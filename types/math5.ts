export type ReviewProvider = 'openai' | 'gemini'

export type StudentQuestion = {
  question: string
  images: File[]
  source: 'camera' | 'upload' | null
  provider: ReviewProvider
}

export type ReviewStatus = 'correct' | 'has_errors' | 'needs_review' | 'no_attempt'

export type ReviewIssue = {
  location: string
  studentWork: string
  errorType: 'copied_data' | 'reasoning' | 'calculation' | 'unit' | 'notation' | 'other'
  explanation: string
  hint: string
}

export type RetryTask = {
  title: string
  instruction: string
  hint: string
  /** Keeps reviews created before this upgrade compatible. */
  responseType?: 'math' | 'explanation' | 'solution'
}

export type WorkReview = {
  status: ReviewStatus
  summary: string
  strengths: string[]
  issues: ReviewIssue[]
  nextStep: string
  retryTasks?: RetryTask[]
}

export type AttemptReview = WorkReview & {
  attemptId: string
}

export type ProblemHistoryItem = {
  problemId: string
  title: string
  confirmedText: string
  inputType: 'image' | 'text'
  createdAt: string
  status: string
  review: (WorkReview & { provider: ReviewProvider }) | null
  latestAttempt: {
    submittedAnswer: string
    verdict: 'ungraded' | 'correct' | 'incorrect' | 'needs_review'
    feedback: string | null
    createdAt: string
  } | null
  attempts: Array<{
    submittedAnswer: string
    verdict: 'ungraded' | 'correct' | 'incorrect' | 'needs_review'
    feedback: string | null
    createdAt: string
  }>
  attemptCount: number
}
