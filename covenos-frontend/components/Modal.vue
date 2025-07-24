<template>
  <Teleport to="body">
    <div v-if="show" class="modal-backdrop" @click="handleBackdropClick">
      <div 
        :class="modalClasses"
        @click.stop
      >
        <!-- Header gradient -->
        <div v-if="headerGradient" class="absolute top-0 left-0 w-full h-1" :class="headerGradient"></div>
        
        <!-- Header -->
        <div v-if="title || icon || $slots.header" class="flex items-center justify-between mb-8">
          <div class="flex items-center space-x-3">
            <div v-if="icon" :class="iconWrapperClasses">
              <component :is="icon" class="w-6 h-6 text-white" />
            </div>
            <div v-if="title || subtitle">
              <h3 class="text-xl font-semibold text-white">{{ title }}</h3>
              <p v-if="subtitle" class="text-sm text-gray-400">{{ subtitle }}</p>
            </div>
            <slot name="header"></slot>
          </div>
          
          <button 
            v-if="closable"
            @click="$emit('close')" 
            class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all duration-200"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>
        
        <!-- Content -->
        <div class="modal-content">
          <slot></slot>
        </div>
        
        <!-- Footer -->
        <div v-if="$slots.footer" class="pt-6 border-t border-gray-700/50">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { computed, watch, nextTick, onUnmounted } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: [Object, String],
    default: null
  },
  size: {
    type: String,
    default: 'md', // xs, sm, md, lg, xl, full
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', 'full'].includes(value)
  },
  variant: {
    type: String,
    default: 'default', // default, danger, success, warning
    validator: (value) => ['default', 'danger', 'success', 'warning'].includes(value)
  },
  closable: {
    type: Boolean,
    default: true
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  persistent: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'opened', 'closed'])

const modalClasses = computed(() => {
  const base = 'modal-enhanced relative overflow-hidden'
  
  const sizes = {
    xs: 'max-w-xs',
    sm: 'max-w-sm', 
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4'
  }
  
  return [base, sizes[props.size]].join(' ')
})

const headerGradient = computed(() => {
  const gradients = {
    default: 'bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500',
    danger: 'bg-gradient-to-r from-red-500 to-red-600',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500'
  }
  
  return gradients[props.variant]
})

const iconWrapperClasses = computed(() => {
  const base = 'p-2 rounded-xl'
  
  const variants = {
    default: 'bg-gradient-to-br from-violet-600 to-purple-600',
    danger: 'bg-gradient-to-br from-red-600 to-red-700',
    success: 'bg-gradient-to-br from-green-600 to-emerald-600',
    warning: 'bg-gradient-to-br from-yellow-600 to-orange-600'
  }
  
  return [base, variants[props.variant]].join(' ')
})

const handleBackdropClick = () => {
  if (props.closeOnBackdrop && !props.persistent) {
    emit('close')
  }
}

// Handle escape key
const handleEscape = (e) => {
  if (e.key === 'Escape' && props.show && props.closable && !props.persistent) {
    emit('close')
  }
}

// Watch for show changes
watch(() => props.show, async (newVal) => {
  if (newVal) {
    await nextTick()
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    emit('opened')
  } else {
    document.removeEventListener('keydown', handleEscape)
    document.body.style.overflow = ''
    emit('closed')
  }
})

// Cleanup on unmount
onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-content {
  max-height: 70vh;
  overflow-y: auto;
}

/* Custom scrollbar for modal content */
.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: rgba(55, 65, 81, 0.3);
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.5);
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.7);
}
</style>