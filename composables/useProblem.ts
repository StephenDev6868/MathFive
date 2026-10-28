import type { AttemptReview, ProblemHistoryItem, ReviewProvider, StudentQuestion, WorkReview } from '~/types/math5'

type RecognizedProblem = {
  problemId: string
  ocrText: string
  unclearSegments: string[]
  needsConfirmation?: boolean
  guestQuota?: { limit: number; remaining: number } | null
}
type ReviewedProblem = WorkReview & { problemId: string }

export function useProblem() {
  const supabase = useSupabaseClient()
  const api = useApi()
  const requestId = () => crypto.randomUUID()

  async function submit(question: StudentQuestion): Promise<RecognizedProblem> {
    if (question.images.length) {
      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData.session?.user.id
      if (!userId) throw new Error('Em cần đăng nhập trước khi tải ảnh.')
      const imagePaths = question.images.map((image, index) => {
        const extension = image.type === 'image/png' ? 'png' : image.type === 'image/webp' ? 'webp' : 'jpg'
        return `${userId}/${crypto.randomUUID()}-${index + 1}.${extension}`
      })
      try {
        await Promise.all(question.images.map(async (image, index) => {
          const { error } = await supabase.storage.from('math-problems').upload(imagePaths[index], image, {
            contentType: image.type,
            upsert: false,
          })
          if (error) throw error
        }))
        return (await api.post<{ data: RecognizedProblem }>('/problems/recognize', { imagePaths, requestId: requestId() })).data
      } catch (error) {
        await supabase.storage.from('math-problems').remove(imagePaths)
        throw error
      }
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
