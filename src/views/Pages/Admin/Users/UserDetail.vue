    <template>
    <div class="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="flex items-center justify-between border-b border-gray-200 px-7 py-5 dark:border-gray-800">
        <h3 class="text-lg font-bold text-gray-800 dark:text-white">Detail Pengguna</h3>
        <button @click="$emit('back')" class="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand-500 transition">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg> Kembali
        </button>
        </div>

        <div class="p-7">
        <div class="flex items-center gap-5 mb-8">
            <div class="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
            <span class="text-2xl font-bold uppercase">{{ user.name.charAt(0) }}</span>
            </div>
            <div>
            <h4 class="text-xl font-bold text-gray-800 dark:text-white">{{ user.name }}</h4>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10 rounded-xl bg-gray-50 p-6 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
            <div>
            <p class="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1 font-medium">ID Pengguna</p>
            <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">#{{ String(user.id).padStart(4, '0') }}</p>
            </div>
            <div>
            <p class="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1 font-medium">Role (Akses)</p>
            <span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase mt-1"
                    :class="user.role === 'admin' ? 'bg-brand-100 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400' : 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'">
                {{ user.role }}
            </span>
            </div>
            <div>
            <p class="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1 font-medium">Tanggal Didaftarkan</p>
            <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ formatDate(user.createdAt) }}</p>
            </div>
            <div>
            <p class="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1 font-medium">Pembaruan Terakhir</p>
            <p class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ formatDate(user.updatedAt) }}</p>
            </div>
        </div>

        <div class="mt-8 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800 pt-6">
            <button @click="$emit('edit', user)" class="rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition shadow-sm">
            Edit Pengguna
            </button>
        </div>
        </div>
    </div>
    </template>

    <script setup lang="ts">
        interface User {
        id: number;
        name: string;
        email: string;
        role: 'admin' | 'kasir';
        createdAt?: string;
        updatedAt?: string;
        }

    defineProps<{ user: User }>();
    defineEmits(['back', 'edit']);

    const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
    </script>