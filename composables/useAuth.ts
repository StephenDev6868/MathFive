export function useAuth() {
  const authStore = useAuthStore()

  return {
    user: computed(() => authStore.user),
    token: computed(() => authStore.token),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    loading: computed(() => authStore.loading),
    login: authStore.login,
    logout: authStore.logout,
    fetchProfile: authStore.fetchProfile
  }
}
