<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'
import { useNotificationStore } from '@/stores/notification'
import { useLoadingStore } from '@/stores/loading'
import type { SystemUser, CreateUserData, UserRole } from '@/types/user'
import { useAuthStore } from '@/stores/auth'

const notificationStore = useNotificationStore()
const loadingStore = useLoadingStore()
const authStore = useAuthStore()

const showCreateModal = ref(false)
const users = ref<SystemUser[]>([
  {
    id: '0',
    name: 'Super Admin',
    email: 'superadmin@example.com',
    role: 'super_admin',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  }
  // Add more sample users as needed
])

const newUser = ref<CreateUserData>({
  name: '',
  email: '',
  password: '',
  role: 'user',
  status: 'active'
})

const rules = {
  name: { required, minLength: minLength(3) },
  email: { required, email },
  password: { required, minLength: minLength(8) },
  role: { required }
}

const v$ = useVuelidate(rules, newUser)

const roles: { label: string; value: UserRole }[] = [
  { label: 'Super Admin', value: 'super_admin' },
  { label: 'Admin', value: 'admin' },
  { label: 'Manager', value: 'manager' },
  { label: 'User', value: 'user' }
]

const statusBadgeClasses = (status: string) => {
  return status === 'active'
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
}

const roleBadgeClasses = (role: UserRole) => {
  switch (role) {
    case 'super_admin':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
    case 'admin':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'
    case 'manager':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
  }
}

async function createUser() {
  const isFormValid = await v$.value.$validate()
  if (!isFormValid) return

  try {
    loadingStore.start('Creating user...')
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newSystemUser: SystemUser = {
      id: crypto.randomUUID(),
      ...newUser.value,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    users.value.push(newSystemUser)
    notificationStore.success('User created successfully')
    closeModal()
  } catch (error) {
    notificationStore.error('Failed to create user')
    console.error('Create user failed:', error)
  } finally {
    loadingStore.stop()
  }
}

function closeModal() {
  showCreateModal.value = false
  v$.value.$reset()
  newUser.value = {
    name: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active'
  }
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}

const canCreateUser = computed(() => {
  return authStore.isSuperAdmin || (authStore.isAdmin && authStore.hasPermission('users.create'))
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">System Users</h2>
      <button
        v-if="canCreateUser"
        @click="showCreateModal = true"
        class="px-4 py-2 bg-jade-600 text-white rounded-md hover:bg-jade-700 focus:outline-none focus:ring-2 focus:ring-jade-500"
      >
        Create User
      </button>
    </div>

    <!-- Users Table -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Role
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Created At
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="user in users" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ user.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500 dark:text-gray-300">{{ user.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="roleBadgeClasses(user.role)"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="statusBadgeClasses(user.status)"
              >
                {{ user.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {{ formatDate(user.createdAt) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create User Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 space-y-6">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Create New User</h3>

        <form @submit.prevent="createUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              v-model="newUser.name"
              type="text"
              :class="[
                'mt-1 block w-full rounded-md shadow-sm focus:border-jade-500 focus:ring-jade-500',
                { 'border-red-500': v$.name.$error }
              ]"
              :disabled="v$.name.$pending"
            />
            <p v-if="v$.name.$error" class="mt-1 text-sm text-red-600">
              {{ v$.name.$errors[0].$message }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              v-model="newUser.email"
              type="email"
              :class="[
                'mt-1 block w-full rounded-md shadow-sm focus:border-jade-500 focus:ring-jade-500',
                { 'border-red-500': v$.email.$error }
              ]"
              :disabled="v$.email.$pending"
            />
            <p v-if="v$.email.$error" class="mt-1 text-sm text-red-600">
              {{ v$.email.$errors[0].$message }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              v-model="newUser.password"
              type="password"
              :class="[
                'mt-1 block w-full rounded-md shadow-sm focus:border-jade-500 focus:ring-jade-500',
                { 'border-red-500': v$.password.$error }
              ]"
              :disabled="v$.password.$pending"
            />
            <p v-if="v$.password.$error" class="mt-1 text-sm text-red-600">
              {{ v$.password.$errors[0].$message }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <select
              v-model="newUser.role"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-jade-500 focus:ring-jade-500"
            >
              <option v-for="role in roles" :key="role.value" :value="role.value">
                {{ role.label }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select
              v-model="newUser.status"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-jade-500 focus:ring-jade-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-jade-600 text-white rounded-md hover:bg-jade-700 focus:outline-none focus:ring-2 focus:ring-jade-500"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template> 