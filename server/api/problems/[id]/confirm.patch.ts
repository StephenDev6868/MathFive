import { ConfirmProblemSchema } from '~/shared/schemas/math5'
import { recordMath5Activity } from '~/server/utils/math5-activity'
import { math5Error } from '~/server/utils/math5-errors'
import { useMath5SupabaseAdmin } from '~/server/utils/math5-supabase'
import { requireMath5Student } from '~/server/utils/math5-user'

export default defineEventHandler(async (event) => {
  const student = await requireMath5Student(event)
  const parsed = ConfirmProblemSchema.safeParse(await readBody(event))
  if (!parsed.success) math5Error(400, 'Đề đã xác nhận cần từ 10 đến 5.000 ký tự.')

  const { data, error } = await useMath5SupabaseAdmin()
    .from('math_problems')
    .update({ confirmed_text: parsed.data.confirmedText, status: 'recognized' })
    .eq('id', getRouterParam(event, 'id'))
    .eq('student_id', student.id)
    .select('id, confirmed_text, status')
    .maybeSingle()
  if (error) math5Error(503, 'Không thể xác nhận đề bài lúc này.')
  if (!data) math5Error(404, 'Không tìm thấy đề bài.')
  await recordMath5Activity(student.id, 'problem_confirmed')
  return { data: { problemId: data.id, confirmedText: data.confirmed_text, status: data.status } }
})
