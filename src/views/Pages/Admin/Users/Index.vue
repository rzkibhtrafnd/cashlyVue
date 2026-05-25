    <template>
    <admin-layout>
        <div class="bg-gray-50 dark:bg-gray-950">
        <div class="mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6 2xl:p-10">
            
            <div class="rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div class="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                <h3 class="text-2xl font-bold text-gray-800 dark:text-white/90">Kelola Pengguna</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Kelola daftar pengguna, atur peran, dan kelola akses sistem kasir dan admin.</p>
                </div>
            </div>
            </div>

            <div v-if="alert.msg"
            class="rounded-2xl border px-4 py-4 text-sm font-medium transition-all"
            :class="alert.type === 'success' ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400' : 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400'"
            >
            {{ alert.msg }}
            </div>

            <UserList 
            v-if="currentView === 'list'" 
            :users="users" 
            :is-loading="isLoading"
            @create="openCreateForm"
            @view="openDetail"
            @edit="openEditForm"
            @delete="deleteUser"
            />

            <UserDetail 
            v-else-if="currentView === 'detail' && selectedUser" 
            :user="selectedUser"
            @back="goBack"
            @edit="openEditForm"
            />

            <UserForm 
            v-else-if="currentView === 'form'" 
            :initial-data="formData"
            :is-saving="isSaving"
            @submit="submitUser"
            @cancel="goBack"
            />

        </div>
        </div>
    </admin-layout>
    </template>

    <script setup lang="ts">
    import { ref, reactive, onMounted } from 'vue'
    import type { AxiosError } from 'axios'
    import api from '@/api/axios'
    import AdminLayout from '@/components/layout/AdminLayout.vue'

    import UserList from './UserList.vue'
    import UserDetail from './UserDetail.vue'
    import UserForm from './UserForm.vue'

    interface User {
    id?: number;
    name: string;
    email: string;
    role: 'admin' | 'kasir';
    password?: string;
    }

    const users = ref<User[]>([])
    const isLoading = ref(true)
    const isSaving = ref(false)

    const currentView = ref<'list' | 'detail' | 'form'>('list')
    const selectedUser = ref<User | null>(null)
    const formData = ref<User | null>(null)

    const alert = reactive({ msg: '', type: 'success' as 'success' | 'error' })
    let alertTimer: ReturnType<typeof setTimeout> | null = null

    const getAuthHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })

    const showAlert = (message: string, type: 'success' | 'error') => {
    alert.msg = message
    alert.type = type
    if (alertTimer) clearTimeout(alertTimer)
    alertTimer = setTimeout(() => { alert.msg = '' }, 4000)
    }

    const fetchUsers = async () => {
    isLoading.value = true
    try {
        const response = await api.get('/users', getAuthHeader())
        users.value = response.data.data || response.data
    } catch {
        showAlert('Gagal mengambil data pengguna dari server', 'error')
    } finally {
        isLoading.value = false
    }
    }

    const submitUser = async (payloadForm: User) => {
    isSaving.value = true
    try {
        const payload: Record<string, string | number | boolean | undefined> = {
        name: payloadForm.name,
        email: payloadForm.email,
        role: payloadForm.role
        }
        if (payloadForm.password) payload.password = payloadForm.password

        if (payloadForm.id) {
        await api.put(`/users/${payloadForm.id}`, payload, getAuthHeader())
        showAlert('Pengguna berhasil diperbarui', 'success')
        } else {
        await api.post('/users', payload, getAuthHeader())
        showAlert('Pengguna baru berhasil ditambahkan', 'success')
        }

        goBack()
        await fetchUsers() 
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>
        const message = axiosError.response?.data?.message || 'Terjadi kesalahan saat menyimpan.'
        showAlert(message, 'error')
    } finally {
        isSaving.value = false
    }
    }

    const deleteUser = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return
    try {
        await api.delete(`/users/${id}`, getAuthHeader())
        showAlert('Pengguna berhasil dihapus', 'success')
        await fetchUsers()
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>
        const message = axiosError.response?.data?.message || 'Gagal menghapus pengguna'
        showAlert(message, 'error')
    }
    }

    const openDetail = (user: User) => {
    selectedUser.value = user
    currentView.value = 'detail'
    }

    const openCreateForm = () => {
    formData.value = null 
    currentView.value = 'form'
    }

    const openEditForm = (user: User) => {
    formData.value = { ...user }
    currentView.value = 'form'
    }

    const goBack = () => {
    currentView.value = 'list'
    selectedUser.value = null
    }

    onMounted(() => {
    fetchUsers()
    })
    </script>