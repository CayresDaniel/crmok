import axios from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  // Criar instância do axios
  const api = axios.create({
    baseURL: config.public.apiBase,
    timeout: 10000, // Reduzir timeout para falhar mais rápido
    headers: {
      'Content-Type': 'application/json'
    },
    // Tentar reconectar automaticamente
    retry: 3,
    retryDelay: 1000
  })

  // Interceptor para incluir token automaticamente
  api.interceptors.request.use((config) => {
    const token = useCookie('covenos-token')
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`
    }
    return config
  })

  // Interceptor para lidar com erros de autenticação e reconexão
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config
      
      // Se é erro de conexão (backend caiu), tentar novamente
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || !error.response) {
        if (!originalRequest._retry && originalRequest._retryCount < 3) {
          originalRequest._retry = true
          originalRequest._retryCount = (originalRequest._retryCount || 0) + 1
          
          console.log(`🔄 Tentativa ${originalRequest._retryCount}/3 de reconexão...`)
          
          // Aguardar antes de tentar novamente
          await new Promise(resolve => setTimeout(resolve, 2000 * originalRequest._retryCount))
          
          return api(originalRequest)
        }
      }
      
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