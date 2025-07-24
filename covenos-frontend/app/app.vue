<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// Inicializar stores no app
const authStore = useAuthStore()

// Inicializar autenticação quando o app carrega
onMounted(async () => {
  await authStore.initAuth()
})
</script>
