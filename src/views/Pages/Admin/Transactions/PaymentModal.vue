    <template>
    <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
        <div class="w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-gray-900 overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-800 shrink-0">
            <h3 class="text-lg font-bold text-gray-800 dark:text-white">Pembayaran</h3>
            <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>

        <!-- Body -->
        <div class="p-5 overflow-y-auto">
            <div class="text-center mb-6 rounded-2xl bg-brand-50/70 border border-brand-100 p-5 dark:bg-brand-500/10 dark:border-brand-500/20">
            <p class="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-1">Total Tagihan</p>
            <p class="text-3xl font-black text-brand-600 dark:text-brand-400">{{ formatRupiah(totalPrice) }}</p>
            </div>

            <div v-if="!dynamicQrisImage" class="flex gap-4 mb-6">
            <button @click="method = 'cash'" class="flex-1 py-3 rounded-xl border-2 font-bold transition-all text-sm" :class="method === 'cash' ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/10' : 'border-gray-200 text-gray-500 dark:border-gray-700'">Tunai (Cash)</button>
            <button @click="method = 'qris'" class="flex-1 py-3 rounded-xl border-2 font-bold transition-all text-sm" :class="method === 'qris' ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/10' : 'border-gray-200 text-gray-500 dark:border-gray-700'">QRIS</button>
            </div>

            <!-- Tunai / Cash View -->
            <div v-if="method === 'cash'" class="space-y-4">
            <div>
                <label class="mb-2 block text-sm font-medium text-gray-800 dark:text-white">Uang Pelanggan (Rp)</label>
                <input v-model="customerMoney" type="number" min="0" placeholder="0" class="w-full text-lg rounded-xl border border-gray-300 bg-transparent px-5 py-3 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white font-medium" />
            </div>
            <div class="flex justify-between items-center rounded-xl bg-green-50 p-4 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
                <span class="font-medium text-green-800 dark:text-green-400">Kembalian</span>
                <span class="text-xl font-bold text-green-800 dark:text-green-400">{{ formatRupiah(changeMoney > 0 ? changeMoney : 0) }}</span>
            </div>
            </div>

            <!-- QRIS View -->
            <div v-if="method === 'qris'" class="flex flex-col items-center justify-center">
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
                <p class="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">Silakan arahkan gawai pelanggan ke kode QR di atas untuk menyelesaikan transaksi.</p>
            </template>

            <div v-else-if="!settings?.imgQris" class="w-64 h-64 md:w-72 md:h-72 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl">
                <span class="text-gray-400 text-sm text-center px-4">QRIS master belum diunggah di Pengaturan</span>
            </div>
            <div v-else class="text-center py-6">
                <p class="text-sm text-gray-500 dark:text-gray-400">Sistem POS siap melakukan injeksi nominal tagihan otomatis.</p>
            </div>
            </div>

            <div v-if="error" class="mt-4 text-center text-sm font-medium text-red-500">{{ error }}</div>
        </div>

        <!-- Footer Aksi -->
        <div class="border-t border-gray-200 p-5 dark:border-gray-800 shrink-0">
            <button 
            v-if="method === 'qris' && dynamicQrisImage" 
            @click="$emit('done-qris')"
            class="w-full py-3.5 rounded-xl font-bold text-white bg-brand-500 hover:bg-brand-600 shadow-theme-sm transition-all"
            >
            Pelanggan Sudah Bayar & Buka Struk
            </button>

            <button 
            v-else 
            @click="handleSubmit" 
            :disabled="!isPaymentValid || isProcessing"
            class="w-full py-3.5 rounded-xl font-bold text-white bg-brand-500 hover:bg-brand-600 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-theme-xs"
            >
            <span v-if="isProcessing">Memproses transaksi...</span>
            <span v-else-if="method === 'qris'">Buat QRIS Dinamis</span>
            <span v-else>Selesaikan Transaksi</span>
            </button>
        </div>
        </div>
    </div>
    </template>

    <script setup lang="ts">
    import { ref, computed, watch } from 'vue'

    const props = defineProps<{
    totalPrice: number
    dynamicQrisImage: string
    settings: any
    isProcessing: boolean
    error: string
    formatRupiah: (num: number) => string
    }>();

    const emit = defineEmits(['close', 'submit-payment', 'done-qris']);

    const method = ref<'cash' | 'qris'>('cash');
    const customerMoney = ref<number | ''>('');

    const changeMoney = computed(() => Number(customerMoney.value) - props.totalPrice);
    const isPaymentValid = computed(() => method.value === 'qris' || Number(customerMoney.value) >= props.totalPrice);

    watch(method, () => { customerMoney.value = '' });

    const handleSubmit = () => {
    emit('submit-payment', {
        method: method.value,
        money: Number(customerMoney.value)
    });
    };
    </script>