    <template>
    <div class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 p-4">
        
        <div class="w-[300px] bg-white text-black p-4 font-mono text-xs shadow-2xl relative mx-auto my-auto rounded-sm">
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
            <p>{{ formatNumber(transaction?.total ?? 0) }}</p>
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
                <p>{{ formatNumber(customerMoneyPaid - (transaction?.total ?? 0)) }}</p>
            </div>
            </template>
        </div>
        
        <div class="border-b border-dashed border-gray-400 mb-4"></div>

        <div class="text-center mt-4">
            <p class="font-bold">TERIMA KASIH</p>
            <p class="text-[10px]">Barang yang sudah dibeli tidak dapat ditukar/dikembalikan</p>
        </div>
        </div>

        <div class="absolute bottom-6 flex gap-4 flex-col sm:flex-row">
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
    import { onMounted } from 'vue';

    interface Product {
    id: number
    name: string
    price: number
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
    user?: {
        name: string
    }
    items: TransactionItem[]
    total: number
    paymentMethod: string
    }

    interface Settings {
    companyName?: string
    address?: string
    phone?: string
    [key: string]: unknown
    }

    const props = defineProps<{
    transaction: Transaction | null
    customerMoneyPaid: number
    settings: Settings | null
    formatNumber: (num: number) => string
    formatDate: (str?: string) => string
    }>();

    defineEmits(['finish']);

    // Fungsi Generator HTML Murni Khusus Struk
    const generateReceiptHTML = () => {
    const itemsHtml = props.transaction?.items.map(item => `
        <div style="margin-bottom: 6px;">
        <p class="font-bold">${item.product?.name || 'Produk'}</p>
        <div class="flex">
            <p>${item.qty} x ${props.formatNumber(item.price)}</p>
            <p>${props.formatNumber(item.subtotal)}</p>
        </div>
        </div>
    `).join('');

    let paymentHtml = `
        <div class="flex font-bold" style="font-size: 13px;">
        <p>TOTAL</p>
        <p>${props.formatNumber(props.transaction?.total ?? 0)}</p>
        </div>
        <div class="flex">
        <p>METODE</p>
        <p class="uppercase">${props.transaction?.paymentMethod}</p>
        </div>
    `;

    if (props.transaction?.paymentMethod === 'cash') {
        paymentHtml += `
        <div class="flex">
            <p>BAYAR</p>
            <p>${props.formatNumber(props.customerMoneyPaid)}</p>
        </div>
        <div class="flex">
            <p>KEMBALI</p>
            <p>${props.formatNumber(props.customerMoneyPaid - (props.transaction?.total ?? 0))}</p>
        </div>
        `;
    }

    return `
        <!DOCTYPE html>
        <html lang="id">
        <head>
        <meta charset="UTF-8">
        <title>Struk TRX-${props.transaction?.id}</title>
        <style>
            /* Konfigurasi Ukuran Kertas Thermal (Ganti 58mm menjadi 80mm jika printer Anda besar) */
            @page {
            size: 58mm auto;
            margin: 0;
            }
            body {
            font-family: 'Courier New', Courier, monospace; /* Font standar kasir */
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
            .uppercase { text-transform: uppercase; }
            .flex { display: flex; justify-content: space-between; }
            .border-b { border-bottom: 1px dashed #000; margin-bottom: 6px; padding-bottom: 6px; }
        </style>
        </head>
        <body>
        <div class="text-center mb-2">
            <h2 class="font-bold uppercase" style="margin: 0; font-size: 14px;">
            ${props.settings?.companyName || 'CASHLY POS'}
            </h2>
            <p>${props.settings?.address || 'Alamat Belum Diatur'}</p>
            <p>Telp: ${props.settings?.phone || '-'}</p>
        </div>
        
        <div class="border-b"></div>
        
        <div style="margin-bottom: 6px;">
            <div class="flex"><p>Tgl:</p><p>${props.formatDate(props.transaction?.createdAt)}</p></div>
            <div class="flex"><p>No:</p><p>TRX-${props.transaction?.id}</p></div>
            <div class="flex"><p>Ksr:</p><p>${props.transaction?.user?.name}</p></div>
        </div>

        <div class="border-b"></div>
        
        ${itemsHtml}

        <div class="border-b"></div>
        
        <div style="margin-bottom: 6px;">
            ${paymentHtml}
        </div>
        
        <div class="border-b"></div>

        <div class="text-center" style="margin-top: 8px;">
            <p class="font-bold">TERIMA KASIH</p>
            <p style="font-size: 9px;">Barang yang sudah dibeli tidak dapat ditukar/dikembalikan</p>
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
    };

    onMounted(() => {
    printReceipt();
    });
    </script>

    <style scoped>
    </style>