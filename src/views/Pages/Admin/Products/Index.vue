    <template>
    <admin-layout>
        <div class="bg-gray-50 dark:bg-gray-950">
        <div class="mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6 2xl:p-10">
            
            <!-- Page Header -->
            <div class="rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div class="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                <h3 class="text-2xl font-bold text-gray-800 dark:text-white/90">Kelola Produk</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Kelola daftar produk, harga, kategori, dan gambar produk toko Anda.</p>
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
    import type { AxiosError } from 'axios'
    import api from '@/api/axios'
    import AdminLayout from '@/components/layout/AdminLayout.vue'

    import ProductList from './ProductList.vue'
    import ProductForm from './ProductForm.vue'

    interface Category {
    id: number;
    name: string;
    }

    interface Product {
    id?: number;
    name: string;
    price: number;
    categoryId: number;
    image?: string;
    }

    interface ProductFormSubmit {
    form: Product;
    file: File | null;
    }

    const backendBaseUrl = 'http://localhost:5000'
    const userRole = localStorage.getItem('role') || 'kasir'

    const products = ref<Product[]>([])
    const categories = ref<Category[]>([])
    const isLoading = ref(true)
    const isSaving = ref(false)

    const currentView = ref<'list' | 'form'>('list')
    const formData = ref<Product | null>(null)

    const alert = reactive({ msg: '', type: 'success' as 'success' | 'error' })
    let alertTimer: ReturnType<typeof setTimeout> | null = null

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
    } catch {
        showAlert('Gagal mengambil data produk', 'error')
    } finally {
        isLoading.value = false
    }
    }

    const fetchCategories = async () => {
    try {
        const response = await api.get('/categories', getAuthHeader())
        categories.value = response.data.data || response.data
    } catch {
        console.error('Gagal memuat kategori')
    }
    }

    const submitProduct = async ({ form, file }: ProductFormSubmit) => {
    isSaving.value = true
    try {
        const dataToSend = new FormData()
        dataToSend.append('name', form.name)
        dataToSend.append('price', form.price.toString())
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
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>
        const message = axiosError.response?.data?.message || 'Terjadi kesalahan saat menyimpan.'
        showAlert(message, 'error')
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
        const axiosError = error as AxiosError<{ message?: string }>
        const message = axiosError.response?.data?.message || 'Gagal menghapus produk'
        showAlert(message, 'error')
    }
    }

    // View Navigation Controls
    const openCreateForm = () => {
    if (userRole !== 'admin') return
    formData.value = null
    currentView.value = 'form'
    }

    const openEditForm = (product: Product) => {
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