export type AccountClassSummary = {
  id: string
  name: string
  classCode: string
  schoolName: string
  studentCount?: number
}

export type TeacherStudent = {
  id: string
  displayName: string
  username: string
  classroomId: string
  classroomCode: string
  createdAt: string
}

export type TeacherRoster = {
  classes: AccountClassSummary[]
  students: TeacherStudent[]
}

export type AccountProfile = {
  id: string
  displayName: string
  username: string
  role: 'student' | 'teacher'
  createdAt: string
  classes: AccountClassSummary[]
  summary: {
    questions: number
    retries: number
    correctRetries: number
    activeDays: number
    students: number
  }
}

export type TeacherDailyMetric = {
  date: string
  label: string
  loggedInStudents: number
  questions: number
  askingStudents: number
  retries: number
  correctRetries: number
}

export type TeacherDifficultyType = 'copied_data' | 'reasoning' | 'calculation' | 'unit' | 'notation' | 'other'

export type TeacherDifficultySummary = {
  type: TeacherDifficultyType
  label: string
  issueCount: number
  studentCount: number
}

export type TeacherQuestionInsight = {
  problemId: string
  studentId: string
  studentName: string
  username: string
  askedAt: string
  questionText: string
  review: null | {
    provider: 'openai' | 'gemini'
    status: 'correct' | 'has_errors' | 'needs_review' | 'no_attempt'
    summary: string
    issues: Array<{
      location: string
      studentWork: string
      errorType: TeacherDifficultyType
      explanation: string
      hint: string
    }>
    nextStep: string
  }
  retryCount: number
  latestRetry: null | {
    verdict: 'ungraded' | 'correct' | 'incorrect' | 'needs_review'
    feedback: string | null
    createdAt: string
  }
}

export type TeacherStudentUsage = {
  studentId: string
  studentName: string
  username: string
  loginDays: number
  loginCount: number
  questions: number
  retries: number
  correctRetries: number
  lastActiveAt: string | null
  isActive: boolean
}

export type TeacherDashboard = {
  classroom: AccountClassSummary
  classes: AccountClassSummary[]
  range: { days: number; from: string; to: string }
  totals: {
    students: number
    loggedInStudents: number
    questions: number
    askingStudents: number
    retries: number
    correctRetries: number
    retryAccuracy: number | null
    activeStudents: number
  }
  daily: TeacherDailyMetric[]
  studentUsage: TeacherStudentUsage[]
  difficultySummary: TeacherDifficultySummary[]
  questionInsights: TeacherQuestionInsight[]
  insightLimit: number
}
