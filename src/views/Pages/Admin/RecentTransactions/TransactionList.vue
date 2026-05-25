<template>
    <div class="rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-hidden">
        
        <div class="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 dark:border-white/[0.05]">
        <div class="flex flex-wrap gap-3 items-center w-full sm:w-auto">
            <select v-model="localFilter.month" class="rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white outline-none">
            <option value="">Semua Bulan</option>
            <option v-for="(name, index) in monthNames" :key="index" :value="index + 1">{{ name }}</option>
            </select>

            <select v-model="localFilter.year" class="rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white outline-none">
            <option v-for="year in yearList" :key="year" :value="year">{{ year }}</option>
            </select>

            <button @click="emitFilter" class="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-theme-xs">
            Filter
            </button>
        </div>

        <div v-if="userRole === 'admin'" class="relative group self-start sm:self-auto">
            <button class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 transition">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export Laporan
            </button>
            <div class="invisible absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-gray-200 bg-white shadow-lg transition-all group-hover:visible group-hover:opacity-100 opacity-0 z-50 dark:border-gray-700 dark:bg-gray-800">
            <div class="p-2 space-y-1">
                <button @click="$emit('export', 'excel')" class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">Excel (.xlsx)</button>
                <button @click="$emit('export', 'pdf')" class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">PDF (.pdf)</button>
            </div>
            </div>
        </div>
        </div>

        <div v-if="isLoading" class="flex justify-center p-10">
        <svg class="h-8 w-8 animate-spin text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
        </div>

        <div v-else class="max-w-full overflow-x-auto">
        <table class="w-full text-left">
            <thead class="border-y border-gray-100 bg-gray-50 dark:border-white/[0.05] dark:bg-gray-900">
            <tr>
                <th class="px-6 py-3 font-medium text-gray-500 text-xs uppercase dark:text-gray-400">ID Transaksi</th>
                <th class="px-6 py-3 font-medium text-gray-500 text-xs uppercase dark:text-gray-400">Waktu</th>
                <th class="px-6 py-3 font-medium text-gray-500 text-xs uppercase dark:text-gray-400">Kasir</th>
                <th class="px-6 py-3 font-medium text-gray-500 text-xs uppercase dark:text-gray-400">Metode</th>
                <th class="px-6 py-3 font-medium text-gray-500 text-xs uppercase dark:text-gray-400">Status</th>
                <th class="px-6 py-3 font-medium text-gray-500 text-xs uppercase dark:text-gray-400">Total</th>
                <th class="px-6 py-3 font-medium text-gray-500 text-xs uppercase dark:text-gray-400 text-right">Aksi</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-white/[0.05]">
            <tr v-if="transactions.length === 0">
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">Tidak ada riwayat transaksi ditemukan.</td>
            </tr>
            <tr v-for="trx in transactions" :key="trx.id" class="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">
                <td class="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-400">TRX-{{ trx.id }}</td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{{ formatDate(trx.createdAt) }}</td>
                <td class="px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">{{ trx.user?.name || '-' }}</td>
                <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase"
                    :class="trx.paymentMethod === 'qris' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'">
                    {{ trx.paymentMethod }}
                </span>
                </td>
                <td class="px-6 py-4">
                <span class="inline-flex rounded-full px-3 py-1 text-xs font-medium" :class="{
                    'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400': trx.paymentStatus === 'paid',
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400': trx.paymentStatus === 'pending',
                    'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400': trx.paymentStatus === 'failed'
                }">
                    {{ formatPaymentStatus(trx.paymentStatus) }}
                </span>
                </td>
                <td class="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{{ formatRupiah(trx.total) }}</td>
                <td class="px-6 py-4 text-right">
                <button @click="$emit('view-detail', trx.id)" class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-theme-xs transition hover:border-brand-500 hover:text-brand-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                    Detail
                </button>
                </td>
            </tr>
            </tbody>
        </table>
        </div>

        <div v-if="!isLoading && transactions.length > 0" class="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-white/[0.05] dark:bg-gray-900/50">
        <span class="text-sm text-gray-500 dark:text-gray-400">Halaman {{ meta.page }} dari {{ meta.totalPages || 1 }}</span>
        <div class="flex gap-2">
            <button @click="$emit('filter-changed', { ...localFilter, page: meta.page - 1 })" :disabled="meta.page === 1" class="px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800">Sebelumnya</button>
            <button @click="$emit('filter-changed', { ...localFilter, page: meta.page + 1 })" :disabled="meta.page >= meta.totalPages" class="px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800">Selanjutnya</button>
        </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

    interface Transaction {
    id: number
    createdAt: string
    total: number
    paymentMethod: string
    paymentStatus: string 
    user?: { name: string }
    }

    const props = defineProps<{
    transactions: Transaction[]
    isLoading: boolean
    meta: { page: number; totalPages: number }
    userRole: string
    monthNames: string[]
    yearList: number[]
    formatDate: (date?: string) => string
    formatRupiah: (num: number) => string
    formatPaymentStatus: (status: string) => string
    }>()

    const emit = defineEmits(['filter-changed', 'export', 'view-detail'])

    const localFilter = reactive({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
    })

    const emitFilter = () => {
    emit('filter-changed', { ...localFilter })
    }
</script>