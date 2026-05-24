    <template>
    <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
        <div class="bg-white p-6 w-full max-w-[320px] shadow-2xl rounded-sm">
        
        <!-- Area yang akan di-print kertas thermal POS -->
        <div id="print-area-trx" class="text-black font-mono text-[10px]">
            <div class="text-center mb-4">
            <h2 class="text-sm font-bold uppercase">{{ settings?.companyName || 'CASHLY POS' }}</h2>
            <p>{{ settings?.address }}</p>
            <p>Telp: {{ settings?.phone }}</p>
            </div>
            
            <div class="border-b border-dashed border-gray-400 mb-2"></div>
            
            <div class="mb-2">
            <div class="flex justify-between"><p>Tgl:</p><p>{{ formatDate(selectedTrx?.createdAt) }}</p></div>
            <div class="flex justify-between"><p>No:</p><p>TRX-{{ selectedTrx?.id }}</p></div>
            <div class="flex justify-between"><p>Ksr:</p><p>{{ selectedTrx?.user?.name }}</p></div>
            </div>
            
            <div class="border-b border-dashed border-gray-400 mb-2"></div>
            
            <div v-for="item in selectedTrx?.items" :key="item.id" class="mb-2">
            <p class="font-bold">{{ item.product?.name || 'Produk' }}</p>
            <div class="flex justify-between">
                <p>{{ item.qty }} x {{ formatNumber(item.price) }}</p>
                <p>{{ formatNumber(item.subtotal) }}</p>
            </div>
            </div>
            
            <div class="border-b border-dashed border-gray-400 mb-2"></div>
            
            <div class="flex justify-between font-bold text-xs">
            <p>TOTAL</p>
            <p>{{ formatNumber(selectedTrx?.total) }}</p>
            </div>
            <div class="flex justify-between mt-1 uppercase">
            <p>METODE</p>
            <p>{{ selectedTrx?.paymentMethod }}</p>
            </div>
            
            <div class="text-center mt-6">
            <p class="font-bold italic">-- REPRINT --</p>
            </div>
        </div>
        
        <!-- Tombol Aksi -->
        <div class="mt-6 flex flex-col gap-2 no-print">
            <button @click="printReceipt" class="w-full bg-blue-600 text-white py-2 rounded-lg font-bold transition hover:bg-blue-700">
            Cetak Struk
            </button>
            <button @click="$emit('close')" class="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-bold text-xs uppercase transition hover:bg-gray-300">
            Tutup
            </button>
        </div>

        </div>
    </div>
    </template>

    <script setup lang="ts">
    defineProps<{
    selectedTrx: any
    settings: any
    formatDate: (date?: string) => string
    formatNumber: (num: number) => string
    }>()

    defineEmits(['close'])

    const printReceipt = () => {
    window.print()
    }
    </script>

    <style scoped>
    @media print {
    body * { 
        visibility: hidden; 
    }
    #print-area-trx, #print-area-trx * { 
        visibility: visible; 
    }
    #print-area-trx {
        position: absolute;
        left: 0; 
        top: 0;
        width: 100%;
        margin: 0; 
        padding: 10px;
    }
    .no-print { 
        display: none !important; 
    }
    }
    </style>