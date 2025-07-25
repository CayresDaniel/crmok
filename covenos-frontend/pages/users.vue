<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-white">
          Usuários
        </h1>
        <p class="text-neutral-400 text-sm">
          Gerencie cabeleireiros e funcionários
        </p>
      </div>
      <button @click="showCreateModal = true" class="btn-primary">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Novo Usuário
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="card">
        <div class="flex items-center">
          <div class="p-2 bg-violet-600 rounded-lg">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-neutral-400">Total</p>
            <p class="text-lg font-semibold text-white">{{ users.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center">
          <div class="p-2 bg-green-600 rounded-lg">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-neutral-400">Ativos</p>
            <p class="text-lg font-semibold text-white">{{ activeUsers }}</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center">
          <div class="p-2 bg-blue-600 rounded-lg">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-neutral-400">Cabeleireiros</p>
            <p class="text-lg font-semibold text-white">{{ hairdressers }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar usuários..."
            class="input w-full"
          />
        </div>
        <div>
          <select v-model="roleFilter" class="input w-full">
            <option value="">Todos os cargos</option>
            <option value="ADMIN">Administrador</option>
            <option value="CABELEIREIRO">Cabeleireiro</option>
          </select>
        </div>
        <div>
          <select v-model="statusFilter" class="input w-full">
            <option value="">Todos os status</option>
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Users Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-if="loading" v-for="i in 6" :key="i" class="card">
        <div class="skeleton h-20 rounded mb-4"></div>
        <div class="skeleton h-4 rounded mb-2"></div>
        <div class="skeleton h-3 rounded w-2/3"></div>
      </div>
      
      <div v-else-if="filteredUsers.length === 0" class="col-span-full">
        <div class="text-center py-12 text-neutral-400">
          <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <p class="text-lg mb-2">Nenhum usuário encontrado</p>
          <p class="text-sm">Adicione um novo usuário para começar</p>
        </div>
      </div>
      
      <div
        v-else
        v-for="user in filteredUsers"
        :key="user.id"
        class="card-hover group"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gradient-to-br from-violet-600 to-violet-800 rounded-full flex items-center justify-center text-white font-medium">
              {{ user.name.charAt(0).toUpperCase() }}
            </div>
            <div class="ml-3">
              <h3 class="font-medium text-white">{{ user.name }}</h3>
              <p class="text-sm text-neutral-400">{{ user.email }}</p>
            </div>
          </div>
          <div class="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
            <button
              @click="editUser(user)"
              class="p-1 text-neutral-400 hover:text-violet-400 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button
              @click="confirmDelete(user)"
              class="p-1 text-neutral-400 hover:text-red-400 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-sm text-neutral-400">Cargo:</span>
            <span :class="getRoleBadge(user.role)">
              {{ getRoleText(user.role) }}
            </span>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm text-neutral-400">Status:</span>
            <span :class="user.active ? 'badge-success' : 'badge-error'">
              {{ user.active ? 'Ativo' : 'Inativo' }}
            </span>
          </div>
          
          <div v-if="user.phone" class="flex items-center justify-between">
            <span class="text-sm text-neutral-400">Telefone:</span>
            <span class="text-sm text-neutral-200">{{ user.phone }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <Modal 
      :show="showCreateModal || !!editingUser"
      @close="closeModal"
      :title="editingUser ? 'Editar Usuário' : 'Novo Usuário'"
      :subtitle="editingUser ? 'Atualize as informações do usuário' : 'Preencha os dados do novo usuário'"
      :icon="UserPlusIcon"
      size="lg"
      variant="default"
    >
      <form @submit.prevent="saveUser" class="space-y-6">
        <div class="form-group">
          <label class="form-label">
            <UserIcon class="w-4 h-4" />
            Username *
          </label>
          <input
            v-model="userForm.username"
            type="text"
            required
            class="form-input"
            placeholder="Nome de usuário para login"
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">
            <UserIcon class="w-4 h-4" />
            Nome Completo *
          </label>
          <input
            v-model="userForm.name"
            type="text"
            required
            class="form-input"
            placeholder="Nome completo do usuário"
          />
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div class="form-group">
            <label class="form-label">
              <AtSymbolIcon class="w-4 h-4" />
              Email *
            </label>
            <input
              v-model="userForm.email"
              type="email"
              required
              class="form-input"
              placeholder="email@exemplo.com"
            />
          </div>
          <div class="form-group">
            <label class="form-label">
              <PhoneIcon class="w-4 h-4" />
              Telefone
            </label>
            <input
              v-model="userForm.phone"
              type="tel"
              class="form-input"
              placeholder="(11) 99999-9999"
            />
          </div>
        </div>
        
        <div v-if="!editingUser" class="form-group">
          <label class="form-label">
            <LockClosedIcon class="w-4 h-4" />
            Senha *
          </label>
          <input
            v-model="userForm.password"
            type="password"
            required
            class="form-input"
            placeholder="Digite uma senha segura"
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">
            <BriefcaseIcon class="w-4 h-4" />
            Cargo *
          </label>
          <select v-model="userForm.role" required class="form-input">
            <option value="">Selecione o cargo</option>
            <option value="ADMIN">Administrador</option>
            <option value="CABELEIREIRO">Cabeleireiro</option>
          </select>
        </div>
        
        <div class="flex flex-col-reverse sm:flex-row justify-end space-y-reverse space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6 border-t border-gray-700/50">
          <button type="button" @click="closeModal" class="btn-secondary px-4 sm:px-6 py-3 w-full sm:w-auto">
            <XMarkIcon class="w-4 h-4 mr-2" />
            Cancelar
          </button>
          <button type="submit" class="btn-primary px-4 sm:px-6 py-3 w-full sm:w-auto" :disabled="saving">
            <div v-if="saving" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Salvando...
            </div>
            <div v-else class="flex items-center justify-center">
              <CheckIcon class="w-4 h-4 mr-2" />
              Salvar
            </div>
          </button>
        </div>
      </form>
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal 
      :show="!!userToDelete"
      @close="userToDelete = null"
      title="Confirmar Exclusão"
      :icon="ExclamationTriangleIcon"
      size="sm"
      variant="danger"
    >
      <div class="text-center mb-6">
        <div class="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
          <ExclamationTriangleIcon class="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <p class="text-gray-400 leading-relaxed">
          Tem certeza que deseja excluir o usuário 
          <span class="font-semibold text-white">{{ userToDelete?.name }}</span>?
        </p>
        <p class="text-sm text-red-400 mt-2 font-medium">
          Esta ação não pode ser desfeita.
        </p>
      </div>
      
      <template #footer>
        <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <button @click="userToDelete = null" class="btn-secondary px-4 sm:px-6 py-3 order-2 sm:order-1 w-full sm:w-auto">
            <XMarkIcon class="w-4 h-4 mr-2" />
            Cancelar
          </button>
          <button @click="deleteUser" class="btn-danger px-4 sm:px-6 py-3 order-1 sm:order-2 w-full sm:w-auto" :disabled="deleting">
            <div v-if="deleting" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Excluindo...
            </div>
            <div v-else class="flex items-center justify-center">
              <TrashIcon class="w-4 h-4 mr-2" />
              Excluir Usuário
            </div>
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { 
  UserPlusIcon,
  UserIcon,
  PhoneIcon,
  AtSymbolIcon,
  LockClosedIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useSeoMeta({
  title: 'Usuários - Coven Beauty',
  description: 'Gerencie usuários do sistema'
})

// State
const users = ref([])
const showCreateModal = ref(false)
const editingUser = ref(null)
const userToDelete = ref(null)
const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)

// Search and filters
const searchTerm = ref('')
const roleFilter = ref('')
const statusFilter = ref('')

// Form data
const userForm = reactive({
  username: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  role: ''
})

// Computed
const filteredUsers = computed(() => {
  let filtered = users.value

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.username?.toLowerCase().includes(search)
    )
  }

  if (roleFilter.value) {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }

  if (statusFilter.value !== '') {
    const isActive = statusFilter.value === 'true'
    filtered = filtered.filter(user => user.active === isActive)
  }

  return filtered
})

const activeUsers = computed(() => {
  return users.value.filter(user => user.active !== false).length
})

const hairdressers = computed(() => {
  return users.value.filter(user => user.role === 'CABELEIREIRO').length
})

// Methods
const resetForm = () => {
  Object.assign(userForm, {
    username: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    role: ''
  })
}

const closeModal = () => {
  showCreateModal.value = false
  editingUser.value = null
  resetForm()
}

const editUser = (user) => {
  editingUser.value = user
  Object.assign(userForm, {
    username: user.username || '',
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    password: '',
    role: user.role || ''
  })
}

const confirmDelete = (user) => {
  userToDelete.value = user
}

const getRoleBadge = (role) => {
  const badges = {
    ADMIN: 'badge-info',
    CABELEIREIRO: 'badge-success'
  }
  return badges[role] || 'badge-secondary'
}

const getRoleText = (role) => {
  const texts = {
    ADMIN: 'Administrador',
    CABELEIREIRO: 'Cabeleireiro'
  }
  return texts[role] || role
}

const loadUsers = async () => {
  try {
    const { $api } = useNuxtApp()
    const token = useCookie('covenos-token')
    
    const response = await $api('/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
    
    users.value = response.data || []
  } catch (error) {
    console.error('Erro ao carregar usuários:', error)
    users.value = []
  } finally {
    loading.value = false
  }
}

const saveUser = async () => {
  try {
    saving.value = true
    const { $api } = useNuxtApp()
    const token = useCookie('covenos-token')
    
    const url = editingUser.value ? `/users/${editingUser.value.id}` : '/users'
    const method = editingUser.value ? 'PUT' : 'POST'
    
    const payload = { ...userForm }
    if (editingUser.value && !payload.password) {
      delete payload.password
    }
    
    await $api(url, {
      method,
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: payload
    })
    
    await loadUsers()
    closeModal()
  } catch (error) {
    console.error('Erro ao salvar usuário:', error)
  } finally {
    saving.value = false
  }
}

const deleteUser = async () => {
  if (!userToDelete.value) return
  
  try {
    deleting.value = true
    const { $api } = useNuxtApp()
    const token = useCookie('covenos-token')
    
    await $api(`/users/${userToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
    
    await loadUsers()
    userToDelete.value = null
  } catch (error) {
    console.error('Erro ao excluir usuário:', error)
  } finally {
    deleting.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadUsers()
})
</script>