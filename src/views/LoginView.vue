<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLoadingStore } from '@/stores/loading'
import { useNotificationStore } from '@/stores/notification'
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import TheHeader from '@/components/TheHeader.vue'
import LogoSVG from '@/components/svg/LogoSVG.vue'

const router = useRouter()
const authStore = useAuthStore()
const loadingStore = useLoadingStore()
const notificationStore = useNotificationStore()

const formData = ref({
  email: '',
  password: ''
})

const rules = {
  email: { required, email },
  password: { required }
}

const v$ = useVuelidate(rules, formData)

const handleLogin = async () => {
  const isFormValid = await v$.value.$validate()
  if (!isFormValid) return

  try {
    loadingStore.start('Signing in...')
    await authStore.login({
      email: formData.value.email,
      password: formData.value.password
    })
    notificationStore.success('Successfully signed in!')
    router.push('/dashboard')
  } catch (error) {
    notificationStore.error('Failed to sign in. Please check your credentials.')
    console.error('Login failed:', error)
  } finally {
    loadingStore.stop()
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
    <TheHeader />
    <div class="w-full max-w-md space-y-8 p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="flex justify-center">
        <LogoSVG class="h-10 w-10 sm:h-12 sm:w-12" />
      </div>
      <h2 class="text-center text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Sign in to your account</h2>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <input
              v-model="formData.email"
              type="email"
              required
              class="input w-full"
              :class="{ 'border-red-500': v$.email.$error }"
              placeholder="Email address"
            />
            <p v-if="v$.email.$error" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ v$.email.$errors[0].$message }}
            </p>
          </div>
          <div>
            <input
              v-model="formData.password"
              type="password"
              required
              class="input w-full"
              :class="{ 'border-red-500': v$.password.$error }"
              placeholder="Password"
            />
            <p v-if="v$.password.$error" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ v$.password.$errors[0].$message }}
            </p>
          </div>
        </div>
        <button
          type="submit"
          class="btn w-full"
        >
          Sign in
        </button>
      </form>
      <div class="text-center text-sm sm:text-base">
        <RouterLink to="/register" class="link">
          Don't have an account? Register
        </RouterLink>
      </div>
    </div>
  </div>
</template>
