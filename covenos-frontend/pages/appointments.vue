<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Agendamentos</h1>
        <p class="text-sm text-gray-400 mt-1">Gerencie os agendamentos do salão</p>
      </div>
      <button @click="showCreateModal = true" class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg shadow-purple-500/25">
        <PlusIcon class="w-5 h-5 mr-2" />
        Novo Agendamento
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400">Hoje</p>
            <p class="text-2xl font-bold text-white mt-2">{{ todayAppointments }}</p>
            <p class="text-xs text-gray-500 mt-1">agendamentos</p>
          </div>
          <div class="p-3 bg-blue-500/10 rounded-xl">
            <CalendarIcon class="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </div>

      <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400">Confirmados</p>
            <p class="text-2xl font-bold text-white mt-2">{{ confirmedAppointments }}</p>
            <p class="text-xs text-gray-500 mt-1">em andamento</p>
          </div>
          <div class="p-3 bg-green-500/10 rounded-xl">
            <CheckCircleIcon class="w-6 h-6 text-green-400" />
          </div>
        </div>
      </div>

      <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400">Pendentes</p>
            <p class="text-2xl font-bold text-white mt-2">{{ pendingAppointments }}</p>
            <p class="text-xs text-gray-500 mt-1">aguardando</p>
          </div>
          <div class="p-3 bg-yellow-500/10 rounded-xl">
            <ClockIcon class="w-6 h-6 text-yellow-400" />
          </div>
        </div>
      </div>

      <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400">Receita Hoje</p>
            <p class="text-2xl font-bold text-white mt-2">{{ formatCurrency(todayRevenue) }}</p>
            <p class="text-xs text-gray-500 mt-1">faturamento</p>
          </div>
          <div class="p-3 bg-purple-500/10 rounded-xl">
            <CurrencyDollarIcon class="w-6 h-6 text-purple-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">Filtros</h3>
        <button @click="clearFilters" class="text-sm text-purple-400 hover:text-purple-300 transition-colors">
          Limpar filtros
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Data</label>
          <input
            v-model="dateFilter"
            type="date"
            class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Status</label>
          <select v-model="statusFilter" class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors">
            <option value="">Todos</option>
            <option value="AGENDADO">Agendado</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="CONCLUIDO">Concluído</option>
            <option value="CANCELADO">Cancelado</option>
            <option value="NAO_COMPARECEU">Não Compareceu</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Cliente</label>
          <input
            v-model="clientFilter"
            type="text"
            placeholder="Buscar cliente..."
            class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Profissional</label>
          <select v-model="hairdresserFilter" class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors">
            <option value="">Todos</option>
            <option v-for="user in hairdressers" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- View Toggle -->
    <div class="flex justify-between items-center">
      <div class="flex bg-gray-900/50 backdrop-blur border border-gray-800 rounded-lg p-1">
        <button
          @click="viewMode = 'list'"
          :class="[
            'px-4 py-2 rounded-md font-medium transition-all duration-200',
            viewMode === 'list' 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25' 
              : 'text-gray-400 hover:text-white'
          ]"
        >
          <ListBulletIcon  class="w-5 h-5 inline-block mr-2" />
          Lista
        </button>
        <button
          @click="viewMode = 'calendar'"
          :class="[
            'px-4 py-2 rounded-md font-medium transition-all duration-200',
            viewMode === 'calendar' 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25' 
              : 'text-gray-400 hover:text-white'
          ]"
        >
          <CalendarDaysIcon class="w-5 h-5 inline-block mr-2" />
          Calendário
        </button>
      </div>
      
      <div v-if="viewMode === 'calendar'" class="flex items-center space-x-3">
        <button @click="previousWeek" class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200">
          <ChevronLeftIcon class="w-5 h-5" />
        </button>
        <span class="text-white font-medium px-4">
          {{ formatWeekRange(currentWeekStart) }}
        </span>
        <button @click="nextWeek" class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200">
          <ChevronRightIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- List View -->
    <div v-if="viewMode === 'list'" class="space-y-4">
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 5" :key="i" class="animate-pulse">
          <div class="bg-gray-800/50 h-24 rounded-xl"></div>
        </div>
      </div>
      
      <div v-else-if="filteredAppointments.length === 0" class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-16 text-center">
        <CalendarIcon class="w-16 h-16 mx-auto text-gray-600 mb-4" />
        <h3 class="text-lg font-semibold text-white mb-2">Nenhum agendamento encontrado</h3>
        <p class="text-gray-400">Crie um novo agendamento para começar</p>
      </div>
      
      <div v-else class="space-y-3">
        <div
          v-for="appointment in filteredAppointments"
          :key="appointment.id"
          class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all duration-300 cursor-pointer group"
          @click="editAppointment(appointment)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="relative">
                <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
                  {{ appointment.client?.name?.charAt(0) || 'C' }}
                </div>
                <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900" :class="getStatusColor(appointment.status)"></div>
              </div>
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-1">
                  <h3 class="text-lg font-semibold text-white">{{ appointment.client?.name }}</h3>
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getStatusBadgeClass(appointment.status)
                  ]">
                    {{ getStatusText(appointment.status) }}
                  </span>
                </div>
                <div class="flex items-center space-x-4 text-sm text-gray-400">
                  <span class="flex items-center">
                    <ClockIcon class="w-4 h-4 mr-1" />
                    {{ formatDateTime(appointment.startTime) }} - {{ formatTime(appointment.endTime) }}
                  </span>
                  <span v-if="appointment.user" class="flex items-center">
                    <UserIcon class="w-4 h-4 mr-1" />
                    {{ appointment.user.name }}
                  </span>
                  <span v-if="appointment.procedures?.length" class="flex items-center">
                    <SparklesIcon class="w-4 h-4 mr-1" />
                    {{ appointment.procedures.length }} procedimento{{ appointment.procedures.length > 1 ? 's' : '' }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <p class="text-xl font-bold text-white">{{ formatCurrency(appointment.totalPrice || 0) }}</p>
                <p v-if="appointment.paymentMethod" class="text-xs text-gray-400 mt-1">{{ appointment.paymentMethod }}</p>
              </div>
              <div class="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <button
                  @click.stop="editAppointment(appointment)"
                  class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
                >
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button
                  @click.stop="confirmDelete(appointment)"
                  class="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all duration-200"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar View -->
    <div v-if="viewMode === 'calendar'" class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6">
      <div class="grid grid-cols-7 gap-2">
        <!-- Header -->
        <div v-for="day in weekDays" :key="day" class="text-center py-3 text-sm font-semibold text-gray-400">
          {{ day }}
        </div>
        
        <!-- Days -->
        <div
          v-for="day in calendarDays"
          :key="day.date"
          class="min-h-[140px] p-3 border border-gray-700 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
          :class="{ 'bg-purple-900/10 border-purple-800': day.isToday }"
        >
          <div class="text-sm font-medium mb-2" :class="day.isToday ? 'text-purple-400' : 'text-gray-300'">
            {{ day.day }}
          </div>
          <div class="space-y-1 max-h-[100px] overflow-y-auto">
            <div
              v-for="appointment in day.appointments"
              :key="appointment.id"
              @click="editAppointment(appointment)"
              class="text-xs p-2 rounded cursor-pointer transition-all hover:scale-105"
              :class="getCalendarAppointmentClass(appointment.status)"
            >
              <div class="font-medium text-white truncate">
                {{ appointment.client?.name }}
              </div>
              <div class="text-gray-300">
                {{ formatTime(appointment.startTime) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showCreateModal || editingAppointment" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div class="bg-gray-900 border border-gray-800 rounded-xl shadow-xl w-full max-w-2xl my-8">
              <!-- Modal Header -->
              <div class="flex items-center justify-between p-6 border-b border-gray-800">
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
                    <CalendarIcon class="w-5 h-5 text-white" />
                  </div>
                  <h3 class="text-xl font-semibold text-white">
                    {{ editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento' }}
                  </h3>
                </div>
                <button @click="closeModal" class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>
              
              <!-- Modal Body -->
              <form @submit.prevent="saveAppointment" class="p-6 space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Cliente *</label>
                    <select v-model="appointmentForm.clientId" required class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors">
                      <option value="">Selecione um cliente</option>
                      <option v-for="client in clients" :key="client.id" :value="client.id">
                        {{ client.name }}
                      </option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Profissional</label>
                    <select v-model="appointmentForm.userId" class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors">
                      <option value="">Selecione um profissional</option>
                      <option v-for="user in hairdressers" :key="user.id" :value="user.id">
                        {{ user.name }}
                      </option>
                    </select>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Data *</label>
                    <input
                      v-model="appointmentForm.date"
                      type="date"
                      required
                      class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Hora Início *</label>
                    <input
                      v-model="appointmentForm.startTime"
                      type="time"
                      required
                      class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Hora Fim *</label>
                    <input
                      v-model="appointmentForm.endTime"
                      type="time"
                      required
                      class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Procedimentos</label>
                  <div class="max-h-32 overflow-y-auto border border-gray-700 rounded-lg p-3 bg-gray-800/30">
                    <div class="space-y-2">
                      <label
                        v-for="procedure in procedures"
                        :key="procedure.id"
                        class="flex items-center space-x-3 cursor-pointer hover:bg-gray-700/50 p-2 rounded transition-colors"
                      >
                        <input
                          type="checkbox"
                          :value="procedure.id"
                          v-model="appointmentForm.procedureIds"
                          class="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                        />
                        <div class="flex-1 flex items-center justify-between">
                          <span class="text-white">{{ procedure.name }}</span>
                          <span class="text-sm text-purple-400">{{ formatCurrency(procedure.price) }}</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Status</label>
                    <select v-model="appointmentForm.status" class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors">
                      <option value="AGENDADO">Agendado</option>
                      <option value="EM_ANDAMENTO">Em Andamento</option>
                      <option value="CONCLUIDO">Concluído</option>
                      <option value="CANCELADO">Cancelado</option>
                      <option value="NAO_COMPARECEU">Não Compareceu</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Método de Pagamento</label>
                    <select v-model="appointmentForm.paymentMethod" class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors">
                      <option value="">Selecione</option>
                      <option value="DINHEIRO">Dinheiro</option>
                      <option value="CARTAO_DEBITO">Cartão de Débito</option>
                      <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                      <option value="PIX">PIX</option>
                      <option value="PARCELADO">Parcelado</option>
                    </select>
                  </div>
                </div>
                
                <!-- Seção de Preços -->
                <div class="bg-gray-800/30 border border-gray-700 rounded-lg p-4 space-y-3">
                  <h4 class="text-sm font-semibold text-gray-300 mb-3">💰 Valores</h4>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-300 mb-2">Desconto (R$)</label>
                      <input
                        v-model="appointmentForm.discount"
                        type="number"
                        min="0"
                        step="0.01"
                        class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="0,00"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-300 mb-2">Total</label>
                      <div class="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white font-semibold text-lg">
                        {{ formatCurrency(calculatedTotalPrice) }}
                      </div>
                      <p v-if="appointmentForm.procedureIds.length === 0" class="text-xs text-gray-400 mt-1">
                        Selecione procedimentos para calcular o valor
                      </p>
                    </div>
                  </div>
                  
                  <div v-if="appointmentForm.procedureIds.length > 0" class="mt-3 pt-3 border-t border-gray-700">
                    <p class="text-xs text-gray-400 mb-2">Detalhamento:</p>
                    <div class="space-y-1">
                      <div 
                        v-for="procedure in procedures.filter(p => appointmentForm.procedureIds.includes(p.id))" 
                        :key="procedure.id"
                        class="flex justify-between text-sm"
                      >
                        <span class="text-gray-300">{{ procedure.name }}</span>
                        <span class="text-purple-400">{{ formatCurrency(procedure.price) }}</span>
                      </div>
                      <div v-if="appointmentForm.discount > 0" class="flex justify-between text-sm text-red-400">
                        <span>Desconto</span>
                        <span>-{{ formatCurrency(appointmentForm.discount) }}</span>
                      </div>
                      <div class="flex justify-between text-sm font-semibold text-white pt-2 border-t border-gray-700">
                        <span>Total</span>
                        <span>{{ formatCurrency(calculatedTotalPrice) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Observações</label>
                  <textarea
                    v-model="appointmentForm.observations"
                    rows="3"
                    class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    placeholder="Anotações sobre o agendamento..."
                  ></textarea>
                </div>
                
                <!-- Modal Footer -->
                <div class="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button" 
                    @click="closeModal" 
                    class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    class="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="saving"
                  >
                    <span v-if="saving" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Salvando...
                    </span>
                    <span v-else>
                      {{ editingAppointment ? 'Atualizar' : 'Agendar' }}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="appointmentToDelete" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div class="bg-gray-900 border border-gray-800 rounded-xl shadow-xl w-full max-w-md">
              <div class="p-6">
                <div class="flex items-center justify-center w-12 h-12 bg-red-900/20 rounded-full mx-auto mb-4">
                  <ExclamationTriangleIcon class="w-6 h-6 text-red-400" />
                </div>
                <h3 class="text-lg font-semibold text-white text-center mb-2">
                  Confirmar exclusão
                </h3>
                <p class="text-sm text-gray-400 text-center mb-6">
                  Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
                </p>
                <div class="flex space-x-3">
                  <button 
                    @click="appointmentToDelete = null" 
                    class="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    @click="deleteAppointment" 
                    class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="deleting"
                  >
                    <span v-if="deleting" class="flex items-center justify-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Excluindo...
                    </span>
                    <span v-else>Excluir</span>
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Reschedule Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showRescheduleModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div class="bg-gray-900 border border-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
              <div class="text-center mb-6">
                <div class="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full mx-auto w-12 h-12 flex items-center justify-center mb-4">
                  <CalendarIcon class="w-6 h-6 text-white" />
                </div>
                <h3 class="text-xl font-semibold text-white mb-2">
                  Agendamento Concluído!
                </h3>
                <p class="text-sm text-gray-400 mb-4">
                  Deseja reagendar <strong class="text-white">{{ completedClient?.name }}</strong> para uma próxima consulta?
                </p>
                
                <div class="text-left mb-4">
                  <label class="block text-sm font-medium text-gray-300 mb-2">Data sugerida (30 dias)</label>
                  <input 
                    v-model="rescheduleDate" 
                    type="date" 
                    class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
              
              <div class="flex space-x-3">
                <button 
                  @click="closeRescheduleModal" 
                  class="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  Não, obrigado
                </button>
                <button 
                  @click="confirmReschedule" 
                  class="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="rescheduling"
                >
                  <span v-if="rescheduling" class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Reagendando...
                  </span>
                  <span v-else>Sim, reagendar</span>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { 
  CalendarIcon,
  PlusIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  SparklesIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Squares2X2Icon,
  ListBulletIcon 
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useSeoMeta({
  title: 'Agendamentos - Coven Beauty',
  description: 'Gerenciamento de agendamentos do salão'
})

// Estado
const appointments = ref([])
const clients = ref([])
const procedures = ref([])
const hairdressers = ref([])
const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)

const viewMode = ref('list')
const dateFilter = ref('')
const statusFilter = ref('')
const clientFilter = ref('')
const hairdresserFilter = ref('')

const currentWeekStart = ref(new Date())
const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const showCreateModal = ref(false)
const editingAppointment = ref(null)
const appointmentToDelete = ref(null)

// Rescheduling modal state
const showRescheduleModal = ref(false)
const completedClient = ref(null)
const rescheduleDate = ref('')
const rescheduling = ref(false)

const appointmentForm = reactive({
  clientId: '',
  userId: '',
  date: '',
  startTime: '',
  endTime: '',
  procedureIds: [],
  status: 'AGENDADO',
  observations: '',
  paymentMethod: '',
  discount: 0
})

// Computed
const filteredAppointments = computed(() => {
  let filtered = appointments.value

  if (dateFilter.value) {
    filtered = filtered.filter(apt => 
      apt.date?.startsWith(dateFilter.value)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(apt => apt.status === statusFilter.value)
  }
  // Removido filtro automático de cancelados para mostrar todos por padrão


  if (clientFilter.value) {
    const term = clientFilter.value.toLowerCase()
    filtered = filtered.filter(apt =>
      apt.client?.name.toLowerCase().includes(term)
    )
  }

  if (hairdresserFilter.value) {
    filtered = filtered.filter(apt => apt.userId === hairdresserFilter.value)
  }

  return filtered.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
})

const calendarDays = computed(() => {
  const start = new Date(currentWeekStart.value)
  const days = []
  const today = new Date().toDateString()
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    
    const dayAppointments = appointments.value.filter(apt => {
      const aptDateStr = apt.date.split('T')[0] // YYYY-MM-DD
      const dayDateStr = date.toISOString().split('T')[0] // YYYY-MM-DD
      return aptDateStr === dayDateStr
    })
    
    days.push({
      date: date.toISOString().split('T')[0],
      day: date.getDate(),
      isToday: date.toDateString() === today,
      appointments: dayAppointments
    })
  }
  
  return days
})

const todayAppointments = computed(() => {
  const today = new Date()
  const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')
  
  return appointments.value.filter(apt => {
    const aptDate = apt.date.split('T')[0] // Pega apenas a parte da data (YYYY-MM-DD)
    return aptDate === todayStr
  }).length
})

const confirmedAppointments = computed(() => {
  return appointments.value.filter(apt => apt.status === 'EM_ANDAMENTO').length
})

const pendingAppointments = computed(() => {
  return appointments.value.filter(apt => apt.status === 'AGENDADO').length
})

const todayRevenue = computed(() => {
  const today = new Date()
  const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')
  
  return appointments.value
    .filter(apt => {
      const aptDate = apt.date.split('T')[0] // Pega apenas a parte da data (YYYY-MM-DD)
      const isToday = aptDate === todayStr
      const isNotCancelled = apt.status !== 'CANCELADO'
      return isToday && isNotCancelled
    })
    .reduce((sum, apt) => sum + (parseFloat(apt.totalPrice) || 0), 0)
})

const calculatedTotalPrice = computed(() => {
  if (!appointmentForm.procedureIds || appointmentForm.procedureIds.length === 0) {
    return 0
  }
  
  const selectedProcedures = procedures.value.filter(proc => 
    appointmentForm.procedureIds.includes(proc.id)
  )
  
  const subtotal = selectedProcedures.reduce((sum, proc) => {
    return sum + parseFloat(proc.price || 0)
  }, 0)
  
  const discount = parseFloat(appointmentForm.discount || 0)
  return Math.max(0, subtotal - discount)
})

// Métodos
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDateTime = (dateTime) => {
  return new Date(dateTime).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatTime = (dateTime) => {
  return new Date(dateTime).toLocaleString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatWeekRange = (startDate) => {
  const start = new Date(startDate)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  
  const options = { day: '2-digit', month: 'short' }
  return `${start.toLocaleDateString('pt-BR', options)} - ${end.toLocaleDateString('pt-BR', options)}`
}

const getStatusColor = (status) => {
  const colors = {
    AGENDADO: 'bg-blue-500',
    EM_ANDAMENTO: 'bg-green-500',
    CONCLUIDO: 'bg-gray-500',
    CANCELADO: 'bg-red-500',
    NAO_COMPARECEU: 'bg-orange-500'
  }
  return colors[status] || 'bg-gray-500'
}

const getStatusBadgeClass = (status) => {
  const classes = {
    AGENDADO: 'bg-blue-900/50 text-blue-400 border border-blue-800',
    EM_ANDAMENTO: 'bg-green-900/50 text-green-400 border border-green-800',
    CONCLUIDO: 'bg-gray-900/50 text-gray-400 border border-gray-800',
    CANCELADO: 'bg-red-900/50 text-red-400 border border-red-800',
    NAO_COMPARECEU: 'bg-orange-900/50 text-orange-400 border border-orange-800'
  }
  return classes[status] || 'bg-gray-900/50 text-gray-400 border border-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    AGENDADO: 'Agendado',
    EM_ANDAMENTO: 'Em Andamento',
    CONCLUIDO: 'Concluído',
    CANCELADO: 'Cancelado',
    NAO_COMPARECEU: 'Não Compareceu'
  }
  return texts[status] || status
}

const getCalendarAppointmentClass = (status) => {
  const classes = {
    AGENDADO: 'bg-blue-600/20 border-blue-500/50 border',
    EM_ANDAMENTO: 'bg-green-600/20 border-green-500/50 border',
    CONCLUIDO: 'bg-gray-600/20 border-gray-500/50 border',
    CANCELADO: 'bg-red-600/20 border-red-500/50 border line-through opacity-60',
    NAO_COMPARECEU: 'bg-orange-600/20 border-orange-500/50 border'
  }
  return classes[status] || 'bg-gray-600/20 border-gray-500/50 border'
}

const clearFilters = () => {
  dateFilter.value = ''
  statusFilter.value = ''
  clientFilter.value = ''
  hairdresserFilter.value = ''
}

const previousWeek = () => {
  const newDate = new Date(currentWeekStart.value)
  newDate.setDate(newDate.getDate() - 7)
  currentWeekStart.value = newDate
}

const nextWeek = () => {
  const newDate = new Date(currentWeekStart.value)
  newDate.setDate(newDate.getDate() + 7)
  currentWeekStart.value = newDate
}

const loadData = async () => {
  try {
    const { $api } = useNuxtApp()
    
    console.log('🔄 Carregando dados da API...')
    
    const [appointmentsRes, clientsRes, proceduresRes, usersRes] = await Promise.all([
      $api('/appointments').catch((error) => {
        console.error('❌ Erro ao carregar agendamentos:', error)
        return []
      }),
      $api('/clients').catch((error) => {
        console.error('❌ Erro ao carregar clientes:', error)
        return []
      }),
      $api('/procedures').catch((error) => {
        console.error('❌ Erro ao carregar procedimentos:', error)
        return []
      }),
      $api('/users').catch((error) => {
        console.error('❌ Erro ao carregar usuários:', error)
        return []
      })
    ])
    
    appointments.value = appointmentsRes || []
    clients.value = clientsRes || []
    procedures.value = proceduresRes || []
    hairdressers.value = (usersRes || []).filter(user => user.role === 'CABELEIREIRO')
    
    console.log('✅ Dados carregados:')
    console.log(`   📅 Agendamentos: ${appointments.value.length}`)
    console.log('   📅 Raw appointments data:', appointmentsRes)
    console.log(`   👥 Clientes: ${clients.value.length}`)
    console.log(`   ✨ Procedimentos: ${procedures.value.length}`)
    console.log(`   💇 Profissionais: ${hairdressers.value.length}`)
    
    // Debug appointments data
    if (appointments.value.length > 0) {
      console.log('🔍 First appointment:', appointments.value[0])
    }
    
    // Log dos procedimentos para verificar se têm produtos associados
    procedures.value.forEach((procedure, index) => {
      if (procedure.procedureProducts?.length > 0) {
        console.log(`   🧪 Procedimento "${procedure.name}" tem ${procedure.procedureProducts.length} produtos`)
      }
    })
    
  } catch (error) {
    console.error('💥 Erro geral ao carregar dados:', error)
    const toast = useToast()
    toast.error('Erro ao carregar dados da API')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  Object.assign(appointmentForm, {
    clientId: '',
    userId: '',
    date: '',
    startTime: '',
    endTime: '',
    procedureIds: [],
    status: 'AGENDADO',
    observations: '',
    paymentMethod: '',
    discount: 0
  })
}

const editAppointment = (appointment) => {
  editingAppointment.value = appointment
  Object.assign(appointmentForm, {
    clientId: appointment.clientId,
    userId: appointment.userId || '',
    date: appointment.date,
    startTime: appointment.startTime?.split('T')[1]?.substr(0, 5),
    endTime: appointment.endTime?.split('T')[1]?.substr(0, 5),
    procedureIds: appointment.procedures?.map(p => p.procedureId) || [],
    status: appointment.status,
    observations: appointment.observations || '',
    paymentMethod: appointment.paymentMethod || '',
    discount: appointment.discount || 0
  })
  showCreateModal.value = false
}

const closeModal = () => {
  showCreateModal.value = false
  editingAppointment.value = null
  resetForm()
}

const saveAppointment = async () => {
  saving.value = true

  try {
    const { $api } = useNuxtApp()
    const toast = useToast()

    const startDateTime = `${appointmentForm.date}T${appointmentForm.startTime}:00`

    const payload = {
      clientId: appointmentForm.clientId,
      userId: appointmentForm.userId || undefined,
      date: appointmentForm.date,
      startTime: startDateTime,
      procedureIds: appointmentForm.procedureIds,
      paymentMethod: appointmentForm.paymentMethod || undefined,
      discount: appointmentForm.discount
        ? parseFloat(appointmentForm.discount)
        : undefined,
      observations: appointmentForm.observations || undefined,
    }

    // Remove apenas campos inválidos (null, undefined, string vazia)
    Object.keys(payload).forEach((key) => {
      if (
        payload[key] === undefined ||
        payload[key] === null ||
        payload[key] === ''
      ) {
        delete payload[key]
      }
    })

    console.log('💾 Salvando agendamento (payload final):', payload)

    const method = editingAppointment.value ? 'PATCH' : 'POST'
    const url = editingAppointment.value
      ? `/appointments/${editingAppointment.value.id}`
      : '/appointments'

    await $api(url, {
      method,
      body: payload,
    })

    // Detectar se o status mudou para CONCLUIDO
    const wasCompleted = editingAppointment.value &&
      appointmentForm.status === 'CONCLUIDO' &&
      appointmentForm.status !== editingAppointment.value.status

    if (
      editingAppointment.value &&
      appointmentForm.status !== editingAppointment.value.status
    ) {
      await $api(`/appointments/${editingAppointment.value.id}/status`, {
        method: 'PATCH',
        body: {
          status: appointmentForm.status,
        },
      })
    }

    await loadData()
    closeModal()

    // Se agendamento foi concluído, mostrar popup de reagendamento
    if (wasCompleted) {
      const client = clients.value.find(c => c.id === appointmentForm.clientId)
      if (client) {
        completedClient.value = client
        // Calcular data para 30 dias no futuro
        const futureDate = new Date()
        futureDate.setDate(futureDate.getDate() + 30)
        rescheduleDate.value = futureDate.toISOString().split('T')[0]
        showRescheduleModal.value = true
      }
    }

    toast.success(
      editingAppointment.value
        ? 'Agendamento atualizado!'
        : 'Agendamento criado!'
    )
  } catch (error) {
    console.error('💥 Erro ao salvar agendamento:', error)
    const toast = useToast()
    toast.error('Erro ao salvar agendamento')
  } finally {
    saving.value = false
  }
}

const confirmDelete = (appointment) => {
  appointmentToDelete.value = appointment
}

const deleteAppointment = async () => {
  deleting.value = true
  
  try {
    const { $api } = useNuxtApp()
    const toast = useToast()
    
    console.log('🗑️ Excluindo agendamento:', appointmentToDelete.value.id)
    
    await $api(`/appointments/${appointmentToDelete.value.id}`, {
      method: 'DELETE'
    })
    
    await loadData()
    appointmentToDelete.value = null
    toast.success('Agendamento excluído!')
  } catch (error) {
    console.error('💥 Erro ao excluir agendamento:', error)
    const toast = useToast()
    toast.error('Erro ao excluir agendamento')
  } finally {
    deleting.value = false
  }
}

// Rescheduling functions
const closeRescheduleModal = () => {
  showRescheduleModal.value = false
  completedClient.value = null
  rescheduleDate.value = ''
}

const confirmReschedule = async () => {
  if (!completedClient.value || !rescheduleDate.value) return
  
  rescheduling.value = true
  
  try {
    const { $api } = useNuxtApp()
    const toast = useToast()
    
    console.log('📅 Reagendando cliente:', completedClient.value.name)
    
    // Usar o primeiro usuário (hairdresser) disponível como padrão
    const defaultUserId = hairdressers.value[0]?.id || null
    
    await $api('http://localhost:3009/api/messages/schedule-followup', {
      method: 'POST',
      body: {
        clientId: completedClient.value.id,
        appointmentDate: rescheduleDate.value,
        userId: defaultUserId
      }
    })
    
    await loadData()
    closeRescheduleModal()
    toast.success(`Cliente ${completedClient.value.name} reagendado para ${new Date(rescheduleDate.value).toLocaleDateString('pt-BR')}!`)
  } catch (error) {
    console.error('💥 Erro ao reagendar cliente:', error)
    const toast = useToast()
    toast.error('Erro ao reagendar cliente')
  } finally {
    rescheduling.value = false
  }
}

// Lifecycle
onMounted(() => {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const lastSunday = new Date(today)
  lastSunday.setDate(today.getDate() - dayOfWeek)
  currentWeekStart.value = lastSunday
  
  loadData()
})
</script>