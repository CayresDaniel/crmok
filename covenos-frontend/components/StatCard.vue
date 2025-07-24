<template>
  <div class="card-gothic hover-lift" :class="cardClass">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="iconClass">
          <component :is="iconComponent" class="w-5 h-5" />
        </div>
      </div>
      <div class="ml-5 w-0 flex-1">
        <dl>
          <dt class="text-sm font-medium text-gray-400 truncate">{{ title }}</dt>
          <dd class="flex items-baseline">
            <div v-if="loading" class="skeleton-gothic h-8 w-20 rounded"></div>
            <div v-else class="text-2xl font-semibold text-gray-100">{{ value }}</div>
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  CalendarIcon, 
  CurrencyDollarIcon, 
  UsersIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/vue/24/outline'

interface Props {
  title: string
  value: string | number
  icon: string
  color: 'witch' | 'gothic' | 'blood' | 'warning'
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

// Icon mapping
const iconMap = {
  CalendarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ExclamationTriangleIcon
}

const iconComponent = computed(() => iconMap[props.icon as keyof typeof iconMap])

const cardClass = computed(() => {
  switch (props.color) {
    case 'witch':
      return 'border-witch-700/50 hover:border-witch-600/70'
    case 'gothic':
      return 'border-gothic-700/50 hover:border-gothic-600/70'
    case 'blood':
      return 'border-blood-700/50 hover:border-blood-600/70'
    case 'warning':
      return 'border-yellow-700/50 hover:border-yellow-600/70'
    default:
      return ''
  }
})

const iconClass = computed(() => {
  switch (props.color) {
    case 'witch':
      return 'bg-witch-600 text-witch-100'
    case 'gothic':
      return 'bg-gothic-600 text-gothic-100'
    case 'blood':
      return 'bg-blood-600 text-blood-100'
    case 'warning':
      return 'bg-yellow-600 text-yellow-100'
    default:
      return 'bg-gray-600 text-gray-100'
  }
})
</script>