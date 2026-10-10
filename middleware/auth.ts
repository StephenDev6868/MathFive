export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()

  // If token exists but user profile is not yet loaded in state, fetch it
  if (authStore.token && !authStore.user) {
    await authStore.fetchProfile()
  }

  if (!authStore.isAuthenticated) {
    return navigateTo({
      path: '/auth/login',
      query: {
        redirect: to.fullPath
      }
    })
  }
})
