import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false)
  const loadingText = ref('')

  function start(text = 'Loading...') {
    isLoading.value = true
    loadingText.value = text
  }

  function stop() {
    isLoading.value = false
    loadingText.value = ''
  }

  return {
    isLoading,
    loadingText,
    start,
    stop
  }
}) 