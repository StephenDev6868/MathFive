export function useAuth() {
  const authStore = useAuthStore()

  return {
    user: computed(() => authStore.user),
    token: computed(() => authStore.token),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isGuest: computed(() => authStore.isGuest),
    guestQuestionsRemaining: computed(() => authStore.guestQuestionsRemaining),
    loading: computed(() => authStore.loading),
    login: authStore.login,
    loginAsGuest: authStore.loginAsGuest,
    logout: authStore.logout,
    fetchProfile: authStore.fetchProfile
  }
}
