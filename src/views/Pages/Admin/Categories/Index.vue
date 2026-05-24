    <template>
    <admin-layout>
        <div class="bg-gray-50 dark:bg-gray-950">
        <div class="mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6 2xl:p-10">
            
            <!-- Page Header -->
            <div class="rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div class="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                <h3 class="text-2xl font-bold text-gray-800 dark:text-white/90">Kelola Kategori</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Tambah, edit, atau hapus kategori produk untuk mengorganisir inventori toko Anda.</p>
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

            <!-- Content Area -->
            <CategoryList 
            v-if="currentView === 'list'" 
            :categories="categories" 
            :is-loading="isLoading"
            @create="openCreateForm"
            @edit="openEditForm"
            @delete="deleteCategory"
            />

            <CategoryForm 
            v-else-if="currentView === 'form'" 
            :initial-data="formData"
            :is-saving="isSaving"
            @submit="submitCategory"
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

    import CategoryList from './CategoryList.vue'
    import CategoryForm from './CategoryForm.vue'

    interface Category {
    id?: number;
    name: string;
    }

    const categories = ref<Category[]>([])
    const isLoading = ref(true)
    const isSaving = ref(false)

    const currentView = ref<'list' | 'form'>('list')
    const formData = ref<Category | null>(null)

    const alert = reactive({ msg: '', type: 'success' as 'success' | 'error' })
    let alertTimer: ReturnType<typeof setTimeout> | null = null

    const getAuthHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })

    const showAlert = (message: string, type: 'success' | 'error') => {
    alert.msg = message
    alert.type = type
    if (alertTimer) clearTimeout(alertTimer)
    alertTimer = setTimeout(() => { alert.msg = '' }, 4000)
    }

    const fetchCategories = async () => {
    isLoading.value = true
    try {
        const response = await api.get('/categories', getAuthHeader())
        categories.value = response.data.data || response.data
    } catch {
        showAlert('Gagal mengambil data kategori dari server', 'error')
    } finally {
        isLoading.value = false
    }
    }

    const submitCategory = async (payloadForm: Category) => {
    isSaving.value = true
    try {
        const payload = { name: payloadForm.name }

        if (payloadForm.id) {
        await api.put(`/categories/${payloadForm.id}`, payload, getAuthHeader())
        showAlert('Kategori berhasil diperbarui', 'success')
        } else {
        await api.post('/categories', payload, getAuthHeader())
        showAlert('Kategori baru berhasil ditambahkan', 'success')
        }

        goBack()
        await fetchCategories() 
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>
        const message = axiosError.response?.data?.message || 'Terjadi kesalahan saat menyimpan.'
        showAlert(message, 'error')
    } finally {
        isSaving.value = false
    }
    }

    const deleteCategory = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kategori ini? Data produk yang terkait mungkin akan terpengaruh.')) return

    try {
        await api.delete(`/categories/${id}`, getAuthHeader())
        showAlert('Kategori berhasil dihapus', 'success')
        await fetchCategories()
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>
        const message = axiosError.response?.data?.message || 'Gagal menghapus kategori'
        showAlert(message, 'error')
    }
    }

    const openCreateForm = () => {
    formData.value = null
    currentView.value = 'form'
    }

    const openEditForm = (category: Category) => {
    formData.value = { ...category }
    currentView.value = 'form'
    }

    const goBack = () => {
    currentView.value = 'list'
    }

    onMounted(() => {
    fetchCategories()
    })
    </script>