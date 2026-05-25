    <template>
    <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
        <div class="bg-white p-6 w-full max-w-[320px] shadow-2xl rounded-sm">
        
        <div class="text-black font-mono text-[10px]">
            <div class="text-center mb-4">
            <h2 class="text-sm font-bold uppercase">{{ settings?.companyName || 'CASHLY POS' }}</h2>
            <p>{{ settings?.address || 'Alamat Belum Diatur' }}</p>
            <p>Telp: {{ settings?.phone || '-' }}</p>
            </div>
            
            <div class="border-b border-dashed border-gray-400 mb-2"></div>
            
            <div class="mb-2">
            <div class="flex justify-between"><p>Tgl:</p><p>{{ formatDate(selectedTrx?.createdAt) }}</p></div>
            <div class="flex justify-between"><p>No:</p><p>TRX-{{ selectedTrx?.id }}</p></div>
            <div class="flex justify-between"><p>Ksr:</p><p>{{ selectedTrx?.user?.name || '-' }}</p></div>
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
            <p>{{ formatNumber(selectedTrx?.total ?? 0) }}</p>
            </div>
            <div class="flex justify-between mt-1 uppercase">
            <p>METODE</p>
            <p>{{ selectedTrx?.paymentMethod || '-' }}</p>
            </div>
        </div>
        
        <div class="mt-6 flex flex-col gap-2">
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
    interface Product {
    name: string
    }

    interface TransactionItem {
    id: number
    qty: number
    price: number
    subtotal: number
    product?: Product
    }

    interface Transaction {
    id: number
    createdAt?: string
    total: number
    paymentMethod: string
    user?: {
        name: string
    }
    items: TransactionItem[]
    }

    interface Settings {
    companyName?: string
    address?: string
    phone?: string
    }

    const props = defineProps<{
    selectedTrx: Transaction | null
    settings: Settings | null
    formatDate: (date?: string) => string
    formatNumber: (num: number) => string
    }>()

    defineEmits(['close'])

    const generateReceiptHTML = () => {
    const trx = props.selectedTrx;
    const set = props.settings;

    const itemsHtml = trx?.items?.map(item => `
        <div style="margin-bottom: 6px;">
        <p class="font-bold">${item.product?.name || 'Produk'}</p>
        <div class="flex">
            <p>${item.qty} x ${props.formatNumber(item.price)}</p>
            <p>${props.formatNumber(item.subtotal)}</p>
        </div>
        </div>
    `).join('') || '';

    return `
        <!DOCTYPE html>
        <html lang="id">
        <head>
        <meta charset="UTF-8">
        <title>Reprint TRX-${trx?.id}</title>
        <style>
            /* Mengatur ukuran kertas thermal standar (58mm) */
            @page {
            size: 58mm auto;
            margin: 0;
            }
            body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 11px;
            color: #000;
            margin: 0;
            padding: 4mm;
            width: 58mm;
            box-sizing: border-box;
            }
            p { margin: 2px 0; }
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
            .italic { font-style: italic; }
            .uppercase { text-transform: uppercase; }
            .flex { display: flex; justify-content: space-between; }
            .border-b { border-bottom: 1px dashed #000; margin-bottom: 6px; padding-bottom: 6px; }
        </style>
        </head>
        <body>
        <div class="text-center mb-2">
            <h2 class="font-bold uppercase" style="margin: 0; font-size: 14px;">
            ${set?.companyName || 'CASHLY POS'}
            </h2>
            <p>${set?.address || 'Alamat Belum Diatur'}</p>
            <p>Telp: ${set?.phone || '-'}</p>
        </div>
        
        <div class="border-b"></div>
        
        <div style="margin-bottom: 6px;">
            <div class="flex"><p>Tgl:</p><p>${props.formatDate(trx?.createdAt)}</p></div>
            <div class="flex"><p>No:</p><p>TRX-${trx?.id}</p></div>
            <div class="flex"><p>Ksr:</p><p>${trx?.user?.name || '-'}</p></div>
        </div>

        <div class="border-b"></div>
        
        ${itemsHtml}

        <div class="border-b"></div>
        
        <div style="margin-bottom: 6px;">
            <div class="flex font-bold" style="font-size: 13px;">
            <p>TOTAL</p>
            <p>${props.formatNumber(trx?.total ?? 0)}</p>
            </div>
            <div class="flex uppercase">
            <p>METODE</p>
            <p>${trx?.paymentMethod || '-'}</p>
            </div>
        </div>
        </body>
        </html>
    `;
    };

    const printReceipt = () => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const htmlContent = generateReceiptHTML();

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
        doc.open();
        doc.write(htmlContent);
        doc.close();
    }

    setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        
        setTimeout(() => {
        document.body.removeChild(iframe);
        }, 1000);
    }, 500);
    }
    </script>

    <style scoped>
    </style>