import { SolveProblemSchema } from '~/shared/schemas/math5'
import { asPublicModelError, math5Error } from '~/server/utils/math5-errors'
import { solveMathProblem } from '~/server/utils/math5-openai'
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
  if (!problem.confirmed_text) math5Error(422, 'Em hãy xác nhận lại đề bài trước khi xem lời giải.')

  const { data: cached } = await admin
    .from('solutions')
    .select('steps, final_answer, explanation')
    .eq('problem_id', problem.id)
    .maybeSingle()
  if (cached) {
    return { data: { problemId: problem.id, status: 'solved', steps: cached.steps, finalAnswer: cached.final_answer, tip: cached.explanation, isVerified: false }, requestId: parsed.data.requestId }
  }

  await reserveMath5Quota(student.id, 'solve')
  let generated
  try {
    generated = await solveMathProblem(problem.confirmed_text)
  } catch (error) {
    return asPublicModelError(error)
  }
  if (generated.result.status !== 'solved' || !generated.result.finalAnswer) {
    // A cautious model response is useful to the learner, not an API failure.
    // Do not persist it as a solution because the current schema requires an answer.
    return {
      data: {
        problemId: problem.id,
        status: generated.result.status,
        steps: generated.result.steps,
        finalAnswer: null,
        tip: generated.result.tip,
        isVerified: false,
      },
      requestId: parsed.data.requestId,
    }
  }

  const { error: saveError } = await admin.from('solutions').insert({
    problem_id: problem.id,
    steps: generated.result.steps,
    final_answer: generated.result.finalAnswer,
    explanation: generated.result.tip,
    model_name: useRuntimeConfig().openaiSolveModel,
    input_tokens: generated.usage?.input_tokens,
    output_tokens: generated.usage?.output_tokens,
  })
  if (saveError) math5Error(503, 'Đã tạo lời giải nhưng chưa thể lưu an toàn. Em hãy thử lại nhé.')
  await admin.from('math_problems').update({ status: 'solved' }).eq('id', problem.id).eq('student_id', student.id)

  return { data: { problemId: problem.id, status: 'solved', steps: generated.result.steps, finalAnswer: generated.result.finalAnswer, tip: generated.result.tip, isVerified: false }, requestId: parsed.data.requestId }
})
