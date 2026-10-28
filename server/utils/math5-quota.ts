import { math5Error } from './math5-errors'
import { useMath5SupabaseAdmin } from './math5-supabase'
import type { Math5User } from './math5-user'

export const GUEST_QUESTION_LIMIT = 10

async function getGuestProblemCount(studentId: string) {
  const { count, error } = await useMath5SupabaseAdmin()
    .from('math_problems')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', studentId)
  if (error) math5Error(503, 'Không thể kiểm tra lượt dùng thử lúc này.')
  return Math.max(0, count || 0)
}

export async function getGuestQuestionQuota(user: Math5User) {
  if (!user.isGuest) return null
  const { data, error } = await useMath5SupabaseAdmin()
    .from('guest_question_usage')
    .select('used')
    .eq('student_id', user.id)
    .maybeSingle()
  const used = error
    ? await getGuestProblemCount(user.id)
    : Math.max(0, Number(data?.used || 0))
  return { limit: GUEST_QUESTION_LIMIT, used, remaining: Math.max(0, GUEST_QUESTION_LIMIT - used) }
}

export async function reserveGuestQuestionQuota(user: Math5User) {
  if (!user.isGuest) return null
  const { data, error } = await useMath5SupabaseAdmin().rpc('consume_guest_question_quota', {
    p_student_id: user.id,
    p_limit: GUEST_QUESTION_LIMIT,
  })
  if (error) {
    // Keep local/dev deployments working before the atomic quota migration is applied.
    const used = await getGuestProblemCount(user.id)
    if (used >= GUEST_QUESTION_LIMIT) {
      math5Error(429, 'Em đã dùng hết 10 lượt ở chế độ khách. Hãy đăng nhập bằng tài khoản học sinh để tiếp tục nhé.')
    }
    return { limit: GUEST_QUESTION_LIMIT, remaining: GUEST_QUESTION_LIMIT - used - 1 }
  }
  if (typeof data !== 'number' || data < 0) {
    math5Error(429, 'Em đã dùng hết 10 lượt ở chế độ khách. Hãy đăng nhập bằng tài khoản học sinh để tiếp tục nhé.')
  }
  return { limit: GUEST_QUESTION_LIMIT, remaining: data }
}

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
