    <template>
    <div class="rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <!-- Header Tabel -->
        <div class="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 dark:border-white/[0.05]">
        <div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Katalog Produk</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Daftar produk yang tersedia untuk dijual.</p>
        </div>
        
        <div v-if="userRole === 'admin'">
            <button @click="$emit('create')" class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4.16666V15.8333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.16663 10H15.8333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Tambah Produk
            </button>
        </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center p-10">
        <svg class="h-8 w-8 animate-spin text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
        </div>

        <!-- Tabel -->
        <div v-else class="max-w-full overflow-x-auto">
        <table class="w-full text-left">
            <thead class="border-y border-gray-100 bg-gray-50 dark:border-white/[0.05] dark:bg-gray-900">
            <tr>
                <th class="px-6 py-3 font-medium text-gray-500 text-xs uppercase dark:text-gray-400 w-24">Gambar</th>
                <th class="px-6 py-3 font-medium text-gray-500 text-xs uppercase dark:text-gray-400">Nama Produk</th>
                <th class="px-6 py-3 font-medium text-gray-500 text-xs uppercase dark:text-gray-400">Kategori</th>
                <th class="px-6 py-3 font-medium text-gray-500 text-xs uppercase dark:text-gray-400">Harga</th>
                <th v-if="userRole === 'admin'" class="px-6 py-3 font-medium text-gray-500 text-xs uppercase dark:text-gray-400 text-right">Aksi</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-white/[0.05]">
            <tr v-if="paginatedProducts.length === 0">
                <td :colspan="userRole === 'admin' ? 5 : 4" class="px-6 py-8 text-center text-gray-500">Belum ada data produk.</td>
            </tr>

            <!-- UBAH: Loop menggunakan paginatedProducts, bukan products -->
            <tr v-for="product in paginatedProducts" :key="product.id" class="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">
                <td class="px-6 py-4">
                <div class="h-12 w-12 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 flex items-center justify-center">
                    <img v-if="product.image" :src="getImageUrl(product.image)" alt="Produk" class="h-full w-full object-cover" />
                    <svg v-else class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                </td>
                <td class="px-6 py-4">
                <span class="block text-sm font-semibold text-gray-800 dark:text-gray-200">{{ product.name }}</span>
                <span class="text-xs text-gray-500">ID: #{{ String(product.id).padStart(4, '0') }}</span>
                </td>
                <td class="px-6 py-4">
                <span class="inline-flex rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    {{ product.category?.name || 'Tanpa Kategori' }}
                </span>
                </td>
                <td class="px-6 py-4">
                <span class="text-sm font-bold text-brand-600 dark:text-brand-400">{{ formatRupiah(product.price) }}</span>
                </td>
                <td v-if="userRole === 'admin'" class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                    <button @click="$emit('edit', product)" class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-theme-xs transition hover:border-brand-500 hover:text-brand-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Edit
                    </button>
                    <button @click="$emit('delete', product.id)" class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-theme-xs transition hover:border-red-500 hover:text-red-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> Hapus
                    </button>
                </div>
                </td>
            </tr>
            </tbody>
        </table>
        </div>

        <div v-if="!isLoading && products.length > 0" class="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-white/[0.05] dark:bg-gray-900/50">
        <span class="text-sm text-gray-500 dark:text-gray-400">
            Menampilkan <span class="font-semibold text-gray-800 dark:text-gray-200">{{ startIndex + 1 }}</span> hingga <span class="font-semibold text-gray-800 dark:text-gray-200">{{ Math.min(endIndex, products.length) }}</span> dari <span class="font-semibold text-gray-800 dark:text-gray-200">{{ products.length }}</span> produk
        </span>
        <div class="flex gap-2">
            <button 
            @click="currentPage--" 
            :disabled="currentPage === 1" 
            class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
            Sebelumnya
            </button>
            <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages || totalPages === 0" 
            class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
            Selanjutnya
            </button>
        </div>
        </div>

    </div>
    </template>

    <script setup lang="ts">
    import { ref, computed, watch } from 'vue';

    const props = defineProps<{
    products: any[];
    isLoading: boolean;
    userRole: string;
    getImageUrl: (filename: string) => string;
    formatRupiah: (num: number) => string;
    }>();

    defineEmits(['create', 'edit', 'delete']);

    const currentPage = ref(1);
    const itemsPerPage = 7;

    const totalPages = computed(() => Math.ceil(props.products.length / itemsPerPage));
    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
    const endIndex = computed(() => startIndex.value + itemsPerPage);

    const paginatedProducts = computed(() => {
    return props.products.slice(startIndex.value, endIndex.value);
    });

    watch(() => props.products, () => {
    currentPage.value = 1;
    }, { deep: true });
    </script>