export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()
  
  // Inicializar autenticação se ainda não foi feito
  if (!authStore.isAuthenticated && !authStore.isLoading) {
    await authStore.initAuth()
  }

  // Se já estiver autenticado, redirecionar para dashboard
  if (authStore.isAuthenticated) {
    return navigateTo('/dashboard')
  }
})