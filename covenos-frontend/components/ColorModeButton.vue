<template>
  <button @click="toggleColorMode" class="p-2 text-gray-400 hover:text-gray-200 transition-colors duration-200">
    <SunIcon v-if="colorMode.preference === 'dark'" class="w-6 h-6" />
    <MoonIcon v-else class="w-6 h-6" />
  </button>
</template>

<script setup lang="ts">
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'

const colorMode = useColorMode()

const toggleColorMode = () => {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}
</script>