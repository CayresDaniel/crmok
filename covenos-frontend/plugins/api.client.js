import axios from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  // Criar instância do axios
  const api = axios.create({
    baseURL: config.public.apiBase,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Interceptor para incluir token automaticamente
  api.interceptors.request.use((config) => {
    const token = useCookie('covenos-token')
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`
    }
    return config
  })

  // Interceptor para lidar com erros de autenticação
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expirado ou inválido
        const token = useCookie('covenos-token')
        const user = useCookie('covenos-user')
        token.value = null
        user.value = null
        // Redirecionar para login se não estiver na página de login
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
      }
      return Promise.reject(error)
    }
  )

  // Função helper para fazer requests
  const $api = async (url, options = {}) => {
    const { method = 'GET', body, headers = {}, ...configExtra } = options
    
    try {
      const response = await api({
        url,
        method,
        data: body,
        headers,
        ...configExtra
      })
      
      return response.data
    } catch (error) {
      console.error('API Error:', {
        url,
        method,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data,
        requestBody: body,
        requestHeaders: headers
      })
      throw error
    }
  }

  return {
    provide: {
      api: $api,
      axios: api
    }
  }
})