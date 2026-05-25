<template>
  <FullScreenLayout>
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div
        class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900"
      >
        <div class="flex flex-col flex-1 w-full lg:w-1/2">
          <div class="w-full max-w-md pt-10 mx-auto">
          </div>
          
          <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div class="mb-5 sm:mb-8">
                <h1 class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Sign In
                </h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Masukkan email dan password untuk masuk ke sistem.
                </p>
              </div>

              <div v-if="errorMessage" class="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                {{ errorMessage }}
              </div>

              <div>
                <form @submit.prevent="handleSubmit">
                  <div class="space-y-5"
                    <!-- Email -->
                    <div>
                      <label for="email" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Email<span class="text-error-500">*</span>
                      </label>
                      <input
                        v-model="email"
                        type="email"
                        id="email"
                        required
                        placeholder="admin@cashly.com"
                        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-500 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                      />
                    </div>
                    <div>
                      <label for="password" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Password<span class="text-error-500">*</span>
                      </label>
                      <div class="relative">
                        <input
                          v-model="password"
                          :type="showPassword ? 'text' : 'password'"
                          id="password"
                          required
                          placeholder="Masukkan password anda"
                          class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-500 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                        />
                        <span @click="togglePasswordVisibility" class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400">
                          <svg v-if="!showPassword" class="fill-current" width="20" height="20" viewBox="0 0 20 20"><path d="M10 4.04c-3.52 0-6.51 2.26-7.58 5.41.05.16.05.33 0 .49 1.07 3.15 4.06 5.42 7.58 5.42 3.52 0 6.51-2.26 7.58-5.42a.84.84 0 000-.49c-1.07-3.15-4.06-5.41-7.58-5.41zm0 9.82a3.86 3.86 0 110-7.72 3.86 3.86 0 010 7.72z"/></svg>
                          <svg v-else class="fill-current" width="20" height="20" viewBox="0 0 20 20"><path d="M4.64 3.58a.75.75 0 00-1.06 1.06l1.27 1.27C3.75 6.84 2.89 8.06 2.42 9.46a.84.84 0 000 .49c1.08 3.15 4.06 5.41 7.58 5.41 1.25 0 2.44-.29 3.5-.82l1.86 1.86a.75.75 0 001.06-1.06L4.64 3.58z"/></svg>
                        </span>
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        :disabled="isLoading"
                        class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
                      >
                        <span v-if="isLoading">Memproses...</span>
                        <span v-else>Sign In</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div class="relative items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div class="flex items-center justify-center z-1">
            <common-grid-shape />
            <div class="flex flex-col items-center max-w-xs">
              <div class="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-blue-600 font-black text-4xl mb-6 shadow-2xl transition-transform hover:scale-105">
                C
              </div>
              
              <h2 class="text-3xl font-extrabold text-white mb-3 tracking-tight">
                Cashly <span class="text-blue-200">POS</span>
              </h2>
              
              <p class="text-center text-blue-100/80 leading-relaxed">
                Kelola transaksi dan operasional toko Anda dengan dashboard yang modern dan intuitif.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { AxiosError } from 'axios'
import api from '@/api/axios'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import CommonGridShape from '@/components/common/CommonGridShape.vue'

const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await api.post('/login', {
      email: email.value,
      password: password.value
    })

    const { token, user } = response.data

    localStorage.setItem('token', token)
    localStorage.setItem('role', user.role)
    localStorage.setItem('userData', JSON.stringify(user))

    router.push(user.role === 'admin' ? '/admin/dashboard' : '/kasir/dashboard')
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>
    errorMessage.value = axiosError.response?.data?.message || 'Login gagal, periksa email dan password Anda.'
  } finally {
    isLoading.value = false
  }
}
</script>