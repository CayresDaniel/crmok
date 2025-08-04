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

    <!-- Active Comandas -->
    <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-lg font-semibold text-white">Comandas do Dia</h2>
          <p class="text-sm text-gray-400">Comandas ativas para hoje</p>
        </div>
        <NuxtLink to="/appointments" class="text-sm text-purple-400 hover:text-purple-300 transition-colors">
          Ver todas →
        </NuxtLink>
      </div>

      <div v-if="loadingComandas" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="bg-gray-800/50 h-32 rounded-lg"></div>
        </div>
      </div>

      <div v-else-if="activeComandas.length === 0" class="text-center py-12">
        <ClipboardDocumentCheckIcon class="w-12 h-12 mx-auto text-gray-600 mb-3" />
        <p class="text-sm text-gray-400 mb-2">Nenhuma comanda ativa no momento</p>
        <p class="text-xs text-gray-500">Comandas aparecerão aqui quando agendamentos forem confirmados</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="comanda in activeComandas"
          :key="comanda.id"
          class="group p-4 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg transition-all duration-200 cursor-pointer border-l-4"
          :class="{
            'border-blue-500': comanda.status === 'AGENDADO',
            'border-yellow-500': comanda.status === 'CONFIRMADO',
            'border-green-500': comanda.status === 'CONCLUIDO',
          }"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                {{ comanda.client?.name?.charAt(0) || 'C' }}
              </div>
              <div>
                <p class="text-sm font-medium text-white">{{ comanda.client?.name }}</p>
                <p class="text-xs text-gray-400">{{ comanda.user?.name }}</p>
              </div>
            </div>
            <span 
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
              :class="{
                'bg-blue-900/30 text-blue-400 border border-blue-800': comanda.status === 'AGENDADO',
                'bg-yellow-900/30 text-yellow-400 border border-yellow-800': comanda.status === 'CONFIRMADO',
                'bg-green-900/30 text-green-400 border border-green-800': comanda.status === 'CONCLUIDO',
              }"
            >
              {{ getStatusLabel(comanda.status) }}
            </span>
          </div>

          <div class="space-y-2 mb-3">
            <div class="flex justify-between text-xs">
              <span class="text-gray-400">Horário:</span>
              <span class="text-white">{{ formatTime(comanda.startTime) }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-gray-400">Valor:</span>
              <span class="text-white">{{ formatCurrency(comanda.totalPrice || 0) }}</span>
            </div>
            <div v-if="comanda.partialPayment" class="flex justify-between text-xs">
              <span class="text-gray-400">Entrada (50%):</span>
              <span class="text-green-400">{{ formatCurrency(comanda.partialPayment) }}</span>
            </div>
          </div>

          <div class="flex space-x-2">
            <!-- Botões para AGENDADO -->
            <button
              v-if="comanda.status === 'AGENDADO'"
              @click="confirmAppointment(comanda.id)"
              class="flex-1 px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded-md transition-colors"
            >
              Confirmar
            </button>
            
            <!-- Botões para CONFIRMADO -->
            <button
              v-if="comanda.status === 'CONFIRMADO'"
              @click="openComandaModal(comanda)"
              class="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors"
            >
              Abrir Comanda
            </button>
            <button
              v-if="comanda.status === 'CONFIRMADO'"
              @click="editComandaModal(comanda)"
              class="flex-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-md transition-colors"
            >
              Editar
            </button>
            <button
              v-if="comanda.status === 'CONFIRMADO'"
              @click="finishComandaModal(comanda)"
              class="flex-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md transition-colors"
            >
              Finalizar
            </button>
            
            <!-- Botões para AGENDADO também podem adicionar itens -->
            <button
              v-if="comanda.status === 'AGENDADO'"
              @click="editComandaModal(comanda)"
              class="flex-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-md transition-colors"
            >
              Adicionar Itens
            </button>
            
            <!-- Botão para CONCLUIDO -->
            <button
              v-if="comanda.status === 'CONCLUIDO'"
              disabled
              class="flex-1 px-3 py-1.5 bg-gray-600 text-gray-300 text-xs rounded-md"
            >
              Concluído
            </button>
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
      
      <!-- Quick Stats for Comandas -->
      <div class="mt-4 p-4 bg-gray-800/30 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400">Comandas Ativas</p>
            <p class="text-2xl font-bold text-white">{{ activeComandas.length }}</p>
          </div>
          <div class="text-xs text-gray-500">
            <div v-if="activeComandas.filter(c => c.status === 'AGENDADO').length > 0" class="text-blue-400">
              {{ activeComandas.filter(c => c.status === 'AGENDADO').length }} agendados
            </div>
            <div v-if="activeComandas.filter(c => c.status === 'CONFIRMADO').length > 0" class="text-yellow-400">
              {{ activeComandas.filter(c => c.status === 'CONFIRMADO').length }} confirmados
            </div>
            <div v-if="activeComandas.filter(c => c.status === 'CONCLUIDO').length > 0" class="text-green-400">
              {{ activeComandas.filter(c => c.status === 'CONCLUIDO').length }} concluídos
            </div>
          </div>
        </div>
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

    <!-- Modal de Gerenciamento de Comanda - Design Moderno -->
    <div v-if="showProductModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-700/50 w-full max-w-5xl max-h-[95vh] overflow-hidden">
        
        <!-- Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-700/50 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
          <div>
            <h2 class="text-2xl font-bold text-white flex items-center">
              <svg class="w-7 h-7 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0-8V7a2 2 0 012-2h2a2 2 0 012 2v2m0 0v8a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2"></path>
              </svg>
              Gerenciar Comanda
            </h2>
            <p class="text-sm text-gray-300 mt-1 flex items-center">
              <svg class="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              {{ selectedComanda?.client?.name }} • {{ formatDateTime(selectedComanda?.date) }}
            </p>
          </div>
          <button @click="closeProductModal" class="text-gray-400 hover:text-white hover:bg-gray-700/50 p-2 rounded-lg transition-all">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="overflow-y-auto max-h-[calc(95vh-140px)]">
          <!-- Conteúdo do Modal -->
          <div class="p-6 space-y-8">
            
            <!-- Cards de Adição -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <!-- Card Produto -->
              <div class="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-800/30 rounded-xl p-6">
                <div class="flex items-center mb-4">
                  <div class="p-2 bg-blue-500/20 rounded-lg mr-3">
                    <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-white">Adicionar Produto</h3>
                    <p class="text-sm text-blue-300/70">Selecione produtos para a comanda</p>
                  </div>
                </div>
                
                <!-- Campo de Busca de Produto -->
                <div class="relative mb-4">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input 
                    v-model="productSearch" 
                    type="text" 
                    placeholder="Pesquisar produto..."
                    class="w-full pl-10 pr-4 py-3 bg-gray-800/70 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                  >
                </div>
                
                <!-- Seleção de Produto -->
                <div class="space-y-3">
                  <select 
                    v-model="productForm.productId" 
                    class="w-full p-3 bg-gray-800/70 border border-gray-600/50 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                  >
                    <option value="">Selecionar produto...</option>
                    <option v-for="product in filteredProducts" :key="product.id" :value="product.id">
                      {{ product.name }} - {{ getDisplayStock(product) }}
                    </option>
                  </select>
                  
                  <div v-if="selectedProduct" class="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                    <div class="flex items-center justify-between mb-3">
                      <div>
                        <p class="text-white font-medium">{{ selectedProduct.name }}</p>
                        <p class="text-sm text-gray-400">Disponível: {{ getDisplayStock(selectedProduct) }}</p>
                      </div>
                    </div>
                    
                    <div class="flex space-x-3">
                      <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-300 mb-1">Quantidade</label>
                        <input 
                          v-model.number="productForm.quantity" 
                          type="number" 
                          :min="1"
                          :max="getMaxQuantity(selectedProduct)"
                          :step="getQuantityStep(selectedProduct)"
                          class="w-full px-3 py-2 bg-gray-700/70 border border-gray-600/50 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                          :placeholder="`Máx: ${getMaxQuantity(selectedProduct)} ${getProductUnit(selectedProduct)}`"
                        >
                      </div>
                      <div class="flex items-end">
                        <button 
                          @click="addQuickProduct" 
                          :disabled="!productForm.productId || !productForm.quantity"
                          class="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg font-medium transition-all transform hover:scale-105 disabled:hover:scale-100"
                        >
                          <svg class="w-4 h-4 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                          Adicionar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Card Procedimento -->
              <div class="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-800/30 rounded-xl p-6">
                <div class="flex items-center mb-4">
                  <div class="p-2 bg-purple-500/20 rounded-lg mr-3">
                    <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-lg font-semibold text-white">Adicionar Procedimento</h3>
                    <p class="text-sm text-purple-300/70">Adicione procedimentos extras</p>
                  </div>
                </div>
                
                <!-- Campo de Busca de Procedimento -->
                <div class="relative mb-4">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  <input 
                    v-model="procedureSearch" 
                    type="text" 
                    placeholder="Pesquisar procedimento..."
                    class="w-full pl-10 pr-4 py-3 bg-gray-800/70 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all"
                  >
                </div>
                
                <!-- Seleção de Procedimento -->
                <div class="space-y-3">
                  <select 
                    v-model="procedureForm.procedureId" 
                    @change="onProcedureSelect"
                    class="w-full p-3 bg-gray-800/70 border border-gray-600/50 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all"
                  >
                    <option value="">Selecionar procedimento...</option>
                    <option v-for="procedure in filteredProcedures" :key="procedure.id" :value="procedure.id">
                      {{ procedure.name }} - {{ formatCurrency(procedure.price || 0) }}
                    </option>
                  </select>
                  
                  <div v-if="procedureForm.procedureId" class="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
                    <div class="flex space-x-3">
                      <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-300 mb-1">Preço</label>
                        <input 
                          v-model.number="procedureForm.price" 
                          type="number" 
                          min="0"
                          step="0.01"
                          class="w-full px-3 py-2 bg-gray-700/70 border border-gray-600/50 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all"
                          placeholder="Preço do procedimento"
                        >
                      </div>
                      <div class="flex items-end">
                        <button 
                          @click="addQuickProcedure" 
                          :disabled="!procedureForm.procedureId || !procedureForm.price"
                          class="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg font-medium transition-all transform hover:scale-105 disabled:hover:scale-100"
                        >
                          <svg class="w-4 h-4 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                          Adicionar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Lista de Itens para Salvar -->
            <div v-if="quickItems.length > 0" class="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-800/30 rounded-xl p-6">
              <div class="flex items-center mb-4">
                <div class="p-2 bg-amber-500/20 rounded-lg mr-3">
                  <svg class="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-white">Itens Aguardando ({{ quickItems.length }})</h3>
                  <p class="text-sm text-amber-300/70">Clique em salvar para adicionar à comanda</p>
                </div>
              </div>
              
              <div class="space-y-2 mb-4">
                <div v-for="(item, index) in quickItems" :key="index" 
                     class="flex justify-between items-center bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700/30 hover:bg-gray-700/50 transition-all">
                  <div class="flex items-center">
                    <div class="p-2 rounded-lg mr-3" :class="item.type === 'product' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="item.type === 'product'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                      </svg>
                    </div>
                    <div>
                      <span class="text-white font-medium">{{ item.name }}</span>
                      <div class="text-sm text-gray-400">
                        {{ item.type === 'product' ? `${item.quantity} ${item.unit}` : formatCurrency(item.price) }}
                      </div>
                    </div>
                  </div>
                  <button 
                    @click="removeQuickItem(index)"
                    class="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 rounded-lg transition-all"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div class="text-center">
                <button 
                  @click="saveQuickItems" 
                  class="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Salvar Todos os Itens ({{ quickItems.length }})
                </button>
              </div>
            </div>
            
            <!-- Lista de Itens Já Salvos -->
            <div v-if="existingItems.length > 0" class="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-800/30 rounded-xl p-6">
              <div class="flex items-center mb-4">
                <div class="p-2 bg-green-500/20 rounded-lg mr-3">
                  <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-white">Itens na Comanda ({{ existingItems.length }})</h3>
                  <p class="text-sm text-green-300/70">Itens já adicionados e salvos</p>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div v-for="item in existingItems" :key="item.id" 
                     class="flex justify-between items-center bg-green-800/20 backdrop-blur-sm p-3 rounded-lg border border-green-700/30">
                  <div class="flex items-center">
                    <div class="p-1.5 bg-green-500/20 rounded-lg mr-3">
                      <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div>
                      <span class="text-green-200 font-medium text-sm">{{ item.name }}</span>
                      <div class="text-xs text-green-400">{{ item.detail }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="border-t border-gray-700/50 p-6 bg-gray-900/50">
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center">
              <svg class="w-6 h-6 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
              <span class="text-lg font-semibold text-gray-300">Total:</span>
            </div>
            <span class="text-2xl font-bold text-white">{{ formatCurrency(selectedComanda?.totalPrice || 0) }}</span>
          </div>
          
          <div class="text-center">
            <button @click="closeProductModal" class="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg transition-all transform hover:scale-105">
              <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Fechar Comanda
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Finalização -->
    <div v-if="showFinishModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-900 rounded-xl p-6 w-full max-w-lg">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-white">Finalizar Comanda - {{ selectedComanda?.client?.name }}</h2>
          <button @click="closeFinishModal" class="text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <div class="bg-gray-800 p-4 rounded-lg">
            <p class="text-sm text-gray-400">Valor Original:</p>
            <p class="text-lg font-bold text-white">{{ formatCurrency(selectedComanda?.totalPrice || 0) }}</p>
            <p v-if="selectedComanda?.partialPayment" class="text-sm text-green-400">
              Entrada paga: {{ formatCurrency(selectedComanda.partialPayment) }}
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Forma de Pagamento</label>
            <select v-model="finishForm.paymentMethod" class="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white">
              <option value="DINHEIRO">Dinheiro</option>
              <option value="PIX">PIX</option>
              <option value="CARTAO_DEBITO">Cartão Débito (Taxa 2,79%)</option>
              <option value="CARTAO_CREDITO_1X">Cartão Crédito 1x (Taxa 5,99%)</option>
              <option value="CARTAO_CREDITO_2X">Cartão Crédito 2x (Taxa 11,39%)</option>
              <option value="CARTAO_CREDITO_3X">Cartão Crédito 3x (Taxa 12,49%)</option>
              <option value="CARTAO_CREDITO_ACIMA_3X">Cartão Crédito +3x (Taxa repassada)</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Desconto (R$)</label>
            <input 
              v-model.number="finishForm.discount" 
              type="number" 
              min="0"
              step="0.01"
              class="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
              placeholder="0,00"
            >
          </div>
          
          <div v-if="calculatedFinish" class="bg-gray-800 p-4 rounded-lg">
            <p class="text-sm text-gray-400">Valor Final:</p>
            <p class="text-lg font-bold text-green-400">{{ formatCurrency(calculatedFinish.finalAmount) }}</p>
            <p v-if="calculatedFinish.taxAmount > 0" class="text-xs text-red-400">
              Taxa do cartão: -{{ formatCurrency(calculatedFinish.taxAmount) }}
            </p>
            <p v-if="finishForm.discount > 0" class="text-xs text-yellow-400">
              Desconto: -{{ formatCurrency(finishForm.discount) }}
            </p>
          </div>
        </div>
        
        <div class="flex space-x-3 mt-6">
          <button 
            @click="finishComanda" 
            :disabled="!finishForm.paymentMethod"
            class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Finalizar Comanda
          </button>
          <button @click="closeFinishModal" class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
            Cancelar
          </button>
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
  CheckCircleIcon,
  ClipboardDocumentCheckIcon
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

const appointments = ref([])
const clients = ref([])
const products = ref([])
const recentAppointments = ref([])
const lowStockProducts = ref([])
const activeComandas = ref([])

// Modal states
const showProductModal = ref(false)
const showFinishModal = ref(false)
const selectedComanda = ref(null)
const productForm = reactive({
  productId: '',
  quantity: 1
})
const procedureForm = reactive({
  procedureId: '',
  price: 0
})
const finishForm = reactive({
  paymentMethod: '',
  discount: 0
})
const addedItems = ref([])
const procedures = ref([])
const showProcedureForm = ref(false)

// Variáveis para o modal simplificado
const quickItems = ref([])
const existingItems = ref([])
const productSearch = ref('')
const procedureSearch = ref('')
const weekActivity = ref([
  { label: 'Seg', percentage: 0, value: 0, count: 0 },
  { label: 'Ter', percentage: 0, value: 0, count: 0 },
  { label: 'Qua', percentage: 0, value: 0, count: 0 },
  { label: 'Qui', percentage: 0, value: 0, count: 0 },
  { label: 'Sex', percentage: 0, value: 0, count: 0 },
  { label: 'Sáb', percentage: 0, value: 0, count: 0 },
  { label: 'Dom', percentage: 0, value: 0, count: 0 }
])

const loadingStats = ref(true)
const loadingAppointments = ref(true)
const loadingProducts = ref(true)
const loadingComandas = ref(true)

// Computed
const selectedProduct = computed(() => {
  return products.value.find(p => p.id === productForm.productId)
})

const availableProcedures = computed(() => {
  // Procedimentos que não estão já no agendamento
  const existingProcedureIds = selectedComanda.value?.procedures?.map(ap => ap.procedureId) || []
  return procedures.value.filter(p => !existingProcedureIds.includes(p.id))
})

const filteredProducts = computed(() => {
  if (!productSearch.value) return products.value
  return products.value.filter(product => 
    product.name.toLowerCase().includes(productSearch.value.toLowerCase()) ||
    product.category?.toLowerCase().includes(productSearch.value.toLowerCase())
  )
})

const filteredProcedures = computed(() => {
  if (!procedureSearch.value) return availableProcedures.value
  return availableProcedures.value.filter(procedure => 
    procedure.name.toLowerCase().includes(procedureSearch.value.toLowerCase()) ||
    procedure.category?.toLowerCase().includes(procedureSearch.value.toLowerCase())
  )
})

const calculatedFinish = computed(() => {
  if (!selectedComanda.value || !finishForm.paymentMethod) return null
  
  let finalPrice = Number(selectedComanda.value.totalPrice) - (finishForm.discount || 0)
  let cardTax = 0
  
  switch (finishForm.paymentMethod) {
    case 'CARTAO_DEBITO':
      cardTax = 0.0279
      break
    case 'CARTAO_CREDITO_1X':
      cardTax = 0.0599
      break
    case 'CARTAO_CREDITO_2X':
      cardTax = 0.1139
      break
    case 'CARTAO_CREDITO_3X':
      cardTax = 0.1249
      break
    default:
      cardTax = 0
  }
  
  const taxAmount = finalPrice * cardTax
  const finalAmount = finalPrice - taxAmount
  
  return {
    finalPrice,
    taxAmount,
    finalAmount
  }
})

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

const getStatusLabel = (status) => {
  switch(status) {
    case 'AGENDADO': return 'Agendado'
    case 'CONFIRMADO': return 'Confirmado'
    case 'CONCLUIDO': return 'Concluído'
    default: return status
  }
}

const confirmAppointment = async (comandaId) => {
  try {
    const { $api } = useNuxtApp()
    const token = useCookie('covenos-token')
    
    await $api(`/appointments/${comandaId}/confirm`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
    
    console.log('Agendamento confirmado com sucesso!')
    loadDashboardData()
  } catch (error) {
    console.error('Erro ao confirmar agendamento:', error)
    console.error('Erro ao confirmar agendamento')
  }
}

const openComandaModal = async (comanda) => {
  console.log('Abrindo modal para comanda:', comanda)
  selectedComanda.value = comanda
  showProductModal.value = true
  resetAllForms()
  await Promise.all([loadProcedures(), loadProducts(), loadComandaDetails(comanda.id)])
}

const editComandaModal = async (comanda) => {
  console.log('Editando comanda:', comanda)
  selectedComanda.value = comanda
  showProductModal.value = true
  resetAllForms()
  await Promise.all([loadProcedures(), loadProducts(), loadComandaDetails(comanda.id)])
}

const finishComandaModal = (comanda) => {
  console.log('Finalizando comanda:', comanda)
  selectedComanda.value = comanda
  showFinishModal.value = true
  resetFinishForm()
}

const closeProductModal = () => {
  showProductModal.value = false
  selectedComanda.value = null
  resetAllForms()
}

const closeFinishModal = () => {
  showFinishModal.value = false
  selectedComanda.value = null
  resetFinishForm()
}

const resetProductForm = () => {
  productForm.productId = ''
  productForm.quantity = 1
}

const resetProcedureForm = () => {
  procedureForm.procedureId = ''
  procedureForm.price = 0
}

const resetFinishForm = () => {
  finishForm.paymentMethod = ''
  finishForm.discount = 0
}

const resetAllForms = () => {
  resetProductForm()
  resetProcedureForm()
  addedItems.value = []
  showProcedureForm.value = false
  quickItems.value = []
  existingItems.value = []
  productSearch.value = ''
  procedureSearch.value = ''
}

const getMaxQuantity = (product) => {
  if (!product) return 0
  
  // Para produtos de uso interno com medida (ex: 1 unidade de 1000ml)
  if (product.type === 'USO_INTERNO' && product.unitQuantity) {
    return Number(product.stock) * Number(product.unitQuantity)
  }
  
  // Para outros tipos, usar o stock direto
  return Number(product.stock) || 0
}

const getDisplayStock = (product) => {
  if (!product) return '0'
  
  // Para produtos de uso interno com medida, mostrar em ml/g etc
  if (product.type === 'USO_INTERNO' && product.unitQuantity) {
    const totalAmount = Number(product.stock) * Number(product.unitQuantity)
    return `${totalAmount}${product.unitMeasurement || 'ml'} (${product.stock} ${product.unit || 'un'})`
  }
  
  // Para outros tipos, mostrar stock normal
  return `${product.stock} ${product.unit || 'un'}`
}

const getProductUnit = (product) => {
  if (!product) return 'un'
  
  // Para produtos de uso interno com medida, usar a unidade de medida
  if (product.type === 'USO_INTERNO' && product.unitQuantity) {
    return product.unitMeasurement || 'ml'
  }
  
  // Para outros tipos, usar a unidade padrão
  return product.unit || 'un'
}

const getQuantityStep = (product) => {
  if (!product) return 1
  
  // Para produtos de uso interno com medida, permitir decimais (ex: 50.5ml)
  if (product.type === 'USO_INTERNO' && product.unitQuantity) {
    return 0.1
  }
  
  // Para outros tipos, usar inteiros
  return 1
}

const loadProcedures = async () => {
  try {
    const { $api } = useNuxtApp()
    const token = useCookie('covenos-token')
    
    const response = await $api('/procedures', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
    
    procedures.value = response || []
  } catch (error) {
    console.error('Erro ao carregar procedimentos:', error)
    procedures.value = []
  }
}

const loadProducts = async () => {
  try {
    const { $api } = useNuxtApp()
    const token = useCookie('covenos-token')
    
    const response = await $api('/products', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
    
    products.value = response || []
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
    products.value = []
  }
}

const loadComandaDetails = async (appointmentId) => {
  try {
    const { $api } = useNuxtApp()
    const token = useCookie('covenos-token')
    
    // Buscar detalhes completos da comanda
    const appointmentDetails = await $api(`/appointments/${appointmentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
    
    // Atualizar selectedComanda com dados completos
    selectedComanda.value = appointmentDetails
    
    // Montar lista de itens existentes
    existingItems.value = []
    
    // Adicionar produtos utilizados
    if (appointmentDetails.productUsages) {
      appointmentDetails.productUsages.forEach(usage => {
        existingItems.value.push({
          id: usage.id,
          name: usage.product.name,
          detail: `${usage.quantityUsed} ${usage.product.unitMeasurement || usage.product.unit || 'un'}`,
          type: 'product'
        })
      })
    }
    
    // Adicionar procedimentos
    if (appointmentDetails.procedures) {
      appointmentDetails.procedures.forEach(ap => {
        existingItems.value.push({
          id: ap.id,
          name: ap.procedure.name,
          detail: formatCurrency(ap.price),
          type: 'procedure'
        })
      })
    }
    
  } catch (error) {
    console.error('Erro ao carregar detalhes da comanda:', error)
  }
}

const addQuickProduct = () => {
  const product = products.value.find(p => p.id === productForm.productId)
  if (!product) {
    console.error('Produto não encontrado')
    return
  }
  
  if (!productForm.quantity || productForm.quantity <= 0) {
    console.error('Quantidade deve ser maior que zero')
    return
  }
  
  const maxQuantity = getMaxQuantity(product)
  if (productForm.quantity > maxQuantity) {
    console.error(`Quantidade máxima disponível: ${maxQuantity} ${product.unitMeasurement || product.unit || 'un'}`)
    return
  }
  
  quickItems.value.push({
    type: 'product',
    id: product.id,
    name: product.name,
    quantity: Number(productForm.quantity),
    unit: getProductUnit(product),
    price: Number(product.price) || 0
  })
  
  resetProductForm()
  console.log('Produto adicionado!')
}

const addQuickProcedure = () => {
  const procedure = procedures.value.find(p => p.id === procedureForm.procedureId)
  if (!procedure) {
    console.error('Procedimento não encontrado')
    return
  }
  
  if (!procedureForm.price || procedureForm.price <= 0) {
    console.error('Preço deve ser maior que zero')
    return
  }
  
  quickItems.value.push({
    type: 'procedure',
    id: procedure.id,
    name: procedure.name,
    price: Number(procedureForm.price)
  })
  
  resetProcedureForm()
  console.log('Procedimento adicionado!')
}

const removeQuickItem = (index) => {
  quickItems.value.splice(index, 1)
  console.log('Item removido!')
}

const saveQuickItems = async () => {
  if (!selectedComanda.value) {
    console.error('Nenhuma comanda selecionada')
    return
  }
  
  if (quickItems.value.length === 0) {
    console.error('Nenhum item para salvar')
    return
  }
  
  try {
    const { $api } = useNuxtApp()
    const token = useCookie('covenos-token')
    let savedCount = 0
    let errors = []
    
    // Salvar produtos
    const productItems = quickItems.value.filter(i => i.type === 'product')
    for (const item of productItems) {
      try {
        await $api(`/appointments/${selectedComanda.value.id}/products`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.value}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            productId: item.id,
            quantity: Number(item.quantity)
          })
        })
        savedCount++
      } catch (error) {
        console.error(`Erro ao salvar produto ${item.name}:`, error)
        const errorMsg = error.response?.data?.message || error.message || 'Erro desconhecido'
        errors.push(`${item.name}: ${errorMsg}`)
      }
    }
    
    // Salvar procedimentos
    const procedureItems = quickItems.value.filter(i => i.type === 'procedure')
    for (const item of procedureItems) {
      try {
        await $api(`/appointments/${selectedComanda.value.id}/procedures`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.value}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            procedureId: item.id,
            price: Number(item.price)
          })
        })
        savedCount++
      } catch (error) {
        console.error(`Erro ao salvar procedimento ${item.name}:`, error)
        const errorMsg = error.response?.data?.message || error.message || 'Erro desconhecido'
        errors.push(`${item.name}: ${errorMsg}`)
      }
    }
    
    if (savedCount > 0) {
      console.log(`${savedCount} itens salvos!`)
      quickItems.value = []
      await loadComandaDetails(selectedComanda.value.id)
      loadDashboardData()
    }
    
    if (errors.length > 0) {
      console.error('Erros ao salvar itens:', errors)
    }
    
  } catch (error) {
    console.error('Erro geral ao salvar itens:', error)
  }
}

const onProcedureSelect = () => {
  const selectedProcedure = procedures.value.find(p => p.id === procedureForm.procedureId)
  if (selectedProcedure) {
    procedureForm.price = Number(selectedProcedure.price || 0)
  }
}

const addProductToList = () => {
  const product = products.value.find(p => p.id === productForm.productId)
  if (!product) {
    console.error('Produto não encontrado')
    return
  }
  
  if (!productForm.quantity || productForm.quantity <= 0) {
    console.error('Quantidade deve ser maior que zero')
    return
  }
  
  const maxQuantity = getMaxQuantity(product)
  if (productForm.quantity > maxQuantity) {
    console.error(`Quantidade máxima disponível: ${maxQuantity} ${product.unitMeasurement || product.unit || 'un'}`)
    return
  }
  
  // Verificar se o produto já foi adicionado
  const existingIndex = addedItems.value.findIndex(item => 
    item.type === 'product' && item.id === product.id
  )
  
  if (existingIndex >= 0) {
    // Atualizar quantidade do item existente
    const newQuantity = addedItems.value[existingIndex].quantity + productForm.quantity
    if (newQuantity > maxQuantity) {
      console.error(`Quantidade total excederia o máximo: ${maxQuantity} ${product.unitMeasurement || product.unit || 'un'}`)
      return
    }
    addedItems.value[existingIndex].quantity = newQuantity
    console.log('Quantidade do produto atualizada!')
  } else {
    // Adicionar novo item
    addedItems.value.push({
      type: 'product',
      id: product.id,
      name: product.name,
      quantity: Number(productForm.quantity),
      unit: product.unitMeasurement || product.unit || 'un',
      price: Number(product.price) || 0
    })
    console.log('Produto adicionado à lista!')
  }
  
  resetProductForm()
}

const addProcedureToList = () => {
  const procedure = procedures.value.find(p => p.id === procedureForm.procedureId)
  if (!procedure) {
    console.error('Procedimento não encontrado')
    return
  }
  
  if (!procedureForm.price || procedureForm.price <= 0) {
    console.error('Preço deve ser maior que zero')
    return
  }
  
  // Verificar se o procedimento já foi adicionado
  const existingIndex = addedItems.value.findIndex(item => 
    item.type === 'procedure' && item.id === procedure.id
  )
  
  if (existingIndex >= 0) {
    // Atualizar preço do procedimento existente
    addedItems.value[existingIndex].price = Number(procedureForm.price)
    console.log('Preço do procedimento atualizado!')
  } else {
    // Adicionar novo procedimento
    addedItems.value.push({
      type: 'procedure',
      id: procedure.id,
      name: procedure.name,
      price: Number(procedureForm.price)
    })
    console.log('Procedimento adicionado à lista!')
  }
  
  resetProcedureForm()
}

const removeItem = (index) => {
  addedItems.value.splice(index, 1)
  console.log('Item removido da lista!')
}

const saveAllItemsToComanda = async () => {
  if (!selectedComanda.value) {
    console.error('Nenhuma comanda selecionada')
    return
  }
  
  if (addedItems.value.length === 0) {
    console.error('Nenhum item para salvar')
    return
  }
  
  console.log('Status da comanda selecionada:', selectedComanda.value.status)
  
  // Para procedimentos, o agendamento precisa estar CONFIRMADO
  const procedureItems = addedItems.value.filter(i => i.type === 'procedure')
  if (procedureItems.length > 0 && selectedComanda.value.status !== 'CONFIRMADO') {
    console.error('Para adicionar procedimentos adicionais, o agendamento precisa estar confirmado. Status atual:', selectedComanda.value.status)
    return
  }
  
  // Para produtos, o agendamento pode estar AGENDADO ou CONFIRMADO
  const productItems = addedItems.value.filter(i => i.type === 'product')
  if (productItems.length > 0 && !['AGENDADO', 'CONFIRMADO'].includes(selectedComanda.value.status)) {
    console.error('Para adicionar produtos, o agendamento precisa estar ativo. Status atual:', selectedComanda.value.status)
    return
  }
  
  try {
    const { $api } = useNuxtApp()
    const token = useCookie('covenos-token')
    let savedCount = 0
    let errors = []
    
    // Salvar produtos
    const productItems = addedItems.value.filter(i => i.type === 'product')
    for (const item of productItems) {
      try {
        console.log('Salvando produto:', { 
          appointmentId: selectedComanda.value.id,
          productId: item.id, 
          quantity: Number(item.quantity) 
        })
        
        const response = await $api(`/appointments/${selectedComanda.value.id}/products`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.value}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            productId: item.id,
            quantity: Number(item.quantity)
          })
        })
        
        console.log('Produto salvo com sucesso:', response)
        savedCount++
      } catch (error) {
        console.error(`Erro ao salvar produto ${item.name}:`, error)
        const errorMsg = error.response?.data?.message || error.message || 'Erro desconhecido'
        errors.push(`${item.name}: ${errorMsg}`)
      }
    }
    
    // Salvar procedimentos adicionais
    const procedureItems = addedItems.value.filter(i => i.type === 'procedure')
    for (const item of procedureItems) {
      try {
        console.log('Salvando procedimento:', { 
          appointmentId: selectedComanda.value.id,
          procedureId: item.id, 
          price: Number(item.price) 
        })
        
        const response = await $api(`/appointments/${selectedComanda.value.id}/procedures`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.value}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            procedureId: item.id,
            price: Number(item.price)
          })
        })
        
        console.log('Procedimento salvo com sucesso:', response)
        savedCount++
      } catch (error) {
        console.error(`Erro ao salvar procedimento ${item.name}:`, error)
        const errorMsg = error.response?.data?.message || error.message || 'Erro desconhecido'
        errors.push(`${item.name}: ${errorMsg}`)
      }
    }
    
    // Exibir resultados
    const totalItems = addedItems.value.length
    
    if (savedCount > 0) {
      console.log(`${savedCount} de ${totalItems} itens salvos na comanda!`)
      loadDashboardData()
    }
    
    if (errors.length > 0) {
      console.error('Erros ao salvar itens:', errors)
      console.error(`${errors.length} itens com erro:`, errors)
    }
    
    // Limpar apenas os itens que foram salvos com sucesso
    if (savedCount === totalItems) {
      addedItems.value = []
      closeProductModal()
    } else if (savedCount > 0) {
      // Remover apenas os itens salvos com sucesso da lista
      const successfulIds = []
      // Implementação simplificada: limpar tudo se houve algum sucesso
      // O usuário pode tentar salvar novamente os que falharam
      addedItems.value = []
    }
    
  } catch (error) {
    console.error('Erro geral ao salvar itens na comanda:', error)
    console.error('Erro geral ao salvar itens na comanda')
  }
}


const finishComanda = async () => {
  if (!selectedComanda.value) {
    console.error('Nenhuma comanda selecionada')
    return
  }
  
  if (!finishForm.paymentMethod) {
    console.error('Selecione uma forma de pagamento')
    return
  }
  
  if (!calculatedFinish.value) {
    console.error('Erro ao calcular valor final')
    return
  }
  
  try {
    const { $api } = useNuxtApp()
    const token = useCookie('covenos-token')
    
    // Validar se a comanda pode ser finalizada
    if (selectedComanda.value.status !== 'CONFIRMADO') {
      console.error('A comanda precisa estar confirmada para ser finalizada. Status atual:', selectedComanda.value.status)
      return
    }
    
    // Verificar se o total da comanda e maior que 0
    const totalPrice = Number(selectedComanda.value.totalPrice) || 0
    if (totalPrice <= 0) {
      console.error('A comanda precisa ter um valor total maior que zero para ser finalizada. Total atual:', totalPrice)
      return
    }
    
    const finishData = {
      paymentMethod: finishForm.paymentMethod,
      discount: Number(finishForm.discount) || 0,
      finalPrice: Number(selectedComanda.value.totalPrice)
    }
    
    console.log('Dados para finalizar comanda:', {
      appointmentId: selectedComanda.value.id,
      appointmentStatus: selectedComanda.value.status,
      ...finishData
    })
    
    const response = await $api(`/appointments/${selectedComanda.value.id}/finish`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(finishData)
    })
    
    console.log('Resposta da API:', response)
    console.log('Comanda finalizada com sucesso!')
    closeFinishModal()
    loadDashboardData()
    
  } catch (error) {
    console.error('Erro ao finalizar comanda:', error)
    
    let errorMessage = 'Erro ao finalizar comanda'
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    }
    
    // Exibir erros detalhados se houver
    if (error.response?.data?.errors) {
      console.error('Erros de validação:', error.response.data.errors)
      errorMessage += ': ' + Object.values(error.response.data.errors).flat().join(', ')
    }
    
    console.error('Erro ao finalizar comanda:', errorMessage)
  }
}

// Função loadComandas removida - agora usamos apenas loadDashboardData

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
      }).catch(() => []),
      $api('/clients', {
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      }).catch(() => []),
      $api('/products', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      }).catch(() => [])
    ])
    
    appointments.value = appointmentsResponse || []
    clients.value = clientsResponse || []
    products.value = productsResponse || []
    
    // Calcular estatísticas
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    
    // Agendamentos de hoje
    const todayAppointments = appointments.value.filter(apt => {
      const appointmentDate = new Date(apt.date).toISOString().split('T')[0]
      return appointmentDate === todayStr
    })
    
    // Agendamentos de ontem para comparação
    const yesterdayAppointments = appointments.value.filter(apt => {
      const appointmentDate = new Date(apt.date).toISOString().split('T')[0]
      return appointmentDate === yesterdayStr
    })
    
    // Calcular tendência de agendamentos
    const appointmentsTrend = yesterdayAppointments.length > 0 
      ? Math.round(((todayAppointments.length - yesterdayAppointments.length) / yesterdayAppointments.length) * 100)
      : 0
    
    // Receita mensal
    const thisMonth = today.getMonth()
    const thisYear = today.getFullYear()
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear
    
    const monthlyRevenue = appointments.value.filter(apt => {
      const aptDate = new Date(apt.date)
      return aptDate.getMonth() === thisMonth && 
             aptDate.getFullYear() === thisYear &&
             apt.status === 'CONCLUIDO'
    }).reduce((sum, apt) => sum + (parseFloat(apt.totalPrice) || 0), 0)
    
    const lastMonthRevenue = appointments.value.filter(apt => {
      const aptDate = new Date(apt.date)
      return aptDate.getMonth() === lastMonth && 
             aptDate.getFullYear() === lastMonthYear &&
             apt.status === 'CONCLUIDO'
    }).reduce((sum, apt) => sum + (parseFloat(apt.totalPrice) || 0), 0)
    
    // Calcular tendência de receita
    const revenueTrend = lastMonthRevenue > 0
      ? Math.round(((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : 0
    
    // Clientes
    const activeClients = clients.value.filter(client => client.active !== false).length
    const newClients = clients.value.filter(client => {
      const createdAt = new Date(client.createdAt)
      return createdAt.getMonth() === thisMonth && createdAt.getFullYear() === thisYear
    }).length
    
    // Produtos com estoque baixo
    const lowStock = products.value.filter(product => 
      product.stock <= (product.minStock || 5) && product.active
    )
    
    // Atualizar stats
    stats.todayAppointments = todayAppointments.length
    stats.appointmentsTrend = appointmentsTrend
    stats.monthlyRevenue = monthlyRevenue
    stats.revenueTrend = revenueTrend
    stats.activeClients = activeClients
    stats.newClients = newClients
    stats.lowStockProducts = lowStock.length
    
    // Próximos agendamentos (próximos 7 dias)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    
    recentAppointments.value = appointments.value
      .filter(apt => {
        const aptDate = new Date(apt.date)
        return aptDate >= today && aptDate <= nextWeek && apt.status === 'AGENDADO'
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 8)
    
    // Produtos com estoque baixo
    lowStockProducts.value = lowStock.slice(0, 6)
    
    // Comandas do dia - filtrar por data usando comparação mais robusta
    activeComandas.value = appointments.value.filter(appointment => {
      const appointmentDate = new Date(appointment.date).toISOString().split('T')[0]
      return !['CANCELADO'].includes(appointment.status) && appointmentDate === todayStr
    }).slice(0, 6)
    
    // Calcular atividade semanal
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const weekData = Array(7).fill(0)
    const weekRevenue = Array(7).fill(0)
    
    // Calcular os últimos 7 dias
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay()) // Domingo da semana atual
    
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startOfWeek)
      dayDate.setDate(startOfWeek.getDate() + i)
      const dayStr = dayDate.toISOString().split('T')[0]
      
      const dayAppointments = appointments.value.filter(apt => {
        const appointmentDate = new Date(apt.date).toISOString().split('T')[0]
        return appointmentDate === dayStr && apt.status === 'CONCLUIDO'
      })
      
      weekData[i] = dayAppointments.length
      weekRevenue[i] = dayAppointments.reduce((sum, apt) => 
        sum + (parseFloat(apt.totalPrice) || 0), 0
      )
    }
    
    const maxValue = Math.max(...weekRevenue, 1)
    weekActivity.value = weekData.map((count, index) => ({
      label: weekDays[index],
      value: weekRevenue[index],
      count: count,
      percentage: Math.round((weekRevenue[index] / maxValue) * 100)
    }))
    
    // Atualizar loading states
    loadingStats.value = false
    loadingAppointments.value = false
    loadingProducts.value = false
    loadingComandas.value = false
    
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error)
    loadingStats.value = false
    loadingAppointments.value = false 
    loadingProducts.value = false
    loadingComandas.value = false
  }
}

// Lifecycle
onMounted(async () => {
  // Carregar dados principais
  await loadDashboardData()
  
  // Pré-carregar produtos e procedimentos para os modais
  await Promise.all([loadProducts(), loadProcedures()])
  
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