<template>
    <admin-layout>
        <div class="bg-gray-50 dark:bg-gray-950">
        <div class="mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6 2xl:p-10">
            
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

            <TransactionList
            :transactions="transactions"
            :is-loading="isLoading"
            :meta="meta"
            :user-role="userRole"
            :month-names="monthNames"
            :year-list="yearList"
            :format-date="formatDate"
            :format-rupiah="formatRupiah"
            :format-payment-status="formatPaymentStatus"
            @filter-changed="handleFilterChanged"
            @export="downloadReport"
            @view-detail="showDetail"
            />
        </div>
        </div>

        <TransactionReceiptModal
        v-if="showModal && selectedTrx"
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

    interface TransactionUser { name: string }

    interface TransactionItem {
    id: number
    qty: number
    price: number
    subtotal: number
    product?: { name: string }
    }

    interface Transaction {
    id: number
    createdAt: string
    total: number
    paymentMethod: string
    paymentStatus: string
    user?: TransactionUser
    items?: TransactionItem[]
    }

    interface Settings {
    companyName: string
    address: string
    phone: string
    }

    const userRole = localStorage.getItem('role') || 'kasir'
    const transactions = ref<Transaction[]>([])
    const isLoading = ref(true)
    const settings = ref<Settings | null>(null)
    const selectedTrx = ref<Transaction | null>(null)
    const showModal = ref(false)

    const activeFilters = reactive({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
    })

    const meta = reactive({ page: 1, totalPages: 1 })

    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
    const yearList = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

    const fetchTransactions = async (page = 1) => {
    isLoading.value = true
    try {
        const { data } = await api.get('/transactions', {
        params: { page, month: activeFilters.month, year: activeFilters.year },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        transactions.value = data.data
        meta.page = data.meta.page
        meta.totalPages = data.meta.totalPages
    } catch (error) {
        console.error("Gagal ambil data transaksi", error)
    } finally {
        isLoading.value = false
    }
    }

    const handleFilterChanged = (newFilter: { month: number | ''; year: number; page?: number }) => {
    activeFilters.month = Number(newFilter.month) || new Date().getMonth() + 1
    activeFilters.year = newFilter.year
    fetchTransactions(newFilter.page || 1)
    }

    const downloadReport = async (type: 'excel' | 'pdf') => {
    try {
        const res = await api.get('/transactions/report', {
        params: { month: activeFilters.month, year: activeFilters.year },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        
        const reportData: Transaction[] = res.data.data || res.data
        const period = `${monthNames[Number(activeFilters.month) - 1]} ${activeFilters.year}`

        if (type === 'excel') {
        const worksheet = XLSX.utils.json_to_sheet(reportData.map(t => ({
            'ID Transaksi': `TRX-${t.id}`,
            'Tanggal': formatDate(t.createdAt),
            'Kasir': t.user?.name || '-',
            'Metode': t.paymentMethod.toUpperCase(),
            'Total': t.total
        })))
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan')
        XLSX.writeFile(workbook, `Laporan_Transaksi_${period}.xlsx`)
        } else {
        const doc = new jsPDF()
        doc.text("LAPORAN RIWAYAT TRANSAKSI", 14, 15)
        doc.text(`Periode: ${period}`, 14, 22)
        autoTable(doc, {
            startY: 30,
            head: [['ID', 'Tanggal', 'Kasir', 'Metode', 'Total']],
            body: reportData.map(t => [`TRX-${t.id}`, formatDate(t.createdAt), t.user?.name || '-', t.paymentMethod.toUpperCase(), formatRupiah(t.total)])
        })
        doc.save(`Laporan_Transaksi_${period}.pdf`)
        }
    } catch {
        alert('Gagal mengunduh laporan.')
    }
    }

    const showDetail = async (id: number) => {
    try {
        const res = await api.get(`/transactions/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        selectedTrx.value = res.data.data || res.data
        showModal.value = true
    } catch {
        alert("Gagal memuat detail transaksi")
    }
    }

    const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)
    const formatNumber = (num: number) => new Intl.NumberFormat('id-ID').format(num)
    const formatDate = (dateStr?: string) => dateStr ? new Date(dateStr).toLocaleString('id-ID') : '-'
    const formatPaymentStatus = (status: string) => {
        const map: Record<string, string> = { paid: 'Terbayar', pending: 'Tertunda', failed: 'Gagal' }
        return map[status] || status
    }

    onMounted(async () => {
    fetchTransactions()
    const resSet = await api.get('/settings', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
    settings.value = resSet.data.data || resSet.data
    })
</script>