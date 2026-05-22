    <template>
    <div class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 p-4 receipt-overlay">
        <div id="print-area" class="w-[300px] bg-white text-black p-4 font-mono text-xs shadow-2xl relative mx-auto my-auto print-receipt-container">
        <div class="text-center mb-4">
            <h2 class="text-lg font-bold uppercase">{{ settings?.companyName || 'CASHLY POS' }}</h2>
            <p>{{ settings?.address || 'Alamat Belum Diatur' }}</p>
            <p>Telp: {{ settings?.phone || '-' }}</p>
        </div>
        
        <div class="border-b border-dashed border-gray-400 mb-2"></div>
        
        <div class="mb-2">
            <div class="flex justify-between"><p>Tgl:</p><p>{{ formatDate(transaction?.createdAt) }}</p></div>
            <div class="flex justify-between"><p>No:</p><p>TRX-{{ transaction?.id }}</p></div>
            <div class="flex justify-between"><p>Ksr:</p><p>{{ transaction?.user?.name }}</p></div>
        </div>

        <div class="border-b border-dashed border-gray-400 mb-2"></div>
        
        <div class="mb-2">
            <div v-for="item in transaction?.items" :key="item.id" class="mb-2">
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
            <p>{{ formatNumber(transaction?.total) }}</p>
            </div>
            <div class="flex justify-between">
            <p>METODE</p>
            <p class="uppercase">{{ transaction?.paymentMethod }}</p>
            </div>
            <template v-if="transaction?.paymentMethod === 'cash'">
            <div class="flex justify-between">
                <p>BAYAR</p>
                <p>{{ formatNumber(customerMoneyPaid) }}</p>
            </div>
            <div class="flex justify-between">
                <p>KEMBALI</p>
                <p>{{ formatNumber(customerMoneyPaid - transaction?.total) }}</p>
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
        <button @click="$emit('finish')" class="rounded-xl bg-gray-700 px-6 py-3 font-bold text-white shadow-lg hover:bg-gray-800 text-center">
            Selesai & Transaksi Baru
        </button>
        </div>
    </div>
    </template>

    <script setup lang="ts">
    defineProps<{
    transaction: any
    customerMoneyPaid: number
    settings: any
    formatNumber: (num: number) => string
    formatDate: (str?: string) => string
    }>();

    defineEmits(['finish']);

    const printReceipt = () => window.print();
    </script>