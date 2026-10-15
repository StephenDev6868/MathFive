import type { AttemptReview, ProblemHistoryItem, ReviewProvider, StudentQuestion, WorkReview } from '~/types/math5'

type RecognizedProblem = { problemId: string; ocrText: string; unclearSegments: string[]; needsConfirmation?: boolean }
type ReviewedProblem = WorkReview & { problemId: string }

export function useProblem() {
  const supabase = useSupabaseClient()
  const api = useApi()
  const requestId = () => crypto.randomUUID()

  async function submit(question: StudentQuestion): Promise<RecognizedProblem> {
    if (question.image) {
      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData.session?.user.id
      if (!userId) throw new Error('Em cần đăng nhập trước khi tải ảnh.')
      const extension = question.image.type === 'image/png' ? 'png' : question.image.type === 'image/webp' ? 'webp' : 'jpg'
      const imagePath = `${userId}/${crypto.randomUUID()}.${extension}`
      const { error: uploadError } = await supabase.storage.from('math-problems').upload(imagePath, question.image, { contentType: question.image.type, upsert: false })
      if (uploadError) throw uploadError
      return (await api.post<{ data: RecognizedProblem }>('/problems/recognize', { imagePath, requestId: requestId() })).data
    }
    return (await api.post<{ data: RecognizedProblem }>('/problems/text', { text: question.question, requestId: requestId() })).data
  }

  async function confirm(problemId: string, confirmedText: string) {
    await api.patch(`/problems/${problemId}/confirm`, { confirmedText })
  }

  async function review(problemId: string, provider: ReviewProvider): Promise<ReviewedProblem> {
    // Keep the legacy route for existing clients; its contract now returns formative feedback.
    return (await api.post<{ data: ReviewedProblem }>(`/problems/${problemId}/solve`, { requestId: requestId(), provider })).data
  }

  async function retry(problemId: string, answer: string, provider: ReviewProvider): Promise<AttemptReview> {
    return (await api.post<{ data: AttemptReview }>(`/problems/${problemId}/attempts`, {
      answer,
      provider,
      requestId: requestId(),
    })).data
  }

  async function history(pageSize = 20): Promise<ProblemHistoryItem[]> {
    return (await api.get<{ data: ProblemHistoryItem[] }>('/problems', {
      query: { pageSize },
    })).data
  }

  return { submit, confirm, review, retry, history }
}
