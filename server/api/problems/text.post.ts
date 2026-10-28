import { CreateTextProblemSchema } from '~/shared/schemas/math5'
import { recordMath5Activity } from '~/server/utils/math5-activity'
import { math5Error } from '~/server/utils/math5-errors'
import { useMath5SupabaseAdmin } from '~/server/utils/math5-supabase'
import { requireMath5Learner } from '~/server/utils/math5-user'
import { reserveGuestQuestionQuota } from '~/server/utils/math5-quota'

export default defineEventHandler(async (event) => {
  const student = await requireMath5Learner(event)
  const parsed = CreateTextProblemSchema.safeParse(await readBody(event))
  if (!parsed.success) math5Error(400, 'Đề bài cần từ 10 đến 5.000 ký tự.')
  const guestQuota = await reserveGuestQuestionQuota(student)

  const admin = useMath5SupabaseAdmin()
  const { data, error } = await admin
    .from('math_problems')
    .insert({
      student_id: student.id,
      input_type: 'text',
      ocr_text: parsed.data.text,
      status: 'recognized',
    })
    .select('id, ocr_text, status')
    .single()

  if (error || !data) math5Error(503, 'Không thể lưu đề bài lúc này.')
  await recordMath5Activity(student.id, 'problem_created', { inputType: 'text' })
  return {
    data: { problemId: data.id, ocrText: data.ocr_text, unclearSegments: [], status: data.status, guestQuota },
    requestId: parsed.data.requestId,
  }
})
