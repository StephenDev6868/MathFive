import type { AccountClassSummary, AccountProfile } from '~/types/dashboard'
import { math5Error } from '~/server/utils/math5-errors'
import { useMath5SupabaseAdmin } from '~/server/utils/math5-supabase'
import { requireMath5User } from '~/server/utils/math5-user'

const vietnamDateKey = (value: string) => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Ho_Chi_Minh',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date(value))

export default defineEventHandler(async (event) => {
  const user = await requireMath5User(event)
  const admin = useMath5SupabaseAdmin()
  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('id, display_name, username, role, created_at')
    .eq('id', user.id)
    .maybeSingle()
  if (profileError) math5Error(503, 'Không thể tải hồ sơ lúc này.')
  if (!profile) math5Error(404, 'Không tìm thấy hồ sơ tài khoản.')

  let classes: AccountClassSummary[] = []
  let students = 0
  if (profile.role === 'teacher') {
    const { data: ownedClasses, error } = await admin
      .from('classrooms')
      .select('id, name, class_code, school_name')
      .eq('teacher_id', user.id)
      .order('class_code')
    if (error) math5Error(503, 'Không thể tải lớp chủ nhiệm.')
    const classIds = (ownedClasses || []).map(item => item.id)
    const { data: memberships, error: memberError } = classIds.length
      ? await admin.from('classroom_members').select('classroom_id, student_id').in('classroom_id', classIds)
      : { data: [], error: null }
    if (memberError) math5Error(503, 'Không thể tải sĩ số lớp.')
    classes = (ownedClasses || []).map(item => ({
      id: item.id,
      name: item.name,
      classCode: item.class_code || item.name,
      schoolName: item.school_name || 'Tiểu học Bùi Thị Xuân',
      studentCount: (memberships || []).filter(member => member.classroom_id === item.id).length,
    }))
    students = new Set((memberships || []).map(member => member.student_id)).size
  } else {
    const { data: memberships, error } = await admin
      .from('classroom_members')
      .select('classroom_id')
      .eq('student_id', user.id)
    if (error) math5Error(503, 'Không thể tải thông tin lớp học.')
    const classIds = (memberships || []).map(item => item.classroom_id)
    const { data: joinedClasses, error: classError } = classIds.length
      ? await admin.from('classrooms').select('id, name, class_code, school_name').in('id', classIds).order('class_code')
      : { data: [], error: null }
    if (classError) math5Error(503, 'Không thể tải thông tin lớp học.')
    classes = (joinedClasses || []).map(item => ({
      id: item.id,
      name: item.name,
      classCode: item.class_code || item.name,
      schoolName: item.school_name || 'Tiểu học Bùi Thị Xuân',
    }))
  }

  const thirtyDaysAgo = new Date(Date.now() - 29 * 86_400_000).toISOString()
  const [problemsResult, attemptsResult, correctAttemptsResult, activityResult] = profile.role === 'student'
    ? await Promise.all([
        admin.from('math_problems').select('id', { count: 'exact', head: true }).eq('student_id', user.id),
        admin.from('student_attempts').select('id', { count: 'exact', head: true }).eq('student_id', user.id),
        admin.from('student_attempts').select('id', { count: 'exact', head: true }).eq('student_id', user.id).eq('verdict', 'correct'),
        admin.from('user_activity_events').select('occurred_at').eq('user_id', user.id).eq('event_type', 'login_success').gte('occurred_at', thirtyDaysAgo),
      ])
    : [{ count: 0, error: null }, { count: 0, error: null }, { count: 0, error: null }, { data: [], error: null }]
  if (problemsResult.error || attemptsResult.error || correctAttemptsResult.error || activityResult.error) math5Error(503, 'Không thể tải thống kê hồ sơ.')

  const activeDays = new Set((activityResult.data || []).map(item => vietnamDateKey(item.occurred_at))).size
  const result: AccountProfile = {
    id: profile.id,
    displayName: profile.display_name,
    username: profile.username || '',
    role: profile.role,
    createdAt: profile.created_at,
    classes,
    summary: {
      questions: problemsResult.count || 0,
      retries: attemptsResult.count || 0,
      correctRetries: correctAttemptsResult.count || 0,
      activeDays,
      students,
    },
  }
  return { data: result }
})
