export type StudentQuestion = {
  question: string
  image: File | null
  source: 'camera' | 'upload' | null
}

export type ReviewStatus = 'correct' | 'has_errors' | 'needs_review' | 'no_attempt'

export type ReviewIssue = {
  location: string
  studentWork: string
  errorType: 'copied_data' | 'reasoning' | 'calculation' | 'unit' | 'notation' | 'other'
  explanation: string
  hint: string
}

export type WorkReview = {
  status: ReviewStatus
  summary: string
  strengths: string[]
  issues: ReviewIssue[]
  nextStep: string
}
