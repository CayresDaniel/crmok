<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Clientes</h1>
        <p class="text-sm text-gray-400 mt-1">Gerencie sua base de clientes</p>
      </div>
      <button @click="showCreateModal = true" class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg shadow-purple-500/25">
        <UserPlusIcon class="w-5 h-5 mr-2" />
        Novo Cliente
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400">Total de Clientes</p>
            <p class="text-2xl font-bold text-white mt-1">{{ clients.length }}</p>
          </div>
          <UsersIcon class="w-8 h-8 text-purple-400" />
        </div>
      </div>
      <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400">Clientes Ativos</p>
            <p class="text-2xl font-bold text-white mt-1">{{ clients.filter(c => c.active).length }}</p>
          </div>
          <CheckCircleIcon class="w-8 h-8 text-green-400" />
        </div>
      </div>
      <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400">Novos este Mês</p>
            <p class="text-2xl font-bold text-white mt-1">{{ getNewClientsThisMonth() }}</p>
          </div>
          <UserPlusIcon class="w-8 h-8 text-blue-400" />
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-4">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar por nome, telefone ou email..."
            class="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        <select v-model="statusFilter" class="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors">
          <option value="">Todos os status</option>
          <option value="true">Ativos</option>
          <option value="false">Inativos</option>
        </select>
      </div>
    </div>

    <!-- Clients Table -->
    <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl overflow-hidden">
      <div v-if="loading" class="p-6 space-y-4">
        <div v-for="i in 5" :key="i" class="animate-pulse">
          <div class="h-16 bg-gray-800/50 rounded-lg"></div>
        </div>
      </div>
      
      <div v-else-if="filteredClients.length === 0" class="text-center py-16">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
          <UsersIcon class="w-8 h-8 text-gray-600" />
        </div>
        <p class="text-lg font-medium text-white mb-2">Nenhum cliente encontrado</p>
        <p class="text-sm text-gray-400">Adicione um novo cliente para começar</p>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-800/30 border-b border-gray-700">
            <tr>
              <th class="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Cliente</th>
              <th class="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Contato</th>
              <th class="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th class="text-left py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Último Atendimento</th>
              <th class="text-right py-4 px-6 text-xs font-medium text-gray-400 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
            <tr
              v-for="client in filteredClients"
              :key="client.id"
              class="hover:bg-gray-800/30 transition-colors duration-150"
            >
              <td class="py-4 px-6">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium mr-3">
                    {{ client.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-white">{{ client.name }}</p>
                    <p v-if="client.observations" class="text-xs text-gray-400 mt-0.5">{{ client.observations }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6">
                <div class="space-y-1">
                  <p class="text-sm text-gray-300 flex items-center">
                    <PhoneIcon class="w-4 h-4 mr-1 text-gray-500" />
                    {{ client.phone }}
                  </p>
                  <p v-if="client.email" class="text-sm text-gray-300 flex items-center">
                    <EnvelopeIcon class="w-4 h-4 mr-1 text-gray-500" />
                    {{ client.email }}
                  </p>
                </div>
              </td>
              <td class="py-4 px-6">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  client.active 
                    ? 'bg-green-900/50 text-green-400 border border-green-800' 
                    : 'bg-red-900/50 text-red-400 border border-red-800'
                ]">
                  <span :class="[
                    'w-1.5 h-1.5 rounded-full mr-1.5',
                    client.active ? 'bg-green-400' : 'bg-red-400'
                  ]"></span>
                  {{ client.active ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="py-4 px-6">
                <p class="text-sm text-gray-300">
                  {{ client.lastAppointment ? formatDate(client.lastAppointment) : 'Nunca agendou' }}
                </p>
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="editClient(client)"
                    class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
                    title="Editar cliente"
                  >
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="confirmDelete(client)"
                    class="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all duration-200"
                    title="Excluir cliente"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
        <div v-if="showCreateModal || editingClient" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div class="bg-gray-900 border border-gray-800 rounded-xl shadow-xl w-full max-w-lg">
              <!-- Modal Header -->
              <div class="flex items-center justify-between p-6 border-b border-gray-800">
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
                    <UserPlusIcon class="w-5 h-5 text-white" />
                  </div>
                  <h3 class="text-xl font-semibold text-white">
                    {{ editingClient ? 'Editar Cliente' : 'Novo Cliente' }}
                  </h3>
                </div>
                <button @click="closeModal" class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>
              
              <!-- Modal Body -->
              <form @submit.prevent="saveClient" class="p-6 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Nome completo *
                  </label>
                  <input
                    v-model="clientForm.name"
                    type="text"
                    required
                    class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Digite o nome do cliente"
                  />
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      Telefone *
                    </label>
                    <input
                      v-model="clientForm.phone"
                      type="tel"
                      required
                      class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      v-model="clientForm.email"
                      type="email"
                      class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="cliente@email.com"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">
                      Data de Nascimento
                    </label>
                    <input
                      v-model="clientForm.birthDate"
                      type="date"
                      class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Observações
                  </label>
                  <textarea
                    v-model="clientForm.observations"
                    rows="3"
                    class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    placeholder="Anotações sobre o cliente..."
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
                      {{ editingClient ? 'Atualizar' : 'Cadastrar' }}
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
        <div v-if="clientToDelete" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
                  Tem certeza que deseja excluir o cliente <span class="font-medium text-white">{{ clientToDelete.name }}</span>? 
                  Esta ação não pode ser desfeita.
                </p>
                <div class="flex space-x-3">
                  <button 
                    @click="clientToDelete = null" 
                    class="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    @click="deleteClient" 
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
  </div>
</template>

<script setup>
import { 
  UserPlusIcon, 
  UsersIcon, 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useSeoMeta({
  title: 'Clientes - Coven Beauty',
  description: 'Gerenciamento de clientes do salão'
})

// Estado
const clients = ref([])
const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)

const searchTerm = ref('')
const statusFilter = ref('')

const showCreateModal = ref(false)
const editingClient = ref(null)
const clientToDelete = ref(null)

const clientForm = reactive({
  name: '',
  phone: '',
  email: '',
  observations: '',
   birthDate: ''
})

// Computed
const filteredClients = computed(() => {
  let filtered = clients.value

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(client =>
      client.name.toLowerCase().includes(term) ||
      client.phone.includes(term) ||
      client.email?.toLowerCase().includes(term)
    )
  }

  if (statusFilter.value !== '') {
    filtered = filtered.filter(client => 
      client.active.toString() === statusFilter.value
    )
  }

  return filtered
})

// Métodos
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const getNewClientsThisMonth = () => {
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()
  
  return clients.value.filter(client => {
    const createdAt = new Date(client.createdAt || client.created_at)
    return createdAt.getMonth() === thisMonth && createdAt.getFullYear() === thisYear
  }).length
}

const loadClients = async () => {
  try {
    const { $api } = useNuxtApp()
    
    const response = await $api('/clients', {
      method: 'GET'
    })
    
    clients.value = Array.isArray(response) ? response : (response.data || [])
  } catch (error) {
    console.error('Erro ao carregar clientes:', error)
    const toast = useToast()
    toast.error('Erro ao carregar lista de clientes')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  Object.assign(clientForm, {
    name: '',
    phone: '',
    email: '',
    observations: ''
  })
}

const editClient = (client) => {
  editingClient.value = client
  Object.assign(clientForm, client)
  showCreateModal.value = false
}

const closeModal = () => {
  showCreateModal.value = false
  editingClient.value = null
  resetForm()
}

const saveClient = async () => {
  saving.value = true
  
  try {
    const { $api } = useNuxtApp()
    const toast = useToast()
    
    const method = editingClient.value ? 'PATCH' : 'POST'
    const url = editingClient.value ? `/clients/${editingClient.value.id}` : '/clients'
    
    const clientData = {
      name: clientForm.name.trim()
    }
    
    if (clientForm.email && clientForm.email.trim()) {
      clientData.email = clientForm.email.trim()
    }
    
    if (clientForm.phone && clientForm.phone.trim()) {
      clientData.phone = clientForm.phone.trim()
    }
    
    if (clientForm.observations && clientForm.observations.trim()) {
      clientData.observations = clientForm.observations.trim()
    }
    
    if (clientForm.birthDate) {
    clientData.birthDate = clientForm.birthDate
  }

    await $api(url, {
      method,
      body: clientData
    })
    
    await loadClients()
    closeModal()
    
    toast.success(
      editingClient.value ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!'
    )
  } catch (error) {
    console.error('Erro ao salvar cliente:', error)
    const toast = useToast()
    const errorMessage = error.response?.data?.message || 'Erro ao salvar cliente'
    toast.error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (client) => {
  clientToDelete.value = client
}

const deleteClient = async () => {
  deleting.value = true
  
  try {
    const { $api } = useNuxtApp()
    const toast = useToast()
    
    await $api(`/clients/${clientToDelete.value.id}`, {
      method: 'DELETE'
    })
    
    await loadClients()
    clientToDelete.value = null
    toast.success('Cliente excluído com sucesso!')
  } catch (error) {
    console.error('Erro ao excluir cliente:', error)
    const toast = useToast()
    toast.error('Erro ao excluir cliente')
  } finally {
    deleting.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadClients()
})
</script>