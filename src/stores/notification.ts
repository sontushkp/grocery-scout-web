import { defineStore } from 'pinia'
import { ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

interface Notification {
  id: string
  type: NotificationType
  message: string
  timeout?: number
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])

  function add(type: NotificationType, message: string, timeout = 5000) {
    const id = crypto.randomUUID()
    const notification = { id, type, message }
    notifications.value.push(notification)

    if (timeout) {
      setTimeout(() => {
        remove(id)
      }, timeout)
    }
  }

  function remove(id: string) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  function success(message: string) {
    add('success', message)
  }

  function error(message: string) {
    add('error', message)
  }

  function info(message: string) {
    add('info', message)
  }

  function warning(message: string) {
    add('warning', message)
  }

  return {
    notifications,
    add,
    remove,
    success,
    error,
    info,
    warning
  }
}) 