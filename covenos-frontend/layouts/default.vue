<template>
  <div class="min-h-screen bg-gray-950">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-gray-950/80 border-b border-gray-800/50">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink to="/dashboard" class="flex items-center space-x-3 group">
              <div class="relative w-10 h-10">
<div class="relative w-10 h-10">
  <div class="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-xl"></div>

  <img 
    src="/logo-sem-fundo.png" 
    alt="Logo da Coven Beauty" 
    class="relative w-22 h-22 rounded-xl object-cover"
  >
</div>
              </div>
              <div class="hidden sm:block">
                <h1 class="text-xl font-semibold text-white">
                  Coven Beauty
                </h1>
                <p class="text-xs text-gray-500 -mt-0.5">
                  CRM
                </p>
              </div>
            </NuxtLink>
          </div>
          
          <!-- Desktop Navigation -->
          <div class="hidden lg:flex items-center space-x-1">
            <NuxtLink to="/dashboard" class="nav-link">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span>Dashboard</span>
            </NuxtLink>
            
            <NuxtLink to="/clients" class="nav-link">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span>Clientes</span>
            </NuxtLink>
            
            <NuxtLink to="/appointments" class="nav-link">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>Agendamentos</span>
            </NuxtLink>
            
            <NuxtLink to="/procedures" class="nav-link">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
              </svg>
              <span>Procedimentos</span>
            </NuxtLink>
            
            <NuxtLink to="/products" class="nav-link">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <span>Produtos</span>
            </NuxtLink>
            
            <NuxtLink to="/financial" class="nav-link">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Financeiro</span>
            </NuxtLink>
            
            <NuxtLink to="/utilidades" class="nav-link">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
              </svg>
              <span>Utilidades</span>
            </NuxtLink>
            
            <NuxtLink to="/users" class="nav-link">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M18 8a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>Usuários</span>
            </NuxtLink>
          </div>
          
          <!-- Right side actions -->
          <div class="flex items-center space-x-3">
            <!-- Notifications -->
            <button class="relative p-2 text-gray-400 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              <span class="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
            </button>
            
            <!-- Mobile menu -->
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="lg:hidden p-2 text-gray-400 hover:text-white transition-colors">
              <svg v-if="!mobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            
            <!-- Profile Menu -->
            <div class="relative">
              <button @click="profileMenuOpen = !profileMenuOpen" class="flex items-center space-x-2 p-1.5 pr-3 rounded-full hover:bg-gray-800/50 transition-all duration-200">
                <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-medium">A</span>
                </div>
                <span class="hidden sm:block text-sm text-gray-300">Admin</span>
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <!-- Dropdown -->
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div v-if="profileMenuOpen" @click.away="profileMenuOpen = false" class="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden">
                  <div class="p-3 border-b border-gray-800">
                    <p class="text-sm font-medium text-white">Administrador</p>
                    <p class="text-xs text-gray-400">admin@covenbeauty.com</p>
                  </div>
                  <div class="p-1">
                    <button class="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <span>Meu Perfil</span>
                    </button>
                    <button class="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      <span>Configurações</span>
                    </button>
                    <div class="border-t border-gray-800 my-1"></div>
                    <button @click="logout" class="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                      </svg>
                      <span>Sair</span>
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
        
        <!-- Mobile Navigation -->
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <div v-if="mobileMenuOpen" class="lg:hidden border-t border-gray-800 py-3">
            <div class="space-y-1">
              <NuxtLink to="/dashboard" @click="mobileMenuOpen = false" class="mobile-nav-link">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                Dashboard
              </NuxtLink>
              <NuxtLink to="/clients" @click="mobileMenuOpen = false" class="mobile-nav-link">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Clientes
              </NuxtLink>
              <NuxtLink to="/appointments" @click="mobileMenuOpen = false" class="mobile-nav-link">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Agendamentos
              </NuxtLink>
              <NuxtLink to="/procedures" @click="mobileMenuOpen = false" class="mobile-nav-link">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                </svg>
                Procedimentos
              </NuxtLink>
              <NuxtLink to="/products" @click="mobileMenuOpen = false" class="mobile-nav-link">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                Produtos
              </NuxtLink>
              <NuxtLink to="/financial" @click="mobileMenuOpen = false" class="mobile-nav-link">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Financeiro
              </NuxtLink>
              <NuxtLink to="/utilidades" @click="mobileMenuOpen = false" class="mobile-nav-link">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                </svg>
                Utilidades
              </NuxtLink>
              <NuxtLink to="/users" @click="mobileMenuOpen = false" class="mobile-nav-link">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M18 8a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Usuários
              </NuxtLink>
            </div>
          </div>
        </transition>
      </div>
    </nav>
    
    <!-- Main Content with padding for fixed header -->
    <main class="pt-16">
      <div class="container mx-auto px-4 py-8">
        <slot />
      </div>
    </main>
    
    <!-- Toast Notifications -->
    <Toast />
  </div>
</template>

<script setup>
const mobileMenuOpen = ref(false)
const profileMenuOpen = ref(false)

const logout = () => {
  const token = useCookie('covenos-token')
  const user = useCookie('covenos-user')
  token.value = null
  user.value = null
  navigateTo('/login')
}

// Close mobile menu on resize
onMounted(() => {
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      mobileMenuOpen.value = false
    }
  })
})
</script>

<style scoped>
.nav-link {
  @apply flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200;
}

.nav-link.router-link-active {
  @apply text-white bg-gray-800;
}

.mobile-nav-link {
  @apply flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200;
}

.mobile-nav-link.router-link-active {
  @apply text-white bg-gray-800;
}
</style>