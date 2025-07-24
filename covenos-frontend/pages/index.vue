<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-4xl font-light text-gray-100 mb-4">Coven Beauty</h1>
      <p class="text-lg text-gray-400 mb-8">Carregando...</p>
      <div class="loading-gothic"></div>
    </div>
  </div>
</template>

<script setup>
// Layout
definePageMeta({
  layout: false
})

// Redirecionar para login por enquanto
onMounted(async () => {
  await navigateTo('/login')
})
</script>