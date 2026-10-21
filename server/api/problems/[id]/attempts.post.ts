import { RetryProblemSchema } from '~/shared/schemas/math5'
import { recordMath5Activity } from '~/server/utils/math5-activity'
import { asPublicModelError, math5Error } from '~/server/utils/math5-errors'
import { reviewRevisedMathWork } from '~/server/utils/math5-openai'
import { reviewRevisedMathWorkWithGemini } from '~/server/utils/math5-gemini'
import { reserveMath5Quota } from '~/server/utils/math5-quota'
import { useMath5SupabaseAdmin } from '~/server/utils/math5-supabase'
import { requireMath5Learner } from '~/server/utils/math5-user'

export default defineEventHandler(async (event) => {
  const student = await requireMath5Learner(event)
  const parsed = RetryProblemSchema.safeParse(await readBody(event))
  if (!parsed.success) math5Error(400, 'Bài làm lại chưa hợp lệ.')

  const problemId = getRouterParam(event, 'id')
  if (!problemId) math5Error(400, 'Thiếu mã bài tập.')
  const admin = useMath5SupabaseAdmin()

  const { data: problem, error: problemError } = await admin
    .from('math_problems')
    .select('id, confirmed_text')
    .eq('id', problemId)
    .eq('student_id', student.id)
    .maybeSingle()
  if (problemError) math5Error(503, 'Không thể đọc đề bài lúc này.')
  if (!problem) math5Error(404, 'Không tìm thấy đề bài.')
  if (!problem.confirmed_text) math5Error(422, 'Em hãy xác nhận nội dung đề và bài làm trước khi làm lại.')

  const { data: previousReview, error: reviewError } = await admin
    .from('ai_reviews')
    .select('status, summary, strengths, issues, next_step, retry_tasks')
    .eq('problem_id', problem.id)
    .eq('provider', parsed.data.provider)
    .maybeSingle()
  if (reviewError) math5Error(503, 'Không thể đọc nhận xét trước đó.')
  if (!previousReview) math5Error(422, 'Em cần nhận nhận xét của AI trước khi nộp bài làm lại.')

  const { data: previousAttempt, error: attemptError } = await admin
    .from('student_attempts')
    .select('submitted_answer, verdict, feedback')
    .eq('problem_id', problem.id)
    .eq('student_id', student.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (attemptError) math5Error(503, 'Không thể đọc lần làm trước đó.')
  const learningContext = {
    initialReview: previousReview,
    latestRetry: previousAttempt || null,
  }

  await reserveMath5Quota(student.id, 'solve')
  let generated
  try {
    generated = parsed.data.provider === 'gemini'
      ? await reviewRevisedMathWorkWithGemini(problem.confirmed_text, learningContext, parsed.data.answer)
      : await reviewRevisedMathWork(problem.confirmed_text, learningContext, parsed.data.answer)
  } catch (error) {
    return asPublicModelError(error, parsed.data.provider)
  }

  const verdict = generated.result.status === 'correct'
    ? 'correct'
    : generated.result.status === 'has_errors'
      ? 'incorrect'
      : 'needs_review'
  const { data: attempt, error: saveError } = await admin
    .from('student_attempts')
    .insert({
      problem_id: problem.id,
      student_id: student.id,
      submitted_answer: parsed.data.answer,
      verdict,
      feedback: generated.result.summary,
      assistance_level: 1,
    })
    .select('id')
    .single()
  if (saveError || !attempt) {
    console.error('[math5] student attempt insert failed', { code: saveError?.code, message: saveError?.message })
    math5Error(503, 'Đã chấm bài làm lại nhưng chưa thể lưu an toàn. Em hãy thử lại nhé.')
  }
  await recordMath5Activity(student.id, 'attempt_submitted', { correct: verdict === 'correct' })

  return {
    data: { attemptId: attempt.id, ...generated.result },
    requestId: parsed.data.requestId,
  }
})
