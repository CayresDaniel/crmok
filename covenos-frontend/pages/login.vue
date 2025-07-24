<template>
  <div class="min-h-screen flex items-center justify-center bg-abyss text-white px-6 font-body">

    <!-- Cartão central de login -->
    <div class="w-full max-w-md bg-night/90 border border-white/10 rounded-lg shadow-2xl backdrop-blur-sm p-8 space-y-6 animate-fade-in">

      <!-- Logo e título -->
      <div class="text-center">
        <img
          src="/logo-sem-fundo.png"
          alt="Logo Covenos"
          class="w-26 h-26 mx-auto mb-4 "
        />
      </div>

      <!-- Mensagem -->
      <div class="text-center space-y-1">
        <p class="text-sm text-neutral-400">Convoque seus poderes ocultos para entrar</p>
      </div>

      <!-- Formulário -->
      <form @submit.prevent="handleLogin" class="space-y-4">

        <!-- Campo usuário -->
        <div>
          <label for="username" class="block text-sm text-neutral-300 mb-1">Invocação</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            class="w-full bg-abyss/50 border border-abyss text-white placeholder:text-neutral-500 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blood"
            placeholder=""
            @focus="clearError"
          />
        </div>

        <!-- Campo senha -->
        <div>
          <label for="password" class="block text-sm text-neutral-300 mb-1">Feitiço secreto</label>
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            required
            class="w-full bg-abyss/50 border border-abyss text-white placeholder:text-neutral-500 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blood"
            placeholder="••••••••"
            @focus="clearError"
          />
        </div>

        <!-- Mostrar senha -->
        <div class="flex items-center gap-2 text-sm text-neutral-400">
          <input type="checkbox" id="showPassword" v-model="showPassword" class="accent-blood" />
          <label for="showPassword">Revelar o feitiço</label>
        </div>

        <!-- Erro -->
        <div v-if="error" class="text-sm text-red-500 bg-red-900/20 p-2 rounded flex gap-2 items-center">
          <ExclamationTriangleIcon class="w-4 h-4" />
          <span>{{ error }}</span>
        </div>

        <!-- Botão -->
        <button
          type="submit"
          class="w-full bg-blood hover:bg-blood/80 text-white py-3 rounded-md font-semibold transition-all duration-300 shadow-md shadow-black/20"
          :disabled="isLoading || !form.username || !form.password"
        >
          <span v-if="isLoading" class="flex justify-center gap-2 items-center">
            <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0..." />
            </svg>
            Invocando espíritos...
          </span>
          <span v-else>Invocar magia</span>
        </button>
      </form>
    </div>
  </div>
</template>


<script setup>
import { 
  EyeIcon, 
  EyeSlashIcon, 
  UserIcon, 
  LockClosedIcon, 
  ExclamationTriangleIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: false,
  middleware: 'guest'
})

useSeoMeta({
  title: 'Login - COVEN OS',
  description: 'Acesse o sistema de gestão Covenos para salões de beleza'
})

const form = reactive({
  username: '',
  password: ''
})

const showPassword = ref(false)
const error = ref('')
const isLoading = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const clearError = () => {
  error.value = ''
}

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true

  try {
    const { $api } = useNuxtApp()

    const response = await $api('/auth/login', {
      method: 'POST',
      body: {
        username: form.username,
        password: form.password
      }
    })

    if (response.access_token && response.user) {
      // Salvar token
      const token = useCookie('covenos-token', {
        default: () => null,
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 dias
      })
      
      // Salvar dados do usuário
      const user = useCookie('covenos-user', {
        default: () => null,
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 dias
      })
      
      token.value = response.access_token
      user.value = response.user
      
      await navigateTo('/dashboard')
    } else {
      error.value = 'Resposta inválida do servidor'
    }
  } catch (err) {
    console.error('Login error:', err)
    error.value = err.response?.data?.message || 'Credenciais inválidas'
  } finally {
    isLoading.value = false
  }
}
</script>

