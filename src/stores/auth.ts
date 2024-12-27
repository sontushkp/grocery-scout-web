import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserRole } from '@/types/user'

interface User {
  email: string
  role: UserRole
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)

  function login(credentials: { email: string; password: string }) {
    // For demo, we'll set super_admin role for a specific email
    const isSuperAdmin = credentials.email === 'superadmin@example.com'
    const isAdmin = credentials.email === 'admin@example.com'
    
    user.value = { 
      email: credentials.email,
      role: isSuperAdmin ? 'super_admin' : isAdmin ? 'admin' : 'user'
    }
    isAuthenticated.value = true
  }

  function register(userData: { email: string; password: string }) {
    // New users always get 'user' role
    user.value = { 
      email: userData.email,
      role: 'user'
    }
    isAuthenticated.value = true
  }

  function logout() {
    user.value = null
    isAuthenticated.value = false
  }

  const isAdmin = computed(() => ['super_admin', 'admin'].includes(user.value?.role || ''))
  const isSuperAdmin = computed(() => user.value?.role === 'super_admin')

  // Helper function to check permissions
  function hasPermission(permission: string) {
    if (user.value?.role === 'super_admin') return true
    // Add other permission logic here
    return false
  }

  return { 
    user, 
    isAuthenticated, 
    login, 
    register, 
    logout, 
    isAdmin,
    isSuperAdmin,
    hasPermission
  }
}) 