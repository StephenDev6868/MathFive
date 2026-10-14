import { defineStore } from 'pinia'
import type { LoginCredentials, User } from '~/types'

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
      .select('display_name, role, created_at')
      .eq('id', authData.user.id)
      .maybeSingle()
    const profile = profileData as { display_name: string; role: string; created_at: string } | null
    if (!profile) {
      user.value = null
      return
    }
    user.value = {
      id: authData.user.id,
      name: profile.display_name,
      email: authData.user.email || '',
      role: profile.role === 'teacher' ? 'teacher' : 'student',
      avatar: '',
      createdAt: profile.created_at,
    }
  }

  async function login(credentials: LoginCredentials) {
    loading.value = true
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: credentials.email, password: credentials.password })
      if (error) throw error
      await fetchProfile()
      if (!user.value) throw new Error('Tài khoản chưa được cấp hồ sơ học sinh hoặc giáo viên.')
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
