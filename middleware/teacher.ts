export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()
  if (authStore.token && !authStore.user) await authStore.fetchProfile()
  if (authStore.user?.role !== 'teacher') return navigateTo('/')
})
