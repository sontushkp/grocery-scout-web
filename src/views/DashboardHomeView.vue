<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Welcome back!</h2>
      <p class="text-gray-600 dark:text-gray-300">
        You are logged in as {{ authStore.user?.email }}
      </p>
    </div>

    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Stats</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-jade-50 dark:bg-gray-700 p-4 rounded-lg">
          <p class="text-jade-600 dark:text-jade-400 text-sm font-medium">Total Users</p>
          <p class="text-2xl font-semibold text-jade-700 dark:text-jade-300">0</p>
        </div>
        <div class="bg-jade-50 dark:bg-gray-700 p-4 rounded-lg">
          <p class="text-jade-600 dark:text-jade-400 text-sm font-medium">Active Users</p>
          <p class="text-2xl font-semibold text-jade-700 dark:text-jade-300">0</p>
        </div>
        <div class="bg-jade-50 dark:bg-gray-700 p-4 rounded-lg">
          <p class="text-jade-600 dark:text-jade-400 text-sm font-medium">New Users Today</p>
          <p class="text-2xl font-semibold text-jade-700 dark:text-jade-300">0</p>
        </div>
      </div>
    </div>
  </div>
</template> 