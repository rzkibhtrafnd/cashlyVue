<template>
  <router-link to="/" class="lg:hidden">
    <img
      class="dark:hidden"
      :src="settings?.logo || '/images/logo/logo.svg'"
      alt="Logo"
    />
    <img
      class="hidden dark:block"
      :src="settings?.logoDark || '/images/logo/logo-dark.svg'"
      alt="Logo"
    />
  </router-link>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useSettings } from '@/composables/useSettings'

const { settings, fetchSettings } = useSettings()

onMounted(() => {
  fetchSettings()
})
</script>
