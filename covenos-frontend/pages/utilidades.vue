<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Utilidades</h1>
        <p class="text-sm text-gray-400 mt-1">Lembretes e comunicação WhatsApp</p>
      </div>
    </div>

    <!-- Grid com 2 containers -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      
      <!-- Container de Lembretes -->
      <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl">
        <div class="p-6 border-b border-gray-800">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg">
                <BellIcon class="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 class="text-xl font-semibold text-white">Lembretes</h2>
                <p class="text-sm text-gray-400">Gerencie lembretes personalizados</p>
              </div>
            </div>
            <button 
              @click="showCreateReminderModal = true"
              class="inline-flex items-center px-3 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg font-medium hover:from-yellow-700 hover:to-orange-700 transition-all duration-200 shadow-lg shadow-yellow-500/25"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              Novo Lembrete
            </button>
          </div>
        </div>

        <!-- Filtros de Lembretes -->
        <div class="p-4 border-b border-gray-800 bg-gray-800/30">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <select v-model="reminderFilters.status" class="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-500 transition-colors">
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
                <option value="all">Todos</option>
              </select>
            </div>
            <div>
              <input
                v-model="reminderFilters.startDate"
                type="date"
                class="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-500 transition-colors"
              />
            </div>
            <div>
              <input
                v-model="reminderFilters.endDate"
                type="date"
                class="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <!-- Lista de Lembretes -->
        <div class="max-h-96 overflow-y-auto">
          <div v-if="loadingReminders" class="p-6">
            <div class="animate-pulse space-y-3">
              <div v-for="i in 3" :key="i" class="bg-gray-800/50 h-16 rounded-lg"></div>
            </div>
          </div>
          
          <div v-else-if="filteredReminders.length === 0" class="p-6 text-center">
            <BellIcon class="w-12 h-12 mx-auto text-gray-600 mb-3" />
            <p class="text-gray-400">Nenhum lembrete encontrado</p>
            <p class="text-sm text-gray-500 mt-1">Crie um novo lembrete para começar</p>
          </div>
          
          <div v-else class="p-4 space-y-3">
            <div
              v-for="reminder in filteredReminders"
              :key="reminder.id"
              class="flex items-start space-x-4 p-4 bg-gray-800/30 border border-gray-700 rounded-lg hover:border-gray-600 transition-all duration-200"
            >
              <div class="flex-shrink-0 mt-1">
                <div :class="[
                  'w-3 h-3 rounded-full',
                  reminder.isActive ? 'bg-yellow-500' : 'bg-gray-500'
                ]"></div>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                  <div>
                    <h4 class="text-white font-medium">{{ reminder.title }}</h4>
                    <p v-if="reminder.description" class="text-sm text-gray-400 mt-1">{{ reminder.description }}</p>
                    <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span class="flex items-center">
                        <CalendarIcon class="w-3 h-3 mr-1" />
                        {{ formatDate(reminder.date) }}
                      </span>
                      <span v-if="reminder.client" class="flex items-center">
                        <UserIcon class="w-3 h-3 mr-1" />
                        {{ reminder.client.name }}
                      </span>
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="getReminderTypeClass(reminder.type)">
                        {{ getReminderTypeText(reminder.type) }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-2 flex-shrink-0">
                    <button
                      @click="editReminder(reminder)"
                      class="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                    >
                      <PencilIcon class="w-4 h-4" />
                    </button>
                    <button
                      v-if="reminder.isActive"
                      @click="completeReminder(reminder.id)"
                      class="p-1 text-gray-400 hover:text-green-400 hover:bg-green-900/20 rounded transition-colors"
                    >
                      <CheckIcon class="w-4 h-4" />
                    </button>
                    <button
                      @click="deleteReminder(reminder.id)"
                      class="p-1 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Container WhatsApp Evolution API -->
      <div class="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl">
        <div class="p-6 border-b border-gray-800">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg">
                <ChatBubbleLeftRightIcon class="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 class="text-xl font-semibold text-white">WhatsApp Evolution</h2>
                <p class="text-sm text-gray-400">Comunicação automatizada</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <div class="flex items-center space-x-2">
                <div :class="[
                  'w-2 h-2 rounded-full',
                  connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 
                  connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 
                  'bg-red-500'
                ]"></div>
                <span :class="[
                  'text-xs font-medium',
                  connectionStatus === 'connected' ? 'text-green-400' : 
                  connectionStatus === 'connecting' ? 'text-yellow-400' : 
                  'text-red-400'
                ]">
                  {{ getConnectionStatusText() }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 space-y-6">
          <!-- Status da API -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-white">Status da Conexão</h3>
            <div class="p-4 bg-gray-800/30 rounded-lg">
              <div class="flex items-center justify-between mb-3">
                <span class="text-sm font-medium text-gray-300">Backend:</span>
                <div class="flex items-center space-x-2">
                  <div :class="[
                    'w-2 h-2 rounded-full',
                    connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
                  ]"></div>
                  <span :class="[
                    'text-xs font-medium',
                    connectionStatus === 'connected' ? 'text-green-400' : 'text-red-400'
                  ]">
                    {{ connectionStatus === 'connected' ? 'Conectado' : 'Desconectado' }}
                  </span>
                </div>
              </div>
              
              <div class="flex space-x-2">
                <button
                  @click="testConnection"
                  class="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors"
                  :disabled="loadingConnection"
                >
                  <span v-if="loadingConnection">Testando...</span>
                  <span v-else>Testar Conexão</span>
                </button>
                <button
                  @click="createInstance"
                  class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
                  :disabled="loadingInstance || connectionStatus !== 'connected'"
                >
                  <span v-if="loadingInstance">Criando...</span>
                  <span v-else>Criar/Conectar</span>
                </button>
              </div>
            </div>
          </div>

          <!-- QR Code Section -->
          <div v-if="showQRCode" class="space-y-4">
            <h3 class="text-lg font-medium text-white">📱 QR Code do WhatsApp</h3>
            <div class="p-4 bg-gray-800/30 rounded-lg text-center">
              <div class="mb-3">
                <p class="text-sm text-gray-300 mb-2">Escaneie este QR Code com seu WhatsApp:</p>
                <div class="flex justify-center">
                  <img :src="qrCode" alt="QR Code WhatsApp" class="max-w-xs rounded-lg border border-gray-600" />
                </div>
              </div>
              <div class="text-xs text-gray-500">
                <p>1. Abra o WhatsApp no seu celular</p>
                <p>2. Toque em Menu (⋮) > Aparelhos conectados</p>
                <p>3. Toque em "Conectar um aparelho"</p>
                <p>4. Aponte a câmera para este QR Code</p>
              </div>
              <button
                @click="showQRCode = false"
                class="mt-3 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
              >
                Fechar QR Code
              </button>
            </div>
          </div>
          
          <!-- Estatísticas dos Clientes -->
          <div v-if="clientsStats" class="space-y-3">
            <h3 class="text-lg font-medium text-white">📊 Estatísticas dos Clientes</h3>
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                <div class="text-2xl font-bold text-green-400">{{ clientsStats.clientsWithPhone || 0 }}</div>
                <div class="text-xs text-gray-400">Total com WhatsApp</div>
              </div>
              <div class="p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                <div class="text-2xl font-bold text-pink-400">{{ clientsStats.todayBirthdays || 0 }}</div>
                <div class="text-xs text-gray-400">Aniversariantes hoje</div>
              </div>
            </div>
          </div>

          <!-- Funcionalidades de Automação -->
          <div class="space-y-3">
            <h3 class="text-lg font-medium text-white">🤖 Envios Automáticos</h3>
            
            <!-- Botões de Envio Automático -->
            <div class="space-y-2">
              <div class="grid grid-cols-1 gap-2">
                <button
                  @click="showAutoBirthdayModal = true"
                  class="flex items-center justify-between p-3 bg-gradient-to-r from-pink-600/20 to-rose-600/20 hover:from-pink-600/30 hover:to-rose-600/30 border border-pink-700/50 rounded-lg transition-colors"
                  :disabled="connectionStatus !== 'connected'"
                >
                  <div class="flex items-center space-x-2">
                    <GiftIcon class="w-4 h-4 text-pink-400" />
                    <div class="text-left">
                      <div class="text-sm text-white font-medium">🎂 Aniversariantes (Automático)</div>
                      <div class="text-xs text-gray-400">Busca da tabela de clientes</div>
                    </div>
                  </div>
                  <ChevronRightIcon class="w-4 h-4 text-gray-400" />
                </button>

                <button
                  @click="showAutoCampaignModal = true"
                  class="flex items-center justify-between p-3 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 border border-blue-700/50 rounded-lg transition-colors"
                  :disabled="connectionStatus !== 'connected'"
                >
                  <div class="flex items-center space-x-2">
                    <SpeakerWaveIcon class="w-4 h-4 text-blue-400" />
                    <div class="text-left">
                      <div class="text-sm text-white font-medium">📢 Campanha (Automática)</div>
                      <div class="text-xs text-gray-400">Para todos os clientes com WhatsApp</div>
                    </div>
                  </div>
                  <ChevronRightIcon class="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          <!-- Funcionalidades Manuais -->
          <div class="space-y-3">
            <h3 class="text-lg font-medium text-white">✋ Envios Manuais</h3>
            
            <!-- Botões de Envio Manual -->
            <div class="space-y-2">
              <div class="grid grid-cols-1 gap-2">
                <button
                  @click="showBirthdayModal = true"
                  class="flex items-center justify-between p-3 bg-gradient-to-r from-pink-600/20 to-rose-600/20 hover:from-pink-600/30 hover:to-rose-600/30 border border-pink-700/50 rounded-lg transition-colors"
                  :disabled="connectionStatus !== 'connected'"
                >
                  <div class="flex items-center space-x-2">
                    <GiftIcon class="w-4 h-4 text-pink-400" />
                    <span class="text-sm text-white font-medium">Mensagens de Aniversário</span>
                  </div>
                  <ChevronRightIcon class="w-4 h-4 text-gray-400" />
                </button>

                <button
                  @click="showCampaignModal = true"
                  class="flex items-center justify-between p-3 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 border border-blue-700/50 rounded-lg transition-colors"
                  :disabled="connectionStatus !== 'connected'"
                >
                  <div class="flex items-center space-x-2">
                    <SpeakerWaveIcon class="w-4 h-4 text-blue-400" />
                    <span class="text-sm text-white font-medium">Campanha Personalizada</span>
                  </div>
                  <ChevronRightIcon class="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Mensagens de Aniversário -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showBirthdayModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div class="bg-gray-900 border border-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <!-- Modal Header -->
              <div class="flex items-center justify-between p-6 border-b border-gray-800">
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-gradient-to-br from-pink-600 to-rose-600 rounded-lg">
                    <GiftIcon class="w-5 h-5 text-white" />
                  </div>
                  <h3 class="text-xl font-semibold text-white">🎂 Mensagens de Aniversário</h3>
                </div>
                <button @click="showBirthdayModal = false" class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>
              
              <!-- Modal Body -->
              <div class="p-6 space-y-6">
                <!-- Formulário -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">📞 Contatos (um por linha)</label>
                    <textarea
                      v-model="birthdayForm.contacts"
                      placeholder="5511999999999&#10;5511888888888&#10;5511777777777"
                      class="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors resize-none h-32"
                    ></textarea>
                    <p class="text-xs text-gray-500 mt-1">Digite os números no formato: 5511999999999 (código do país + DDD + número)</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">💌 Mensagem de Aniversário</label>
                    <textarea
                      v-model="birthdayForm.message"
                      placeholder="🎉 Parabéns pelo seu aniversário! Que este novo ano seja repleto de alegrias e realizações! 🎂"
                      class="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors resize-none h-24"
                    ></textarea>
                  </div>
                  
                  <button
                    @click="sendBirthdayMessages"
                    :disabled="!birthdayForm.message || !birthdayForm.contacts || sendingBirthday"
                    class="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div v-if="sendingBirthday" class="flex items-center space-x-2">
                      <div class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Enviando...</span>
                    </div>
                    <div v-else class="flex items-center space-x-2">
                      <GiftIcon class="w-4 h-4" />
                      <span>🎂 Enviar Mensagens de Aniversário</span>
                    </div>
                  </button>
                </div>

                <!-- Resultados -->
                <div v-if="birthdayResults.length > 0" class="space-y-3">
                  <h4 class="text-lg font-medium text-white">📊 Resultados do Envio</h4>
                  <div class="space-y-2 max-h-60 overflow-y-auto">
                    <div
                      v-for="(result, index) in birthdayResults"
                      :key="index"
                      class="flex items-center justify-between p-3 bg-gray-800/20 border border-gray-700 rounded text-sm"
                    >
                      <div class="flex items-center space-x-3">
                        <div :class="[
                          'w-2 h-2 rounded-full',
                          result.success ? 'bg-green-500' : 'bg-red-500'
                        ]"></div>
                        <span class="text-gray-300">{{ result.contact }}</span>
                      </div>
                      <span :class="[
                        'text-xs px-2 py-1 rounded font-medium',
                        result.success ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                      ]">
                        {{ result.success ? '✅ Enviado' : '❌ Erro' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal de Campanha -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showCampaignModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div class="bg-gray-900 border border-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <!-- Modal Header -->
              <div class="flex items-center justify-between p-6 border-b border-gray-800">
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                    <SpeakerWaveIcon class="w-5 h-5 text-white" />
                  </div>
                  <h3 class="text-xl font-semibold text-white">🎯 Campanha Personalizada</h3>
                </div>
                <button @click="showCampaignModal = false" class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>
              
              <!-- Modal Body -->
              <div class="p-6 space-y-6">
                <!-- Formulário -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">📞 Contatos (um por linha)</label>
                    <textarea
                      v-model="campaignForm.contacts"
                      placeholder="5511999999999&#10;5511888888888&#10;5511777777777"
                      class="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none h-32"
                    ></textarea>
                    <p class="text-xs text-gray-500 mt-1">Digite os números no formato: 5511999999999 (código do país + DDD + número)</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">📢 Mensagem da Campanha</label>
                    <textarea
                      v-model="campaignForm.message"
                      placeholder="🔥 PROMOÇÃO ESPECIAL! 50% OFF em todos os produtos! Use o cupom: PROMO50. Válido até 31/12/2024 🛍️"
                      class="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none h-24"
                    ></textarea>
                  </div>
                  
                  <button
                    @click="sendCampaignMessages"
                    :disabled="!campaignForm.message || !campaignForm.contacts || sendingCampaign"
                    class="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div v-if="sendingCampaign" class="flex items-center space-x-2">
                      <div class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Enviando...</span>
                    </div>
                    <div v-else class="flex items-center space-x-2">
                      <SpeakerWaveIcon class="w-4 h-4" />
                      <span>🎯 Enviar Campanha</span>
                    </div>
                  </button>
                </div>

                <!-- Resultados -->
                <div v-if="campaignResults.length > 0" class="space-y-3">
                  <h4 class="text-lg font-medium text-white">📊 Resultados do Envio</h4>
                  <div class="space-y-2 max-h-60 overflow-y-auto">
                    <div
                      v-for="(result, index) in campaignResults"
                      :key="index"
                      class="flex items-center justify-between p-3 bg-gray-800/20 border border-gray-700 rounded text-sm"
                    >
                      <div class="flex items-center space-x-3">
                        <div :class="[
                          'w-2 h-2 rounded-full',
                          result.success ? 'bg-green-500' : 'bg-red-500'
                        ]"></div>
                        <span class="text-gray-300">{{ result.contact }}</span>
                      </div>
                      <span :class="[
                        'text-xs px-2 py-1 rounded font-medium',
                        result.success ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                      ]">
                        {{ result.success ? '✅ Enviado' : '❌ Erro' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal de Aniversário Automático -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showAutoBirthdayModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div class="bg-gray-900 border border-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <!-- Modal Header -->
              <div class="flex items-center justify-between p-6 border-b border-gray-800">
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-gradient-to-br from-pink-600 to-rose-600 rounded-lg">
                    <GiftIcon class="w-5 h-5 text-white" />
                  </div>
                  <h3 class="text-xl font-semibold text-white">🎂 Aniversariantes Automático</h3>
                </div>
                <button @click="showAutoBirthdayModal = false" class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>
              
              <!-- Modal Body -->
              <div class="p-6 space-y-6">
                <!-- Info dos Aniversariantes -->
                <div v-if="todayBirthdayClients.length > 0" class="space-y-3">
                  <h4 class="text-lg font-medium text-white">🎉 Aniversariantes de hoje ({{ todayBirthdayClients.length }})</h4>
                  <div class="max-h-32 overflow-y-auto space-y-2">
                    <div
                      v-for="client in todayBirthdayClients"
                      :key="client.id"
                      class="flex items-center justify-between p-2 bg-gray-800/20 border border-gray-700 rounded text-sm"
                    >
                      <span class="text-gray-300">{{ client.name }}</span>
                      <span class="text-gray-400">{{ formatPhone(client.phone) }}</span>
                    </div>
                  </div>
                </div>

                <div v-else class="text-center py-8">
                  <GiftIcon class="w-12 h-12 mx-auto text-gray-600 mb-3" />
                  <p class="text-gray-400">Nenhum aniversariante encontrado hoje</p>
                  <p class="text-sm text-gray-500 mt-1">As mensagens serão enviadas apenas quando houver aniversariantes</p>
                </div>

                <!-- Formulário -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">💌 Mensagem de Aniversário</label>
                    <textarea
                      v-model="autoBirthdayForm.message"
                      placeholder="🎉 Parabéns pelo seu aniversário, [NOME]! Que este novo ano seja repleto de alegrias e realizações! 🎂"
                      class="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 transition-colors resize-none h-24"
                    ></textarea>
                    <p class="text-xs text-gray-500 mt-1">Use [NOME] para personalizar com o nome do cliente</p>
                  </div>
                  
                  <button
                    @click="sendAutoBirthdayMessages"
                    :disabled="!autoBirthdayForm.message || sendingAutoBirthday || todayBirthdayClients.length === 0"
                    class="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div v-if="sendingAutoBirthday" class="flex items-center space-x-2">
                      <div class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Enviando...</span>
                    </div>
                    <div v-else class="flex items-center space-x-2">
                      <GiftIcon class="w-4 h-4" />
                      <span>🎂 Enviar para {{ todayBirthdayClients.length }} Aniversariante(s)</span>
                    </div>
                  </button>
                </div>

                <!-- Resultados -->
                <div v-if="autoBirthdayResults.length > 0" class="space-y-3">
                  <h4 class="text-lg font-medium text-white">📊 Resultados do Envio</h4>
                  <div class="space-y-2 max-h-60 overflow-y-auto">
                    <div
                      v-for="(result, index) in autoBirthdayResults"
                      :key="index"
                      class="flex items-center justify-between p-3 bg-gray-800/20 border border-gray-700 rounded text-sm"
                    >
                      <div class="flex items-center space-x-3">
                        <div :class="[
                          'w-2 h-2 rounded-full',
                          result.success ? 'bg-green-500' : 'bg-red-500'
                        ]"></div>
                        <span class="text-gray-300">{{ result.name || result.contact }}</span>
                      </div>
                      <span :class="[
                        'text-xs px-2 py-1 rounded font-medium',
                        result.success ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                      ]">
                        {{ result.success ? '✅ Enviado' : '❌ Erro' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal de Campanha Automática -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showAutoCampaignModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div class="bg-gray-900 border border-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <!-- Modal Header -->
              <div class="flex items-center justify-between p-6 border-b border-gray-800">
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                    <SpeakerWaveIcon class="w-5 h-5 text-white" />
                  </div>
                  <h3 class="text-xl font-semibold text-white">📢 Campanha Automática</h3>
                </div>
                <button @click="showAutoCampaignModal = false" class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>
              
              <!-- Modal Body -->
              <div class="p-6 space-y-6">
                <!-- Info dos Clientes -->
                <div class="space-y-3">
                  <h4 class="text-lg font-medium text-white">👥 Clientes com WhatsApp</h4>
                  <div class="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                    <div class="flex items-center justify-between">
                      <span class="text-gray-300">Total de clientes:</span>
                      <span class="text-white font-semibold">{{ clientsStats?.clientsWithPhone || 0 }}</span>
                    </div>
                    <p class="text-xs text-gray-500 mt-2">A mensagem será enviada para todos os clientes cadastrados com WhatsApp</p>
                  </div>
                </div>

                <!-- Formulário -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">📢 Mensagem da Campanha</label>
                    <textarea
                      v-model="autoCampaignForm.message"
                      placeholder="🔥 PROMOÇÃO ESPECIAL! 50% OFF em todos os serviços! Use o cupom: PROMO50. Válido até 31/12/2024 🛍️"
                      class="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none h-24"
                    ></textarea>
                  </div>
                  
                  <button
                    @click="sendAutoCampaignMessages"
                    :disabled="!autoCampaignForm.message || sendingAutoCampaign || !clientsStats?.clientsWithPhone"
                    class="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div v-if="sendingAutoCampaign" class="flex items-center space-x-2">
                      <div class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Enviando...</span>
                    </div>
                    <div v-else class="flex items-center space-x-2">
                      <SpeakerWaveIcon class="w-4 h-4" />
                      <span>📢 Enviar para {{ clientsStats?.clientsWithPhone || 0 }} Cliente(s)</span>
                    </div>
                  </button>
                </div>

                <!-- Resultados -->
                <div v-if="autoCampaignResults.length > 0" class="space-y-3">
                  <h4 class="text-lg font-medium text-white">📊 Resultados do Envio</h4>
                  <div class="space-y-2 max-h-60 overflow-y-auto">
                    <div
                      v-for="(result, index) in autoCampaignResults"
                      :key="index"
                      class="flex items-center justify-between p-3 bg-gray-800/20 border border-gray-700 rounded text-sm"
                    >
                      <div class="flex items-center space-x-3">
                        <div :class="[
                          'w-2 h-2 rounded-full',
                          result.success ? 'bg-green-500' : 'bg-red-500'
                        ]"></div>
                        <span class="text-gray-300">{{ formatPhone(result.contact) }}</span>
                      </div>
                      <span :class="[
                        'text-xs px-2 py-1 rounded font-medium',
                        result.success ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                      ]">
                        {{ result.success ? '✅ Enviado' : '❌ Erro' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal de Criar/Editar Lembrete -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showCreateReminderModal || editingReminder" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div class="bg-gray-900 border border-gray-800 rounded-xl shadow-xl w-full max-w-md">
              <!-- Modal Header -->
              <div class="flex items-center justify-between p-6 border-b border-gray-800">
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg">
                    <BellIcon class="w-5 h-5 text-white" />
                  </div>
                  <h3 class="text-xl font-semibold text-white">
                    {{ editingReminder ? 'Editar Lembrete' : 'Novo Lembrete' }}
                  </h3>
                </div>
                <button @click="closeReminderModal" class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>
              
              <!-- Modal Body -->
              <form @submit.prevent="saveReminder" class="p-6 space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Título *</label>
                  <input
                    v-model="reminderForm.title"
                    type="text"
                    required
                    class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                    placeholder="Título do lembrete"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
                  <select v-model="reminderForm.type" class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors">
                    <option value="MANUAL">Manual</option>
                    <option value="ANIVERSARIO">Aniversário</option>
                    <option value="AGENDAMENTO">Agendamento</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Data e Hora *</label>
                  <input
                    v-model="reminderForm.date"
                    type="datetime-local"
                    required
                    class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Cliente (Opcional)</label>
                  <select v-model="reminderForm.clientId" class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors">
                    <option value="">Selecione um cliente</option>
                    <option v-for="client in clients" :key="client.id" :value="client.id">
                      {{ client.name }}
                    </option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
                  <textarea
                    v-model="reminderForm.description"
                    rows="3"
                    class="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                    placeholder="Descrição opcional do lembrete..."
                  ></textarea>
                </div>
                
                <!-- Modal Footer -->
                <div class="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button" 
                    @click="closeReminderModal" 
                    class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    class="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="savingReminder"
                  >
                    <span v-if="savingReminder" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Salvando...
                    </span>
                    <span v-else>
                      {{ editingReminder ? 'Atualizar' : 'Salvar' }}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { 
  BellIcon,
  PlusIcon,
  CalendarIcon,
  UserIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  GiftIcon,
  SpeakerWaveIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

useSeoMeta({
  title: 'Utilidades - Coven Beauty',
  description: 'Lembretes e comunicação WhatsApp CRM'
})

// Estado dos lembretes
const reminders = ref([])
const clients = ref([])
const loadingReminders = ref(true)
const savingReminder = ref(false)

const showCreateReminderModal = ref(false)
const editingReminder = ref(null)

const reminderFilters = reactive({
  status: 'active',
  startDate: '',
  endDate: '',
  type: '',
  clientId: ''
})

const reminderForm = reactive({
  title: '',
  type: 'MANUAL',
  date: '',
  clientId: '',
  description: ''
})

// Estado Evolution API
const connectionStatus = ref('disconnected')
const loadingConnection = ref(false)
const loadingInstance = ref(false)

// Modais
const showBirthdayModal = ref(false)
const showCampaignModal = ref(false)
const showAutoBirthdayModal = ref(false)
const showAutoCampaignModal = ref(false)

// Formulários de mensagem
const birthdayForm = reactive({
  contacts: '',
  message: ''
})

const campaignForm = reactive({
  contacts: '',
  message: ''
})

const autoBirthdayForm = reactive({
  message: '🎉 Parabéns pelo seu aniversário! Que este novo ano seja repleto de alegrias, saúde e muita beleza! 🎂✨'
})

const autoCampaignForm = reactive({
  message: '🔥 PROMOÇÃO ESPECIAL! 50% OFF em todos os serviços! Agende já o seu horário! 💅✨'
})

// Estados de envio
const sendingBirthday = ref(false)
const sendingCampaign = ref(false)
const sendingAutoBirthday = ref(false)
const sendingAutoCampaign = ref(false)
const birthdayResults = ref([])
const campaignResults = ref([])
const autoBirthdayResults = ref([])
const autoCampaignResults = ref([])

// Dados dos clientes
const clientsStats = ref(null)
const todayBirthdayClients = ref([])

// QR Code
const qrCode = ref('')
const showQRCode = ref(false)

// Computed
const filteredReminders = computed(() => {
  let filtered = reminders.value

  // Filtro por status
  if (reminderFilters.status !== 'all') {
    filtered = filtered.filter(r => {
      if (reminderFilters.status === 'active') {
        return r.isActive
      } else {
        return !r.isActive
      }
    })
  }

  // Filtro por data
  if (reminderFilters.startDate) {
    filtered = filtered.filter(r => new Date(r.date) >= new Date(reminderFilters.startDate))
  }
  if (reminderFilters.endDate) {
    filtered = filtered.filter(r => new Date(r.date) <= new Date(reminderFilters.endDate))
  }

  return filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
})

// Métodos dos lembretes
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getReminderTypeClass = (type) => {
  const classes = {
    MANUAL: 'bg-blue-900/50 text-blue-400 border border-blue-800',
    ANIVERSARIO: 'bg-pink-900/50 text-pink-400 border border-pink-800',
    AGENDAMENTO: 'bg-purple-900/50 text-purple-400 border border-purple-800'
  }
  return classes[type] || 'bg-gray-900/50 text-gray-400 border border-gray-800'
}

const getReminderTypeText = (type) => {
  const texts = {
    MANUAL: 'Manual',
    ANIVERSARIO: 'Aniversário',
    AGENDAMENTO: 'Agendamento'
  }
  return texts[type] || type
}

// Funções Evolution API
const getConnectionStatusText = () => {
  const statusTexts = {
    connected: 'Conectado',
    connecting: 'Conectando...',
    disconnected: 'Desconectado'
  }
  return statusTexts[connectionStatus.value] || 'Desconhecido'
}

const testConnection = async () => {
  loadingConnection.value = true
  connectionStatus.value = 'connecting'
  
  try {
    const response = await $fetch('http://localhost:3009/api/messages/status')
    
    if (response) {
      connectionStatus.value = 'connected'
      const toast = useToast()
      toast.success('Conexão com Evolution API estabelecida!')
    }
  } catch (error) {
    console.error('Erro ao testar conexão:', error)
    connectionStatus.value = 'disconnected'
    const toast = useToast()
    toast.error('Erro ao conectar com Evolution API. Verifique se o backend está rodando.')
  } finally {
    loadingConnection.value = false
  }
}

const createInstance = async () => {
  loadingInstance.value = true
  
  try {
    const createResponse = await $fetch('http://localhost:3009/api/messages/create-instance', {
      method: 'POST'
    })
    
    const connectResponse = await $fetch('http://localhost:3009/api/messages/connect', {
      method: 'POST'
    })
    
    // Extrair QR Code da resposta
    if (connectResponse.qrcode) {
      qrCode.value = connectResponse.qrcode
      showQRCode.value = true
    }
    
    const toast = useToast()
    toast.success('Instância criada! Escaneie o QR Code abaixo')
  } catch (error) {
    console.error('Erro ao criar instância:', error)
    const toast = useToast()
    toast.error('Erro ao criar instância WhatsApp')
  } finally {
    loadingInstance.value = false
  }
}

// Função para enviar mensagens de aniversário
const sendBirthdayMessages = async () => {
  if (!birthdayForm.message || !birthdayForm.contacts) {
    const toast = useToast()
    toast.error('Preencha todos os campos!')
    return
  }

  sendingBirthday.value = true
  birthdayResults.value = []

  try {
    const contacts = birthdayForm.contacts
      .split('\n')
      .map(contact => contact.trim())
      .filter(contact => contact !== '')

    const response = await $fetch('http://localhost:3009/api/messages/send-birthday', {
      method: 'POST',
      body: {
        contacts,
        message: birthdayForm.message
      }
    })

    birthdayResults.value = response.results || []
    
    const successCount = birthdayResults.value.filter(r => r.success).length
    const totalCount = birthdayResults.value.length
    
    const toast = useToast()
    toast.success(`${successCount}/${totalCount} mensagens de aniversário enviadas!`)
    
    // Limpar formulário
    birthdayForm.contacts = ''
    birthdayForm.message = ''
    
  } catch (error) {
    console.error('Erro ao enviar mensagens:', error)
    const toast = useToast()
    toast.error(`Erro ao enviar mensagens: ${error.message}`)
  } finally {
    sendingBirthday.value = false
  }
}

// Função para enviar campanhas
const sendCampaignMessages = async () => {
  if (!campaignForm.message || !campaignForm.contacts) {
    const toast = useToast()
    toast.error('Preencha todos os campos!')
    return
  }

  sendingCampaign.value = true
  campaignResults.value = []

  try {
    const contacts = campaignForm.contacts
      .split('\n')
      .map(contact => contact.trim())
      .filter(contact => contact !== '')

    const response = await $fetch('http://localhost:3009/api/messages/send-campaign', {
      method: 'POST',
      body: {
        contacts,
        message: campaignForm.message
      }
    })

    campaignResults.value = response.results || []
    
    const successCount = campaignResults.value.filter(r => r.success).length
    const totalCount = campaignResults.value.length
    
    const toast = useToast()
    toast.success(`${successCount}/${totalCount} mensagens de campanha enviadas!`)
    
    // Limpar formulário
    campaignForm.contacts = ''
    campaignForm.message = ''
    
  } catch (error) {
    console.error('Erro ao enviar mensagens:', error)
    const toast = useToast()
    toast.error(`Erro ao enviar mensagens: ${error.message}`)
  } finally {
    sendingCampaign.value = false
  }
}

// Função para enviar aniversários automático
const sendAutoBirthdayMessages = async () => {
  if (!autoBirthdayForm.message) {
    const toast = useToast()
    toast.error('Preencha a mensagem!')
    return
  }

  sendingAutoBirthday.value = true
  autoBirthdayResults.value = []

  try {
    const response = await $fetch('http://localhost:3009/api/messages/send-birthday-auto', {
      method: 'POST',
      body: {
        message: autoBirthdayForm.message
      }
    })

    autoBirthdayResults.value = response.results || []
    
    const successCount = response.totalSent || 0
    const totalCount = response.clients?.length || 0
    
    const toast = useToast()
    if (totalCount === 0) {
      toast.info('Nenhum aniversariante encontrado hoje!')
    } else {
      toast.success(`${successCount}/${totalCount} mensagens de aniversário enviadas!`)
    }
    
    // Mostrar nomes dos aniversariantes nos resultados
    if (response.clients) {
      autoBirthdayResults.value = response.results.map((result, index) => ({
        ...result,
        name: response.clients[index]?.name || result.contact
      }))
    }
    
  } catch (error) {
    console.error('Erro ao enviar mensagens:', error)
    const toast = useToast()
    toast.error(`Erro ao enviar mensagens: ${error.message}`)
  } finally {
    sendingAutoBirthday.value = false
  }
}

// Função para enviar campanha automática
const sendAutoCampaignMessages = async () => {
  if (!autoCampaignForm.message) {
    const toast = useToast()
    toast.error('Preencha a mensagem!')
    return
  }

  sendingAutoCampaign.value = true
  autoCampaignResults.value = []

  try {
    const response = await $fetch('http://localhost:3009/api/messages/send-campaign-auto', {
      method: 'POST',
      body: {
        message: autoCampaignForm.message
      }
    })

    autoCampaignResults.value = response.results || []
    
    const successCount = response.totalSent || 0
    const totalCount = autoCampaignResults.value.length
    
    const toast = useToast()
    toast.success(`${successCount}/${totalCount} mensagens de campanha enviadas!`)
    
  } catch (error) {
    console.error('Erro ao enviar mensagens:', error)
    const toast = useToast()
    toast.error(`Erro ao enviar mensagens: ${error.message}`)
  } finally {
    sendingAutoCampaign.value = false
  }
}

// Função para carregar estatísticas dos clientes
const loadClientsStats = async () => {
  try {
    const response = await $fetch('http://localhost:3009/api/messages/clients/stats')
    clientsStats.value = response.data || {}
    console.log('📊 Estatísticas dos clientes:', clientsStats.value)
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error)
  }
}

// Função para carregar aniversariantes do dia
const loadTodayBirthdays = async () => {
  try {
    const response = await $fetch('http://localhost:3009/api/messages/clients/birthday-today')
    todayBirthdayClients.value = response.data || []
    console.log('🎂 Aniversariantes hoje:', todayBirthdayClients.value)
  } catch (error) {
    console.error('Erro ao carregar aniversariantes:', error)
  }
}

// Função para formatar telefone
const formatPhone = (phone) => {
  if (!phone) return ''
  // Remove + e mostra formato brasileiro
  const clean = phone.replace(/\D/g, '')
  if (clean.startsWith('55')) {
    const number = clean.substring(2)
    if (number.length === 11) {
      return `(${number.substring(0, 2)}) ${number.substring(2, 7)}-${number.substring(7)}`
    }
  }
  return phone
}

// Métodos dos lembretes
const loadReminders = async () => {
  try {
    const { $api } = useNuxtApp()
    
    console.log('🔄 Carregando lembretes...')
    
    const [remindersRes, clientsRes] = await Promise.all([
      $api('/reminders', {
        method: 'GET',
        query: {
          status: reminderFilters.status,
          startDate: reminderFilters.startDate || undefined,
          endDate: reminderFilters.endDate || undefined,
          type: reminderFilters.type || undefined,
          clientId: reminderFilters.clientId || undefined
        }
      }).catch((error) => {
        console.error('❌ Erro ao carregar lembretes:', error)
        return []
      }),
      $api('/clients').catch((error) => {
        console.error('❌ Erro ao carregar clientes:', error)
        return []
      })
    ])
    
    reminders.value = remindersRes || []
    clients.value = clientsRes || []
    
    console.log('✅ Lembretes carregados:', reminders.value.length)
    
  } catch (error) {
    console.error('💥 Erro ao carregar dados:', error)
  } finally {
    loadingReminders.value = false
  }
}

const resetReminderForm = () => {
  Object.assign(reminderForm, {
    title: '',
    type: 'MANUAL',
    date: '',
    clientId: '',
    description: ''
  })
}

const editReminder = (reminder) => {
  editingReminder.value = reminder
  Object.assign(reminderForm, {
    title: reminder.title,
    type: reminder.type,
    date: reminder.date ? new Date(reminder.date).toISOString().slice(0, 16) : '',
    clientId: reminder.clientId || '',
    description: reminder.description || ''
  })
  showCreateReminderModal.value = false
}

const closeReminderModal = () => {
  showCreateReminderModal.value = false
  editingReminder.value = null
  resetReminderForm()
}

const saveReminder = async () => {
  savingReminder.value = true
  
  try {
    const { $api } = useNuxtApp()
    const toast = useToast()
    
    const payload = {
      title: reminderForm.title,
      type: reminderForm.type,
      date: new Date(reminderForm.date).toISOString(),
      clientId: reminderForm.clientId || undefined,
      description: reminderForm.description || undefined
    }
    
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined || payload[key] === '') {
        delete payload[key]
      }
    })
    
    console.log('💾 Salvando lembrete:', payload)
    
    const method = editingReminder.value ? 'PATCH' : 'POST'
    const url = editingReminder.value 
      ? `/reminders/${editingReminder.value.id}` 
      : '/reminders'
    
    await $api(url, {
      method,
      body: payload
    })
    
    await loadReminders()
    closeReminderModal()
    toast.success(editingReminder.value ? 'Lembrete atualizado!' : 'Lembrete criado!')
  } catch (error) {
    console.error('💥 Erro ao salvar lembrete:', error)
    const toast = useToast()
    toast.error('Erro ao salvar lembrete')
  } finally {
    savingReminder.value = false
  }
}

const completeReminder = async (reminderId) => {
  try {
    const { $api } = useNuxtApp()
    const toast = useToast()
    
    await $api(`/reminders/${reminderId}/complete`, {
      method: 'PATCH'
    })
    
    await loadReminders()
    toast.success('Lembrete marcado como concluído!')
  } catch (error) {
    console.error('💥 Erro ao completar lembrete:', error)
    const toast = useToast()
    toast.error('Erro ao completar lembrete')
  }
}

const deleteReminder = async (reminderId) => {
  if (!confirm('Tem certeza que deseja excluir este lembrete?')) {
    return
  }
  
  try {
    const { $api } = useNuxtApp()
    const toast = useToast()
    
    await $api(`/reminders/${reminderId}`, {
      method: 'DELETE'
    })
    
    await loadReminders()
    toast.success('Lembrete excluído!')
  } catch (error) {
    console.error('💥 Erro ao excluir lembrete:', error)
    const toast = useToast()
    toast.error('Erro ao excluir lembrete')
  }
}

// Watch para recarregar lembretes quando filtros mudarem
watch(reminderFilters, () => {
  loadReminders()
}, { deep: true })

// Watchers para recarregar dados quando modais abrem
watch(showAutoBirthdayModal, (isOpen) => {
  if (isOpen) {
    loadTodayBirthdays()
  }
})

watch(showAutoCampaignModal, (isOpen) => {
  if (isOpen) {
    loadClientsStats()
  }
})

// Lifecycle
onMounted(() => {
  loadReminders()
  
  // Testar conexão automaticamente
  testConnection()
  
  // Carregar estatísticas dos clientes
  loadClientsStats()
  loadTodayBirthdays()
})
</script>