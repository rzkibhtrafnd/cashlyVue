    <template>
    <admin-layout>
        <div class=" bg-gray-50 dark:bg-gray-950">
        <div class="mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6 2xl:p-10">
            <!-- Header -->
            <div class="rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div class="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                <h3 class="text-2xl font-bold text-gray-800 dark:text-white/90">
                    Pengaturan Sistem
                </h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Kelola informasi toko, koneksi WiFi, logo, dan konfigurasi pembayaran QRIS.</p>
                </div>
            </div>
            </div>

            <!-- Loading -->
            <div v-if="loadingFetch" class="flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-20 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div class="flex flex-col items-center gap-4">
                <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-500/10">
                <svg class="h-8 w-8 animate-spin text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                </div>
                <div class="text-center">
                <h4 class="text-lg font-semibold text-gray-800 dark:text-white">
                    Membaca Pengaturan
                </h4>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Mohon tunggu sebentar...
                </p>
                </div>
            </div>
            </div>

            <!-- Form -->
            <div v-else class="rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <!-- Top -->
            <div class="border-b border-gray-100 px-6 py-5 dark:border-white/[0.05]">
                <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Informasi & Konfigurasi Toko
                    </h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Pastikan data toko dan sistem pembayaran sudah sesuai.
                    </p>
                </div>
                </div>
            </div>

            <!-- Form Body -->
            <form @submit.prevent="submitSettings" class="p-6">
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                
                <!-- Nama Toko -->
                <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nama Toko
                    </label>
                    <div class="relative">
                    <input v-model="form.companyName" type="text" placeholder="Masukkan nama toko" class="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-gray-800 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
                    </div>
                </div>

                <!-- Email -->
                <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Bisnis
                    </label>
                    <input v-model="form.email" type="email" placeholder="email@toko.com" class="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-gray-800 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
                </div>

                <!-- Telepon -->
                <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nomor Telepon
                    </label>
                    <input v-model="form.phone" type="text" placeholder="08123456789" class="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-gray-800 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
                </div>

                <!-- Alamat -->
                <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Alamat
                    </label>
                    <input v-model="form.address" type="text" placeholder="Jl. Raya No. 1" class="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-gray-800 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
                </div>

                <!-- WiFi -->
                <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nama WiFi (SSID)
                    </label>
                    <input v-model="form.wifi" type="text" placeholder="Toko Free WiFi" class="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-gray-800 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
                </div>

                <!-- Password -->
                <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password WiFi
                    </label>
                    <input v-model="form.wifiPassword" type="text" placeholder="Password WiFi" class="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-gray-800 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white" />
                </div>

                <!-- Logo -->
                <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Logo Toko
                    </label>
                    <div class="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 transition hover:border-brand-500 dark:border-gray-700 dark:bg-gray-900">
                    <input @change="handleFileUpload($event, 'logo')" type="file" accept="image/*" class="w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-brand-600 dark:text-gray-400" />
                    
                    <div v-if="currentLogo" class="mt-4 flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
                        <img :src="getImageUrl(currentLogo)" alt="Logo Aktif" class="h-16 w-16 rounded-lg object-contain bg-gray-100 dark:bg-gray-800" />
                        <div class="flex flex-col">
                        <span class="text-sm font-semibold text-gray-800 dark:text-white">Logo Saat Ini</span>
                        <span class="text-xs font-medium text-green-600 dark:text-green-400">Tersimpan di sistem</span>
                        </div>
                    </div>
                    </div>
                </div>

                <!-- QRIS -->
                <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Gambar QRIS
                    </label>
                    <div class="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 transition hover:border-brand-500 dark:border-gray-700 dark:bg-gray-900">
                    <input @change="handleFileUpload($event, 'qris')" type="file" accept="image/*" class="w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-brand-600 dark:text-gray-400" />
                    
                    <div v-if="currentQris" class="mt-4 flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
                        <img :src="getImageUrl(currentQris)" alt="QRIS Aktif" class="h-24 w-24 rounded-lg object-contain border border-gray-100 dark:border-gray-700" />
                        <div class="flex flex-col">
                        <span class="text-sm font-semibold text-gray-800 dark:text-white">QRIS Saat Ini</span>
                        <span class="text-xs font-medium text-green-600 dark:text-green-400">Tersimpan di sistem</span>
                        </div>
                    </div>
                    </div>
                </div>

                </div>

                <!-- Alert -->
                <div v-if="alertMsg" :class="alertType === 'success' ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400' : 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400'" class="mt-6 rounded-2xl border px-4 py-4 text-sm font-medium">
                {{ alertMsg }}
                </div>

                <!-- Action -->
                <div class="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end dark:border-white/[0.05]">
                <button type="button" @click="fetchSettings" class="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:border-brand-500 hover:text-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                    Reset
                </button>

                <button :disabled="isSaving" type="submit" class="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50">
                    <svg v-if="isSaving" class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    {{ isSaving ? 'Menyimpan Pengaturan...' : 'Simpan Pengaturan' }}
                </button>
                </div>
            </form>
            </div>
        </div>
        </div>
    </admin-layout>
    </template>

    <script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import api from '@/api/axios'
    import AdminLayout from '@/components/layout/AdminLayout.vue'

    const backendBaseUrl = 'http://localhost:5000'

    const getImageUrl = (filename: string) => {
    return `${backendBaseUrl}/uploads/${filename}`
    }

    const loadingFetch = ref(true)
    const isSaving = ref(false)
    const alertMsg = ref('')
    const alertType = ref('success')

    const currentLogo = ref('')
    const currentQris = ref('')

    // Form State
    const form = ref({
    companyName: '',
    email: '',
    phone: '',
    address: '',
    wifi: '',
    wifiPassword: ''
    })

    const fileLogo = ref<File | null>(null)
    const fileQris = ref<File | null>(null)

    const fetchSettings = async () => {
    loadingFetch.value = true
    try {
        const token = localStorage.getItem('token')
        const response = await api.get('/settings', {
        headers: { Authorization: `Bearer ${token}` }
        })
        
        const data = response.data.data || response.data
        
        form.value.companyName = data.companyName || ''
        form.value.email = data.email || ''
        form.value.phone = data.phone || ''
        form.value.address = data.address || ''
        form.value.wifi = data.wifi || ''
        form.value.wifiPassword = data.wifiPassword || ''
        
        currentLogo.value = data.imgLogo || ''
        currentQris.value = data.imgQris || ''

    } catch (error) {
        console.error("Gagal memuat pengaturan", error)
    } finally {
        loadingFetch.value = false
    }
    }

    const handleFileUpload = (event: Event, type: 'logo' | 'qris') => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
        if (type === 'logo') {
        fileLogo.value = target.files[0]
        } else {
        fileQris.value = target.files[0]
        }
    }
    }

    const submitSettings = async () => {
    isSaving.value = true
    alertMsg.value = ''
    
    try {
        const token = localStorage.getItem('token')
        
        const formData = new FormData()
        formData.append('companyName', form.value.companyName)
        formData.append('email', form.value.email)
        formData.append('phone', form.value.phone)
        formData.append('address', form.value.address)
        formData.append('wifi', form.value.wifi)
        formData.append('wifiPassword', form.value.wifiPassword)
        
        if (fileLogo.value) {
        formData.append('imgLogo', fileLogo.value)
        }
        if (fileQris.value) {
        formData.append('imgQris', fileQris.value)
        }

        await api.post('/settings', formData, {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
        })

        alertType.value = 'success'
        alertMsg.value = 'Pengaturan berhasil disimpan!'
        
        // Opsional: Muat ulang data setelah disimpan agar gambar ter-refresh
        await fetchSettings()

        setTimeout(() => { alertMsg.value = '' }, 3000)

    } catch (error: any) {
        console.error("Gagal menyimpan pengaturan", error)
        alertType.value = 'error'
        alertMsg.value = error.response?.data?.message || 'Terjadi kesalahan saat menyimpan.'
    } finally {
        isSaving.value = false
    }
    }

    onMounted(() => {
    fetchSettings()
    })
    </script>