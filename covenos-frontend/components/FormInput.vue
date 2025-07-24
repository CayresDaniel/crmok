<template>
  <div class="form-group">
    <label v-if="label" class="form-label">
      <component :is="icon" v-if="icon" class="w-4 h-4" />
      {{ label }}
      <span v-if="required" class="text-red-400 ml-1">*</span>
    </label>
    
    <div class="relative">
      <!-- Input ou Select -->
      <select 
        v-if="type === 'select'" 
        :id="fieldId"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :required="required"
        :disabled="disabled"
        :class="inputClasses"
      >
        <option v-if="placeholder" value="">{{ placeholder }}</option>
        <slot name="options"></slot>
      </select>
      
      <textarea 
        v-else-if="type === 'textarea'"
        :id="fieldId"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :rows="rows || 3"
        :class="[inputClasses, 'resize-none']"
        @focus="$emit('focus')"
        @blur="$emit('blur')"
      ></textarea>
      
      <input 
        v-else
        :id="fieldId"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :class="inputClasses"
        @focus="$emit('focus')"
        @blur="$emit('blur')"
      />
      
      <!-- Icon esquerdo -->
      <component 
        v-if="leftIcon" 
        :is="leftIcon" 
        class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" 
      />
      
      <!-- Icon direito ou slot -->
      <div v-if="rightIcon || slots.right" class="absolute right-3 top-1/2 transform -translate-y-1/2">
        <slot name="right">
          <component v-if="rightIcon" :is="rightIcon" class="w-5 h-5 text-neutral-400" />
        </slot>
      </div>
    </div>
    
    <!-- Error message -->
    <div v-if="error" class="error-message mt-2">
      <ExclamationTriangleIcon class="w-4 h-4" />
      <span>{{ error }}</span>
    </div>
    
    <!-- Help text -->
    <p v-if="helpText" class="text-xs text-gray-400 mt-1">{{ helpText }}</p>
  </div>
</template>

<script setup>
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { computed, useId, useSlots } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  helpText: {
    type: String,
    default: ''
  },
  icon: {
    type: [Object, String],
    default: null
  },
  leftIcon: {
    type: [Object, String],
    default: null
  },
  rightIcon: {
    type: [Object, String],
    default: null
  },
  rows: {
    type: Number,
    default: 3
  }
})

defineEmits(['update:modelValue', 'focus', 'blur'])

const slots = useSlots()
const fieldId = useId()

const inputClasses = computed(() => {
  const base = 'form-input w-full'
  const withLeftIcon = props.leftIcon ? 'pl-11' : ''
  const withRightIcon = props.rightIcon || slots.right ? 'pr-11' : ''
  const errorState = props.error ? 'border-red-500 focus:border-red-500' : ''
  
  return [base, withLeftIcon, withRightIcon, errorState].filter(Boolean).join(' ')
})
</script>