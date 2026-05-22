    <template>
    <admin-layout>
        <div 
        class="flex flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden w-full mb-6 md:rounded-b-2xl border-b border-gray-200 dark:border-gray-800 shadow-sm"
        style="height: calc(100vh - 110px);"
        >
        
        <div class="flex md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shrink-0">
            <button 
            @click="mobileView = 'catalog'"
            class="flex-1 py-3.5 text-sm font-bold transition-colors"
            :class="mobileView === 'catalog' ? 'text-brand-500 border-b-2 border-brand-500 bg-brand-50/30 dark:bg-brand-500/10' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'"
            >
            Katalog Produk
            </button>
            <button 
            @click="mobileView = 'cart'"
            class="flex-1 py-3.5 text-sm font-bold transition-colors flex items-center justify-center gap-2"
            :class="mobileView === 'cart' ? 'text-brand-500 border-b-2 border-brand-500 bg-brand-50/30 dark:bg-brand-500/10' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'"
            >
            Keranjang 
            <span v-if="totalItems > 0" class="bg-brand-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">{{ totalItems }}</span>
            </button>
        </div>

        <div class="flex flex-1 flex-col md:flex-row min-h-0 overflow-hidden">
            
            <ProductCatalog
            :class="mobileView === 'catalog' ? 'flex' : 'hidden md:flex'"
            :products="products"
            :categories="categories"
            :is-loading="isLoadingProducts"
            :get-image-url="getImageUrl"
            :format-rupiah="formatRupiah"
            @add-to-cart="addToCart"
            />

            <CartSidebar
            :class="mobileView === 'cart' ? 'flex' : 'hidden md:flex'"
            :cart="cart"
            :format-rupiah="formatRupiah"
            @increase="increaseQty"
            @decrease="decreaseQty"
            @checkout="openPaymentModal"
            />

        </div>

        <PaymentModal
            v-if="showPaymentModal"
            :total-price="totalPrice"
            :dynamic-qris-image="dynamicQrisImage"
            :settings="settings"
            :is-processing="isProcessing"
            :error="paymentError"
            :format-rupiah="formatRupiah"
            @close="closePaymentModal"
            @submit-payment="handlePaymentSubmit"
            @done-qris="showReceiptStep"
        />

        <ReceiptModal
            v-if="showReceiptModal"
            :transaction="currentTransaction"
            :customer-money-paid="customerMoneyPaid"
            :settings="settings"
            :format-number="formatNumber"
            :format-date="formatDate"
            @finish="closeReceiptAndReset"
        />

        </div>
    </admin-layout>
    </template>

    <script setup lang="ts">
    import { ref, computed, onMounted } from 'vue'
    import api from '@/api/axios'
    import AdminLayout from '@/components/layout/AdminLayout.vue'

    import ProductCatalog from './ProductCatalog.vue'
    import CartSidebar from './CartSidebar.vue'
    import PaymentModal from './PaymentModal.vue'
    import ReceiptModal from './ReceiptModal.vue'

    const backendBaseUrl = 'http://localhost:5000'

    interface Product { id: number; name: string; price: number; image: string; categoryId?: number; category?: any }
    interface CartItem extends Product { qty: number }

    const products = ref<Product[]>([])
    const categories = ref<any[]>([])
    const cart = ref<CartItem[]>([])
    const settings = ref<any>(null)
    const isLoadingProducts = ref(true)

    const mobileView = ref<'catalog' | 'cart'>('catalog')

    const showPaymentModal = ref(false)
    const showReceiptModal = ref(false)
    const isProcessing = ref(false)
    const paymentError = ref('')
    const dynamicQrisImage = ref('')

    const currentTransaction = ref<any>(null)
    const customerMoneyPaid = ref(0)

    const totalPrice = computed(() => cart.value.reduce((sum, item) => sum + (item.price * item.qty), 0));
    const totalItems = computed(() => cart.value.reduce((sum, item) => sum + item.qty, 0));

    const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)
    const formatNumber = (num: number) => new Intl.NumberFormat('id-ID').format(num)
    const getImageUrl = (filename: string) => `${backendBaseUrl}/uploads/${filename}`
    const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    }

    const addToCart = (product: Product) => {
    const existing = cart.value.find(i => i.id === product.id)
    if (existing) existing.qty++
    else cart.value.push({ ...product, qty: 1 })
    };

    const increaseQty = (item: CartItem) => item.qty++;
    const decreaseQty = (item: CartItem) => {
    item.qty--
    if (item.qty === 0) cart.value = cart.value.filter(i => i.id !== item.id)
    };

    const openPaymentModal = () => {
    paymentError.value = ''
    dynamicQrisImage.value = ''
    showPaymentModal.value = true
    };

    const closePaymentModal = () => { showPaymentModal.value = false };

    const handlePaymentSubmit = async ({ method, money }: { method: 'cash' | 'qris'; money: number }) => {
    isProcessing.value = true
    paymentError.value = ''
    const token = localStorage.getItem('token')

    try {
        const payload = {
        paymentMethod: method,
        cart: cart.value.map(item => ({ id: item.id, qty: item.qty }))
        }

        const resTrx = await api.post('/transactions', payload, { headers: { Authorization: `Bearer ${token}` } })
        const trxData = resTrx.data.data || resTrx.data

        if (method === 'qris') {
        if (trxData.qrisImage) dynamicQrisImage.value = trxData.qrisImage
        else if (trxData.qrisError) throw new Error(trxData.qrisError)
        currentTransaction.value = trxData
        } else {
        const resDetail = await api.get(`/transactions/${trxData.id}`, { headers: { Authorization: `Bearer ${token}` } })
        currentTransaction.value = resDetail.data.data || resDetail.data
        customerMoneyPaid.value = money
        showPaymentModal.value = false
        showReceiptModal.value = true
        }
    } catch (error: any) {
        paymentError.value = error.response?.data?.message || error.message || 'Gagal memproses transaksi'
    } finally {
        isProcessing.value = false
    }
    };

    const showReceiptStep = async () => {
    if (!currentTransaction.value) return
    const token = localStorage.getItem('token')
    try {
        const resDetail = await api.get(`/transactions/${currentTransaction.value.id}`, { headers: { Authorization: `Bearer ${token}` } })
        currentTransaction.value = resDetail.data.data || resDetail.data
        showPaymentModal.value = false
        showReceiptModal.value = true
        dynamicQrisImage.value = ''
    } catch (error) {
        console.error("Gagal memuat detail struk", error)
    }
    };

    const closeReceiptAndReset = () => {
    showReceiptModal.value = false
    cart.value = []
    currentTransaction.value = null
    customerMoneyPaid.value = 0
    mobileView.value = 'catalog'
    };

    onMounted(async () => {
    const token = localStorage.getItem('token')
    try {
        const [resProd, resCat, resSet] = await Promise.all([
        api.get('/products', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/categories', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/settings', { headers: { Authorization: `Bearer ${token}` } })
        ])
        products.value = resProd.data.data || resProd.data
        categories.value = resCat.data.data || resCat.data
        settings.value = resSet.data.data || resSet.data
    } catch (error) {
        console.error("Gagal memuat data POS:", error)
    } finally {
        isLoadingProducts.value = false
    }
    });
    </script>

    <style scoped>
    :deep(body), :global(body) {
    overflow: hidden !important;
    }

    :deep(main) {
    padding: 0 !important;
    margin: 0 !important;
    overflow: hidden !important;
    }
    </style>