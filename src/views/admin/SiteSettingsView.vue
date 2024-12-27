<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useNotificationStore } from '@/stores/notification'
import { useLoadingStore } from '@/stores/loading'
import { useSettingsStore } from '@/stores/settings'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const loadingStore = useLoadingStore()
const settingsStore = useSettingsStore()

// Redirect if not super admin
if (!authStore.isSuperAdmin) {
  router.push('/dashboard')
}

// Tab Management
type TabId = 'general' | 'appearance' | 'security' | 'integrations'

interface Tab {
  id: TabId
  label: string
  icon: string
}

const tabs: Tab[] = [
  {
    id: 'general',
    label: 'General',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />`
  },
  {
    id: 'appearance',
    label: 'Appearance',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />`
  },
  {
    id: 'security',
    label: 'Security',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />`
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />`
  }
]

const currentTab = ref<TabId>('general')

// Form Data
interface SiteSettings {
  general: {
    siteName: string
    siteDescription: string
    logo: File | null
    favicon: File | null
    contactEmail: string
  }
  appearance: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    fontFamily: string
    buttonStyle: 'rounded' | 'square'
    containerWidth: 'full' | 'contained'
  }
}

const settings = ref<SiteSettings>({
  general: {
    siteName: 'Vue TS Boilerplate',
    siteDescription: 'A modern Vue 3 + TypeScript starter template',
    logo: null,
    favicon: null,
    contactEmail: 'admin@example.com'
  },
  appearance: {
    primaryColor: '#10B981', // jade-600
    secondaryColor: '#374151', // gray-700
    accentColor: '#3B82F6', // blue-500
    fontFamily: 'Inter',
    buttonStyle: 'rounded',
    containerWidth: 'contained'
  }
})

const fontOptions = [
  { label: 'Inter', value: 'Inter' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Open Sans', value: 'Open Sans' },
  { label: 'Poppins', value: 'Poppins' }
]

// File Handling
function handleFileUpload(event: Event, type: 'logo' | 'favicon') {
  const input = event.target as HTMLInputElement
  if (input.files?.length) {
    settings.value.general[type] = input.files[0]
  }
}

// Save Settings
const showSaveModal = ref(false)

async function saveSettings() {
  showSaveModal.value = true
}

async function confirmSave() {
  try {
    loadingStore.start('Saving settings...')
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Here you would typically save all settings to your backend
    notificationStore.success('Settings saved successfully')
    hasUnsavedChanges.value = false
  } catch (error) {
    notificationStore.error('Failed to save settings')
    console.error('Save settings failed:', error)
  } finally {
    loadingStore.stop()
    showSaveModal.value = false
  }
}

// Unsaved changes management
const hasUnsavedChanges = ref(false)
const showConfirmModal = ref(false)
const pendingSettings = ref<Partial<SiteSettings> | null>(null)

// Track changes
function trackChanges() {
  hasUnsavedChanges.value = true
}

// Apply changes with confirmation
function applyChanges() {
  showConfirmModal.value = true
  pendingSettings.value = { ...settings.value }
}

const colorError = ref({
  primary: false,
  secondary: false,
  accent: false
})

function validateColor(color: string, type: 'primary' | 'secondary' | 'accent') {
  colorError.value[type] = !settingsStore.isValidHexColor(color)
  return !colorError.value[type]
}

function handleColorInput(event: Event, type: 'primary' | 'secondary' | 'accent') {
  const input = event.target as HTMLInputElement
  const color = input.value
  
  if (validateColor(color, type)) {
    settings.value.appearance[`${type}Color`] = color
  }
}

async function confirmChanges() {
  try {
    // Validate all colors before applying
    const isValidPrimary = validateColor(settings.value.appearance.primaryColor, 'primary')
    const isValidSecondary = validateColor(settings.value.appearance.secondaryColor, 'secondary')
    const isValidAccent = validateColor(settings.value.appearance.accentColor, 'accent')

    if (!isValidPrimary || !isValidSecondary || !isValidAccent) {
      notificationStore.error('Please fix the invalid color values')
      return
    }

    loadingStore.start('Applying changes...')
    if (pendingSettings.value) {
      // Update the settings store with the new appearance settings
      await settingsStore.updateSettings({
        appearance: pendingSettings.value.appearance
      })
      notificationStore.success('Changes applied successfully')
      hasUnsavedChanges.value = false
    }
  } catch (error) {
    notificationStore.error('Failed to apply changes')
    console.error('Apply changes failed:', error)
  } finally {
    loadingStore.stop()
    showConfirmModal.value = false
  }
}

// Watch for input changes
watch(
  () => settings.value,
  () => {
    trackChanges()
  },
  { deep: true }
)

const getObjectURL = (file: File) => URL.createObjectURL(file)
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Site Settings</h2>
      <button
        @click="saveSettings"
        class="btn"
      >
        Save Settings
      </button>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="currentTab = tab.id"
          :class="[
            currentTab === tab.id
              ? 'border-jade-500 text-jade-600 dark:text-jade-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600',
            'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm'
          ]"
        >
          <svg
            class="mr-2 h-5 w-5"
            :class="currentTab === tab.id ? 'text-jade-500' : 'text-gray-400 group-hover:text-gray-500'"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            v-html="tab.icon"
          />
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Tab Panels -->
    <div class="mt-6">
      <!-- General Settings -->
      <div v-if="currentTab === 'general'" class="space-y-6">
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Site Name</label>
            <input
              v-model="settings.general.siteName"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-jade-500 focus:ring-jade-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Site Description</label>
            <textarea
              v-model="settings.general.siteDescription"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-jade-500 focus:ring-jade-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Logo</label>
            <div class="mt-1 flex items-center space-x-4">
              <div v-if="settings.general.logo" class="h-12 w-12 rounded-md bg-gray-100 dark:bg-gray-700">
                <img
                  :src="getObjectURL(settings.general.logo)"
                  class="h-full w-full object-contain"
                  alt="Site Logo"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                @change="e => handleFileUpload(e, 'logo')"
                class="block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-jade-50 file:text-jade-700
                  dark:file:bg-jade-900 dark:file:text-jade-300
                  hover:file:bg-jade-100 dark:hover:file:bg-jade-800"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Favicon</label>
            <div class="mt-1 flex items-center space-x-4">
              <div v-if="settings.general.favicon" class="h-8 w-8 rounded-md bg-gray-100 dark:bg-gray-700">
                <img
                  :src="getObjectURL(settings.general.favicon)"
                  class="h-full w-full object-contain"
                  alt="Favicon"
                />
              </div>
              <input
                type="file"
                accept="image/x-icon,image/png"
                @change="e => handleFileUpload(e, 'favicon')"
                class="block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-jade-50 file:text-jade-700
                  dark:file:bg-jade-900 dark:file:text-jade-300
                  hover:file:bg-jade-100 dark:hover:file:bg-jade-800"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Email</label>
            <input
              v-model="settings.general.contactEmail"
              type="email"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-jade-500 focus:ring-jade-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
      </div>

      <!-- Appearance Settings -->
      <div v-if="currentTab === 'appearance'" class="space-y-6">
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Primary Color</label>
              <div class="mt-1 flex items-center space-x-3">
                <input
                  :value="settings.appearance.primaryColor"
                  @input="e => handleColorInput(e, 'primary')"
                  type="color"
                  class="h-8 w-8 rounded-md border-gray-300 shadow-sm focus:border-jade-500 focus:ring-jade-500"
                />
                <input
                  :value="settings.appearance.primaryColor"
                  @input="e => handleColorInput(e, 'primary')"
                  type="text"
                  :class="[
                    'block w-full rounded-md shadow-sm focus:border-jade-500 focus:ring-jade-500 dark:bg-gray-700 dark:border-gray-600',
                    { 'border-red-500': colorError.primary }
                  ]"
                />
              </div>
              <p v-if="colorError.primary" class="mt-1 text-sm text-red-600">
                Please enter a valid hex color (e.g., #FF0000)
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Secondary Color</label>
              <div class="mt-1 flex items-center space-x-3">
                <input
                  :value="settings.appearance.secondaryColor"
                  @input="e => handleColorInput(e, 'secondary')"
                  type="color"
                  class="h-8 w-8 rounded-md border-gray-300 shadow-sm focus:border-jade-500 focus:ring-jade-500"
                />
                <input
                  :value="settings.appearance.secondaryColor"
                  @input="e => handleColorInput(e, 'secondary')"
                  type="text"
                  :class="[
                    'block w-full rounded-md shadow-sm focus:border-jade-500 focus:ring-jade-500 dark:bg-gray-700 dark:border-gray-600',
                    { 'border-red-500': colorError.secondary }
                  ]"
                />
              </div>
              <p v-if="colorError.secondary" class="mt-1 text-sm text-red-600">
                Please enter a valid hex color (e.g., #0000FF)
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Accent Color</label>
              <div class="mt-1 flex items-center space-x-3">
                <input
                  :value="settings.appearance.accentColor"
                  @input="e => handleColorInput(e, 'accent')"
                  type="color"
                  class="h-8 w-8 rounded-md border-gray-300 shadow-sm focus:border-jade-500 focus:ring-jade-500"
                />
                <input
                  :value="settings.appearance.accentColor"
                  @input="e => handleColorInput(e, 'accent')"
                  type="text"
                  :class="[
                    'block w-full rounded-md shadow-sm focus:border-jade-500 focus:ring-jade-500 dark:bg-gray-700 dark:border-gray-600',
                    { 'border-red-500': colorError.accent }
                  ]"
                />
              </div>
              <p v-if="colorError.accent" class="mt-1 text-sm text-red-600">
                Please enter a valid hex color (e.g., #00FF00)
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Font Family</label>
              <select
                v-model="settings.appearance.fontFamily"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-jade-500 focus:ring-jade-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option v-for="font in fontOptions" :key="font.value" :value="font.value">
                  {{ font.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Button Style</label>
              <div class="mt-2 flex items-center space-x-4">
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="settings.appearance.buttonStyle"
                    value="rounded"
                    class="form-radio text-jade-600 focus:ring-jade-500"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">Rounded</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="settings.appearance.buttonStyle"
                    value="square"
                    class="form-radio text-jade-600 focus:ring-jade-500"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">Square</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Container Width</label>
              <div class="mt-2 flex items-center space-x-4">
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="settings.appearance.containerWidth"
                    value="contained"
                    class="form-radio text-jade-600 focus:ring-jade-500"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">Contained</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    v-model="settings.appearance.containerWidth"
                    value="full"
                    class="form-radio text-jade-600 focus:ring-jade-500"
                  />
                  <span class="ml-2 text-gray-700 dark:text-gray-300">Full Width</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div v-if="currentTab === 'security'" class="space-y-6">
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <p class="text-gray-500 dark:text-gray-400">Security settings coming soon...</p>
        </div>
      </div>

      <!-- Integrations Settings -->
      <div v-if="currentTab === 'integrations'" class="space-y-6">
        <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <p class="text-gray-500 dark:text-gray-400">Integrations settings coming soon...</p>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 space-y-6">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Confirm Changes</h3>
        <p class="text-gray-500 dark:text-gray-400">
          Are you sure you want to apply these changes? This will immediately affect the site appearance.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showConfirmModal = false"
            class="btn-secondary"
          >
            Cancel
          </button>
          <button
            @click="confirmChanges"
            class="btn"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>

    <!-- Save Confirmation Modal -->
    <div v-if="showSaveModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 space-y-6">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Save Settings</h3>
        <p class="text-gray-500 dark:text-gray-400">
          Are you sure you want to save all settings? This will persist your changes.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showSaveModal = false"
            class="btn-secondary"
          >
            Cancel
          </button>
          <button
            @click="confirmSave"
            class="btn"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- Save Changes Button -->
    <div
      v-if="hasUnsavedChanges"
      class="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 z-40"
    >
      <div class="flex items-center space-x-4">
        <span class="text-sm text-gray-500 dark:text-gray-400">You have unsaved changes</span>
        <button
          @click="applyChanges"
          class="btn"
        >
          Apply Changes
        </button>
      </div>
    </div>
  </div>
</template> 