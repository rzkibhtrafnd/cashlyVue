    <template>
    <admin-layout>
        <div class="bg-gray-50 dark:bg-gray-950">
        <div class="mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6 2xl:p-10">
            
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
    import api from '@/api/axios'
    import AdminLayout from '@/components/layout/AdminLayout.vue'

    import UserList from './UserList.vue'
    import UserDetail from './UserDetail.vue'
    import UserForm from './UserForm.vue'

    const users = ref<any[]>([])
    const isLoading = ref(true)
    const isSaving = ref(false)

    const currentView = ref<'list' | 'detail' | 'form'>('list')
    const selectedUser = ref<any | null>(null)
    const formData = ref<any>(null)

    const alert = reactive({ msg: '', type: 'success' as 'success' | 'error' })
    let alertTimer: any = null

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
    } catch (error) {
        showAlert('Gagal mengambil data pengguna dari server', 'error')
    } finally {
        isLoading.value = false
    }
    }

    const submitUser = async (payloadForm: any) => {
    isSaving.value = true
    try {
        const payload: any = { name: payloadForm.name, email: payloadForm.email, role: payloadForm.role }
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
    } catch (error: any) {
        showAlert(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan.', 'error')
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
        showAlert('Gagal menghapus pengguna', 'error')
    }
    }

    const openDetail = (user: any) => {
    selectedUser.value = user
    currentView.value = 'detail'
    }

    const openCreateForm = () => {
    formData.value = null 
    currentView.value = 'form'
    }

    const openEditForm = (user: any) => {
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