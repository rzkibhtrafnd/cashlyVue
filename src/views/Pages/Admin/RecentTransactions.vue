    <template>
    <admin-layout>
        <div class="bg-gray-50 dark:bg-gray-950">
        <div class="mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6 2xl:p-10">
            
            <!-- Page Header -->
            <div class="rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div class="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                <h3 class="text-2xl font-bold text-gray-800 dark:text-white/90">Riwayat Transaksi</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Lihat, filter, dan kelola semua laporan transaksi penjualan Anda.</p>
                </div>
            </div>
            </div>

            <!-- Filter & Content Area Card -->
            <div class="rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-hidden">
            
            <!-- Filter Header Bagian Atas -->
            <div class="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 dark:border-white/[0.05]">
                <div class="flex flex-wrap gap-3 items-center w-full sm:w-auto">
                <!-- Filter Bulan -->
                <select v-model="filter.month" class="rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white outline-none">
                    <option value="">Semua Bulan</option>
                    <option v-for="(name, index) in monthNames" :key="index" :value="index + 1">{{ name }}</option>
                </select>

                <!-- Filter Tahun -->
                <select v-model="filter.year" class="rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white outline-none">
                    <option v-for="year in yearList" :key="year" :value="year">{{ year }}</option>
                </select>

                <button @click="fetchTransactions(1)" class="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-theme-xs">
                    Filter
                </button>
                </div>

                <!-- Dropdown Export Laporan (Hanya Admin) -->
                <div v-if="userRole === 'admin'" class="relative group self-start sm:self-auto">
                <button class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 transition">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export Laporan
                </button>
                <!-- Dropdown Menu -->
                <div class="invisible absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-gray-200 bg-white shadow-lg transition-all group-hover:visible group-hover:opacity-100 opacity-0 z-50 dark:border-gray-700 dark:bg-gray-800">
                    <div class="p-2 space-y-1">
                    <button @click="downloadReport('excel')" class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
                        Excel (.xlsx)
                    </button>
                    <button @click="downloadReport('pdf')" class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/></svg>
                        PDF (.pdf)
                    </button>
                    </div>
                </div>
                </div>
            </div>

            <!-- Loading State -->
            <div v-if="isLoading" class="flex justify-center p-10">
                <svg class="h-8 w-8 animate-spin text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
            </div>

            <!-- Data Table Area -->
            <div v-else class="max-w-full overflow-x-auto">
                <table class="w-full text-left">
                <thead class="border-y border-gray-100 bg-gray-50 dark:border-white/[0.05] dark:bg-gray-900">
                    <tr>
                    <th class="px-6 py-3 font-medium text-gray-500 text-xs uppercase dark:text-gray-400 w-32">ID Transaksi</th>
                    <th class="px-6 py-3 font-medium text-gray-500 text-xs uppercase dark:text-gray-400">Waktu</th>
                    <th class="px-6 py-3 font-medium text-gray-500 text-xs uppercase dark:text-gray-400">Kasir</th>
                    <th class="px-6 py-3 font-medium text-gray-500 text-xs uppercase dark:text-gray-400">Metode</th>
                    <th class="px-6 py-3 font-medium text-gray-500 text-xs uppercase dark:text-gray-400">Total</th>
                    <th class="px-6 py-3 font-medium text-gray-500 text-xs uppercase dark:text-gray-400 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    <tr v-if="transactions.length === 0">
                    <td colspan="6" class="px-6 py-8 text-center text-gray-500">Tidak ada riwayat transaksi ditemukan.</td>
                    </tr>
                    <tr v-for="trx in transactions" :key="trx.id" class="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">
                    <td class="px-6 py-4">
                        <span class="block font-medium text-gray-700 text-sm dark:text-gray-400">TRX-{{ trx.id }}</span>
                    </td>
                    <td class="px-6 py-4">
                        <span class="block text-sm text-gray-600 dark:text-gray-400">{{ formatDate(trx.createdAt) }}</span>
                    </td>
                    <td class="px-6 py-4">
                        <span class="block text-sm font-medium text-gray-800 dark:text-gray-200">{{ trx.user?.name }}</span>
                    </td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase"
                        :class="trx.paymentMethod === 'qris' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'">
                        {{ trx.paymentMethod }}
                        </span>
                    </td>
                    <td class="px-6 py-4">
                        <span class="block text-sm font-bold text-gray-900 dark:text-white">{{ formatRupiah(trx.total) }}</span>
                    </td>
                    <td class="px-6 py-4">
                        <div class="flex items-center justify-end">
                        <button @click="showDetail(trx.id)" class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-theme-xs transition hover:border-brand-500 hover:text-brand-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                            Detail
                        </button>
                        </div>
                    </td>
                    </tr>
                </tbody>
                </table>
            </div>

            <!-- Pagination Footer -->
            <div v-if="!isLoading && transactions.length > 0" class="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-white/[0.05] dark:bg-gray-900/50">
                <span class="text-sm text-gray-500 dark:text-gray-400">
                Menampilkan Halaman <span class="font-semibold text-gray-800 dark:text-gray-200">{{ meta.page }}</span> dari <span class="font-semibold text-gray-800 dark:text-gray-200">{{ meta.totalPages || 1 }}</span>
                </span>
                <div class="flex gap-2">
                <button 
                    @click="fetchTransactions(meta.page - 1)" 
                    :disabled="meta.page === 1" 
                    class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                    Sebelumnya
                </button>
                <button 
                    @click="fetchTransactions(meta.page + 1)" 
                    :disabled="meta.page === meta.totalPages || meta.totalPages === 0" 
                    class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                    Selanjutnya
                </button>
                </div>
            </div>

            </div>
        </div>
        </div>

        <!-- Modal Struk / Detail -->
        <div v-if="showModal" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
        <div class="bg-white p-6 w-full max-w-[320px] shadow-2xl rounded-sm">
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
            
            <div class="mt-6 flex flex-col gap-2 no-print">
            <button @click="printReceipt" class="w-full bg-blue-600 text-white py-2 rounded-lg font-bold">Cetak Struk</button>
            <button @click="showModal = false" class="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-bold text-xs uppercase">Tutup</button>
            </div>
        </div>
        </div>
    </admin-layout>
    </template>

    <script setup lang="ts">
    import { ref, onMounted, reactive } from 'vue'
    import api from '@/api/axios'
    import AdminLayout from '@/components/layout/AdminLayout.vue'
    import * as XLSX from 'xlsx'
    import { jsPDF } from 'jspdf'
    import autoTable from 'jspdf-autotable'

    // --- States ---
    const userRole = localStorage.getItem('role') || 'kasir'
    const transactions = ref<any[]>([])
    const isLoading = ref(true)
    const settings = ref<any>(null)
    const selectedTrx = ref<any>(null)
    const showModal = ref(false)

    const filter = reactive({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
    })

    const meta = reactive({
    page: 1,
    totalPages: 1
    })

    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
    const yearList = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

    // --- Functions ---
    const fetchTransactions = async (page = 1) => {
    isLoading.value = true
    const token = localStorage.getItem('token')
    try {
        const res = await api.get('/transactions', {
        params: { page, month: filter.month, year: filter.year },
        headers: { Authorization: `Bearer ${token}` }
        })
        transactions.value = res.data.data
        meta.page = res.data.meta.page
        meta.totalPages = res.data.meta.totalPages
    } catch (error) {
        console.error("Gagal ambil data transaksi", error)
    } finally {
        isLoading.value = false
    }
    }

    const downloadReport = async (type: 'excel' | 'pdf') => {
    try {
        const token = localStorage.getItem('token')
        const res = await api.get('/transactions/report', {
        params: { month: filter.month, year: filter.year },
        headers: { Authorization: `Bearer ${token}` }
        })
        
        const reportData = res.data.data || res.data
        const period = `${monthNames[filter.month - 1] || 'Semua'} ${filter.year}`

        if (type === 'excel') {
        const worksheet = XLSX.utils.json_to_sheet(reportData.map((t: any) => ({
            'ID Transaksi': `TRX-${t.id}`,
            'Tanggal': new Date(t.createdAt).toLocaleDateString('id-ID'),
            'Waktu': new Date(t.createdAt).toLocaleTimeString('id-ID'),
            'Kasir': t.user.name,
            'Metode': t.paymentMethod.toUpperCase(),
            'Total': t.total
        })))
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan')
        XLSX.writeFile(workbook, `Laporan_Transaksi_${period}.xlsx`)
        } else {
        const doc = new jsPDF()
        
        doc.setFontSize(16)
        doc.text("LAPORAN RIWAYAT TRANSAKSI", 14, 15)
        doc.setFontSize(11)
        doc.text(`Periode: ${period}`, 14, 22)

        const tableRows = reportData.map((t: any) => [
            `TRX-${t.id}`,
            new Date(t.createdAt).toLocaleDateString('id-ID'),
            t.user.name,
            t.paymentMethod.toUpperCase(),
            formatRupiah(t.total)
        ])

        autoTable(doc, {
            startY: 30,
            head: [['ID', 'Tanggal', 'Kasir', 'Metode', 'Total']],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [40, 40, 40] }
        })

        doc.save(`Laporan_Transaksi_${period}.pdf`)
        }
    } catch (error) {
        console.error("Error Detail:", error)
        alert('Gagal mengunduh laporan. Pastikan koneksi stabil.')
    }
    }

    const showDetail = async (id: number) => {
    const token = localStorage.getItem('token')
    try {
        const res = await api.get(`/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
        })
        selectedTrx.value = res.data.data || res.data
        showModal.value = true
    } catch (error) {
        alert("Gagal memuat detail transaksi")
    }
    }

    const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)
    const formatNumber = (num: number) => new Intl.NumberFormat('id-ID').format(num)
    const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    }

    const printReceipt = () => window.print()

    onMounted(async () => {
    const token = localStorage.getItem('token')
    fetchTransactions()
    const resSet = await api.get('/settings', { headers: { Authorization: `Bearer ${token}` } })
    settings.value = resSet.data.data || resSet.data
    })
    </script>

    <style scoped>
    @media print {
    body * { visibility: hidden; }
    #print-area-trx, #print-area-trx * { visibility: visible; }
    #print-area-trx {
        position: absolute;
        left: 0; top: 0;
        width: 100%;
        margin: 0; padding: 10px;
    }
    .no-print { display: none !important; }
    }
    </style>