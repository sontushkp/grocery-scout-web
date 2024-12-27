<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 261.76 226.69"
    xmlns:v="https://vecta.io/nano"
    :class="$attrs.class"
  >
    <path
      d="M161.096.001l-30.225 52.351L100.647.001H-.005l130.877 226.688L261.749.001z"
      :class="themeStore.theme === 'dark' ? 'fill-jade-400' : 'fill-jade-600'"
    />
    <path
      d="M161.096.001l-30.225 52.351L100.647.001H52.346l78.526 136.01L209.398.001z"
      :class="themeStore.theme === 'dark' ? 'fill-gray-600' : 'fill-gray-800'"
    />
  </svg>
</template>
