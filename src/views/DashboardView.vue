<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import LogoSVG from '@/components/svg/LogoSVG.vue'
import TheBottomNav from '@/components/TheBottomNav.vue'
import { ref, computed } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const isDrawerExpanded = ref(false)
const isOrgSettingsOpen = ref(false)

const showAdminMenu = computed(() => authStore.isAdmin)
const showSuperAdminMenu = computed(() => authStore.isSuperAdmin)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Sidebar - Hidden on mobile -->
    <div
      class="hidden md:block bg-white dark:bg-gray-800 shadow-md transition-all duration-300"
      :class="{ 'w-64': isDrawerExpanded, 'w-20': !isDrawerExpanded }"
      @mouseenter="isDrawerExpanded = true"
      @mouseleave="isDrawerExpanded = false"
    >
      <div class="p-4 flex items-center justify-between">
        <LogoSVG class="h-8 w-8" />
      </div>
      <div class="px-4" v-if="isDrawerExpanded">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Dashboard</h2>
      </div>
      <nav class="mt-4">
        <RouterLink
          to="/dashboard"
          class="flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-jade-50 hover:text-jade-600 dark:hover:bg-gray-700 dark:hover:text-jade-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span v-if="isDrawerExpanded" class="ml-3">Overview</span>
        </RouterLink>

        <RouterLink
          to="/profile"
          class="flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-jade-50 hover:text-jade-600 dark:hover:bg-gray-700 dark:hover:text-jade-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span v-if="isDrawerExpanded" class="ml-3">Profile</span>
        </RouterLink>

        <button
          @click="handleLogout"
          class="w-full flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-jade-50 hover:text-jade-600 dark:hover:bg-gray-700 dark:hover:text-jade-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span v-if="isDrawerExpanded" class="ml-3">Logout</span>
        </button>
      </nav>

      <!-- Admin Menu - Only visible on larger screens for admins -->
      <template v-if="showAdminMenu">
        <div 
          class="mt-4 px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400"
          v-if="isDrawerExpanded"
        >
          Organization
        </div>
        <div class="relative">
          <button
            @click="isOrgSettingsOpen = !isOrgSettingsOpen"
            class="w-full flex items-center px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-jade-50 hover:text-jade-600 dark:hover:bg-gray-700 dark:hover:text-jade-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span v-if="isDrawerExpanded" class="ml-3">Organization Settings</span>
            <svg
              v-if="isDrawerExpanded"
              class="ml-auto h-4 w-4 transform transition-transform duration-200"
              :class="{ 'rotate-180': isOrgSettingsOpen }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Submenu -->
          <div v-if="isDrawerExpanded && isOrgSettingsOpen" class="pl-4">
            <RouterLink
              to="/admin/users"
              class="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-jade-50 hover:text-jade-600 dark:hover:bg-gray-700 dark:hover:text-jade-400"
            >
              <span>Users</span>
            </RouterLink>
            <RouterLink
              to="/admin/roles"
              class="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-jade-50 hover:text-jade-600 dark:hover:bg-gray-700 dark:hover:text-jade-400"
            >
              <span>Roles</span>
            </RouterLink>
            <RouterLink
              v-if="showSuperAdminMenu"
              to="/admin/settings"
              class="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-jade-50 hover:text-jade-600 dark:hover:bg-gray-700 dark:hover:text-jade-400"
            >
              <span>Site Settings</span>
            </RouterLink>
          </div>
        </div>
      </template>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-auto pb-16 md:pb-0">
      <header class="bg-white dark:bg-gray-800 shadow">
        <div class="px-4 py-6 flex justify-between items-center">
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
        </div>
      </header>

      <main class="p-6">
        <RouterView />
      </main>
    </div>

    <!-- Bottom Navigation - Visible only on mobile -->
    <TheBottomNav />
  </div>
</template>
