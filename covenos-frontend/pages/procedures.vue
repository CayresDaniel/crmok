<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">
          Procedimentos
        </h1>
        <p class="text-gray-400">
          Gerencie os procedimentos e serviços oferecidos
        </p>
      </div>
      <button @click="showCreateModal = true" class="btn-primary">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Novo Procedimento
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card">
        <div class="flex items-center">
          <div class="p-3 bg-purple-600 rounded-xl shadow-glow">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-400">Total de Procedimentos</p>
            <p class="text-2xl font-bold text-white">{{ procedures.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center">
          <div class="p-3 bg-green-600 rounded-xl shadow-glow">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-400">Ativos</p>
            <p class="text-2xl font-bold text-white">{{ activeProcedures }}</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center">
          <div class="p-3 bg-indigo-600 rounded-xl shadow-glow">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-400">Duração Média</p>
            <p class="text-2xl font-bold text-white">{{ averageDuration }}min</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-center">
          <div class="p-3 bg-yellow-600 rounded-xl shadow-glow">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-400">Preço Médio</p>
            <p class="text-2xl font-bold text-white">{{ formatCurrency(averagePrice) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card">
      <h3 class="text-lg font-semibold text-white mb-4">Filtros</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Buscar</label>
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Nome do procedimento..."
            class="input"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Categoria</label>
          <select v-model="categoryFilter" class="input">
            <option value="">Todas as categorias</option>
            <option value="CORTE">Corte</option>
            <option value="PINTURA">Pintura</option>
            <option value="TRATAMENTO">Tratamento</option>
            <option value="PENTEADO">Penteado</option>
            <option value="OUTROS">Outros</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Status</label>
          <select v-model="statusFilter" class="input">
            <option value="">Todos</option>
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Procedures List -->
    <div class="card">
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 5" :key="i" class="skeleton h-20"></div>
      </div>
      
      <div v-else-if="filteredProcedures.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
        </svg>
        <h3 class="text-lg font-semibold text-white mb-2">Nenhum procedimento encontrado</h3>
        <p class="text-gray-400">Crie um novo procedimento para começar</p>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-700">
              <th class="text-left py-4 px-4 text-gray-300 font-semibold">Nome</th>
              <th class="text-left py-4 px-4 text-gray-300 font-semibold">Categoria</th>
              <th class="text-left py-4 px-4 text-gray-300 font-semibold">Duração</th>
              <th class="text-left py-4 px-4 text-gray-300 font-semibold">Preço</th>
              <th class="text-left py-4 px-4 text-gray-300 font-semibold">Produtos</th>
              <th class="text-left py-4 px-4 text-gray-300 font-semibold">Status</th>
              <th class="text-right py-4 px-4 text-gray-300 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="procedure in filteredProcedures"
              :key="procedure.id"
              class="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors"
            >
              <td class="py-4 px-4">
                <div>
                  <h4 class="text-white font-medium">{{ procedure.name }}</h4>
                  <p v-if="procedure.description" class="text-gray-400 text-sm mt-1">
                    {{ procedure.description }}
                  </p>
                </div>
              </td>
              <td class="py-4 px-4">
                <span class="badge-info">{{ getCategoryText(procedure.category) }}</span>
              </td>
              <td class="py-4 px-4 text-gray-300">
                {{ procedure.duration }}min
              </td>
              <td class="py-4 px-4">
                <span class="text-white font-semibold">{{ formatCurrency(procedure.price) }}</span>
              </td>
              <td class="py-4 px-4">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                  </svg>
                  <span class="text-gray-400 text-sm">
                    {{ procedure.products?.length || 0 }} produtos
                  </span>
                </div>
              </td>
              <td class="py-4 px-4">
                <span :class="procedure.active ? 'badge-success' : 'badge-error'">
                  {{ procedure.active ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="py-4 px-4 text-right">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="editProcedure(procedure)"
                    class="p-2 text-gray-400 hover:text-indigo-400 transition-colors rounded-lg hover:bg-gray-800"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    @click="toggleProcedureStatus(procedure)"
                    class="p-2 text-gray-400 hover:text-yellow-400 transition-colors rounded-lg hover:bg-gray-800"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </button>
                  <button
                    @click="confirmDelete(procedure)"
                    class="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-800"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || editingProcedure" class="modal-backdrop">
      <div class="modal">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-white">
            {{ editingProcedure ? 'Editar Procedimento' : 'Novo Procedimento' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="saveProcedure" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">Nome *</label>
              <input
                v-model="procedureForm.name"
                type="text"
                required
                class="input"
                placeholder="Nome do procedimento"
              />
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">Categoria *</label>
              <select v-model="procedureForm.category" required class="input">
                <option value="">Selecione uma categoria</option>
                <option value="CORTE">Corte</option>
                <option value="PINTURA">Pintura</option>
                <option value="TRATAMENTO">Tratamento</option>
                <option value="PENTEADO">Penteado</option>
                <option value="OUTROS">Outros</option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-300 mb-2">Descrição</label>
            <textarea
              v-model="procedureForm.description"
              rows="3"
              class="input"
              placeholder="Descrição do procedimento..."
            ></textarea>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">Duração (minutos) *</label>
              <input
                v-model="procedureForm.duration"
                type="number"
                required
                min="1"
                class="input"
                placeholder="60"
              />
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">Preço *</label>
              <input
                v-model="procedureForm.price"
                type="number"
                step="0.01"
                required
                min="0"
                class="input"
                placeholder="0,00"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-300 mb-2">Produtos Utilizados</label>
            <div class="max-h-40 overflow-y-auto border border-gray-700 rounded-xl p-4 bg-gray-800/50">
              <div v-if="products.length === 0" class="text-gray-400 text-center py-4">
                <p>Nenhum produto disponível</p>
                <p class="text-sm mt-1">Cadastre produtos na página de Produtos</p>
              </div>
              <div v-else class="space-y-3">
                <label
                  v-for="product in products"
                  :key="product.id"
                  class="flex items-center justify-between cursor-pointer hover:bg-gray-700/50 p-2 rounded-lg transition-colors"
                >
                  <div class="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      :value="product.id"
                      v-model="procedureForm.productIds"
                      class="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                    />
                    <div>
                      <span class="text-white font-medium">{{ product.name }}</span>
                      <p class="text-gray-400 text-sm">Estoque: {{ product.stock }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <input
                      v-if="procedureForm.productIds.includes(product.id)"
                      v-model="procedureForm.productQuantities[product.id]"
                      type="number"
                      min="0.1"
                      step="0.1"
                      class="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      placeholder="Qtd"
                    />
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <input
              v-model="procedureForm.isActive"
              type="checkbox"
              id="isActive"
              class="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
            />
            <label for="isActive" class="text-sm font-medium text-gray-300">
              Procedimento ativo
            </label>
          </div>
          
          <div class="flex justify-end space-x-4 pt-6">
            <button type="button" @click="closeModal" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn-primary" :disabled="saving">
              {{ saving ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="procedureToDelete" class="modal-backdrop">
      <div class="modal max-w-md">
        <div class="mb-6">
          <h3 class="text-xl font-bold text-white mb-2">Confirmar Exclusão</h3>
          <p class="text-gray-400">
            Tem certeza que deseja excluir o procedimento "{{ procedureToDelete.name }}"?
            Esta ação não pode ser desfeita.
          </p>
        </div>
        
        <div class="flex justify-end space-x-4">
          <button @click="procedureToDelete = null" class="btn-secondary">
            Cancelar
          </button>
          <button @click="deleteProcedure" class="btn-danger" :disabled="deleting">
            {{ deleting ? 'Excluindo...' : 'Excluir' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useSeoMeta({
  title: 'Procedimentos - Coven Beauty',
  description: 'Gerenciamento de procedimentos e serviços'
})

// Estado
const procedures = ref([])
const products = ref([])
const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)

const searchTerm = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')

const showCreateModal = ref(false)
const editingProcedure = ref(null)
const procedureToDelete = ref(null)

const procedureForm = reactive({
  name: '',
  category: '',
  description: '',
  duration: '',
  price: '',
  productIds: [],
  productQuantities: {},
  isActive: true
})

// Computed
const filteredProcedures = computed(() => {
  let filtered = procedures.value

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(procedure =>
      procedure.name.toLowerCase().includes(term) ||
      procedure.description?.toLowerCase().includes(term)
    )
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(procedure => procedure.category === categoryFilter.value)
  }

  if (statusFilter.value !== '') {
    const isActive = statusFilter.value === 'true'
    filtered = filtered.filter(procedure => procedure.active === isActive)
  }

  return filtered.sort((a, b) => a.name.localeCompare(b.name))
})

const activeProcedures = computed(() => {
  return procedures.value.filter(p => p.isActive).length
})

const averageDuration = computed(() => {
  if (procedures.value.length === 0) return 0
  const total = procedures.value.reduce((sum, p) => sum + p.duration, 0)
  return Math.round(total / procedures.value.length)
})

const averagePrice = computed(() => {
  if (procedures.value.length === 0) return 0
  const total = procedures.value.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0)
  return total / procedures.value.length
})

// Métodos
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const getCategoryText = (category) => {
  const categories = {
    CORTE: 'Corte',
    PINTURA: 'Pintura',
    TRATAMENTO: 'Tratamento',
    PENTEADO: 'Penteado',
    OUTROS: 'Outros'
  }
  return categories[category] || category
}

const loadData = async () => {
  try {
    const { $api } = useNuxtApp()
    
    console.log('🔄 Carregando procedimentos e produtos...')
    
    const [proceduresRes, productsRes] = await Promise.all([
      $api('/procedures').catch((error) => {
        console.error('❌ Erro ao carregar procedimentos:', error)
        return []
      }),
      $api('/products').catch((error) => {
        console.error('❌ Erro ao carregar produtos:', error)
        return []
      })
    ])
    
    procedures.value = proceduresRes || []
    products.value = (productsRes || []).filter(p => p.active)
    
    console.log('✅ Dados carregados:')
    console.log(`   📋 Procedimentos: ${procedures.value.length}`)
    console.log(`   🧪 Produtos ativos: ${products.value.length}`)
    console.log('   🧪 Produtos disponíveis:', products.value.map(p => `${p.name} (${p.active ? 'ativo' : 'inativo'})`))
    
  } catch (error) {
    console.error('💥 Erro geral ao carregar dados:', error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  Object.assign(procedureForm, {
    name: '',
    category: '',
    description: '',
    duration: '',
    price: '',
    productIds: [],
    productQuantities: {},
    isActive: true
  })
}

const editProcedure = (procedure) => {
  editingProcedure.value = procedure
  Object.assign(procedureForm, {
    name: procedure.name,
    category: procedure.category,
    description: procedure.description || '',
    duration: procedure.duration,
    price: procedure.price,
    productIds: procedure.products?.map(p => p.id) || [],
    productQuantities: procedure.products?.reduce((acc, p) => {
      acc[p.id] = p.pivot?.quantity || 1
      return acc
    }, {}) || {},
    isActive: procedure.active
  })
  showCreateModal.value = false
}

const closeModal = () => {
  showCreateModal.value = false
  editingProcedure.value = null
  resetForm()
}

const saveProcedure = async () => {
  saving.value = true
  
  try {
    const { $api } = useNuxtApp()
    const token = useCookie('covenos-token')
    
    // Criar objeto com produtos e quantidades
    const procedureProducts = procedureForm.productIds.map(productId => ({
      productId,
      quantity: parseFloat(procedureForm.productQuantities[productId]) || 1
    }))
    
    const payload = {
      name: procedureForm.name,
      category: procedureForm.category,
      description: procedureForm.description,
      duration: parseInt(procedureForm.duration),
      price: parseFloat(procedureForm.price),
      active: procedureForm.isActive
    }
    
    const method = editingProcedure.value ? 'PATCH' : 'POST'
    const url = editingProcedure.value 
      ? `/procedures/${editingProcedure.value.id}` 
      : '/procedures'
    
    const response = await $api(url, {
      method,
      headers: {
        'Authorization': `Bearer ${token.value}`
      },
      body: payload
    })
    
    // Se há produtos selecionados, vinculá-los ao procedimento
    if (procedureProducts.length > 0) {
      const procedureId = editingProcedure.value?.id || response.id
      
      // Primeiro, desvincular todos os produtos existentes se for edição
      if (editingProcedure.value) {
        const existingProducts = editingProcedure.value.products || []
        for (const product of existingProducts) {
          try {
            await $api(`/procedures/${procedureId}/products/${product.id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token.value}` }
            })
          } catch (error) {
            // Ignorar erros de produtos que já foram desvinculados
          }
        }
      }
      
      // Vincular os novos produtos
      for (const productData of procedureProducts) {
        try {
          await $api(`/procedures/${procedureId}/products`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token.value}` },
            body: productData
          })
        } catch (error) {
          console.error('Erro ao vincular produto:', error)
        }
      }
    }
    
    await loadData()
    closeModal()
  } catch (error) {
    console.error('Erro ao salvar procedimento:', error)
  } finally {
    saving.value = false
  }
}

const toggleProcedureStatus = async (procedure) => {
  try {
    const { $api } = useNuxtApp()
    const token = useCookie('covenos-token')
    
    await $api(`/procedures/${procedure.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token.value}`
      },
      body: {
        active: !procedure.active
      }
    })
    
    await loadData()
  } catch (error) {
    console.error('Erro ao alterar status do procedimento:', error)
  }
}

const confirmDelete = (procedure) => {
  procedureToDelete.value = procedure
}

const deleteProcedure = async () => {
  deleting.value = true
  
  try {
    const { $api } = useNuxtApp()
    const token = useCookie('covenos-token')
    
    await $api(`/procedures/${procedureToDelete.value.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
    
    await loadData()
    procedureToDelete.value = null
  } catch (error) {
    console.error('Erro ao excluir procedimento:', error)
  } finally {
    deleting.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadData()
})
</script>