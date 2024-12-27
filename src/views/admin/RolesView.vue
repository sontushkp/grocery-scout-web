<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface Permission {
  id: string
  name: string
  description: string
}

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
}

const roles = ref<Role[]>([
  {
    id: '1',
    name: 'Admin',
    description: 'Full system access',
    permissions: ['users.manage', 'roles.manage', 'settings.manage']
  },
  {
    id: '2',
    name: 'Manager',
    description: 'Can manage users and content',
    permissions: ['users.view', 'content.manage']
  },
  {
    id: '3',
    name: 'User',
    description: 'Basic user access',
    permissions: ['content.view']
  }
])

const availablePermissions = ref<Permission[]>([
  { id: 'users.manage', name: 'Manage Users', description: 'Create, edit, and delete users' },
  { id: 'users.view', name: 'View Users', description: 'View user information' },
  { id: 'roles.manage', name: 'Manage Roles', description: 'Create, edit, and delete roles' },
  { id: 'settings.manage', name: 'Manage Settings', description: 'Modify system settings' },
  { id: 'content.manage', name: 'Manage Content', description: 'Create, edit, and delete content' },
  { id: 'content.view', name: 'View Content', description: 'View content' }
])

const showNewRoleModal = ref(false)
const editingRole = ref<Role | null>(null)
const newRole = ref({
  name: '',
  description: '',
  permissions: [] as string[]
})

const isEditing = computed(() => !!editingRole.value)

function openNewRoleModal() {
  showNewRoleModal.value = true
  editingRole.value = null
  newRole.value = {
    name: '',
    description: '',
    permissions: []
  }
}

function editRole(role: Role) {
  editingRole.value = role
  newRole.value = {
    name: role.name,
    description: role.description,
    permissions: [...role.permissions]
  }
  showNewRoleModal.value = true
}

function closeModal() {
  showNewRoleModal.value = false
  editingRole.value = null
}

function saveRole() {
  if (editingRole.value) {
    // Update existing role
    const index = roles.value.findIndex(r => r.id === editingRole.value?.id)
    if (index !== -1) {
      roles.value[index] = {
        ...editingRole.value,
        ...newRole.value
      }
    }
  } else {
    // Create new role
    roles.value.push({
      id: crypto.randomUUID(),
      ...newRole.value
    })
  }
  closeModal()
}

function deleteRole(roleId: string) {
  if (confirm('Are you sure you want to delete this role?')) {
    roles.value = roles.value.filter(role => role.id !== roleId)
  }
}

function togglePermission(permission: string) {
  const permissions = newRole.value.permissions
  const index = permissions.indexOf(permission)
  if (index === -1) {
    permissions.push(permission)
  } else {
    permissions.splice(index, 1)
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Roles Management</h2>
      <button
        @click="openNewRoleModal"
        class="px-4 py-2 bg-jade-600 text-white rounded-md hover:bg-jade-700 focus:outline-none focus:ring-2 focus:ring-jade-500"
      >
        Add New Role
      </button>
    </div>

    <!-- Roles List -->
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Role Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Description
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Permissions
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="role in roles" :key="role.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
              {{ role.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
              {{ role.description }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="permission in role.permissions"
                  :key="permission"
                  class="px-2 py-1 text-xs rounded-full bg-jade-100 text-jade-800 dark:bg-jade-800 dark:text-jade-100"
                >
                  {{ permission }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="editRole(role)"
                class="text-jade-600 hover:text-jade-900 dark:hover:text-jade-400 mr-3"
              >
                Edit
              </button>
              <button
                @click="deleteRole(role.id)"
                class="text-red-600 hover:text-red-900 dark:hover:text-red-400"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal for New/Edit Role -->
    <div
      v-if="showNewRoleModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 space-y-6">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ isEditing ? 'Edit Role' : 'Create New Role' }}
        </h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Role Name</label>
            <input
              v-model="newRole.name"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-jade-500 focus:ring-jade-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <input
              v-model="newRole.description"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-jade-500 focus:ring-jade-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Permissions</label>
            <div class="space-y-2">
              <div
                v-for="permission in availablePermissions"
                :key="permission.id"
                class="flex items-center"
              >
                <input
                  :id="permission.id"
                  type="checkbox"
                  :checked="newRole.permissions.includes(permission.id)"
                  @change="togglePermission(permission.id)"
                  class="h-4 w-4 text-jade-600 focus:ring-jade-500 border-gray-300 rounded"
                />
                <label :for="permission.id" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  <span class="font-medium">{{ permission.name }}</span>
                  <span class="text-gray-500 dark:text-gray-400 ml-2">- {{ permission.description }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button
            @click="closeModal"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            @click="saveRole"
            class="px-4 py-2 bg-jade-600 text-white rounded-md hover:bg-jade-700 focus:outline-none focus:ring-2 focus:ring-jade-500"
          >
            {{ isEditing ? 'Update' : 'Create' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 