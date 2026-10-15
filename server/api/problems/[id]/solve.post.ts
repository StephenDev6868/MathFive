import { SolveProblemSchema } from '~/shared/schemas/math5'
import { asPublicModelError, math5Error } from '~/server/utils/math5-errors'
import { reviewMathWork } from '~/server/utils/math5-openai'
import { reviewMathWorkWithGemini } from '~/server/utils/math5-gemini'
import { reserveMath5Quota } from '~/server/utils/math5-quota'
import { useMath5SupabaseAdmin } from '~/server/utils/math5-supabase'
import { requireMath5Student } from '~/server/utils/math5-user'

export default defineEventHandler(async (event) => {
  const student = await requireMath5Student(event)
  const parsed = SolveProblemSchema.safeParse(await readBody(event))
  if (!parsed.success) math5Error(400, 'Mã yêu cầu không hợp lệ.')
  const admin = useMath5SupabaseAdmin()
  const problemId = getRouterParam(event, 'id')
  const { data: problem, error: problemError } = await admin
    .from('math_problems')
    .select('id, confirmed_text')
    .eq('id', problemId)
    .eq('student_id', student.id)
    .maybeSingle()
  if (problemError) math5Error(503, 'Không thể đọc đề bài lúc này.')
  if (!problem) math5Error(404, 'Không tìm thấy đề bài.')
  if (!problem.confirmed_text) math5Error(422, 'Em hãy xác nhận nội dung đề và bài làm trước khi kiểm tra.')

  const { data: cached, error: cachedError } = await admin
    .from('ai_reviews')
    .select('status, summary, strengths, issues, next_step')
    .eq('problem_id', problem.id)
    .eq('provider', parsed.data.provider)
    .maybeSingle()
  if (cachedError) {
    console.error('[math5] ai_reviews lookup failed', { code: cachedError.code, message: cachedError.message })
    math5Error(503, 'Tính năng chữa bài chưa được cập nhật dữ liệu. Vui lòng thử lại sau.')
  }
  if (cached) {
    return { data: { problemId: problem.id, status: cached.status, summary: cached.summary, strengths: cached.strengths, issues: cached.issues, nextStep: cached.next_step }, requestId: parsed.data.requestId }
  }

  await reserveMath5Quota(student.id, 'solve')
  let generated
  try {
    generated = parsed.data.provider === 'gemini'
      ? await reviewMathWorkWithGemini(problem.confirmed_text)
      : await reviewMathWork(problem.confirmed_text)
  } catch (error) {
    return asPublicModelError(error, parsed.data.provider)
  }
  const { error: saveError } = await admin.from('ai_reviews').insert({
    problem_id: problem.id,
    provider: parsed.data.provider,
    status: generated.result.status,
    summary: generated.result.summary,
    strengths: generated.result.strengths,
    issues: generated.result.issues,
    next_step: generated.result.nextStep,
    model_name: useRuntimeConfig().openaiSolveModel,
    input_tokens: generated.usage?.input_tokens,
    output_tokens: generated.usage?.output_tokens,
  })
  if (saveError) {
    console.error('[math5] ai_reviews insert failed', { code: saveError.code, message: saveError.message })
    math5Error(503, 'Đã kiểm tra bài nhưng chưa thể lưu an toàn. Em hãy thử lại nhé.')
  }
  await admin.from('math_problems').update({ status: 'reviewed' }).eq('id', problem.id).eq('student_id', student.id)

  return { data: { problemId: problem.id, ...generated.result }, requestId: parsed.data.requestId }
})
