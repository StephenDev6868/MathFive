import type { User } from '@supabase/supabase-js'
import { math5Error } from './math5-errors'
import { useMath5SupabaseAdmin, useMath5SupabaseAuth } from './math5-supabase'

export type Math5Student = User & { role: 'student' }
export type Math5Teacher = User & { role: 'teacher' }
export type Math5User = User & { role: 'student' | 'teacher'; isGuest: boolean }
/** Any authenticated account may use the personal AI practice workspace. */
export type Math5Learner = Math5User

export async function requireMath5User(event: Parameters<typeof getHeader>[0]): Promise<Math5User> {
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
  if (!profile || (profile.role !== 'student' && profile.role !== 'teacher')) {
    math5Error(403, 'Tài khoản chưa được phân quyền hợp lệ.')
  }
  return Object.assign(data.user, {
    role: profile.role as 'student' | 'teacher',
    isGuest: Boolean(data.user.is_anonymous || data.user.app_metadata?.is_guest),
  })
}

export async function requireMath5Student(event: Parameters<typeof getHeader>[0]): Promise<Math5Student> {
  const user = await requireMath5User(event)
  if (user.role !== 'student') math5Error(403, 'Tính năng này chỉ dành cho học sinh.')
  return user as Math5Student
}

export async function requireMath5Learner(event: Parameters<typeof getHeader>[0]): Promise<Math5Learner> {
  return requireMath5User(event)
}

export async function requireMath5Teacher(event: Parameters<typeof getHeader>[0]): Promise<Math5Teacher> {
  const user = await requireMath5User(event)
  if (user.role !== 'teacher') math5Error(403, 'Tính năng này chỉ dành cho giáo viên.')
  return user as Math5Teacher
}
