    <template>
    <admin-layout>
        <!-- Loading State -->
        <div
        v-if="loading"
        class="flex h-[70vh] items-center justify-center"
        >
        <div
            class="flex flex-col items-center gap-4 rounded-3xl border border-blue-100 bg-white px-10 py-10 shadow-[0_4px_20px_rgba(59,130,246,0.08)] dark:border-blue-900/30 dark:bg-gray-900"
        >
            <div
            class="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-blue-100 dark:bg-blue-500/10 dark:ring-blue-500/20"
            >
            <svg
                class="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke-width="4"
                />

                <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
            </svg>
            </div>

            <div class="text-center">
            <h3
                class="text-lg font-bold text-gray-900 dark:text-white"
            >
                Memuat Dashboard
            </h3>

            <p
                class="mt-1 text-sm text-gray-500 dark:text-gray-400"
            >
                Mohon tunggu sebentar...
            </p>
            </div>
        </div>
        </div>

        <!-- Dashboard -->
        <div
        v-else
        class="min-h-screen dark:bg-gray-950"
        >
        <div
            class="mx-auto w-full max-w-screen-2xl space-y-6 px-4 py-5 sm:px-6 xl:px-8"
        >
            <!-- Header -->
            <div
            class="rounded-3xl border border-blue-100 bg-white p-6 shadow-[0_4px_20px_rgba(59,130,246,0.08)] dark:border-blue-900/30 dark:bg-gray-900"
            >
            <div
                class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
            >
                <div>
                <h1
                    class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white"
                >
                    Dashboard Admin
                </h1>

                <p
                    class="mt-2 text-sm text-gray-500 dark:text-gray-400"
                >
                    Pantau statistik penjualan dan transaksi terbaru
                    secara realtime.
                </p>
                </div>

                <div
                class="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 dark:border-blue-900/30 dark:bg-blue-500/10"
                >
                <p
                    class="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400"
                >
                    Total Pendapatan
                </p>

                <h2
                    class="mt-1 text-2xl font-bold text-gray-900 dark:text-white"
                >
                    Rp
                    {{
                    dashboardData.totalRevenue.toLocaleString(
                        'id-ID'
                    )
                    }}
                </h2>
                </div>
            </div>
            </div>

            <!-- Statistic Cards -->
            <div
            class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
            >
            <!-- Categories -->
            <div
                class="group relative overflow-hidden rounded-3xl border border-blue-100 bg-white p-5 shadow-[0_4px_20px_rgba(59,130,246,0.08)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl dark:border-blue-900/30 dark:bg-gray-900"
            >
                <div
                class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl transition-all duration-500 group-hover:scale-125"
                ></div>

                <div
                class="relative flex items-start justify-between"
                >
                <div
                    class="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-blue-100 dark:bg-blue-500/10 dark:ring-blue-500/20"
                >
                    <svg
                    class="h-7 w-7 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M4 6h7v7H4zM13 6h7v7h-7zM4 15h7v5H4zM13 15h7v5h-7z"
                    />
                    </svg>
                </div>

                <div
                    class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                >
                    Statistik
                </div>
                </div>

                <div class="relative mt-6">
                <p
                    class="text-sm font-medium tracking-wide text-gray-500 dark:text-gray-400"
                >
                    Total Kategori
                </p>

                <div class="mt-2 flex items-end gap-2">
                    <h4
                    class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white"
                    >
                    {{ dashboardData.categoriesCount }}
                    </h4>

                    <span
                    class="mb-1 text-xs font-medium text-blue-600 dark:text-blue-400"
                    >
                    Data
                    </span>
                </div>
                </div>
            </div>

            <!-- Products -->
            <div
                class="group relative overflow-hidden rounded-3xl border border-blue-100 bg-white p-5 shadow-[0_4px_20px_rgba(59,130,246,0.08)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl dark:border-blue-900/30 dark:bg-gray-900"
            >
                <div
                class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl transition-all duration-500 group-hover:scale-125"
                ></div>

                <div
                class="relative flex items-start justify-between"
                >
                <div
                    class="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-blue-100 dark:bg-blue-500/10 dark:ring-blue-500/20"
                >
                    <svg
                    class="h-7 w-7 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M20 7L12 3L4 7L12 11L20 7ZM4 7V17L12 21M20 7V17L12 21"
                    />
                    </svg>
                </div>

                <div
                    class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                >
                    Produk
                </div>
                </div>

                <div class="relative mt-6">
                <p
                    class="text-sm font-medium tracking-wide text-gray-500 dark:text-gray-400"
                >
                    Total Produk
                </p>

                <div class="mt-2 flex items-end gap-2">
                    <h4
                    class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white"
                    >
                    {{ dashboardData.productsCount }}
                    </h4>

                    <span
                    class="mb-1 text-xs font-medium text-blue-600 dark:text-blue-400"
                    >
                    Item
                    </span>
                </div>
                </div>
            </div>

            <!-- Transactions -->
            <div
                class="group relative overflow-hidden rounded-3xl border border-blue-100 bg-white p-5 shadow-[0_4px_20px_rgba(59,130,246,0.08)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl dark:border-blue-900/30 dark:bg-gray-900"
            >
                <div
                class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl transition-all duration-500 group-hover:scale-125"
                ></div>

                <div
                class="relative flex items-start justify-between"
                >
                <div
                    class="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-blue-100 dark:bg-blue-500/10 dark:ring-blue-500/20"
                >
                    <svg
                    class="h-7 w-7 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 3H5L6 8H19L21 5H6M6 8L5 13H19M9 21A1 1 0 109 19A1 1 0 009 21ZM18 21A1 1 0 1018 19A1 1 0 0018 21Z"
                    />
                    </svg>
                </div>

                <div
                    class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                >
                    Transaksi
                </div>
                </div>

                <div class="relative mt-6">
                <p
                    class="text-sm font-medium tracking-wide text-gray-500 dark:text-gray-400"
                >
                    Total Transaksi
                </p>

                <div class="mt-2 flex items-end gap-2">
                    <h4
                    class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white"
                    >
                    {{ dashboardData.transactionsCount }}
                    </h4>

                    <span
                    class="mb-1 text-xs font-medium text-blue-600 dark:text-blue-400"
                    >
                    Order
                    </span>
                </div>
                </div>
            </div>

            <!-- Revenue -->
            <div
                class="group relative overflow-hidden rounded-3xl border border-blue-100 bg-white p-5 shadow-[0_4px_20px_rgba(59,130,246,0.08)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl dark:border-blue-900/30 dark:bg-gray-900"
            >
                <div
                class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl transition-all duration-500 group-hover:scale-125"
                ></div>

                <div
                class="relative flex items-start justify-between"
                >
                <div
                    class="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-blue-100 dark:bg-blue-500/10 dark:ring-blue-500/20"
                >
                    <svg
                    class="h-7 w-7 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 8C10.343 8 9 9.343 9 11C9 12.657 10.343 14 12 14C13.657 14 15 15.343 15 17C15 18.657 13.657 20 12 20M12 4V6M12 20V22"
                    />
                    </svg>
                </div>

                <div
                    class="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                >
                    Revenue
                </div>
                </div>

                <div class="relative mt-6">
                <p
                    class="text-sm font-medium tracking-wide text-gray-500 dark:text-gray-400"
                >
                    Total Pendapatan
                </p>

                <div class="mt-2">
                    <h4
                    class="truncate text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white"
                    >
                    Rp
                    {{
                        dashboardData.totalRevenue.toLocaleString(
                        'id-ID'
                        )
                    }}
                    </h4>
                </div>
                </div>
            </div>
            </div>

            <!-- Content -->
            <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <!-- Top Products -->
            <div
                class="rounded-3xl border border-blue-100 bg-white shadow-[0_4px_20px_rgba(59,130,246,0.08)] dark:border-blue-900/30 dark:bg-gray-900"
            >
                <div
                class="border-b border-blue-100 px-6 py-5 dark:border-blue-900/30"
                >
                <h3
                    class="text-lg font-bold text-gray-900 dark:text-white"
                >
                    Produk Terlaris
                </h3>

                <p
                    class="mt-1 text-sm text-gray-500 dark:text-gray-400"
                >
                    Produk dengan penjualan tertinggi.
                </p>
                </div>

                <div class="space-y-3 p-4">
                <div
                    v-for="(product, index) in dashboardData.topProducts"
                    :key="product.id"
                    class="group flex items-center justify-between rounded-2xl border border-blue-100 bg-white p-3 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50/40 dark:border-blue-900/30 dark:bg-gray-900 dark:hover:bg-blue-500/5"
                >
                    <div class="flex items-center gap-3">
                    <div
                        class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-sm font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                    >
                        {{ index + 1 }}
                    </div>

                    <div>
                        <p
                        class="max-w-[180px] truncate text-sm font-semibold text-gray-900 dark:text-white"
                        >
                        {{ product.name }}
                        </p>

                        <span
                        class="text-xs text-gray-500 dark:text-gray-400"
                        >
                        Produk Terjual
                        </span>
                    </div>
                    </div>

                    <div
                    class="rounded-xl bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                    >
                    {{ product.totalSold }}
                    </div>
                </div>
                </div>
            </div>

            <!-- Recent Transactions -->
            <div
                class="rounded-3xl border border-blue-100 bg-white shadow-[0_4px_20px_rgba(59,130,246,0.08)] dark:border-blue-900/30 dark:bg-gray-900 xl:col-span-2"
            >
                <div
                class="border-b border-blue-100 px-6 py-5 dark:border-blue-900/30"
                >
                <h3
                    class="text-lg font-bold text-gray-900 dark:text-white"
                >
                    Transaksi Terbaru
                </h3>

                <p
                    class="mt-1 text-sm text-gray-500 dark:text-gray-400"
                >
                    Aktivitas transaksi terbaru sistem.
                </p>
                </div>

                <!-- Desktop Table -->
                <div class="hidden overflow-x-auto p-4 lg:block">
                <table
                    class="w-full min-w-[700px] border-separate border-spacing-y-2"
                >
                    <thead>
                    <tr>
                        <th
                        class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                        >
                        Kasir
                        </th>

                        <th
                        class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                        >
                        Tanggal
                        </th>

                        <th
                        class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                        >
                        Total
                        </th>

                        <th
                        class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                        >
                        Status
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr
                        v-for="trx in dashboardData.recentTransactions"
                        :key="trx.id"
                        class="bg-white transition-all duration-300 hover:shadow-md dark:bg-gray-900"
                    >
                        <td
                        class="rounded-l-2xl px-4 py-4"
                        >
                        <div
                            class="flex items-center gap-3"
                        >
                            <p
                            class="font-medium text-gray-900 dark:text-white"
                            >
                            {{
                                trx.user?.name ||
                                'Kasir Default'
                            }}
                            </p>
                        </div>
                        </td>

                        <td
                        class="px-4 py-4 text-sm text-gray-500 dark:text-gray-400"
                        >
                        {{
                            new Date(
                            trx.createdAt
                            ).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                            })
                        }}
                        </td>

                        <td
                        class="px-4 py-4 font-semibold text-gray-900 dark:text-white"
                        >
                        Rp
                        {{
                            trx.total.toLocaleString('id-ID')
                        }}
                        </td>

                        <td
                        class="rounded-r-2xl px-4 py-4"
                        >
                        <span
                            class="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                            :class="{
                            'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400':
                                trx.paymentStatus ===
                                'paid',

                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400':
                                trx.paymentStatus ===
                                'pending',

                            'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400':
                                trx.paymentStatus ===
                                'failed'
                            }"
                        >
                            {{
                            formatPaymentStatus(
                                trx.paymentStatus
                            )
                            }}
                        </span>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>

                <!-- Mobile -->
                <div class="space-y-4 p-4 lg:hidden">
                <div
                    v-for="trx in dashboardData.recentTransactions"
                    :key="trx.id"
                    class="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm dark:border-blue-900/30 dark:bg-gray-900"
                >
                    <div
                    class="flex items-start justify-between gap-3"
                    >
                    <div class="flex items-center gap-3">

                        <div>
                        <h4
                            class="font-semibold text-gray-900 dark:text-white"
                        >
                            {{
                            trx.user?.name ||
                            'Kasir Default'
                            }}
                        </h4>

                        <p
                            class="text-xs text-gray-500 dark:text-gray-400"
                        >
                            {{
                            new Date(
                                trx.createdAt
                            ).toLocaleDateString(
                                'id-ID',
                                {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                                }
                            )
                            }}
                        </p>
                        </div>
                    </div>

                    <span
                        class="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                        :class="{
                        'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400':
                            trx.paymentStatus ===
                            'paid',

                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400':
                            trx.paymentStatus ===
                            'pending',

                        'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400':
                            trx.paymentStatus ===
                            'failed'
                        }"
                    >
                        {{
                        formatPaymentStatus(
                            trx.paymentStatus
                        )
                        }}
                    </span>
                    </div>

                    <div
                    class="mt-4 flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3 dark:bg-blue-500/10"
                    >
                    <span
                        class="text-sm text-gray-500 dark:text-gray-400"
                    >
                        Total
                    </span>

                    <span
                        class="text-base font-bold text-gray-900 dark:text-white"
                    >
                        Rp
                        {{
                        trx.total.toLocaleString('id-ID')
                        }}
                    </span>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    </admin-layout>
    </template>

    <script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import api from '@/api/axios'
    import AdminLayout from '@/components/layout/AdminLayout.vue'

    interface TopProduct {
    id: string | number
    name: string
    totalSold: number
    }

    interface DashboardTransaction {
    id: string | number
    total: number
    paymentStatus: string
    createdAt: string
    user?: {
        name: string
    }
    }

    const loading = ref(true)
    const dashboardData = ref<{
    categoriesCount: number
    productsCount: number
    transactionsCount: number
    totalRevenue: number
    recentTransactions: DashboardTransaction[]
    topProducts: TopProduct[]
    }>({
    categoriesCount: 0,
    productsCount: 0,
    transactionsCount: 0,
    totalRevenue: 0,
    recentTransactions: [],
    topProducts: []
    })

    const formatPaymentStatus = (status: string) => {
    const statusMap: Record<string, string> = {
        'paid': 'Terbayar',
        'pending': 'Tertunda',
        'failed': 'Gagal'
    }
    return statusMap[status] || status 
    }

    const fetchDashboardData = async () => {
    try {
        const token = localStorage.getItem('token')
        const response = await api.get('/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
        })
        dashboardData.value = response.data.data
    } catch (error) {
        console.error("Gagal mengambil data dashboard admin", error)
    } finally {
        loading.value = false
    }
    }

    onMounted(() => {
    fetchDashboardData()
    })
    </script>