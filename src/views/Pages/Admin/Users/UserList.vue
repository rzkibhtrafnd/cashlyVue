    <template>
    <div class="rounded-2xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div class="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 dark:border-white/[0.05]">
        <div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Data Admin & Kasir</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Kelola akun pengguna sistem aplikasi kasir.</p>
        </div>
        <button @click="$emit('create')" class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 4.16666V15.8333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.16663 10H15.8333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Tambah Pengguna
        </button>
        </div>

        <div v-if="isLoading" class="flex justify-center p-10">
        <svg class="h-8 w-8 animate-spin text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
        </div>

        <div v-else class="max-w-full overflow-x-auto">
        <table class="w-full text-left">
            <thead class="border-y border-gray-100 bg-gray-50 dark:border-white/[0.05] dark:bg-gray-900">
            <tr>
                <th class="px-6 py-3 font-medium text-gray-500 text-xs uppercase dark:text-gray-400">ID</th>
                <th class="px-6 py-3 font-medium text-gray-500 text-xs uppercase dark:text-gray-400">Nama Pengguna</th>
                <th class="px-6 py-3 font-medium text-gray-500 text-xs uppercase dark:text-gray-400">Email</th>
                <th class="px-6 py-3 font-medium text-gray-500 text-xs uppercase dark:text-gray-400">Role</th>
                <th class="px-6 py-3 font-medium text-gray-500 text-xs uppercase dark:text-gray-400 text-right">Aksi</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-white/[0.05]">
            <tr v-if="users.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-gray-500">Belum ada data pengguna.</td>
            </tr>
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition">
                <td class="px-6 py-4"><span class="block font-medium text-gray-700 text-sm dark:text-gray-400">#{{ String(user.id).padStart(4, '0') }}</span></td>
                <td class="px-6 py-4"><span class="block text-sm font-medium text-gray-700 dark:text-gray-200">{{ user.name }}</span></td>
                <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</td>
                <td class="px-6 py-4 text-sm">
                <span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase"
                        :class="user.role === 'admin' ? 'bg-brand-100 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400' : 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'">
                    {{ user.role }}
                </span>
                </td>
                <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                    <button @click="$emit('view', user)" class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-theme-xs transition hover:border-blue-500 hover:text-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> Detail</button>
                    <button @click="$emit('edit', user)" class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-theme-xs transition hover:border-brand-500 hover:text-brand-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Edit</button>
                    <button @click="$emit('delete', user.id)" class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-theme-xs transition hover:border-red-500 hover:text-red-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> Hapus</button>
                </div>
                </td>
            </tr>
            </tbody>
        </table>
        </div>
    </div>
    </template>

    <script setup lang="ts">
    interface User {
        id: number;
        name: string;
        email: string;
        role: 'admin' | 'kasir';
    }
    defineProps<{
        users: User[];
        isLoading: boolean;
    }>();

    defineEmits(['create', 'view', 'edit', 'delete']);
    </script>