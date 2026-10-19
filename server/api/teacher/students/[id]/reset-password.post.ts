import { randomInt } from 'node:crypto'
import { math5Error } from '~/server/utils/math5-errors'
import { useMath5SupabaseAdmin } from '~/server/utils/math5-supabase'
import { requireTeacherStudent } from '~/server/utils/math5-teacher-roster'
import { requireMath5Teacher } from '~/server/utils/math5-user'

const generatePassword = () => Array.from({ length: 8 }, () => randomInt(10)).join('')

export default defineEventHandler(async (event) => {
  const teacher = await requireMath5Teacher(event)
  const studentId = getRouterParam(event, 'id')
  if (!studentId) math5Error(400, 'Thiếu mã học sinh.')
  await requireTeacherStudent(teacher.id, studentId)
  const password = generatePassword()
  const admin = useMath5SupabaseAdmin()
  const { error: authError } = await admin.auth.admin.updateUserById(studentId, { password })
  if (authError) math5Error(503, 'Không thể đặt lại mật khẩu.')
  const { error: profileError } = await admin.from('profiles').update({ must_change_password: true }).eq('id', studentId)
  if (profileError) math5Error(503, 'Đã đặt lại mật khẩu nhưng chưa thể cập nhật trạng thái tài khoản.')
  return { data: { password } }
})
