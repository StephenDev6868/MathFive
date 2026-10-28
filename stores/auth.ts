import { defineStore } from 'pinia'
import type { LoginCredentials, User } from '~/types'

const INTERNAL_ACCOUNT_EMAIL_DOMAIN = 'accounts.math5.local'

export const useAuthStore = defineStore('auth', () => {
  const supabase = useSupabaseClient()
  const session = useSupabaseSession()
  const user = useState<User | null>('auth_user', () => null)
  const loading = ref(false)
  const guestQuestionsRemaining = ref<number | null>(null)
  const token = computed(() => session.value?.access_token ?? null)
  const isAuthenticated = computed(() => Boolean(token.value && user.value))
  const isGuest = computed(() => Boolean(user.value?.isGuest))

  async function refreshGuestQuota(accessToken = token.value) {
    if (!accessToken || !user.value?.isGuest) {
      guestQuestionsRemaining.value = null
      return
    }
    const result = await $fetch<{ data: { remaining: number } }>('/api/auth/guest-quota', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    guestQuestionsRemaining.value = result.data.remaining
  }

  async function fetchProfile() {
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) {
      user.value = null
      guestQuestionsRemaining.value = null
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
      isGuest: Boolean(authData.user.is_anonymous || authData.user.app_metadata?.is_guest),
    }
    if (user.value.isGuest) await refreshGuestQuota().catch(() => undefined)
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

  async function loginAsGuest(displayName: string) {
    loading.value = true
    try {
      const name = displayName.trim().replace(/\s+/g, ' ')
      if (name.length < 2 || name.length > 50) {
        throw new Error('Tên của em cần từ 2 đến 50 ký tự.')
      }
      const result = await $fetch<{ data: { accessToken: string; refreshToken: string } }>('/api/auth/guest', {
        method: 'POST',
        body: { displayName: name },
      })
      const { error } = await supabase.auth.setSession({
        access_token: result.data.accessToken,
        refresh_token: result.data.refreshToken,
      })
      if (error) throw error

      await fetchProfile()
      if (!user.value) throw new Error('Chưa thể khởi tạo hồ sơ dùng thử.')
      return user.value
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
    guestQuestionsRemaining.value = null
    await navigateTo('/auth/login')
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isGuest,
    guestQuestionsRemaining,
    fetchProfile,
    refreshGuestQuota,
    login,
    loginAsGuest,
    logout,
  }
})
