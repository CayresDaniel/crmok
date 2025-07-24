import { defineStore } from 'pinia'
import type { User, LoginCredentials, LoginResponse, AuthState } from '~/types/auth'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'ADMIN',
    isStylist: (state) => state.user?.role === 'CABELEIREIRO',
    userDisplayName: (state) => state.user?.name || state.user?.username || '',
  },

  actions: {
    // Inicializar store com dados salvos
    async initAuth() {
      const token = useCookie('covenos-token', {
        default: () => null,
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 dias
      })

      const userData = useCookie('covenos-user', {
        default: () => null,
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 dias
      })

      if (token.value && userData.value) {
        this.token = token.value
        this.user = userData.value
        this.isAuthenticated = true
        
        // Validar token no servidor
        try {
          await this.validateToken()
        } catch (error) {
          await this.logout()
        }
      }
    },

    // Login
    async login(credentials: LoginCredentials) {
      this.isLoading = true
      
      try {
        const { $api } = useNuxtApp()
        const response = await $api<LoginResponse>('/auth/login', {
          method: 'POST',
          body: credentials
        })

        if (response.access_token && response.user) {
          await this.setAuthData(response.access_token, response.user)
          
          // Mostrar toast de sucesso
          const { $toast } = useNuxtApp()
          $toast.success(useNuxtApp().$i18n.t('auth.loginSuccess'))
          
          return { success: true }
        }

        throw new Error('Resposta inválida do servidor')
      } catch (error: any) {
        console.error('Login error:', error)
        
        const { $toast } = useNuxtApp()
        $toast.error(error.data?.message || useNuxtApp().$i18n.t('auth.invalidCredentials'))
        
        return { 
          success: false, 
          error: error.data?.message || 'Erro no login' 
        }
      } finally {
        this.isLoading = false
      }
    },

    // Logout
    async logout() {
      // Limpar dados do store
      this.user = null
      this.token = null
      this.isAuthenticated = false
      
      // Limpar cookies
      const tokenCookie = useCookie('covenos-token')
      const userCookie = useCookie('covenos-user')
      tokenCookie.value = null
      userCookie.value = null
      
      // Redirecionar para login
      await navigateTo('/login')
      
      const { $toast } = useNuxtApp()
      $toast.info('Logout realizado com sucesso')
    },

    // Definir dados de autenticação
    async setAuthData(token: string, user: User) {
      this.token = token
      this.user = user
      this.isAuthenticated = true

      // Salvar nos cookies
      const tokenCookie = useCookie('covenos-token', {
        default: () => null,
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 dias
      })
      
      const userCookie = useCookie('covenos-user', {
        default: () => null,
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 dias
      })

      tokenCookie.value = token
      userCookie.value = user
    },

    // Validar token no servidor
    async validateToken() {
      if (!this.token) {
        throw new Error('Token não encontrado')
      }

      try {
        const { $api } = useNuxtApp()
        const response = await $api('/auth/validate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        })

        if (!response.valid) {
          throw new Error('Token inválido')
        }

        // Atualizar dados do usuário se necessário
        if (response.user) {
          this.user = response.user
          const userCookie = useCookie('covenos-user')
          userCookie.value = response.user
        }

        return true
      } catch (error) {
        console.error('Token validation error:', error)
        throw error
      }
    },

    // Refresh user data
    async refreshUser() {
      if (!this.token) return

      try {
        const { $api } = useNuxtApp()
        const response = await $api('/auth/profile', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        })

        if (response) {
          this.user = response
          const userCookie = useCookie('covenos-user')
          userCookie.value = response
        }
      } catch (error) {
        console.error('Error refreshing user data:', error)
      }
    },

    // Verificar se a sessão expirou
    async checkSession() {
      if (!this.isAuthenticated || !this.token) {
        return false
      }

      try {
        await this.validateToken()
        return true
      } catch (error) {
        const { $toast } = useNuxtApp()
        $toast.error(useNuxtApp().$i18n.t('auth.sessionExpired'))
        await this.logout()
        return false
      }
    }
  }
})