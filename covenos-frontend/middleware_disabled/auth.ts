export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  
  // Inicializar autenticação se ainda não foi feito
  if (!authStore.isAuthenticated && !authStore.isLoading) {
    await authStore.initAuth()
  }

  // Se não estiver autenticado, redirecionar para login
  if (!authStore.isAuthenticated) {
    // Salvar a rota que o usuário tentou acessar para redirecionar depois do login
    const redirectTo = to.fullPath !== '/login' ? to.fullPath : '/dashboard'
    
    return navigateTo({
      path: '/login',
      query: { redirect: redirectTo }
    })
  }

  // Verificar se a sessão ainda é válida
  const isSessionValid = await authStore.checkSession()
  if (!isSessionValid) {
    return navigateTo('/login')
  }
})