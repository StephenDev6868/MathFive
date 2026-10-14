import { RecognizeProblemSchema } from '~/shared/schemas/math5'
import { asPublicModelError, math5Error } from '~/server/utils/math5-errors'
import { recognizeMathProblem } from '~/server/utils/math5-openai'
import { reserveMath5Quota } from '~/server/utils/math5-quota'
import { useMath5SupabaseAdmin } from '~/server/utils/math5-supabase'
import { requireMath5Student } from '~/server/utils/math5-user'

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const maxImageBytes = 5 * 1024 * 1024

export default defineEventHandler(async (event) => {
  const student = await requireMath5Student(event)
  const parsed = RecognizeProblemSchema.safeParse(await readBody(event))
  if (!parsed.success) math5Error(400, 'Đường dẫn ảnh hoặc mã yêu cầu không hợp lệ.')
  if (!parsed.data.imagePath.startsWith(`${student.id}/`)) math5Error(403, 'Em không có quyền dùng ảnh này.')

  const admin = useMath5SupabaseAdmin()
  const { data: existing } = await admin
    .from('math_problems')
    .select('id, ocr_text, status')
    .eq('student_id', student.id)
    .eq('image_path', parsed.data.imagePath)
    .maybeSingle()
  if (existing?.ocr_text) {
    return { data: { problemId: existing.id, ocrText: existing.ocr_text, unclearSegments: [], status: existing.status }, requestId: parsed.data.requestId }
  }

  const { data: file, error: downloadError } = await admin.storage.from('math-problems').download(parsed.data.imagePath)
  if (downloadError || !file) math5Error(404, 'Không tìm thấy ảnh bài tập.')
  if (!allowedTypes.has(file.type) || file.size > maxImageBytes) math5Error(413, 'Ảnh phải là JPG, PNG hoặc WebP và không quá 5 MB.')

  await reserveMath5Quota(student.id, 'ocr')
  let recognized
  try {
    const imageDataUrl = `data:${file.type};base64,${Buffer.from(await file.arrayBuffer()).toString('base64')}`
    recognized = await recognizeMathProblem(imageDataUrl)
  } catch (error) {
    return asPublicModelError(error)
  }

  const { data, error } = await admin
    .from('math_problems')
    .insert({
      student_id: student.id,
      input_type: 'image',
      image_path: parsed.data.imagePath,
      ocr_text: recognized.result.recognizedText,
      status: 'recognized',
    })
    .select('id, status')
    .single()
  if (error || !data) math5Error(503, 'Đã đọc ảnh nhưng chưa thể lưu đề bài.')

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
