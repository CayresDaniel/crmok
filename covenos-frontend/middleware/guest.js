export default defineNuxtRouteMiddleware(() => {
  const token = useCookie('covenos-token')
  
  if (token.value) {
    return navigateTo('/dashboard')
  }
})