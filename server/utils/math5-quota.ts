import { math5Error } from './math5-errors'
import { useMath5SupabaseAdmin } from './math5-supabase'

export async function reserveMath5Quota(studentId: string, kind: 'ocr' | 'solve') {
  const config = useRuntimeConfig()
  const limit = kind === 'ocr' ? Number(config.aiDailyOcrLimit) : Number(config.aiDailySolveLimit)
  const { data, error } = await useMath5SupabaseAdmin().rpc('consume_ai_quota', {
    p_student_id: studentId,
    p_kind: kind,
    p_daily_limit: limit,
  })
  if (error) math5Error(503, 'Không thể kiểm tra lượt sử dụng AI lúc này.')
  if (!data) math5Error(429, 'Em đã dùng hết lượt AI hôm nay. Hãy thử lại vào ngày mai nhé.')
}
