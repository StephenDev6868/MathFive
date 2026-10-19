import { defineStore } from 'pinia'
import type { LoginCredentials, User } from '~/types'

const INTERNAL_ACCOUNT_EMAIL_DOMAIN = 'accounts.math5.local'

export const useAuthStore = defineStore('auth', () => {
  const supabase = useSupabaseClient()
  const session = useSupabaseSession()
  const user = useState<User | null>('auth_user', () => null)
  const loading = ref(false)
  const token = computed(() => session.value?.access_token ?? null)
  const isAuthenticated = computed(() => Boolean(token.value && user.value))

  async function fetchProfile() {
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) {
      user.value = null
      return
    }
    const { data: profileData } = await supabase.from('profiles')
      .select('display_name, username, role, created_at')
      .eq('id', authData.user.id)
      .maybeSingle()
    const profile = profileData as { display_name: string; username: string | null; role: string; created_at: string } | null
    if (!profile) {
      user.value = null
      return
    }
    user.value = {
      id: authData.user.id,
      name: profile.display_name,
      username: profile.username || '',
      email: authData.user.email || '',
      role: profile.role === 'teacher' ? 'teacher' : 'student',
      avatar: '',
      createdAt: profile.created_at,
    }
  }

  async function login(credentials: LoginCredentials) {
    loading.value = true
    try {
      const username = credentials.username.trim().toLowerCase()
      if (!/^[a-z][a-z0-9]{2,39}$/.test(username)) {
        throw new Error('Tên đăng nhập chỉ gồm chữ cái thường và số, ít nhất 3 ký tự.')
      }
      const { error } = await supabase.auth.signInWithPassword({
        email: `${username}@${INTERNAL_ACCOUNT_EMAIL_DOMAIN}`,
        password: credentials.password,
      })
      if (error) throw error
      await fetchProfile()
      if (!user.value) throw new Error('Tài khoản chưa được cấp hồ sơ học sinh hoặc giáo viên.')
      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData.session?.access_token) {
        // Analytics is best-effort and must never block a successful login.
        await $fetch('/api/auth/login-event', {
          method: 'POST',
          headers: { Authorization: `Bearer ${sessionData.session.access_token}` },
        }).catch(() => undefined)
      }
      return user.value
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
    await navigateTo('/auth/login')
  }

  return { user, token, loading, isAuthenticated, fetchProfile, login, logout }
})
