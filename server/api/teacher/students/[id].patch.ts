import { UpdateTeacherStudentSchema } from '~/shared/schemas/math5'
import { math5Error } from '~/server/utils/math5-errors'
import { useMath5SupabaseAdmin } from '~/server/utils/math5-supabase'
import { requireTeacherStudent } from '~/server/utils/math5-teacher-roster'
import { requireMath5Teacher } from '~/server/utils/math5-user'

const ACCOUNT_EMAIL_DOMAIN = 'accounts.math5.local'

export default defineEventHandler(async (event) => {
  const teacher = await requireMath5Teacher(event)
  const studentId = getRouterParam(event, 'id')
  if (!studentId) math5Error(400, 'Thiếu mã học sinh.')
  const parsed = UpdateTeacherStudentSchema.safeParse(await readBody(event))
  if (!parsed.success) math5Error(400, 'Thông tin cập nhật chưa hợp lệ.')
  const { classes, membership } = await requireTeacherStudent(teacher.id, studentId)
  const admin = useMath5SupabaseAdmin()
  const { data: student, error: studentError } = await admin.from('profiles').select('display_name, username').eq('id', studentId).eq('role', 'student').maybeSingle()
  if (studentError) math5Error(503, 'Không thể tải hồ sơ học sinh.')
  if (!student) math5Error(404, 'Không tìm thấy học sinh.')

  const nextUsername = parsed.data.username || student.username || ''
  if (parsed.data.username && parsed.data.username !== student.username) {
    const { data: duplicate, error: duplicateError } = await admin.from('profiles').select('id').ilike('username', parsed.data.username).neq('id', studentId).maybeSingle()
    if (duplicateError) math5Error(503, 'Không thể kiểm tra tên đăng nhập.')
    if (duplicate) math5Error(409, 'Tên đăng nhập đã được sử dụng.')
    const { error: authError } = await admin.auth.admin.updateUserById(studentId, { email: `${nextUsername}@${ACCOUNT_EMAIL_DOMAIN}` })
    if (authError) math5Error(503, 'Không thể cập nhật tên đăng nhập.')
  }
  const updates: Record<string, string> = {}
  if (parsed.data.displayName) updates.display_name = parsed.data.displayName
  if (parsed.data.username) updates.username = parsed.data.username
  if (Object.keys(updates).length) {
    const { error } = await admin.from('profiles').update(updates).eq('id', studentId)
    if (error) math5Error(503, 'Không thể cập nhật hồ sơ học sinh.')
  }
  if (parsed.data.classroomId && parsed.data.classroomId !== membership.classroom_id) {
    if (!classes.some(item => item.id === parsed.data.classroomId)) math5Error(403, 'Chỉ có thể chuyển học sinh giữa các lớp mình chủ nhiệm.')
    const { error: removeError } = await admin.from('classroom_members').delete().eq('classroom_id', membership.classroom_id).eq('student_id', studentId)
    if (removeError) math5Error(503, 'Không thể cập nhật lớp học sinh.')
    const { error: addError } = await admin.from('classroom_members').insert({ classroom_id: parsed.data.classroomId, student_id: studentId })
    if (addError) math5Error(503, 'Không thể cập nhật lớp học sinh.')
  }
  return { data: { id: studentId } }
})
