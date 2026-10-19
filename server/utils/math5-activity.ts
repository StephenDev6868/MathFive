import { useMath5SupabaseAdmin } from './math5-supabase'

export type Math5ActivityType =
  | 'login_success'
  | 'problem_created'
  | 'problem_confirmed'
  | 'attempt_submitted'
  | 'hint_viewed'
  | 'solution_viewed'

export async function recordMath5Activity(
  userId: string,
  eventType: Math5ActivityType,
  metadata: Record<string, string | number | boolean> = {},
) {
  const { error } = await useMath5SupabaseAdmin()
    .from('user_activity_events')
    .insert({ user_id: userId, event_type: eventType, metadata })

  if (error) {
    console.warn('[math5] activity event was not recorded', { eventType, code: error.code })
  }
}
