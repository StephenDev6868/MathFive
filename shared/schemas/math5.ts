import { z } from 'zod'

export const RequestIdSchema = z.string().uuid()

export const CreateTextProblemSchema = z.object({
  text: z.string().trim().min(10).max(5000),
  requestId: RequestIdSchema,
})

export const RecognizeProblemSchema = z.object({
  imagePaths: z.array(z.string().trim().min(1).max(500)).min(1).max(5),
  requestId: RequestIdSchema,
})

export const ConfirmProblemSchema = z.object({
  confirmedText: z.string().trim().min(10).max(5000),
})

export const ReviewProviderSchema = z.enum(['openai', 'gemini'])

export const SolveProblemSchema = z.object({
  requestId: RequestIdSchema,
  provider: ReviewProviderSchema,
})

export const RetryProblemSchema = z.object({
  requestId: RequestIdSchema,
  provider: ReviewProviderSchema,
  answer: z.string().trim().min(2).max(5000),
})

export const ProblemHistoryQuerySchema = z.object({
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
})

export const TeacherDashboardQuerySchema = z.object({
  classId: z.string().uuid().optional(),
  days: z.coerce.number().int().refine(value => [7, 14, 30].includes(value)).default(7),
})

const StudentUsernameSchema = z.string().trim().toLowerCase().regex(/^[a-z][a-z0-9]{2,39}$/, 'Tên đăng nhập không hợp lệ.')
const StudentDisplayNameSchema = z.string().trim().min(2).max(80)

export const CreateTeacherStudentSchema = z.object({
  classroomId: z.string().uuid(),
  displayName: StudentDisplayNameSchema,
  username: StudentUsernameSchema,
})

export const UpdateTeacherStudentSchema = z.object({
  classroomId: z.string().uuid().optional(),
  displayName: StudentDisplayNameSchema.optional(),
  username: StudentUsernameSchema.optional(),
}).refine(value => value.classroomId || value.displayName || value.username, 'Chưa có thông tin cần cập nhật.')

export const OcrResultSchema = z.object({
  recognizedText: z.string().min(1).max(5000),
  unclearSegments: z.array(z.string().max(100)).max(20),
  needsConfirmation: z.boolean(),
})

export const ReviewIssueSchema = z.object({
  location: z.string().min(1).max(160),
  studentWork: z.string().min(1).max(500),
  errorType: z.enum(['copied_data', 'reasoning', 'calculation', 'unit', 'notation', 'other']),
  explanation: z.string().min(1).max(700),
  hint: z.string().min(1).max(500),
})

export const RetryTaskSchema = z.object({
  title: z.string().min(1).max(100),
  instruction: z.string().min(1).max(400),
  hint: z.string().min(1).max(300),
  responseType: z.enum(['math', 'explanation', 'solution']),
})

export const WorkReviewResultSchema = z.object({
  status: z.enum(['correct', 'has_errors', 'needs_review', 'no_attempt']),
  summary: z.string().min(1).max(500),
  strengths: z.array(z.string().min(1).max(300)).max(5),
  issues: z.array(ReviewIssueSchema).max(10),
  nextStep: z.string().min(1).max(500),
  retryTasks: z.array(RetryTaskSchema).max(4),
})

export type OcrResult = z.infer<typeof OcrResultSchema>
export type ReviewIssue = z.infer<typeof ReviewIssueSchema>
export type RetryTask = z.infer<typeof RetryTaskSchema>
export type WorkReviewResult = z.infer<typeof WorkReviewResultSchema>
export type ReviewProvider = z.infer<typeof ReviewProviderSchema>
