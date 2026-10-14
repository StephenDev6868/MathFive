import { z } from 'zod'

export const RequestIdSchema = z.string().uuid()

export const CreateTextProblemSchema = z.object({
  text: z.string().trim().min(10).max(5000),
  requestId: RequestIdSchema,
})

export const RecognizeProblemSchema = z.object({
  imagePath: z.string().trim().min(1).max(500),
  requestId: RequestIdSchema,
})

export const ConfirmProblemSchema = z.object({
  confirmedText: z.string().trim().min(10).max(5000),
})

export const SolveProblemSchema = z.object({
  requestId: RequestIdSchema,
})

export const OcrResultSchema = z.object({
  recognizedText: z.string().min(1).max(5000),
  unclearSegments: z.array(z.string().max(100)).max(20),
  needsConfirmation: z.boolean(),
})

export const SolutionResultSchema = z.object({
  status: z.enum(['solved', 'insufficient_data', 'needs_review']),
  steps: z.array(z.object({
    title: z.string().min(1).max(80),
    explanation: z.string().min(1).max(1500),
    calculation: z.string().max(500).nullable(),
  })).max(20),
  finalAnswer: z.string().max(1000).nullable(),
  tip: z.string().min(1).max(400),
})

export type OcrResult = z.infer<typeof OcrResultSchema>
export type SolutionResult = z.infer<typeof SolutionResultSchema>
