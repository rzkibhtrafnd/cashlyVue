    <template>
    <div class="w-full h-full md:w-72 lg:w-[400px] flex flex-col bg-white dark:bg-gray-900 z-10 shrink-0 border-t md:border-t-0 border-gray-200 dark:border-gray-800 min-h-0">
        <div class="p-3 md:p-4 border-b border-gray-200 dark:border-gray-800 bg-brand-500 text-white shrink-0">
        <h2 class="text-base md:text-lg font-bold uppercase tracking-wider">Keranjang ({{ totalItems }})</h2>
        </div>

        <div class="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 min-h-0 no-scrollbar">
        <div v-if="cart.length === 0" class="flex flex-col items-center justify-center h-full text-gray-400 py-12">
            <svg class="w-10 h-10 md:w-12 md:h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
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
                <button @click="$emit('decrease', item)" class="px-2.5 py-0.5 text-gray-600 hover:text-brand-500 dark:text-gray-300">-</button>
                <span class="px-2 py-0.5 text-xs font-medium w-7 text-center border-x border-gray-200 dark:border-gray-700 dark:text-white">{{ item.qty }}</span>
                <button @click="$emit('increase', item)" class="px-2.5 py-0.5 text-gray-600 hover:text-brand-500 dark:text-gray-300">+</button>
            </div>
            </div>
        </div>
        </div>

        <div class="p-3 md:p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/50 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div class="flex justify-between items-end mb-3 md:mb-4">
            <span class="text-gray-600 dark:text-gray-400 font-medium text-xs md:text-sm uppercase">Total Bayar</span>
            <span class="text-xl md:text-2xl font-bold text-gray-800 dark:text-white leading-none">{{ formatRupiah(totalPrice) }}</span>
        </div>
        <button 
            @click="$emit('checkout')" 
            :disabled="cart.length === 0" 
            class="w-full py-2.5 md:py-3.5 rounded-xl text-sm md:text-base font-bold text-white shadow-theme-xs transition-all disabled:opacity-50"
            :class="cart.length > 0 ? 'bg-brand-500 hover:bg-brand-600' : 'bg-gray-400'"
        >
            PROSES PEMBAYARAN
        </button>
        </div>
    </div>
    </template>

    <script setup lang="ts">
    import { computed } from 'vue'

    interface Category {
    id: number
    name: string
    }

    interface Product {
    id: number
    name: string
    price: number
    image: string
    categoryId?: number
    category?: Category
    }

    interface CartItem extends Product {
    qty: number
    }

    const props = defineProps<{
    cart: CartItem[]
    formatRupiah: (num: number) => string
    }>()

    defineEmits<{
    (e: 'increase', item: CartItem): void
    (e: 'decrease', item: CartItem): void
    (e: 'checkout'): void
    }>()

    // --- Computed Properties ---
    const totalItems = computed(() => props.cart.reduce((sum, item) => sum + item.qty, 0))
    const totalPrice = computed(() => props.cart.reduce((sum, item) => sum + (item.price * item.qty), 0))
    </script>