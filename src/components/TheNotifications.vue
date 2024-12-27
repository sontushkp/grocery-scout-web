<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification'
import { TransitionGroup } from 'vue'

const notificationStore = useNotificationStore()

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return `
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      `
    case 'error':
      return `
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      `
    case 'warning':
      return `
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      `
    default:
      return `
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      `
  }
}

const getTypeClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100'
    case 'error':
      return 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-100'
    case 'warning':
      return 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
    default:
      return 'bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
  }
}
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 space-y-2 min-w-[320px]">
    <TransitionGroup
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-for="notification in notificationStore.notifications"
        :key="notification.id"
        :class="['rounded-lg p-4 shadow-lg', getTypeClasses(notification.type)]"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              v-html="getIcon(notification.type)"
            />
          </div>
          <div class="ml-3 w-0 flex-1">
            <p class="text-sm font-medium">{{ notification.message }}</p>
          </div>
          <div class="ml-4 flex flex-shrink-0">
            <button
              @click="notificationStore.remove(notification.id)"
              class="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
              :class="[
                notification.type === 'success' ? 'focus:ring-green-500' :
                notification.type === 'error' ? 'focus:ring-red-500' :
                notification.type === 'warning' ? 'focus:ring-yellow-500' :
                'focus:ring-blue-500'
              ]"
            >
              <span class="sr-only">Close</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template> 