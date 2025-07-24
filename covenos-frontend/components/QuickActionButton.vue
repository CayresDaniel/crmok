<template>
  <NuxtLink 
    :to="to" 
    class="group block p-4 rounded-lg border-2 border-dashed transition-all duration-300 hover-lift"
    :class="buttonClass"
  >
    <div class="text-center">
      <component 
        :is="iconComponent" 
        class="w-8 h-8 mx-auto mb-2 transition-colors duration-300"
        :class="iconClass"
      />
      <p class="text-sm font-medium transition-colors duration-300" :class="textClass">
        {{ label }}
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { 
  UserPlusIcon,
  CalendarDaysIcon,
  PlusIcon,
  BanknotesIcon
} from '@heroicons/vue/24/outline'

interface Props {
  label: string
  icon: string
  to: string
  color: 'witch' | 'gothic' | 'blood' | 'shadow'
}

const props = defineProps<Props>()

// Icon mapping
const iconMap = {
  UserPlusIcon,
  CalendarDaysIcon,
  PlusIcon,
  BanknotesIcon
}

const iconComponent = computed(() => iconMap[props.icon as keyof typeof iconMap])

const buttonClass = computed(() => {
  switch (props.color) {
    case 'witch':
      return 'border-witch-600/50 hover:border-witch-500 hover:bg-witch-900/20'
    case 'gothic':
      return 'border-gothic-600/50 hover:border-gothic-500 hover:bg-gothic-900/20'
    case 'blood':
      return 'border-blood-600/50 hover:border-blood-500 hover:bg-blood-900/20'
    case 'shadow':
      return 'border-shadow-600/50 hover:border-shadow-500 hover:bg-shadow-800/50'
    default:
      return 'border-gray-600/50 hover:border-gray-500 hover:bg-gray-900/20'
  }
})

const iconClass = computed(() => {
  switch (props.color) {
    case 'witch':
      return 'text-witch-400 group-hover:text-witch-300'
    case 'gothic':
      return 'text-gothic-400 group-hover:text-gothic-300'
    case 'blood':
      return 'text-blood-400 group-hover:text-blood-300'
    case 'shadow':
      return 'text-shadow-400 group-hover:text-shadow-300'
    default:
      return 'text-gray-400 group-hover:text-gray-300'
  }
})

const textClass = computed(() => {
  switch (props.color) {
    case 'witch':
      return 'text-witch-300 group-hover:text-witch-200'
    case 'gothic':
      return 'text-gothic-300 group-hover:text-gothic-200'
    case 'blood':
      return 'text-blood-300 group-hover:text-blood-200'
    case 'shadow':
      return 'text-shadow-300 group-hover:text-shadow-200'
    default:
      return 'text-gray-300 group-hover:text-gray-200'
  }
})
</script>