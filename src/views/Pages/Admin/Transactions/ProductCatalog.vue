    <template>
    <!-- Menambahkan h-full dan min-h-0 agar flex child mengunci kontainer -->
    <div class="flex-1 flex flex-col h-full min-h-0 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800">
        <!-- Header & Kategori (Tetap di atas, tidak ikut tergulung) -->
        <div class="flex flex-col border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
        <div class="p-3 md:p-4 flex justify-between items-center">
            <h2 class="text-lg font-bold text-gray-800 dark:text-white">Pilih Produk</h2>
        </div>
        
        <div class="px-3 md:px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
            <button 
            @click="changeCategory('')" 
            class="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            :class="selectedCategory === '' ? 'bg-brand-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'"
            >
            Semua
            </button>
            <button 
            v-for="cat in categories" 
            :key="cat.id" 
            @click="changeCategory(cat.id)" 
            class="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            :class="selectedCategory === cat.id ? 'bg-brand-500 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'"
            >
            {{ cat.name }}
            </button>
        </div>
        </div>

        <!-- Area Grid Produk (Hanya area ini yang memicu scroll internal) -->
        <div class="flex-1 overflow-y-auto p-3 md:p-4 min-h-0 no-scrollbar bg-gray-50/50 dark:bg-gray-950/20">
        <div v-if="isLoading" class="flex justify-center py-10">
            <svg class="h-8 w-8 animate-spin text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
        </div>
        
        <div v-else-if="paginatedProducts.length === 0" class="flex flex-col items-center justify-center h-full text-gray-400 py-10">
            <p>Tidak ada produk di kategori ini.</p>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            <div 
            v-for="product in paginatedProducts" 
            :key="product.id" 
            @click="$emit('add-to-cart', product)"
            class="group cursor-pointer rounded-xl border border-gray-200 bg-white p-3 transition-all hover:border-brand-500 hover:shadow-theme-sm dark:border-gray-800 dark:bg-gray-900 flex flex-col h-full"
            >
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

        <!-- Pagination (Tetap Terkunci Menempel di Sisi Bawah) -->
        <div class="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-between items-center shrink-0">
        <button 
            @click="localPage--" 
            :disabled="localPage === 1" 
            class="px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
        >
            Sebelumnya
        </button>
        <span class="text-xs md:text-sm text-gray-500 font-medium">Hal {{ localPage }} / {{ totalPages || 1 }}</span>
        <button 
            @click="localPage++" 
            :disabled="localPage === totalPages || totalPages === 0" 
            class="px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
        >
            Selanjutnya
        </button>
        </div>
    </div>
    </template>

    <script setup lang="ts">
    import { ref, computed } from 'vue'

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

        const props = defineProps<{
        products: Product[]
        categories: Category[]
        isLoading: boolean
        getImageUrl: (file: string) => string
        formatRupiah: (num: number) => string
        }>();

    defineEmits(['add-to-cart']);

    const selectedCategory = ref<number | ''>('');
    const localPage = ref(1);
    const itemsPerPage = 8;

    const filteredProducts = computed(() => {
    if (selectedCategory.value === '') return props.products
    return props.products.filter(p => p.categoryId === selectedCategory.value || p.category?.id === selectedCategory.value)
    });

    const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage));

    const paginatedProducts = computed(() => {
    const start = (localPage.value - 1) * itemsPerPage
    return filteredProducts.value.slice(start, start + itemsPerPage)
    });

    const changeCategory = (id: number | '') => {
    selectedCategory.value = id
    localPage.value = 1
    };
    </script>