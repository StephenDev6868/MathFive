import type { AccountClassSummary, TeacherRoster, TeacherStudent } from '~/types/dashboard'
import { math5Error } from '~/server/utils/math5-errors'
import { useMath5SupabaseAdmin } from '~/server/utils/math5-supabase'
import { getTeacherOwnedClasses } from '~/server/utils/math5-teacher-roster'
import { requireMath5Teacher } from '~/server/utils/math5-user'

export default defineEventHandler(async (event) => {
  const teacher = await requireMath5Teacher(event)
  const admin = useMath5SupabaseAdmin()
  const ownedClasses = await getTeacherOwnedClasses(teacher.id)
  const classIds = ownedClasses.map(item => item.id)
  const { data: memberships, error: membershipError } = classIds.length
    ? await admin.from('classroom_members').select('classroom_id, student_id').in('classroom_id', classIds)
    : { data: [], error: null }
  if (membershipError) math5Error(503, 'Không thể tải danh sách học sinh.')

  const studentIds = [...new Set((memberships || []).map(item => item.student_id))]
  const { data: profiles, error: profileError } = studentIds.length
    ? await admin.from('profiles').select('id, display_name, username, created_at, role').in('id', studentIds).eq('role', 'student')
    : { data: [], error: null }
  if (profileError) math5Error(503, 'Không thể tải hồ sơ học sinh.')

  const classById = new Map(ownedClasses.map(item => [item.id, item]))
  const profileById = new Map((profiles || []).map(item => [item.id, item]))
  const students: TeacherStudent[] = (memberships || []).flatMap((membership) => {
    const profile = profileById.get(membership.student_id)
    const classroom = classById.get(membership.classroom_id)
    if (!profile || !classroom) return []
    return [{
      id: profile.id,
      displayName: profile.display_name,
      username: profile.username || '',
      classroomId: classroom.id,
      classroomCode: classroom.class_code || classroom.name,
      createdAt: profile.created_at,
    }]
  }).sort((a, b) => a.classroomCode.localeCompare(b.classroomCode, 'vi') || a.displayName.localeCompare(b.displayName, 'vi'))
  const classes: AccountClassSummary[] = ownedClasses.map(item => ({
    id: item.id,
    name: item.name,
    classCode: item.class_code || item.name,
    schoolName: item.school_name || 'Tiểu học Bùi Thị Xuân',
    studentCount: (memberships || []).filter(member => member.classroom_id === item.id).length,
  }))
  const result: TeacherRoster = { classes, students }
  return { data: result }
})
