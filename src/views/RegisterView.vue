<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLoadingStore } from '@/stores/loading'
import { useNotificationStore } from '@/stores/notification'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength, sameAs } from '@vuelidate/validators'
import TheHeader from '@/components/TheHeader.vue'
import LogoSVG from '@/components/svg/LogoSVG.vue'

const userEmail = ref('')
const password = ref('')
const router = useRouter()
const authStore = useAuthStore()

const handleRegister = async () => {
  try {
    await authStore.register({ email: userEmail.value, password: password.value })
    router.push('/dashboard')
  } catch (error) {
    console.error('Registration failed:', error)
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
      <h2 class="text-center text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Create your account</h2>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <input
              v-model="userEmail"
              type="email"
              required
              class="input w-full"
              placeholder="Email address"
            />
          </div>
          <div>
            <input
              v-model="password"
              type="password"
              required
              class="input w-full"
              placeholder="Password"
            />
          </div>
        </div>
        <button
          type="submit"
          class="btn w-full"
        >
          Register
        </button>
      </form>
      <div class="text-center text-sm sm:text-base">
        <RouterLink to="/login" class="link">
          Already have an account? Sign in
        </RouterLink>
      </div>
    </div>
  </div>
</template>
