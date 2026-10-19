import { RecognizeProblemSchema } from '~/shared/schemas/math5'
import { recordMath5Activity } from '~/server/utils/math5-activity'
import { asPublicModelError, math5Error } from '~/server/utils/math5-errors'
import { isOpenAIQuotaOrBillingError, recognizeMathProblem } from '~/server/utils/math5-openai'
import { isGeminiVisionConfigured, recognizeMathProblemWithGemini } from '~/server/utils/math5-gemini'
import { reserveMath5Quota } from '~/server/utils/math5-quota'
import { useMath5SupabaseAdmin } from '~/server/utils/math5-supabase'
import { requireMath5Student } from '~/server/utils/math5-user'

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const maxImageBytes = 5 * 1024 * 1024
const maxTotalImageBytes = 15 * 1024 * 1024

export default defineEventHandler(async (event) => {
  const student = await requireMath5Student(event)
  const parsed = RecognizeProblemSchema.safeParse(await readBody(event))
  if (!parsed.success) math5Error(400, 'Danh sách ảnh hoặc mã yêu cầu không hợp lệ.')
  if (parsed.data.imagePaths.some(imagePath => !imagePath.startsWith(`${student.id}/`))) math5Error(403, 'Em không có quyền dùng ảnh này.')

  const admin = useMath5SupabaseAdmin()
  const { data: existing } = await admin
    .from('math_problems')
    .select('id, ocr_text, status')
    .eq('student_id', student.id)
    .eq('image_path', parsed.data.imagePaths[0])
    .maybeSingle()
  if (existing?.ocr_text) {
    return { data: { problemId: existing.id, ocrText: existing.ocr_text, unclearSegments: [], status: existing.status }, requestId: parsed.data.requestId }
  }

  const files = await Promise.all(parsed.data.imagePaths.map(async (imagePath) => {
    const { data: file, error: downloadError } = await admin.storage.from('math-problems').download(imagePath)
    if (downloadError || !file) math5Error(404, 'Không tìm thấy ảnh bài tập.')
    if (!allowedTypes.has(file.type) || file.size > maxImageBytes) math5Error(413, 'Mỗi ảnh phải là JPG, PNG hoặc WebP và không quá 5 MB.')
    return file
  }))
  if (files.reduce((total, file) => total + file.size, 0) > maxTotalImageBytes) math5Error(413, 'Tổng dung lượng ảnh tối đa là 15 MB.')

  await reserveMath5Quota(student.id, 'ocr')
  let recognized
  const imageData = await Promise.all(files.map(async file => ({
    base64: Buffer.from(await file.arrayBuffer()).toString('base64'),
    mimeType: file.type,
  })))
  try {
    const imageDataUrls = imageData.map(image => `data:${image.mimeType};base64,${image.base64}`)
    recognized = await recognizeMathProblem(imageDataUrls)
  } catch (error) {
    if (isOpenAIQuotaOrBillingError(error) && isGeminiVisionConfigured()) {
      console.warn('[math5] OpenAI OCR quota or billing limit reached; falling back to Gemini', {
        code: (error as { code?: unknown }).code,
      })
      try {
        recognized = await recognizeMathProblemWithGemini(imageData)
      } catch (geminiError) {
        return asPublicModelError(geminiError, 'gemini')
      }
    } else {
      return asPublicModelError(error)
    }
  }

  const { data, error } = await admin
    .from('math_problems')
    .insert({
      student_id: student.id,
      input_type: 'image',
      image_path: parsed.data.imagePaths[0],
      ocr_text: recognized.result.recognizedText,
      status: 'recognized',
    })
    .select('id, status')
    .single()
  if (error || !data) math5Error(503, 'Đã đọc ảnh nhưng chưa thể lưu đề bài.')
  await recordMath5Activity(student.id, 'problem_created', { inputType: 'image' })

  return {
    data: {
      problemId: data.id,
      ocrText: recognized.result.recognizedText,
      unclearSegments: recognized.result.unclearSegments,
      needsConfirmation: recognized.result.needsConfirmation,
      status: data.status,
    },
    requestId: parsed.data.requestId,
  }
})
