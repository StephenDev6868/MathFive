import { ProblemHistoryQuerySchema } from '~/shared/schemas/math5'
import { math5Error } from '~/server/utils/math5-errors'
import { useMath5SupabaseAdmin } from '~/server/utils/math5-supabase'
import { requireMath5Student } from '~/server/utils/math5-user'

function historyTitle(text: string) {
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean)
  const candidate = lines.find(line => !/^bài làm(?: của em)?:?$/i.test(line)) || 'Bài Toán chưa đặt tên'
  return candidate.replace(/^đề bài:\s*/i, '').slice(0, 90)
}

export default defineEventHandler(async (event) => {
  const student = await requireMath5Student(event)
  const parsed = ProblemHistoryQuerySchema.safeParse(getQuery(event))
  if (!parsed.success) math5Error(400, 'Bộ lọc lịch sử không hợp lệ.')

  const admin = useMath5SupabaseAdmin()
  const { data: problems, error: problemError } = await admin
    .from('math_problems')
    .select('id, input_type, ocr_text, confirmed_text, status, created_at')
    .eq('student_id', student.id)
    .order('created_at', { ascending: false })
    .limit(parsed.data.pageSize)
  if (problemError) math5Error(503, 'Không thể tải lịch sử chữa bài lúc này.')
  if (!problems?.length) return { data: [] }

  const problemIds = problems.map(problem => problem.id)
  const [reviewsResult, attemptsResult] = await Promise.all([
    admin
      .from('ai_reviews')
      .select('problem_id, provider, status, summary, strengths, issues, next_step, created_at')
      .in('problem_id', problemIds)
      .order('created_at', { ascending: false }),
    admin
      .from('student_attempts')
      .select('problem_id, submitted_answer, verdict, feedback, created_at')
      .eq('student_id', student.id)
      .in('problem_id', problemIds)
      .order('created_at', { ascending: false }),
  ])
  if (reviewsResult.error || attemptsResult.error) math5Error(503, 'Không thể tải đầy đủ lịch sử chữa bài.')

  const latestReviewByProblem = new Map<string, any>()
  for (const review of reviewsResult.data || []) {
    if (!latestReviewByProblem.has(review.problem_id)) latestReviewByProblem.set(review.problem_id, review)
  }
  const attemptsByProblem = new Map<string, any[]>()
  for (const attempt of attemptsResult.data || []) {
    const items = attemptsByProblem.get(attempt.problem_id) || []
    items.push(attempt)
    attemptsByProblem.set(attempt.problem_id, items)
  }

  const data = problems.map((problem) => {
    const confirmedText = problem.confirmed_text || problem.ocr_text || ''
    const review = latestReviewByProblem.get(problem.id)
    const attempts = attemptsByProblem.get(problem.id) || []
    const latestAttempt = attempts[0]
    const attemptHistory = [...attempts].reverse().map(attempt => ({
      submittedAnswer: attempt.submitted_answer,
      verdict: attempt.verdict,
      feedback: attempt.feedback,
      createdAt: attempt.created_at,
    }))
    return {
      problemId: problem.id,
      title: historyTitle(confirmedText),
      confirmedText,
      inputType: problem.input_type,
      createdAt: problem.created_at,
      status: latestAttempt?.verdict || review?.status || problem.status,
      review: review ? {
        provider: review.provider,
        status: review.status,
        summary: review.summary,
        strengths: review.strengths,
        issues: review.issues,
        nextStep: review.next_step,
      } : null,
      latestAttempt: latestAttempt ? {
        submittedAnswer: latestAttempt.submitted_answer,
        verdict: latestAttempt.verdict,
        feedback: latestAttempt.feedback,
        createdAt: latestAttempt.created_at,
      } : null,
      attempts: attemptHistory,
      attemptCount: attempts.length,
    }
  })

  return { data }
})
