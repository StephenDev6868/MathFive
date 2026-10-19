import { math5Error } from '~/server/utils/math5-errors'
import { useMath5SupabaseAdmin } from '~/server/utils/math5-supabase'
import { requireTeacherStudent } from '~/server/utils/math5-teacher-roster'
import { requireMath5Teacher } from '~/server/utils/math5-user'

export default defineEventHandler(async (event) => {
  const teacher = await requireMath5Teacher(event)
  const studentId = getRouterParam(event, 'id')
  if (!studentId) math5Error(400, 'Thiếu mã học sinh.')
  await requireTeacherStudent(teacher.id, studentId)
  const { error } = await useMath5SupabaseAdmin().auth.admin.deleteUser(studentId)
  if (error) math5Error(503, 'Không thể xóa tài khoản học sinh.')
  return { data: { id: studentId } }
})
