import { defineStore } from 'pinia'
import type { User, LoginCredentials } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })

  const user = useState<User | null>('auth_user', () => null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // Fetch current user profile if token exists
  async function fetchProfile() {
    if (!token.value) {
      user.value = null
      return
    }

    try {
      loading.value = true
      const data = await $fetch<User>('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      user.value = data
    } catch {
      // Token invalid or expired
      logout()
    } finally {
      loading.value = false
    }
  }

  // Handle Login
  async function login(credentials: LoginCredentials) {
    loading.value = true
    try {
      const response = await $fetch<{ user: User; token: string }>('/api/auth/login', {
        method: 'POST',
        body: credentials
      })

      token.value = response.token
      user.value = response.user
      return response
    } finally {
      loading.value = false
    }
  }

  // Handle Logout
  async function logout() {
    try {
      if (token.value) {
        await $fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        }).catch(() => {})
      }
    } finally {
      token.value = null
      user.value = null
      navigateTo('/auth/login')
    }
  }

  // Update profile
  function updateProfile(updated: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...updated }
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    fetchProfile,
    login,
    logout,
    updateProfile
  }
})
