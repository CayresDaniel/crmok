export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie('covenos-token')
  
  if (!token.value) {
    return navigateTo('/login')
  }
})