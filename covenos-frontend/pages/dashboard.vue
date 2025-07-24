<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Dashboard</h1>
        <p class="text-sm text-gray-400 mt-1">Bem-vindo ao Coven Beauty</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <p class="text-sm text-gray-400">{{ currentDate }}</p>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <!-- Agendamentos Hoje -->
      <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400">Agendamentos Hoje</p>
            <p class="text-2xl font-bold text-white mt-2">{{ stats.todayAppointments }}</p>
            <p class="text-xs text-gray-500 mt-1">
              <span :class="stats.appointmentsTrend >= 0 ? 'text-green-400' : 'text-red-400'">
                {{ stats.appointmentsTrend >= 0 ? '+' : '' }}{{ stats.appointmentsTrend }}%
              </span>
              vs. ontem
            </p>
          </div>
          <div class="p-3 bg-purple-500/10 rounded-xl">
            <CalendarIcon class="w-6 h-6 text-purple-400" />
          </div>
        </div>
      </div>

      <!-- Receita Mensal -->
      <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400">Receita Mensal</p>
            <p class="text-2xl font-bold text-white mt-2">{{ formatCurrency(stats.monthlyRevenue) }}</p>
            <p class="text-xs text-gray-500 mt-1">
              <span class="text-green-400">+{{ stats.revenueTrend }}%</span>
              vs. mês anterior
            </p>
          </div>
          <div class="p-3 bg-green-500/10 rounded-xl">
            <CurrencyDollarIcon class="w-6 h-6 text-green-400" />
          </div>
        </div>
      </div>

      <!-- Clientes Ativos -->
      <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400">Clientes Ativos</p>
            <p class="text-2xl font-bold text-white mt-2">{{ stats.activeClients }}</p>
            <p class="text-xs text-gray-500 mt-1">
              <span class="text-blue-400">{{ stats.newClients }}</span>
              novos este mês
            </p>
          </div>
          <div class="p-3 bg-blue-500/10 rounded-xl">
            <UsersIcon class="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </div>

      <!-- Produtos em Baixa -->
      <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400">Estoque Baixo</p>
            <p class="text-2xl font-bold text-white mt-2">{{ stats.lowStockProducts }}</p>
            <p class="text-xs text-gray-500 mt-1">
              produtos precisam reposição
            </p>
          </div>
          <div class="p-3 bg-red-500/10 rounded-xl">
            <ExclamationTriangleIcon class="w-6 h-6 text-red-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6">
      <h2 class="text-lg font-semibold text-white mb-4">Ações Rápidas</h2>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <NuxtLink to="/clients" class="quick-action-btn group">
          <div class="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors mb-3">
            <UserPlusIcon class="w-6 h-6 text-purple-400" />
          </div>
          <span class="text-sm font-medium text-gray-300 group-hover:text-white">Novo Cliente</span>
        </NuxtLink>
        
        <NuxtLink to="/appointments" class="quick-action-btn group">
          <div class="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors mb-3">
            <CalendarDaysIcon class="w-6 h-6 text-blue-400" />
          </div>
          <span class="text-sm font-medium text-gray-300 group-hover:text-white">Agendar</span>
        </NuxtLink>
        
        <NuxtLink to="/products" class="quick-action-btn group">
          <div class="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors mb-3">
            <CubeIcon class="w-6 h-6 text-green-400" />
          </div>
          <span class="text-sm font-medium text-gray-300 group-hover:text-white">Novo Produto</span>
        </NuxtLink>
        
        <NuxtLink to="/financial" class="quick-action-btn group">
          <div class="p-3 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors mb-3">
            <BanknotesIcon class="w-6 h-6 text-yellow-400" />
          </div>
          <span class="text-sm font-medium text-gray-300 group-hover:text-white">Nova Transação</span>
        </NuxtLink>
      
        <NuxtLink to="/procedures" class="quick-action-btn group">
          <div class="p-3 bg-yellow-500/10 rounded-lg group-hover:bg-yellow-500/20 transition-colors mb-3">
            <CubeIcon class="w-6 h-6 text-green-200" />
          </div>
          <span class="text-sm font-medium text-gray-300 group-hover:text-white">Novo Procedimento</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Recent Data Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- Recent Appointments -->
      <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-white">Próximos Agendamentos</h2>
          <NuxtLink to="/appointments" class="text-sm text-purple-400 hover:text-purple-300 transition-colors">
            Ver todos →
          </NuxtLink>
        </div>

        <div v-if="loadingAppointments" class="space-y-3">
          <div v-for="i in 4" :key="i" class="animate-pulse">
            <div class="bg-gray-800/50 h-16 rounded-lg"></div>
          </div>
        </div>

        <div v-else-if="recentAppointments.length === 0" class="text-center py-12">
          <CalendarIcon class="w-12 h-12 mx-auto text-gray-600 mb-3" />
          <p class="text-sm text-gray-400">Nenhum agendamento para hoje</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="appointment in recentAppointments"
            :key="appointment.id"
            class="group p-4 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg transition-all duration-200 cursor-pointer"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
                  {{ appointment.client?.name?.charAt(0) || 'C' }}
                </div>
                <div>
                  <p class="text-sm font-medium text-white">{{ appointment.client?.name }}</p>
                  <p class="text-xs text-gray-400">{{ appointment.service }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-white">{{ formatTime(appointment.startTime) }}</p>
                <p class="text-xs text-gray-400">{{ formatCurrency(appointment.totalPrice || 0) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Low Stock Products -->
      <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-white">Produtos em Baixa</h2>
          <NuxtLink to="/products" class="text-sm text-purple-400 hover:text-purple-300 transition-colors">
            Ver todos →
          </NuxtLink>
        </div>

        <div v-if="loadingProducts" class="space-y-3">
          <div v-for="i in 4" :key="i" class="animate-pulse">
            <div class="bg-gray-800/50 h-14 rounded-lg"></div>
          </div>
        </div>

        <div v-else-if="lowStockProducts.length === 0" class="text-center py-12">
          <CheckCircleIcon class="w-12 h-12 mx-auto text-green-500 mb-3" />
          <p class="text-sm text-gray-400">Todos os produtos estão em estoque</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="product in lowStockProducts"
            :key="product.id"
            class="group p-4 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg transition-all duration-200 cursor-pointer"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-white group-hover:text-purple-400 transition-colors">
                  {{ product.name }}
                </p>
                <p class="text-xs text-gray-400 mt-1">
                  Categoria: {{ product.category }}
                </p>
              </div>
              <div class="flex items-center space-x-3">
                <div class="text-right">
                  <p class="text-sm font-medium text-white">{{ product.stock }}</p>
                  <p class="text-xs text-gray-400">{{ product.unit }}</p>
                </div>
                <div class="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                  <span class="text-xs font-medium text-red-400">Baixo</span>
                </div>
              </div>
            </div>
            <div class="mt-2">
              <div class="w-full bg-gray-700 rounded-full h-1.5">
                <div 
                  class="bg-red-500 h-1.5 rounded-full transition-all duration-300"
                  :style="`width: ${(product.stock / (product.minStock * 2)) * 100}%`"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity Chart -->
    <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6">
      <h2 class="text-lg font-semibold text-white mb-4">Atividade Semanal</h2>
      <div class="h-64 flex items-end justify-between space-x-2">
        <div v-for="(day, index) in weekActivity" :key="index" class="flex-1 flex flex-col items-center">
          <div class="w-full bg-gray-800 rounded-t flex-1 relative overflow-hidden">
            <div 
              class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-500 to-purple-400 transition-all duration-500"
              :style="`height: ${day.percentage}%`"
            ></div>
          </div>
          <p class="text-xs text-gray-400 mt-2">{{ day.label }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  CalendarIcon, 
  CurrencyDollarIcon, 
  UsersIcon, 
  ExclamationTriangleIcon,
  UserPlusIcon,
  CalendarDaysIcon,
  CubeIcon,
  BanknotesIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

// Page meta
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

// SEO
useSeoMeta({
  title: 'Dashboard - Coven Beauty',
  description: 'Painel principal do sistema Coven Beauty'
})

// State
const currentDate = ref(new Date().toLocaleDateString('pt-BR', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
}))

const stats = reactive({
  todayAppointments: 0,
  appointmentsTrend: 0,
  monthlyRevenue: 0,
  revenueTrend: 0,
  activeClients: 0,
  newClients: 0,
  lowStockProducts: 0
})

const recentAppointments = ref([])
const lowStockProducts = ref([])
const weekActivity = ref([
  { label: 'Seg', percentage: 0 },
  { label: 'Ter', percentage: 0 },
  { label: 'Qua', percentage: 0 },
  { label: 'Qui', percentage: 0 },
  { label: 'Sex', percentage: 0 },
  { label: 'Sáb', percentage: 0 },
  { label: 'Dom', percentage: 0 }
])

const loadingStats = ref(true)
const loadingAppointments = ref(true)
const loadingProducts = ref(true)

// Methods
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatTime = (time) => {
  return new Date(time).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDateTime = (dateTime) => {
  return new Date(dateTime).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadDashboardData = async () => {
  try {
    const { $api } = useNuxtApp()
    const token = useCookie('covenos-token')
    
    // Carregar dados em paralelo
    const [appointmentsResponse, clientsResponse, productsResponse] = await Promise.all([
      $api('/appointments', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      }).catch(() => ({ data: [] })),
      $api('/clients', {
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      }).catch(() => ({ data: [] })),
      $api('/products', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      }).catch(() => ({ data: [] }))
    ])
    
    // Calcular estatísticas
    const today = new Date()
    const todayStr = today.toDateString()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toDateString()
    
    // Agendamentos de hoje
    const todayAppointments = appointmentsResponse.data?.filter(apt => 
      new Date(apt.date || apt.startTime).toDateString() === todayStr
    ) || []
    
    // Agendamentos de ontem para comparação
    const yesterdayAppointments = appointmentsResponse.data?.filter(apt => 
      new Date(apt.date || apt.startTime).toDateString() === yesterdayStr
    ) || []
    
    // Calcular tendência de agendamentos
    const appointmentsTrend = yesterdayAppointments.length > 0 
      ? Math.round(((todayAppointments.length - yesterdayAppointments.length) / yesterdayAppointments.length) * 100)
      : 0
    
    // Receita mensal
    const thisMonth = today.getMonth()
    const thisYear = today.getFullYear()
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear
    
    const monthlyRevenue = appointmentsResponse.data?.filter(apt => {
      const aptDate = new Date(apt.date || apt.startTime)
      return aptDate.getMonth() === thisMonth && aptDate.getFullYear() === thisYear
    }).reduce((sum, apt) => sum + (parseFloat(apt.totalPrice) || 0), 0) || 0
    
    const lastMonthRevenue = appointmentsResponse.data?.filter(apt => {
      const aptDate = new Date(apt.date || apt.startTime)
      return aptDate.getMonth() === lastMonth && aptDate.getFullYear() === lastMonthYear
    }).reduce((sum, apt) => sum + (parseFloat(apt.totalPrice) || 0), 0) || 0
    
    // Calcular tendência de receita
    const revenueTrend = lastMonthRevenue > 0
      ? Math.round(((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : 0
    
    // Clientes
    const activeClients = clientsResponse.data?.filter(client => client.active !== false).length || 0
    const newClients = clientsResponse.data?.filter(client => {
      const createdAt = new Date(client.createdAt)
      return createdAt.getMonth() === thisMonth && createdAt.getFullYear() === thisYear
    }).length || 0
    
    // Produtos com estoque baixo
    const lowStock = productsResponse.data?.filter(product => 
      product.stock <= (product.minStock || 5)
    ) || []
    
    // Atualizar stats
    stats.todayAppointments = todayAppointments.length
    stats.appointmentsTrend = appointmentsTrend
    stats.monthlyRevenue = monthlyRevenue
    stats.revenueTrend = revenueTrend
    stats.activeClients = activeClients
    stats.newClients = newClients
    stats.lowStockProducts = lowStock.length
    
    // Agendamentos recentes (próximos do dia)
    recentAppointments.value = todayAppointments
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, 5)
    
    // Produtos com estoque baixo
    lowStockProducts.value = lowStock.slice(0, 5)
    
    // Calcular atividade semanal
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const weekData = Array(7).fill(0)
    
    appointmentsResponse.data?.forEach(apt => {
      const aptDate = new Date(apt.date || apt.startTime)
      const daysDiff = Math.floor((today - aptDate) / (1000 * 60 * 60 * 24))
      
      if (daysDiff >= 0 && daysDiff < 7) {
        const dayIndex = aptDate.getDay()
        weekData[dayIndex]++
      }
    })
    
    const maxAppointments = Math.max(...weekData, 1)
    weekActivity.value = weekData.map((count, index) => ({
      label: weekDays[index],
      percentage: Math.round((count / maxAppointments) * 100)
    }))
    
    // Atualizar loading states
    loadingStats.value = false
    loadingAppointments.value = false
    loadingProducts.value = false
    
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error)
    loadingStats.value = false
    loadingAppointments.value = false 
    loadingProducts.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadDashboardData()
  
  // Atualizar a cada 5 minutos
  const interval = setInterval(() => {
    loadDashboardData()
  }, 5 * 60 * 1000)
  
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

<style scoped>
.quick-action-btn {
  @apply flex flex-col items-center justify-center p-4 rounded-xl border border-gray-800 hover:border-gray-700 transition-all duration-200 cursor-pointer;
}
</style>