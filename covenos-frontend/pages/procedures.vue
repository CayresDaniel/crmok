<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Procedimentos</h1>
        <p class="text-sm text-gray-400 mt-1">Gerencie os procedimentos e serviços oferecidos</p>
      </div>
      <button @click="showCreateModal = true" class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg shadow-purple-500/25">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Novo Procedimento
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400">Total de Procedimentos</p>
            <p class="text-2xl font-bold text-white mt-2">{{ procedures.length }}</p>
            <p class="text-xs text-gray-500 mt-1">cadastrados</p>
          </div>
          <div class="p-3 bg-purple-500/10 rounded-xl">
            <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400">Procedimentos Ativos</p>
            <p class="text-2xl font-bold text-white mt-2">{{ activeProcedures }}</p>
            <p class="text-xs text-gray-500 mt-1">disponíveis</p>
          </div>
          <div class="p-3 bg-green-500/10 rounded-xl">
            <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400">Duração Média</p>
            <p class="text-2xl font-bold text-white mt-2">{{ averageDuration }}min</p>
            <p class="text-xs text-gray-500 mt-1">por sessão</p>
          </div>
          <div class="p-3 bg-blue-500/10 rounded-xl">
            <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-400">Preço Médio</p>
            <p class="text-2xl font-bold text-white mt-2">{{ formatCurrency(averagePrice) }}</p>
            <p class="text-xs text-gray-500 mt-1">por procedimento</p>
          </div>
          <div class="p-3 bg-yellow-500/10 rounded-xl">
            <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar procedimentos..."
            class="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        <select v-model="categoryFilter" class="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors">
          <option value="">Todas as categorias</option>
          <option value="CORTE">Corte</option>
          <option value="TRATAMENTO">Tratamento</option>
          <option value="COLORACAO">Coloração</option>
          <option value="DESCOLORACAO">Descoloração</option>
          <option value="EPILACAO">Epilação</option>
          <option value="ESTETICA_FACIAL">Estética Facial</option>
          <option value="ESTETICA_CORPORAL">Estética Corporal</option>
        </select>
        <select v-model="statusFilter" class="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors">
          <option value="">Todos os status</option>
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </select>
      </div>
    </div>

    <!-- Procedures List -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="i in 6" :key="i" class="animate-pulse">
        <div class="bg-gray-800/50 h-64 rounded-xl"></div>
      </div>
    </div>
    
    <div v-else-if="filteredProcedures.length === 0" class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-16 text-center">
      <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
      </svg>
      <h3 class="text-lg font-semibold text-white mb-2">Nenhum procedimento encontrado</h3>
      <p class="text-gray-400">Crie um novo procedimento para começar</p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="procedure in filteredProcedures"
        :key="procedure.id"
        class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all duration-300 group"
      >
        <div class="p-6">
          <!-- Header with Badge -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors truncate">
                {{ procedure.name }}
              </h3>
              <p v-if="procedure.description" class="text-sm text-gray-400 mt-1 line-clamp-2">
                {{ procedure.description }}
              </p>
            </div>
            <span :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-3 flex-shrink-0',
              procedure.active ? 'bg-green-900/50 text-green-400 border border-green-800' : 'bg-red-900/50 text-red-400 border border-red-800'
            ]">
              {{ procedure.active ? 'Ativo' : 'Inativo' }}
            </span>
          </div>
          
          <!-- Category Badge -->
          <div class="mb-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800">
              {{ getCategoryText(procedure.category) }}
            </span>
          </div>
          
          <!-- Procedure Details -->
          <div class="space-y-3">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-400">Duração:</span>
              <span class="text-white font-medium">{{ procedure.duration }}min</span>
            </div>
            
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-400">Preço:</span>
              <span class="text-white font-semibold">{{ formatCurrency(procedure.price) }}</span>
            </div>
            
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-400">Produtos:</span>
              <span class="text-white">{{ (procedure.products?.length || procedure.procedureProducts?.length || 0) }} itens</span>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="flex items-center justify-between pt-4 mt-4 border-t border-gray-700">
            <button
              @click="toggleProcedureStatus(procedure)"
              :class="[
                'text-sm font-medium transition-colors',
                procedure.active ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'
              ]"
            >
              {{ procedure.active ? 'Desativar' : 'Ativar' }}
            </button>
            <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                @click="editProcedure(procedure)"
                class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
                title="Editar"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button
                @click="confirmDelete(procedure)"
                class="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all duration-200"
                title="Excluir"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
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
        <div v-if="showCreateModal || editingProcedure" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div class="bg-gray-900 border border-gray-800 rounded-xl shadow-xl w-full max-w-4xl my-8">
              <!-- Modal Header -->
              <div class="flex items-center justify-between p-6 border-b border-gray-800">
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                    </svg>
                  </div>
                  <h3 class="text-xl font-semibold text-white">
                    {{ editingProcedure ? 'Editar Procedimento' : 'Novo Procedimento' }}
                  </h3>
                </div>
                <button @click="closeModal" class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <!-- Modal Body -->
              <form @submit.prevent="saveProcedure" class="p-6 space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Nome do Procedimento *</label>
                    <input
                      v-model="procedureForm.name"
                      type="text"
                      required
                      class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="Nome do procedimento"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Categoria *</label>
                    <select v-model="procedureForm.category" required class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors">
                      <option value="">Selecione uma categoria</option>
                      <option value="CORTE">Corte</option>
                      <option value="TRATAMENTO">Tratamento</option>
                      <option value="COLORACAO">Coloração</option>
                      <option value="DESCOLORACAO">Descoloração</option>
                      <option value="EPILACAO">Epilação</option>
                      <option value="ESTETICA_FACIAL">Estética Facial</option>
                      <option value="ESTETICA_CORPORAL">Estética Corporal</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
                  <textarea
                    v-model="procedureForm.description"
                    rows="3"
                    class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    placeholder="Descrição do procedimento..."
                  ></textarea>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Duração (minutos) *</label>
                    <input
                      v-model="procedureForm.duration"
                      type="number"
                      required
                      min="1"
                      class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                      placeholder="60"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Preço *</label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">R$</span>
                      <input
                        v-model="procedureForm.price"
                        type="number"
                        step="0.01"
                        required
                        min="0"
                        class="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                        placeholder="0,00"
                      />
                    </div>
                  </div>
                </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Produtos Utilizados</label>
            
            <!-- Busca de produtos -->
            <div class="relative mb-4">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                v-model="productSearchTerm"
                type="text"
                placeholder="Buscar produtos..."
                class="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            
            <!-- Lista de produtos -->
            <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-4 max-h-64 overflow-y-auto">
              <div v-if="filteredProductsForModal.length === 0 && productSearchTerm" class="text-center py-4">
                <svg class="w-12 h-12 mx-auto text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <p class="text-gray-400">Nenhum produto encontrado</p>
                <p class="text-sm text-gray-500 mt-1">Tente buscar por outro termo</p>
              </div>
              
              <div v-else-if="products.length === 0" class="text-center py-8">
                <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
                <h3 class="text-lg font-semibold text-white mb-2">Nenhum produto disponível</h3>
                <p class="text-gray-400">Cadastre produtos na página de Produtos primeiro</p>
              </div>
              
              <div v-else class="space-y-2">
                <label
                  v-for="product in filteredProductsForModal"
                  :key="product.id"
                  class="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-all duration-200 group"
                >
                  <input
                    type="checkbox"
                    :value="product.id"
                    v-model="procedureForm.productIds"
                    class="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between">
                      <h4 class="text-white font-medium group-hover:text-purple-400 transition-colors">
                        {{ product.name }}
                      </h4>
                      <span class="text-xs px-2 py-1 bg-blue-900/30 text-blue-400 border border-blue-800 rounded-full">
                        {{ getProductTypeLabel(product.type) }}
                      </span>
                    </div>
                    <div class="flex items-center justify-between mt-1">
                      <p class="text-sm text-gray-400">
                        Estoque: {{ product.stock }} {{ product.unit || 'un' }}
                        <span v-if="product.type === 'USO_INTERNO' && product.unitQuantity" class="text-gray-500">
                          ({{ calculateTotalStock(product) }} {{ product.unitMeasurement }})
                        </span>
                      </p>
                      <p v-if="product.price" class="text-sm font-medium text-green-400">
                        {{ formatCurrency(product.price) }}
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
            
            <!-- Produtos selecionados -->
            <div v-if="procedureForm.productIds.length > 0" class="mt-4 p-4 bg-purple-900/20 border border-purple-800 rounded-lg">
              <h4 class="text-sm font-medium text-purple-400 mb-2">
                Produtos selecionados ({{ procedureForm.productIds.length }})
              </h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="productId in procedureForm.productIds"
                  :key="productId"
                  class="inline-flex items-center px-3 py-1 bg-purple-900/40 text-purple-300 text-sm rounded-full border border-purple-800"
                >
                  {{ products.find(p => p.id === productId)?.name }}
                  <button
                    @click="removeProduct(productId)"
                    class="ml-2 text-purple-400 hover:text-purple-300"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </span>
              </div>
              <p class="text-xs text-gray-400 mt-2">
                💡 A quantidade de cada produto será definida durante a execução da comanda
              </p>
            </div>
          </div>
                
                <div class="flex items-center space-x-3 p-4 bg-green-900/10 border border-green-800 rounded-lg">
                  <input
                    v-model="procedureForm.isActive"
                    type="checkbox"
                    id="isActive"
                    class="w-4 h-4 text-purple-600 bg-gray-800 border-gray-700 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <label for="isActive" class="text-sm text-gray-300">
                    <strong>Procedimento ativo</strong>
                    <br>
                    <span class="text-xs text-gray-400">
                      Procedimentos ativos ficam disponíveis para agendamento
                    </span>
                  </label>
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
                      {{ editingProcedure ? 'Atualizar' : 'Cadastrar' }}
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
        <div v-if="procedureToDelete" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
                  <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-white text-center mb-2">
                  Confirmar exclusão
                </h3>
                <p class="text-sm text-gray-400 text-center mb-6">
                  Tem certeza que deseja excluir o procedimento <span class="font-medium text-white">{{ procedureToDelete.name }}</span>? 
                  Esta ação não pode ser desfeita.
                </p>
                <div class="flex space-x-3">
                  <button 
                    @click="procedureToDelete = null" 
                    class="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    @click="deleteProcedure" 
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
const productSearchTerm = ref('')

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

const filteredProductsForModal = computed(() => {
  if (!productSearchTerm.value) return products.value
  
  const term = productSearchTerm.value.toLowerCase()
  return products.value.filter(product =>
    product.name.toLowerCase().includes(term) ||
    product.description?.toLowerCase().includes(term) ||
    product.type?.toLowerCase().includes(term)
  )
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
    TRATAMENTO: 'Tratamento',
    COLORACAO: 'Coloração',
    DESCOLORACAO: 'Descoloração',
    EPILACAO: 'Epilação',
    ESTETICA_FACIAL: 'Estética Facial',
    ESTETICA_CORPORAL: 'Estética Corporal'
  }
  return categories[category] || category
}

const getProductTypeLabel = (type) => {
  switch (type) {
    case 'USO_INTERNO': return 'Uso Interno'
    case 'VENDA_DIRETA': return 'Venda Direta'
    default: return type
  }
}

const calculateTotalStock = (product) => {
  if (product.type === 'USO_INTERNO' && product.unitQuantity) {
    return (product.stock * parseFloat(product.unitQuantity)).toFixed(2)
  }
  return product.stock
}

const removeProduct = (productId) => {
  const index = procedureForm.productIds.indexOf(productId)
  if (index > -1) {
    procedureForm.productIds.splice(index, 1)
  }
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
    
    // Debug: Verificar estrutura dos procedimentos
    if (procedures.value.length > 0) {
      console.log('📋 Estrutura do primeiro procedimento:', procedures.value[0])
      console.log('📋 Produtos do primeiro procedimento:')
      console.log('   - products:', procedures.value[0].products)
      console.log('   - procedureProducts:', procedures.value[0].procedureProducts)
    }
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
    isActive: true
  })
  productSearchTerm.value = ''
}

const editProcedure = (procedure) => {
  editingProcedure.value = procedure
  
  // Mapear produtos corretamente (pode vir como 'products' ou 'procedureProducts')
  let productIds = []
  if (procedure.products?.length) {
    productIds = procedure.products.map(p => p.id)
  } else if (procedure.procedureProducts?.length) {
    productIds = procedure.procedureProducts.map(pp => pp.productId || pp.product?.id).filter(Boolean)
  }
  
  Object.assign(procedureForm, {
    name: procedure.name,
    category: procedure.category,
    description: procedure.description || '',
    duration: procedure.duration,
    price: procedure.price,
    productIds,
    isActive: procedure.active
  })
  productSearchTerm.value = ''
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
    
    // Criar objeto apenas com os IDs dos produtos (sem quantidade)
    const procedureProducts = procedureForm.productIds.map(productId => ({
      productId
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
        // Tentar ambos os formatos: products e procedureProducts
        const existingProducts = editingProcedure.value.products || []
        const existingProcedureProducts = editingProcedure.value.procedureProducts || []
        
        // Desvincular produtos do formato 'products'
        for (const product of existingProducts) {
          try {
            await $api(`/procedures/${procedureId}/products/${product.id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token.value}` }
            })
          } catch (error) {
            console.warn('Erro ao desvincular produto:', product.id, error)
          }
        }
        
        // Desvincular produtos do formato 'procedureProducts'
        for (const pp of existingProcedureProducts) {
          const productId = pp.productId || pp.product?.id
          if (productId) {
            try {
              await $api(`/procedures/${procedureId}/products/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token.value}` }
              })
            } catch (error) {
              console.warn('Erro ao desvincular produto:', productId, error)
            }
          }
        }
      }
      
      // Vincular os novos produtos (sem quantidade definida)
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
    
    const toast = useToast()
    toast.success(
      editingProcedure.value ? 'Procedimento atualizado com sucesso!' : 'Procedimento criado com sucesso!'
    )
  } catch (error) {
    console.error('Erro ao salvar procedimento:', error)
    const toast = useToast()
    toast.error('Erro ao salvar procedimento')
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