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
  }
  daily: TeacherDailyMetric[]
}
