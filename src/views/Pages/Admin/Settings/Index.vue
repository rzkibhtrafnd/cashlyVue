    <template>
    <admin-layout>
        <div class="bg-gray-50 dark:bg-gray-950">
        <div class="mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6 2xl:p-10">
            
            <!-- Page Header -->
            <div class="rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div class="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                <h3 class="text-2xl font-bold text-gray-800 dark:text-white/90">Pengaturan Sistem</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Kelola informasi toko, koneksi WiFi, logo, dan konfigurasi pembayaran QRIS.</p>
                </div>
            </div>
            </div>

            <!-- Alert Notification -->
            <div v-if="alert.msg"
            class="rounded-2xl border px-4 py-4 text-sm font-medium transition-all"
            :class="alert.type === 'success' ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400' : 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400'"
            >
            {{ alert.msg }}
            </div>

            <!-- Loading State -->
            <div v-if="loadingFetch" class="flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-20 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div class="flex flex-col items-center gap-4">
                <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-500/10">
                <svg class="h-8 w-8 animate-spin text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                </div>
                <div class="text-center">
                <h4 class="text-lg font-semibold text-gray-800 dark:text-white">Membaca Pengaturan</h4>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Mohon tunggu sebentar...</p>
                </div>
            </div>
            </div>

            <!-- Content Area -->
            <div v-else class="rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div class="border-b border-gray-100 px-6 py-5 dark:border-white/[0.05]">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Informasi & Konfigurasi Toko</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Pastikan data toko dan sistem pembayaran sudah sesuai.</p>
            </div>

            <SettingsForm
                :initial-data="form"
                :current-logo="currentLogo"
                :current-qris="currentQris"
                :is-saving="isSaving"
                :get-image-url="getImageUrl"
                @submit="submitSettings"
                @reset="fetchSettings"
            />
            </div>

        </div>
        </div>
    </admin-layout>
    </template>

    <script setup lang="ts">
    import { ref, reactive, onMounted } from 'vue'
    import type { AxiosError } from 'axios'
    import api from '@/api/axios'
    import AdminLayout from '@/components/layout/AdminLayout.vue'
    import SettingsForm from './SettingForm.vue'

    interface Settings {
    companyName: string;
    email: string;
    phone: string;
    address: string;
    wifi: string;
    wifiPassword: string;
    }

    interface SettingsFormSubmit {
    form: Settings;
    logo: File | null;
    qris: File | null;
    }

    const backendBaseUrl = 'http://localhost:5000'

    const loadingFetch = ref(true)
    const isSaving = ref(false)
    const currentLogo = ref('')
    const currentQris = ref('')

    const alert = reactive({ msg: '', type: 'success' as 'success' | 'error' })
    let alertTimer: ReturnType<typeof setTimeout> | null = null

    const form = ref<Settings>({
    companyName: '',
    email: '',
    phone: '',
    address: '',
    wifi: '',
    wifiPassword: ''
    })

    // Utilities
    const getAuthHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
    const getImageUrl = (filename: string) => `${backendBaseUrl}/uploads/${filename}`

    const showAlert = (message: string, type: 'success' | 'error') => {
    alert.msg = message
    alert.type = type
    if (alertTimer) clearTimeout(alertTimer)
    alertTimer = setTimeout(() => { alert.msg = '' }, 4000)
    }

    // API Connection
    const fetchSettings = async () => {
    loadingFetch.value = true
    try {
        const response = await api.get('/settings', getAuthHeader())
        const data = response.data.data || response.data
        
        form.value = {
        companyName: data.companyName || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        wifi: data.wifi || '',
        wifiPassword: data.wifiPassword || ''
        }
        
        currentLogo.value = data.imgLogo || ''
        currentQris.value = data.imgQris || ''
    } catch {
        showAlert('Gagal memuat pengaturan sistem', 'error')
    } finally {
        loadingFetch.value = false
    }
    }

    const submitSettings = async ({ form: updatedForm, logo, qris }: SettingsFormSubmit) => {
    isSaving.value = true
    try {
        const formDataToSend = new FormData()
        formDataToSend.append('companyName', updatedForm.companyName)
        formDataToSend.append('email', updatedForm.email)
        formDataToSend.append('phone', updatedForm.phone)
        formDataToSend.append('address', updatedForm.address)
        formDataToSend.append('wifi', updatedForm.wifi)
        formDataToSend.append('wifiPassword', updatedForm.wifiPassword)
        
        if (logo) formDataToSend.append('imgLogo', logo)
        if (qris) formDataToSend.append('imgQris', qris)

        const config = {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
        }
        }

        await api.post('/settings', formDataToSend, config)
        showAlert('Pengaturan berhasil disimpan!', 'success')
        await fetchSettings()
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>
        const message = axiosError.response?.data?.message || 'Terjadi kesalahan saat menyimpan.'
        showAlert(message, 'error')
    } finally {
        isSaving.value = false
    }
    }

    onMounted(() => {
    fetchSettings()
    })
    </script>