    <template>
    <admin-layout>
        <!-- Loading -->
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
                Memuat Dashboard Kasir
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
        class="min-h-screen bg-blue-50/40 dark:bg-gray-950"
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
                    Dashboard Kasir
                </h1>

                <p
                    class="mt-2 text-sm text-gray-500 dark:text-gray-400"
                >
                    Pantau aktivitas transaksi dan pendapatan Anda
                    secara realtime.
                </p>
                </div>

                <div
                class="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 dark:border-blue-900/30 dark:bg-blue-500/10"
                >
                <p
                    class="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400"
                >
                    Pendapatan Saya
                </p>

                <h2
                    class="mt-1 text-2xl font-bold text-gray-900 dark:text-white"
                >
                    Rp
                    {{
                    dashboardData.myRevenue.toLocaleString(
                        'id-ID'
                    )
                    }}
                </h2>
                </div>
            </div>
            </div>

            <!-- Statistic Cards -->
            <div
            class="grid grid-cols-1 gap-5 md:grid-cols-2"
            >
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
                    Total Transaksi Saya
                </p>

                <div class="mt-2 flex items-end gap-2">
                    <h4
                    class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white"
                    >
                    {{
                        dashboardData.myTransactionsCount
                    }}
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
                    Total Pendapatan Saya
                </p>

                <div class="mt-2">
                    <h4
                    class="truncate text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white"
                    >
                    Rp
                    {{
                        dashboardData.myRevenue.toLocaleString(
                        'id-ID'
                        )
                    }}
                    </h4>
                </div>
                </div>
            </div>
            </div>

            <!-- Transaction History -->
            <div
            class="rounded-3xl border border-blue-100 bg-white shadow-[0_4px_20px_rgba(59,130,246,0.08)] dark:border-blue-900/30 dark:bg-gray-900"
            >
            <div
                class="border-b border-blue-100 px-6 py-5 dark:border-blue-900/30"
            >
                <h3
                class="text-lg font-bold text-gray-900 dark:text-white"
                >
                Riwayat Transaksi Terakhir
                </h3>

                <p
                class="mt-1 text-sm text-gray-500 dark:text-gray-400"
                >
                Daftar transaksi terbaru yang Anda lakukan.
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
                        ID
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

                    <th
                        class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                    >
                        Tanggal
                    </th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                    v-for="trx in dashboardData.myRecentTransactions"
                    :key="trx.id"
                    class="bg-white transition-all duration-300 hover:shadow-md dark:bg-gray-900"
                    >
                    <td
                        class="rounded-l-2xl px-4 py-4"
                    >
                        <div
                        class="inline-flex rounded-xl bg-blue-50 px-3 py-2 font-mono text-sm font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                        >
                        #{{ trx.id }}
                        </div>
                    </td>

                    <td
                        class="px-4 py-4 font-semibold text-gray-900 dark:text-white"
                    >
                        Rp
                        {{
                        trx.total.toLocaleString('id-ID')
                        }}
                    </td>

                    <td class="px-4 py-4">
                        <span
                        class="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                        :class="{
                            'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400':
                            trx.paymentStatus ===
                            'PAID',

                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400':
                            trx.paymentStatus !==
                            'PAID'
                        }"
                        >
                        {{ trx.paymentStatus }}
                        </span>
                    </td>

                    <td
                        class="rounded-r-2xl px-4 py-4 text-sm text-gray-500 dark:text-gray-400"
                    >
                        {{
                        new Date(
                            trx.createdAt
                        ).toLocaleString('id-ID')
                        }}
                    </td>
                    </tr>
                </tbody>
                </table>
            </div>

            <!-- Mobile Card -->
            <div class="space-y-4 p-4 lg:hidden">
                <div
                v-for="trx in dashboardData.myRecentTransactions"
                :key="trx.id"
                class="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm dark:border-blue-900/30 dark:bg-gray-900"
                >
                <div
                    class="flex items-start justify-between gap-3"
                >
                    <div>
                    <div
                        class="inline-flex rounded-xl bg-blue-50 px-3 py-2 font-mono text-sm font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                    >
                        #{{ trx.id }}
                    </div>

                    <p
                        class="mt-3 text-lg font-bold text-gray-900 dark:text-white"
                    >
                        Rp
                        {{
                        trx.total.toLocaleString('id-ID')
                        }}
                    </p>

                    <p
                        class="mt-1 text-xs text-gray-500 dark:text-gray-400"
                    >
                        {{
                        new Date(
                            trx.createdAt
                        ).toLocaleString('id-ID')
                        }}
                    </p>
                    </div>

                    <span
                    class="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                    :class="{
                        'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400':
                        trx.paymentStatus ===
                        'PAID',

                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400':
                        trx.paymentStatus !==
                        'PAID'
                    }"
                    >
                    {{ trx.paymentStatus }}
                    </span>
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

    interface KasirTransaction {
    id: string | number
    total: number
    paymentStatus: string
    createdAt: string
    }

    const loading = ref(true)
    const dashboardData = ref<{
    myTransactionsCount: number
    myRevenue: number
    myRecentTransactions: KasirTransaction[]
    }>({
    myTransactionsCount: 0,
    myRevenue: 0,
    myRecentTransactions: []
    })

    const fetchKasirData = async () => {
    try {
        const token = localStorage.getItem('token')
        const response = await api.get('/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
        })
        dashboardData.value = response.data.data
    } catch (error) {
        console.error("Gagal mengambil data dashboard kasir", error)
    } finally {
        loading.value = false
    }
    }

    onMounted(() => {
    fetchKasirData()
    })
    </script>