    <template>
    <admin-layout>
        <div class="flex flex-col md:flex-row bg-gray-50 dark:bg-gray-950 overflow-hidden">
        
        <!-- Sisi Kiri: Daftar Produk -->
        <div class="flex-1 flex flex-col min-h-0 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800">
            
            <!-- Header & Kategori -->
            <div class="flex flex-col border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
            <div class="p-3 md:p-4 flex justify-between items-center">
                <h2 class="text-lg font-bold text-gray-800 dark:text-white">Pilih Produk</h2>
            </div>
            
            <div class="px-3 md:px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
                <button @click="setCategory('')" 
                        class="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                        :class="selectedCategory === '' ? 'bg-brand-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'">
                Semua
                </button>
                <button v-for="cat in categories" :key="cat.id" 
                        @click="setCategory(cat.id)" 
                        class="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                        :class="selectedCategory === cat.id ? 'bg-brand-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'">
                {{ cat.name }}
                </button>
            </div>
            </div>

            <!-- Area Scrollable Produk -->
            <div class="flex-1 overflow-y-auto p-3 md:p-4 min-h-0 no-scrollbar">
            <div v-if="isLoadingProducts" class="flex justify-center py-10">
                <svg class="h-8 w-8 animate-spin text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
            </div>
            
            <div v-else-if="paginatedProducts.length === 0" class="flex flex-col items-center justify-center h-full text-gray-400">
                <p>Tidak ada produk di kategori ini.</p>
            </div>

            <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-4">
                <div v-for="product in paginatedProducts" :key="product.id" 
                    @click="addToCart(product)"
                    class="group cursor-pointer rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-brand-500 hover:shadow-theme-sm dark:border-gray-800 dark:bg-gray-900 flex flex-col h-full">
                <div class="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 mb-3 flex items-center justify-center shrink-0">
                    <img v-if="product.image" :src="getImageUrl(product.image)" :alt="product.name" class="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                    <svg v-else class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <div class="flex-1 flex flex-col justify-between">
                    <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 leading-tight mb-1">{{ product.name }}</h3>
                    <p class="text-brand-600 dark:text-brand-400 font-bold text-sm">{{ formatRupiah(product.price) }}</p>
                </div>
                </div>
            </div>
            </div>

            <!-- Pagination Section Aktif -->
            <div class="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-between items-center shrink-0">
            <button @click="currentPage--" :disabled="currentPage === 1" 
                    class="px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300">
                Sebelumnya
            </button>
            <span class="text-xs md:text-sm text-gray-500 font-medium">Hal {{ currentPage }} / {{ totalPages || 1 }}</span>
            <button @click="currentPage++" :disabled="currentPage === totalPages || totalPages === 0" 
                    class="px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300">
                Selanjutnya
            </button>
            </div>
        </div>

        <!-- Sisi Kanan: Keranjang -->
        <div class="w-full h-[50vh] md:h-full md:w-72 lg:w-[400px] flex flex-col bg-white dark:bg-gray-900 z-10 shrink-0 border-t md:border-t-0 border-gray-200 dark:border-gray-800">
            <div class="p-3 md:p-4 border-b border-gray-200 dark:border-gray-800 bg-brand-500 text-white shrink-0">
            <h2 class="text-base md:text-lg font-bold uppercase tracking-wider">Keranjang ({{ totalItems }})</h2>
            </div>

            <!-- List Item Keranjang -->
            <div class="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 min-h-0 no-scrollbar">
            <div v-if="cart.length === 0" class="flex flex-col items-center justify-center h-full text-gray-400">
                <svg class="w-10 h-10 md:w-12 md:h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                <p class="text-sm md:text-base italic">Keranjang kosong</p>
            </div>

            <div v-else v-for="item in cart" :key="item.id" class="flex justify-between items-start pb-3 border-b border-gray-100 dark:border-gray-800">
                <div class="flex-1 pr-2">
                <h4 class="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight">{{ item.name }}</h4>
                <p class="text-xs text-gray-500 mt-0.5">{{ formatRupiah(item.price) }}</p>
                </div>
                <div class="flex flex-col items-end gap-1.5 shrink-0">
                <span class="text-sm font-bold text-brand-600 dark:text-brand-400">{{ formatRupiah(item.price * item.qty) }}</span>
                <div class="flex items-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <button @click="decreaseQty(item)" class="px-2.5 py-0.5 text-gray-600 hover:text-brand-500 dark:text-gray-300">-</button>
                    <span class="px-2 py-0.5 text-xs font-medium w-7 text-center border-x border-gray-200 dark:border-gray-700 dark:text-white">{{ item.qty }}</span>
                    <button @click="increaseQty(item)" class="px-2.5 py-0.5 text-gray-600 hover:text-brand-500 dark:text-gray-300">+</button>
                </div>
                </div>
            </div>
            </div>

            <!-- Total & Bayar -->
            <div class="p-3 md:p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:shadow-none">
            <div class="flex justify-between items-end mb-3 md:mb-4">
                <span class="text-gray-600 dark:text-gray-400 font-medium text-xs md:text-sm uppercase">Total Bayar</span>
                <span class="text-xl md:text-2xl font-bold text-gray-800 dark:text-white leading-none">{{ formatRupiah(totalPrice) }}</span>
            </div>
            <button @click="openPaymentModal" :disabled="cart.length === 0" 
                    class="w-full py-2.5 md:py-3.5 rounded-xl text-sm md:text-base font-bold text-white shadow-theme-xs transition-all disabled:opacity-50"
                    :class="cart.length > 0 ? 'bg-brand-500 hover:bg-brand-600' : 'bg-gray-400'">
                PROSES PEMBAYARAN
            </button>
            </div>
        </div>
        </div>

        <!-- MODAL PEMBAYARAN -->
        <div v-if="showPaymentModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
        <div class="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-gray-900 overflow-hidden flex flex-col max-h-[90vh]">
            <div class="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-800 shrink-0">
            <h3 class="text-lg font-bold text-gray-800 dark:text-white">Pembayaran</h3>
            <button @click="closePaymentModal" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            </div>

            <div class="p-5 overflow-y-auto">
            <div class="text-center mb-6 rounded-2xl bg-brand-50/70 border border-brand-100 p-5 dark:bg-brand-500/10 dark:border-brand-500/20">
                <p class="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-1">Total Tagihan</p>
                <p class="text-3xl font-black text-brand-600 dark:text-brand-400">{{ formatRupiah(totalPrice) }}</p>
            </div>

            <div v-if="!dynamicQrisImage" class="flex gap-4 mb-6">
                <button @click="paymentMethod = 'cash'" class="flex-1 py-3 rounded-xl border-2 font-bold transition-all text-sm"
                        :class="paymentMethod === 'cash' ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/10' : 'border-gray-200 text-gray-500 dark:border-gray-700'">
                Tunai (Cash)
                </button>
                <button @click="paymentMethod = 'qris'" class="flex-1 py-3 rounded-xl border-2 font-bold transition-all text-sm"
                        :class="paymentMethod === 'qris' ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/10' : 'border-gray-200 text-gray-500 dark:border-gray-700'">
                QRIS
                </button>
            </div>

            <div v-if="paymentMethod === 'cash'" class="space-y-4">
                <div>
                <label class="mb-2 block text-sm font-medium text-gray-800 dark:text-white">Uang Pelanggan (Rp)</label>
                <input v-model="customerMoney" type="number" min="0" placeholder="0" class="w-full text-lg rounded-xl border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white font-medium" />
                </div>
                <div class="flex justify-between items-center rounded-xl bg-green-50 p-4 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
                <span class="font-medium text-green-800 dark:text-green-400">Kembalian</span>
                <span class="text-xl font-bold text-green-800 dark:text-green-400">{{ formatRupiah(changeMoney > 0 ? changeMoney : 0) }}</span>
                </div>
            </div>

            <div v-if="paymentMethod === 'qris'" class="flex flex-col items-center justify-center">
                <div v-if="isProcessing && !dynamicQrisImage" class="flex flex-col items-center py-10 gap-3">
                <svg class="h-9 w-9 animate-spin text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                <span class="text-sm font-medium text-brand-600 dark:text-brand-400 animate-pulse">Menyusun QRIS Dinamis...</span>
                </div>
                
                <template v-else-if="dynamicQrisImage">
                <div class="relative group p-3 bg-white dark:bg-gray-800 rounded-2xl border-2 border-brand-500/30 shadow-md">
                    <img :src="dynamicQrisImage" alt="QRIS Dinamis" class="w-64 h-64 md:w-72 md:h-72 object-contain" />
                    <div class="absolute inset-x-0 bottom-3 flex justify-center no-print">
                    <span class="px-3 py-1 bg-brand-500 text-white font-mono text-[10px] font-bold tracking-widest rounded-full uppercase shadow-sm">Dynamic Lock</span>
                    </div>
                </div>
                <div class="mt-4 text-center">
                    <p class="text-xs text-gray-500 dark:text-gray-400">Silakan arahkan gawai pelanggan ke kode QR di atas untuk menyelesaikan transaksi.</p>
                </div>
                </template>

                <div v-else-if="!settings?.imgQris" class="w-64 h-64 md:w-72 md:h-72 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl">
                <span class="text-gray-400 text-sm text-center px-4">QRIS master belum diunggah di Pengaturan</span>
                </div>
                <div v-else class="text-center py-6">
                <p class="text-sm text-gray-500 dark:text-gray-400">Sistem POS siap melakukan injeksi nominal tagihan otomatis.</p>
                </div>
            </div>

            <div v-if="paymentError" class="mt-4 text-center text-sm font-medium text-red-500">
                {{ paymentError }}
            </div>
            </div>

            <div class="border-t border-gray-200 p-5 dark:border-gray-800 shrink-0">
            <button v-if="paymentMethod === 'qris' && dynamicQrisImage" @click="showReceiptStep"
                    class="w-full py-3.5 rounded-xl font-bold text-white bg-brand-500 hover:bg-brand-600 shadow-theme-sm transition-all">
                Pelanggan Sudah Bayar & Buka Struk
            </button>

            <button @click="processPayment" :disabled="!isPaymentValid || isProcessing" v-else
                    class="w-full py-3.5 rounded-xl font-bold text-white bg-brand-500 hover:bg-brand-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-theme-xs">
                <span v-if="isProcessing">Memproses transaksi...</span>
                <span v-else-if="paymentMethod === 'qris'">Buat QRIS Dinamis</span>
                <span v-else>Selesaikan Transaksi</span>
            </button>
            </div>
        </div>
        </div>

        <!-- MODAL STRUK -->
        <div v-if="showReceiptModal" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 p-4 receipt-overlay">
        <div id="print-area" class="w-[300px] bg-white text-black p-4 font-mono text-xs shadow-2xl relative mx-auto my-auto print-receipt-container">
            
            <div class="text-center mb-4">
            <h2 class="text-lg font-bold uppercase">{{ settings?.companyName || 'CASHLY POS' }}</h2>
            <p>{{ settings?.address || 'Alamat Belum Diatur' }}</p>
            <p>Telp: {{ settings?.phone || '-' }}</p>
            </div>
            
            <div class="border-b border-dashed border-gray-400 mb-2"></div>
            
            <div class="mb-2">
            <div class="flex justify-between"><p>Tgl:</p><p>{{ formatDate(currentTransaction?.createdAt) }}</p></div>
            <div class="flex justify-between"><p>No:</p><p>TRX-{{ currentTransaction?.id }}</p></div>
            <div class="flex justify-between"><p>Ksr:</p><p>{{ currentTransaction?.user?.name }}</p></div>
            </div>

            <div class="border-b border-dashed border-gray-400 mb-2"></div>
            
            <div class="mb-2">
            <div v-for="item in currentTransaction?.items" :key="item.id" class="mb-2">
                <p class="font-bold">{{ item.product?.name || 'Produk' }}</p>
                <div class="flex justify-between">
                <p>{{ item.qty }} x {{ formatNumber(item.price) }}</p>
                <p>{{ formatNumber(item.subtotal) }}</p>
                </div>
            </div>
            </div>

            <div class="border-b border-dashed border-gray-400 mb-2"></div>
            
            <div class="mb-4">
            <div class="flex justify-between font-bold text-sm">
                <p>TOTAL</p>
                <p>{{ formatNumber(currentTransaction?.total) }}</p>
            </div>
            <div class="flex justify-between">
                <p>METODE</p>
                <p class="uppercase">{{ currentTransaction?.paymentMethod }}</p>
            </div>
            <template v-if="currentTransaction?.paymentMethod === 'cash'">
                <div class="flex justify-between">
                <p>BAYAR</p>
                <p>{{ formatNumber(customerMoneyPaid) }}</p>
                </div>
                <div class="flex justify-between">
                <p>KEMBALI</p>
                <p>{{ formatNumber(customerMoneyPaid - currentTransaction?.total) }}</p>
                </div>
            </template>
            </div>
            
            <div class="border-b border-dashed border-gray-400 mb-4"></div>

            <div class="text-center mt-4">
            <p class="font-bold">TERIMA KASIH</p>
            <p>Barang yang sudah dibeli tidak dapat ditukar/dikembalikan</p>
            </div>
        </div>

        <div class="absolute bottom-6 flex gap-4 no-print flex-col sm:flex-row">
            <button @click="printReceipt" class="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg hover:bg-blue-700">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            Cetak Struk
            </button>
            <button @click="closeReceiptAndReset" class="rounded-xl bg-gray-700 px-6 py-3 font-bold text-white shadow-lg hover:bg-gray-800 text-center">
            Selesai & Transaksi Baru
            </button>
        </div>
        </div>
    </admin-layout>
    </template>

    <script setup lang="ts">
    import { ref, computed, onMounted } from 'vue'
    import api from '@/api/axios'
    import AdminLayout from '@/components/layout/AdminLayout.vue'

    const backendBaseUrl = 'http://localhost:5000'

    interface Category { id: number; name: string; }
    interface Product { id: number; name: string; price: number; image: string; category?: Category; categoryId?: number; }
    interface CartItem extends Product { qty: number; }
    interface Setting { companyName: string; address: string; phone: string; imgQris: string; }

    const products = ref<Product[]>([])
    const categories = ref<Category[]>([])
    const cart = ref<CartItem[]>([])
    const settings = ref<Setting | null>(null)
    const isLoadingProducts = ref(true)

    const selectedCategory = ref<number | ''>('')
    const currentPage = ref(1)

    // UBAHAN DI SINI: Jumlah produk per halaman sekarang diset ke 6 item
    const itemsPerPage = 9

    const showPaymentModal = ref(false)
    const isProcessing = ref(false)
    const paymentMethod = ref<'cash' | 'qris'>('cash')
    const customerMoney = ref<number | ''>('')
    const paymentError = ref('')
    const dynamicQrisImage = ref('')

    const showReceiptModal = ref(false)
    const currentTransaction = ref<any>(null)
    const customerMoneyPaid = ref(0) 

    const filteredProducts = computed(() => {
    if (selectedCategory.value === '') return products.value
    return products.value.filter(p => p.categoryId === selectedCategory.value || p.category?.id === selectedCategory.value)
    })

    // Perhitungan jumlah halaman otomatis mengikuti jumlah data produk yang difilter / 6
    const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))

    // Memotong array produk untuk dirender per halaman secara akurat
    const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    return filteredProducts.value.slice(start, start + itemsPerPage)
    })

    const totalItems = computed(() => cart.value.reduce((sum, item) => sum + item.qty, 0))
    const totalPrice = computed(() => cart.value.reduce((sum, item) => sum + (item.price * item.qty), 0))
    const changeMoney = computed(() => Number(customerMoney.value) - totalPrice.value)

    const isPaymentValid = computed(() => {
    if (paymentMethod.value === 'cash') {
        return Number(customerMoney.value) >= totalPrice.value
    }
    return true 
    })

    const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)
    const formatNumber = (num: number) => new Intl.NumberFormat('id-ID').format(num)
    const getImageUrl = (filename: string) => `${backendBaseUrl}/uploads/${filename}`
    const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    }

    onMounted(async () => {
    const token = localStorage.getItem('token')
    try {
        const resProd = await api.get('/products', { headers: { Authorization: `Bearer ${token}` } })
        products.value = resProd.data.data || resProd.data

        const resCat = await api.get('/categories', { headers: { Authorization: `Bearer ${token}` } })
        categories.value = resCat.data.data || resCat.data

        const resSet = await api.get('/settings', { headers: { Authorization: `Bearer ${token}` } })
        settings.value = resSet.data.data || resSet.data
    } catch (error) {
        console.error("Gagal memuat data awal POS:", error)
    } finally {
        isLoadingProducts.value = false
    }
    })

    const setCategory = (catId: number | '') => {
    selectedCategory.value = catId
    currentPage.value = 1 
    }

    const addToCart = (product: Product) => {
    const existing = cart.value.find(i => i.id === product.id)
    if (existing) {
        existing.qty++
    } else {
        cart.value.push({ ...product, qty: 1 })
    }
    }

    const increaseQty = (item: CartItem) => item.qty++
    const decreaseQty = (item: CartItem) => {
    item.qty--
    if (item.qty === 0) {
        cart.value = cart.value.filter(i => i.id !== item.id)
    }
    }

    const openPaymentModal = () => {
    paymentError.value = ''
    customerMoney.value = ''
    dynamicQrisImage.value = ''
    paymentMethod.value = 'cash'
    showPaymentModal.value = true
    }

    const closePaymentModal = () => {
    showPaymentModal.value = false
    dynamicQrisImage.value = ''
    }

    const processPayment = async () => {
    isProcessing.value = true
    paymentError.value = ''
    const token = localStorage.getItem('token')

    try {
        const payload = {
        paymentMethod: paymentMethod.value,
        cart: cart.value.map(item => ({ id: item.id, qty: item.qty }))
        }

        const resTrx = await api.post('/transactions', payload, {
        headers: { Authorization: `Bearer ${token}` }
        })

        const trxData = resTrx.data.data || resTrx.data;

        if (paymentMethod.value === 'qris') {
        if (trxData.qrisImage) {
            dynamicQrisImage.value = trxData.qrisImage;
        } else if (trxData.qrisError) {
            throw new Error(trxData.qrisError);
        }
        currentTransaction.value = trxData;
        } else {
        const newTransactionId = trxData.id;
        const resDetail = await api.get(`/transactions/${newTransactionId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        currentTransaction.value = resDetail.data.data || resDetail.data
        customerMoneyPaid.value = Number(customerMoney.value)

        showPaymentModal.value = false
        showReceiptModal.value = true
        }

    } catch (error: any) {
        console.error("Gagal memproses transaksi:", error)
        paymentError.value = error.response?.data?.message || error.message || 'Gagal memproses transaksi'
    } finally {
        isProcessing.value = false
    }
    }

    const showReceiptStep = async () => {
    if (!currentTransaction.value) return
    const token = localStorage.getItem('token')
    
    try {
        const resDetail = await api.get(`/transactions/${currentTransaction.value.id}`, {
        headers: { Authorization: `Bearer ${token}` }
        })
        currentTransaction.value = resDetail.data.data || resDetail.data
        
        showPaymentModal.value = false
        showReceiptModal.value = true
        dynamicQrisImage.value = ''
    } catch (error) {
        console.error("Gagal memuat struk belanja penuh:", error)
    }
    }

    const printReceipt = () => {
    window.print()
    }

    const closeReceiptAndReset = () => {
    showReceiptModal.value = false
    cart.value = [] 
    currentTransaction.value = null
    customerMoneyPaid.value = 0
    }
    </script>

    <style>
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    @media print {
    body * { visibility: hidden; }
    #print-area, #print-area * { visibility: visible; }
    #print-area {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        max-width: 300px; 
        margin: 0;
        padding: 10px;
        box-shadow: none !important;
    }
    .no-print { display: none !important; }
    }
    </style>