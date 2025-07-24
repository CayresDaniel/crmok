<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Produtos</h1>
        <p class="text-sm text-gray-400 mt-1">Gerencie o estoque de produtos do salão</p>
      </div>
      <button @click="showCreateModal = true" class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg shadow-purple-500/25">
        <PlusIcon class="w-5 h-5 mr-2" />
        Novo Produto
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400">Total de Produtos</p>
            <p class="text-2xl font-bold text-white mt-2">{{ products.length }}</p>
            <p class="text-xs text-gray-500 mt-1">cadastrados</p>
          </div>
          <div class="p-3 bg-blue-500/10 rounded-xl">
            <CubeIcon class="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </div>

      <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400">Estoque Baixo</p>
            <p class="text-2xl font-bold text-white mt-2">{{ lowStockCount }}</p>
            <p class="text-xs text-gray-500 mt-1">produtos em alerta</p>
          </div>
          <div class="p-3 bg-red-500/10 rounded-xl">
            <ExclamationTriangleIcon class="w-6 h-6 text-red-400" />
          </div>
        </div>
      </div>

      <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400">Valor dos Produtos</p>
            <p class="text-2xl font-bold text-white mt-2">{{ formatCurrency(totalValue) }}</p>
            <p class="text-xs text-gray-500 mt-1">soma dos preços</p>
          </div>
          <div class="p-3 bg-green-500/10 rounded-xl">
            <CurrencyDollarIcon class="w-6 h-6 text-green-400" />
          </div>
        </div>
      </div>

      <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400">Categorias</p>
            <p class="text-2xl font-bold text-white mt-2">{{ categories.length }}</p>
            <p class="text-xs text-gray-500 mt-1">tipos de produto</p>
          </div>
          <div class="p-3 bg-purple-500/10 rounded-xl">
            <TagIcon class="w-6 h-6 text-purple-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar produtos..."
            class="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        <select v-model="categoryFilter" class="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors">
          <option value="">Todas as categorias</option>
          <option v-for="type in categories" :key="type" :value="type">
            {{ type === 'USO_INTERNO' ? 'Uso Interno' : 'Venda' }}
          </option>
        </select>
        <select v-model="stockFilter" class="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors">
          <option value="">Todos os estoques</option>
          <option value="low">Estoque baixo</option>
          <option value="normal">Estoque normal</option>
          <option value="high">Estoque alto</option>
        </select>
      </div>
    </div>

    <!-- Products Grid -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="i in 6" :key="i" class="animate-pulse">
        <div class="bg-gray-800/50 h-64 rounded-xl"></div>
      </div>
    </div>
    
    <div v-else-if="filteredProducts.length === 0" class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-16 text-center">
      <CubeIcon class="w-16 h-16 mx-auto text-gray-600 mb-4" />
      <h3 class="text-lg font-semibold text-white mb-2">Nenhum produto encontrado</h3>
      <p class="text-gray-400">Adicione um novo produto para começar</p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all duration-300 group"
      >
        <div class="p-6">
          <!-- Header with Badge -->
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                {{ product.name }}
              </h3>
              <p v-if="product.description" class="text-sm text-gray-400 mt-1">
                {{ product.description }}
              </p>
            </div>
            <span :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              getStockBadgeClass(product)
            ]">
              {{ getStockStatus(product) }}
            </span>
          </div>
          
          <!-- Product Details -->
          <div class="space-y-3">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-400">Tipo:</span>
              <span class="text-white">{{ product.type === 'USO_INTERNO' ? 'Uso Interno' : 'Venda' }}</span>
            </div>
            
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-400">Preço:</span>
              <span class="text-white font-semibold">{{ formatCurrency(product.price || 0) }}</span>
            </div>
            
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-400">Estoque:</span>
              <span class="text-white">{{ product.stock }} {{ product.unit || 'un' }}</span>
            </div>
            
            <!-- Stock Progress Bar -->
            <div class="pt-2">
              <div class="flex items-center justify-between text-xs mb-1">
                <span class="text-gray-500">Nível de estoque</span>
                <span class="text-gray-500">Mín: {{ product.minStock || 5 }}</span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-1.5">
                <div 
                  :class="[
                    'h-1.5 rounded-full transition-all duration-300',
                    getStockBarColor(product)
                  ]"
                  :style="`width: ${Math.min((product.stock / ((product.minStock || 5) * 3)) * 100, 100)}%`"
                ></div>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center justify-between pt-4 mt-4 border-t border-gray-700">
            <button
              @click="openStockModal(product)"
              class="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Ajustar Estoque
            </button>
            <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                @click="editProduct(product)"
                class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
                title="Editar"
              >
                <PencilIcon class="w-4 h-4" />
              </button>
              <button
                @click="confirmDelete(product)"
                class="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all duration-200"
                title="Excluir"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Product Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showCreateModal || editingProduct" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
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
                    <CubeIcon class="w-5 h-5 text-white" />
                  </div>
                  <h3 class="text-xl font-semibold text-white">
                    {{ editingProduct ? 'Editar Produto' : 'Novo Produto' }}
                  </h3>
                </div>
                <button @click="closeModal" class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>
              
              <!-- Modal Body -->
              <form @submit.prevent="saveProduct" class="p-6 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Nome do Produto *</label>
                  <input
                    v-model="productForm.name"
                    type="text"
                    required
                    class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Nome do produto"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
                  <textarea
                    v-model="productForm.description"
                    rows="3"
                    class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    placeholder="Descrição do produto..."
                  ></textarea>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Tipo *</label>
                    <select v-model="productForm.type" required class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors">
                      <option value="">Selecione o tipo</option>
                      <option value="USO_INTERNO">Uso Interno</option>
                      <option value="VENDA">Venda</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Unidade</label>
                    <select v-model="productForm.unit" class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors">
                      <option value="">Selecione a unidade</option>
                      <option value="ml">ml</option>
                      <option value="L">L</option>
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="un">un</option>
                      <option value="cx">cx</option>
                    </select>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Preço</label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">R$</span>
                      <input
                        v-model="productForm.price"
                        type="number"
                        step="0.01"
                        min="0"
                        class="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Estoque Inicial *</label>
                    <input
                      v-model="productForm.stock"
                      type="number"
                      min="0"
                      required
                      class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Estoque Mínimo</label>
                    <input
                      v-model="productForm.minStock"
                      type="number"
                      min="0"
                      class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="5"
                    />
                  </div>
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
                      {{ editingProduct ? 'Atualizar' : 'Cadastrar' }}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Stock Movement Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="stockProduct" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
                <h3 class="text-lg font-semibold text-white mb-4">
                  Ajustar Estoque - {{ stockProduct.name }}
                </h3>
                
                <div class="mb-4 p-4 bg-gray-800/50 rounded-lg">
                  <p class="text-sm text-gray-400">Estoque atual:</p>
                  <p class="text-xl font-bold text-white mt-1">{{ stockProduct.stock }} {{ stockProduct.unit || 'un' }}</p>
                </div>
                
                <form @submit.prevent="adjustStock" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Tipo de Movimento *</label>
                    <select v-model="stockForm.type" required class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors">
                      <option value="">Selecione o tipo</option>
                      <option value="IN">Entrada</option>
                      <option value="OUT">Saída</option>
                      <option value="ADJUSTMENT">Ajuste</option>
                    </select>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Quantidade *</label>
                    <input
                      v-model="stockForm.quantity"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Motivo</label>
                    <textarea
                      v-model="stockForm.reason"
                      rows="3"
                      class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                      placeholder="Motivo do movimento..."
                    ></textarea>
                  </div>
                  
                  <div v-if="stockForm.type && stockForm.quantity" class="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                    <p class="text-sm text-blue-400">
                      <strong>Novo estoque:</strong> {{ calculateNewStock() }} {{ stockProduct.unit || 'un' }}
                    </p>
                  </div>
                  
                  <div class="flex space-x-3 pt-4">
                    <button 
                      type="button" 
                      @click="stockProduct = null" 
                      class="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      class="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="savingStock"
                    >
                      <span v-if="savingStock" class="flex items-center justify-center">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Salvando...
                      </span>
                      <span v-else>Confirmar</span>
                    </button>
                  </div>
                </form>
              </div>
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
        <div v-if="productToDelete" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
                  Tem certeza que deseja excluir o produto <span class="font-medium text-white">{{ productToDelete.name }}</span>? 
                  Esta ação não pode ser desfeita.
                </p>
                <div class="flex space-x-3">
                  <button 
                    @click="productToDelete = null" 
                    class="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    @click="deleteProduct" 
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
  PlusIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  TagIcon,
  PencilIcon, 
  TrashIcon, 
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useSeoMeta({
  title: 'Produtos - Coven Beauty',
  description: 'Gerenciamento de produtos e estoque do salão'
})

// Estado
const products = ref([])
const loading = ref(true)
const saving = ref(false)
const savingStock = ref(false)
const deleting = ref(false)

const searchTerm = ref('')
const categoryFilter = ref('')
const stockFilter = ref('')

const showCreateModal = ref(false)
const editingProduct = ref(null)
const productToDelete = ref(null)
const stockProduct = ref(null)

const productForm = reactive({
  name: '',
  description: '',
  type: '',
  unit: '',
  price: '',
  stock: '',
  minStock: 5
})

const stockForm = reactive({
  type: '',
  quantity: '',
  reason: ''
})

// Computed
const filteredProducts = computed(() => {
  let filtered = products.value

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term) ||
      product.type?.toLowerCase().includes(term)
    )
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(product => product.type === categoryFilter.value)
  }

  if (stockFilter.value) {
    filtered = filtered.filter(product => {
      const minStock = product.minStock || 5
      if (stockFilter.value === 'low') return product.stock <= minStock
      if (stockFilter.value === 'normal') return product.stock > minStock && product.stock <= minStock * 3
      if (stockFilter.value === 'high') return product.stock > minStock * 3
      return true
    })
  }

  return filtered.sort((a, b) => a.name.localeCompare(b.name))
})

const categories = computed(() => {
  const types = [...new Set(products.value.map(p => p.type).filter(Boolean))]
  return types.sort()
})

const lowStockCount = computed(() => {
  return products.value.filter(product => 
    product.stock <= (product.minStock || 5)
  ).length
})

const totalValue = computed(() => {
  return products.value.reduce((sum, product) => 
    sum + (parseFloat(product.price) || 0), 0
  )
})

// Métodos
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const getStockStatus = (product) => {
  const minStock = product.minStock || 5
  if (product.stock <= minStock) return 'Baixo'
  if (product.stock <= minStock * 3) return 'Normal'
  return 'Alto'
}

const getStockBadgeClass = (product) => {
  const minStock = product.minStock || 5
  if (product.stock <= minStock) return 'bg-red-900/50 text-red-400 border border-red-800'
  if (product.stock <= minStock * 3) return 'bg-yellow-900/50 text-yellow-400 border border-yellow-800'
  return 'bg-green-900/50 text-green-400 border border-green-800'
}

const getStockBarColor = (product) => {
  const minStock = product.minStock || 5
  if (product.stock <= minStock) return 'bg-red-500'
  if (product.stock <= minStock * 3) return 'bg-yellow-500'
  return 'bg-green-500'
}

const calculateNewStock = () => {
  if (!stockForm.type || !stockForm.quantity || !stockProduct.value) return 0
  
  const current = stockProduct.value.stock
  const quantity = parseFloat(stockForm.quantity)
  
  if (stockForm.type === 'IN') return current + quantity
  if (stockForm.type === 'OUT') return Math.max(0, current - quantity)
  if (stockForm.type === 'ADJUSTMENT') return quantity
  
  return current
}

const loadProducts = async () => {
  try {
    const { $api } = useNuxtApp()
    const toast = useToast()
    
    const response = await $api('/products', {
      method: 'GET'
    })
    
    products.value = Array.isArray(response) ? response : (response.data || [])
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
    const toast = useToast()
    toast.error('Erro ao carregar lista de produtos')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  Object.assign(productForm, {
    name: '',
    description: '',
    type: '',
    unit: '',
    price: '',
    stock: '',
    minStock: 5
  })
}

const resetStockForm = () => {
  Object.assign(stockForm, {
    type: '',
    quantity: '',
    reason: ''
  })
}

const editProduct = (product) => {
  editingProduct.value = product
  Object.assign(productForm, product)
  showCreateModal.value = false
}

const openStockModal = (product) => {
  stockProduct.value = product
  resetStockForm()
}

const closeModal = () => {
  showCreateModal.value = false
  editingProduct.value = null
  resetForm()
}

const saveProduct = async () => {
  saving.value = true
  
  try {
    const { $api } = useNuxtApp()
    const toast = useToast()
    
    const method = editingProduct.value ? 'PATCH' : 'POST'
    const url = editingProduct.value ? `/products/${editingProduct.value.id}` : '/products'
    
    const productData = {
      name: productForm.name.trim(),
      type: productForm.type,
      stock: parseInt(productForm.stock) || 0,
      minStock: parseInt(productForm.minStock) || 0
    }
    
    if (productForm.description && productForm.description.trim()) {
      productData.description = productForm.description.trim()
    }
    
    if (productForm.price && productForm.price !== '') {
      productData.price = parseFloat(productForm.price)
    }
    
    if (productForm.unit && productForm.unit.trim()) {
      productData.unit = productForm.unit.trim()
    }
    
    await $api(url, {
      method,
      body: productData
    })
    
    await loadProducts()
    closeModal()
    
    toast.success(
      editingProduct.value ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!'
    )
  } catch (error) {
    console.error('Erro ao salvar produto:', error)
    const toast = useToast()
    const errorMessage = error.response?.data?.message || 'Erro ao salvar produto'
    toast.error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage)
  } finally {
    saving.value = false
  }
}

const adjustStock = async () => {
  savingStock.value = true
  
  try {
    const { $api } = useNuxtApp()
    const toast = useToast()
    const token = useCookie('covenos-token')
    
    let endpoint, quantity
    
    if (stockForm.type === 'IN') {
      endpoint = `/products/${stockProduct.value.id}/stock/add`
      quantity = parseFloat(stockForm.quantity)
    } else if (stockForm.type === 'OUT') {
      endpoint = `/products/${stockProduct.value.id}/stock/remove`
      quantity = parseFloat(stockForm.quantity)
    } else if (stockForm.type === 'ADJUSTMENT') {
      const targetQuantity = parseFloat(stockForm.quantity)
      const currentStock = stockProduct.value.stock
      const difference = targetQuantity - currentStock
      
      if (difference > 0) {
        endpoint = `/products/${stockProduct.value.id}/stock/add`
        quantity = difference
      } else if (difference < 0) {
        endpoint = `/products/${stockProduct.value.id}/stock/remove`
        quantity = Math.abs(difference)
      } else {
        // Sem mudança necessária
        toast.success('Estoque já está no valor desejado!')
        return
      }
    } else {
      throw new Error('Tipo de movimento inválido')
    }
    
    await $api(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: {
        quantity,
        reason: stockForm.reason || `Movimento de estoque - ${stockForm.type}`
      }
    })
    
    await loadProducts()
    stockProduct.value = null
    resetStockForm()
    toast.success('Estoque ajustado com sucesso!')
  } catch (error) {
    console.error('Erro ao ajustar estoque:', error)
    const toast = useToast()
    toast.error('Erro ao ajustar estoque')
  } finally {
    savingStock.value = false
  }
}

const confirmDelete = (product) => {
  productToDelete.value = product
}

const deleteProduct = async () => {
  deleting.value = true
  
  try {
    const { $api } = useNuxtApp()
    const toast = useToast()
    
    await $api(`/products/${productToDelete.value.id}`, {
      method: 'DELETE'
    })
    
    await loadProducts()
    productToDelete.value = null
    toast.success('Produto excluído com sucesso!')
  } catch (error) {
    console.error('Erro ao excluir produto:', error)
    const toast = useToast()
    toast.error('Erro ao excluir produto')
  } finally {
    deleting.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadProducts()
})
</script>