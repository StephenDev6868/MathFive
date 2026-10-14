import type { User } from '@supabase/supabase-js'
import { math5Error } from './math5-errors'
import { useMath5SupabaseAdmin, useMath5SupabaseAuth } from './math5-supabase'

export type Math5Student = User & { role: 'student' }

export async function requireMath5Student(event: Parameters<typeof getHeader>[0]): Promise<Math5Student> {
  const authorization = getHeader(event, 'authorization')
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined
  if (!token) math5Error(401, 'Em cần đăng nhập để sử dụng trợ lý AI.')

  const { data, error } = await useMath5SupabaseAuth().auth.getUser(token)
  if (error || !data.user) math5Error(401, 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.')

  const { data: profile, error: profileError } = await useMath5SupabaseAdmin()
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .maybeSingle()

  if (profileError) math5Error(503, 'Không thể kiểm tra quyền tài khoản lúc này.')
  if (!profile || profile.role !== 'student') math5Error(403, 'Tính năng này chỉ dành cho học sinh.')
  return Object.assign(data.user, { role: 'student' as const })
}
