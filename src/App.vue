<script setup lang="ts">
import { onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { RouterView } from 'vue-router'

const settingsStore = useSettingsStore()

onMounted(() => {
  // Initialize theme after the app is mounted
  settingsStore.applyTheme(settingsStore.settings.appearance)
})
</script>

<template>
  <RouterView />
</template>
