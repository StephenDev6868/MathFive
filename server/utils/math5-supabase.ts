import { createClient } from '@supabase/supabase-js'

function getSupabaseConfig() {
  const config = useRuntimeConfig()
  if (!config.public.supabaseUrl || !config.public.supabaseKey || !config.supabaseSecretKey) {
    throw createError({ statusCode: 503, statusMessage: 'Dịch vụ học tập chưa được cấu hình đầy đủ.' })
  }
  return config
}

export function useMath5SupabaseAdmin() {
  const config = getSupabaseConfig()
  return createClient(config.public.supabaseUrl, config.supabaseSecretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export function useMath5SupabaseAuth() {
  const config = getSupabaseConfig()
  return createClient(config.public.supabaseUrl, config.public.supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
