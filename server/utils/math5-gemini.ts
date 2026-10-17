import { GoogleGenAI } from '@google/genai'
import { WorkReviewResultSchema } from '~/shared/schemas/math5'
import { math5Error } from './math5-errors'
import { retryReviewInstructions, validateWorkReview, workReviewInstructions } from './math5-openai'

const workReviewJsonSchema = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['correct', 'has_errors', 'needs_review', 'no_attempt'] },
    summary: { type: 'string' },
    strengths: { type: 'array', items: { type: 'string' } },
    issues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          location: { type: 'string' },
          studentWork: { type: 'string' },
          errorType: { type: 'string', enum: ['copied_data', 'reasoning', 'calculation', 'unit', 'notation', 'other'] },
          explanation: { type: 'string' },
          hint: { type: 'string' },
        },
        required: ['location', 'studentWork', 'errorType', 'explanation', 'hint'],
        additionalProperties: false,
      },
    },
    nextStep: { type: 'string' },
    retryTasks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          instruction: { type: 'string' },
          hint: { type: 'string' },
          responseType: { type: 'string', enum: ['math', 'explanation', 'solution'] },
        },
        required: ['title', 'instruction', 'hint', 'responseType'],
        additionalProperties: false,
      },
    },
  },
  required: ['status', 'summary', 'strengths', 'issues', 'nextStep', 'retryTasks'],
  additionalProperties: false,
} as const

function geminiConfig() {
  const config = useRuntimeConfig()
  if (!config.geminiApiKey) math5Error(503, 'Google Gemini chưa được cấu hình trên máy chủ.')
  if (!config.geminiSolveModel) math5Error(503, 'Chưa chọn model Gemini cho chức năng chữa bài.')
  return { apiKey: config.geminiApiKey, model: config.geminiSolveModel }
}

export async function reviewMathWorkWithGemini(confirmedText: string) {
  const { apiKey, model } = geminiConfig()
  const response = await new GoogleGenAI({ apiKey }).models.generateContent({
    model,
    contents: `Nội dung đề và bài làm đã được học sinh xác nhận:\n${confirmedText}`,
    config: {
      systemInstruction: workReviewInstructions,
      responseMimeType: 'application/json',
      responseJsonSchema: workReviewJsonSchema,
      temperature: 0.2,
      maxOutputTokens: 2000,
    },
  })
  if (!response.text) math5Error(503, 'Gemini chưa kiểm tra được bài làm. Em hãy thử lại sau nhé.')

  let output: unknown
  try {
    output = JSON.parse(response.text)
  } catch {
    math5Error(503, 'Gemini trả về nhận xét chưa đúng định dạng. Em hãy thử lại nhé.')
  }
  const result = validateWorkReview(WorkReviewResultSchema.parse(output))
  return {
    result,
    usage: {
      input_tokens: response.usageMetadata?.promptTokenCount,
      output_tokens: response.usageMetadata?.candidatesTokenCount,
    },
  }
}

export async function reviewRevisedMathWorkWithGemini(confirmedText: string, previousReview: unknown, submittedAnswer: string) {
  const { apiKey, model } = geminiConfig()
  const response = await new GoogleGenAI({ apiKey }).models.generateContent({
    model,
    contents: `BÀI BAN ĐẦU ĐÃ XÁC NHẬN:\n${confirmedText}\n\nNHẬN XÉT TRƯỚC:\n${JSON.stringify(previousReview)}\n\nBÀI LÀM LẠI CẦN CHẤM:\n${submittedAnswer}`,
    config: {
      systemInstruction: retryReviewInstructions,
      responseMimeType: 'application/json',
      responseJsonSchema: workReviewJsonSchema,
      temperature: 0.2,
      maxOutputTokens: 2000,
    },
  })
  if (!response.text) math5Error(503, 'Gemini chưa chấm được bài làm lại. Em hãy thử lại sau nhé.')

  let output: unknown
  try {
    output = JSON.parse(response.text)
  } catch {
    math5Error(503, 'Gemini trả về nhận xét chưa đúng định dạng. Em hãy thử lại nhé.')
  }
  const result = validateWorkReview(WorkReviewResultSchema.parse(output))
  return {
    result,
    usage: {
      input_tokens: response.usageMetadata?.promptTokenCount,
      output_tokens: response.usageMetadata?.candidatesTokenCount,
    },
  }
}
