import { randomInt } from 'node:crypto'
import { CreateTeacherStudentSchema } from '~/shared/schemas/math5'
import { math5Error } from '~/server/utils/math5-errors'
import { useMath5SupabaseAdmin } from '~/server/utils/math5-supabase'
import { getTeacherOwnedClasses } from '~/server/utils/math5-teacher-roster'
import { requireMath5Teacher } from '~/server/utils/math5-user'

const ACCOUNT_EMAIL_DOMAIN = 'accounts.math5.local'
const generatePassword = () => Array.from({ length: 8 }, () => randomInt(10)).join('')

export default defineEventHandler(async (event) => {
  const teacher = await requireMath5Teacher(event)
  const parsed = CreateTeacherStudentSchema.safeParse(await readBody(event))
  if (!parsed.success) math5Error(400, 'Thông tin học sinh chưa hợp lệ.')
  const admin = useMath5SupabaseAdmin()
  const classes = await getTeacherOwnedClasses(teacher.id)
  if (!classes.some(item => item.id === parsed.data.classroomId)) math5Error(403, 'Giáo viên chỉ có thể thêm học sinh vào lớp mình chủ nhiệm.')
  const { data: duplicate, error: duplicateError } = await admin.from('profiles').select('id').ilike('username', parsed.data.username).maybeSingle()
  if (duplicateError) math5Error(503, 'Không thể kiểm tra tên đăng nhập.')
  if (duplicate) math5Error(409, 'Tên đăng nhập đã được sử dụng.')

  const password = generatePassword()
  const { data: created, error: authError } = await admin.auth.admin.createUser({
    email: `${parsed.data.username}@${ACCOUNT_EMAIL_DOMAIN}`,
    password,
    email_confirm: true,
    user_metadata: { display_name: parsed.data.displayName },
  })
  if (authError || !created.user) math5Error(503, 'Không thể tạo tài khoản học sinh.')
  const studentId = created.user.id
  const { error: profileError } = await admin.from('profiles').insert({
    id: studentId,
    display_name: parsed.data.displayName,
    username: parsed.data.username,
    role: 'student',
    must_change_password: true,
  })
  if (profileError) {
    await admin.auth.admin.deleteUser(studentId)
    math5Error(503, 'Không thể lưu hồ sơ học sinh.')
  }
  const { error: memberError } = await admin.from('classroom_members').insert({ classroom_id: parsed.data.classroomId, student_id: studentId })
  if (memberError) {
    await admin.auth.admin.deleteUser(studentId)
    math5Error(503, 'Không thể xếp học sinh vào lớp.')
  }
  return { data: { id: studentId, password } }
})
