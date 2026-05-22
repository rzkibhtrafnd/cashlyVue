    <template>
    <admin-layout>
        <div class="bg-gray-50 dark:bg-gray-950">
        <div class="mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6 2xl:p-10">
            
            <!-- Alert Notification -->
            <div v-if="alert.msg"
            class="rounded-2xl border px-4 py-4 text-sm font-medium transition-all"
            :class="alert.type === 'success' ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400' : 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400'"
            >
            {{ alert.msg }}
            </div>

            <!-- Render View Dinamis -->
            <ProductList 
            v-if="currentView === 'list'" 
            :products="products" 
            :is-loading="isLoading"
            :user-role="userRole"
            :get-image-url="getImageUrl"
            :format-rupiah="formatRupiah"
            @create="openCreateForm"
            @edit="openEditForm"
            @delete="deleteProduct"
            />

            <ProductForm 
            v-else-if="currentView === 'form' && userRole === 'admin'" 
            :initial-data="formData"
            :categories="categories"
            :is-saving="isSaving"
            :get-image-url="getImageUrl"
            @submit="submitProduct"
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

    // Import Komponen Anak yang Sudah Dipecah
    import ProductList from './ProductList.vue'
    import ProductForm from './ProductForm.vue'

    const backendBaseUrl = 'http://localhost:5000'
    const userRole = localStorage.getItem('role') || 'kasir'

    // State Utama
    const products = ref<any[]>([])
    const categories = ref<any[]>([])
    const isLoading = ref(true)
    const isSaving = ref(false)

    const currentView = ref<'list' | 'form'>('list')
    const formData = ref<any>(null)

    const alert = reactive({ msg: '', type: 'success' as 'success' | 'error' })
    let alertTimer: any = null

    // Helper Utilities
    const getAuthHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
    const getImageUrl = (filename: string) => `${backendBaseUrl}/uploads/${filename}`
    const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)

    const showAlert = (message: string, type: 'success' | 'error') => {
    alert.msg = message
    alert.type = type
    if (alertTimer) clearTimeout(alertTimer)
    alertTimer = setTimeout(() => { alert.msg = '' }, 4000)
    }

    // Fetching Data dari API
    const fetchProducts = async () => {
    isLoading.value = true
    try {
        const response = await api.get('/products', getAuthHeader())
        products.value = response.data.data || response.data
    } catch (error) {
        showAlert('Gagal mengambil data produk', 'error')
    } {
        isLoading.value = false
    }
    }

    const fetchCategories = async () => {
    try {
        const response = await api.get('/categories', getAuthHeader())
        categories.value = response.data.data || response.data
    } catch (error) {
        console.error('Gagal memuat kategori', error)
    }
    }

    // Handler Submit Form
    const submitProduct = async ({ form, file }: { form: any; file: File | null }) => {
    isSaving.value = true
    try {
        const dataToSend = new FormData()
        dataToSend.append('name', form.name)
        dataToSend.append('price', form.price)
        dataToSend.append('categoryId', form.categoryId.toString())
        
        if (file) {
        dataToSend.append('image', file)
        }

        const config = {
        headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
        }
        }

        if (form.id) {
        await api.put(`/products/${form.id}`, dataToSend, config)
        showAlert('Produk berhasil diperbarui', 'success')
        } else {
        await api.post('/products', dataToSend, config)
        showAlert('Produk baru berhasil ditambahkan', 'success')
        }

        goBack()
        await fetchProducts() 
    } catch (error: any) {
        showAlert(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan.', 'error')
    } finally {
        isSaving.value = false
    }
    }

    const deleteProduct = async (id: number) => {
    if (userRole !== 'admin') return
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return

    try {
        await api.delete(`/products/${id}`, getAuthHeader())
        showAlert('Produk berhasil dihapus', 'success')
        await fetchProducts()
    } catch (error) {
        showAlert('Gagal menghapus produk', 'error')
    }
    }

    // View Navigation Controls
    const openCreateForm = () => {
    if (userRole !== 'admin') return
    formData.value = null
    currentView.value = 'form'
    }

    const openEditForm = (product: any) => {
    if (userRole !== 'admin') return
    formData.value = { ...product }
    currentView.value = 'form'
    }

    const goBack = () => {
    currentView.value = 'list'
    }

    onMounted(() => {
    fetchProducts()
    fetchCategories()
    })
    </script>