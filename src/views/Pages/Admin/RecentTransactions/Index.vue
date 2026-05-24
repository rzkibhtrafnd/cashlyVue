    <template>
    <admin-layout>
        <div class="bg-gray-50 dark:bg-gray-950">
        <div class="mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6 2xl:p-10">
            
            <!-- Page Header -->
            <div class="rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div class="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                <h3 class="text-2xl font-bold text-gray-800 dark:text-white/90">Riwayat Transaksi</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Lihat, filter, dan kelola semua laporan transaksi penjualan Anda.
                </p>
                </div>
            </div>
            </div>

            <!-- Content Area: Table & Filters -->
            <TransactionList
            :transactions="transactions"
            :is-loading="isLoading"
            :meta="meta"
            :user-role="userRole"
            :month-names="monthNames"
            :year-list="yearList"
            :format-date="formatDate"
            :format-rupiah="formatRupiah"
            @filter-changed="handleFilterChanged"
            @export="downloadReport"
            @view-detail="showDetail"
            />

        </div>
        </div>

        <!-- Modal Detail Struk -->
        <TransactionReceiptModal
        v-if="showModal"
        :selected-trx="selectedTrx"
        :settings="settings"
        :format-date="formatDate"
        :format-number="formatNumber"
        @close="showModal = false"
        />
    </admin-layout>
    </template>

    <script setup lang="ts">
    import { ref, onMounted, reactive } from 'vue'
    import api from '@/api/axios'
    import AdminLayout from '@/components/layout/AdminLayout.vue'
    import TransactionList from './TransactionList.vue'
    import TransactionReceiptModal from './TransactionReceiptModal.vue'
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

    const activeFilters = reactive({
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
        params: { page, month: activeFilters.month, year: activeFilters.year },
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

    const handleFilterChanged = (newFilter: { month: number | ''; year: number }) => {
    activeFilters.month = newFilter.month as any
    activeFilters.year = newFilter.year
    fetchTransactions(1)
    }

    const downloadReport = async (type: 'excel' | 'pdf') => {
    try {
        const token = localStorage.getItem('token')
        const res = await api.get('/transactions/report', {
        params: { month: activeFilters.month, year: activeFilters.year },
        headers: { Authorization: `Bearer ${token}` }
        })
        
        const reportData = res.data.data || res.data
        const period = `${monthNames[Number(activeFilters.month) - 1] || 'Semua'} ${activeFilters.year}`

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

    // --- Formatters ---
    const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)
    const formatNumber = (num: number) => new Intl.NumberFormat('id-ID').format(num)
    const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    }

    onMounted(async () => {
    const token = localStorage.getItem('token')
    fetchTransactions()
    const resSet = await api.get('/settings', { headers: { Authorization: `Bearer ${token}` } })
    settings.value = resSet.data.data || resSet.data
    })
    </script>