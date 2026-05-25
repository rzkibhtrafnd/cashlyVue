    <template>
    <div class="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="border-b border-gray-200 px-7 py-5 dark:border-gray-800">
        <h3 class="text-lg font-bold text-gray-800 dark:text-white">
            {{ localForm.id ? 'Edit Pengguna' : 'Tambah Pengguna Baru' }}
        </h3>
        </div>

        <form @submit.prevent="$emit('submit', localForm)" class="p-7">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white">Nama Lengkap <span class="text-red-500">*</span></label>
            <input v-model="localForm.name" type="text" required placeholder="Masukkan nama" class="w-full rounded-lg border border-gray-200 bg-transparent px-5 py-3 text-sm outline-none transition focus:border-brand-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white" />
            </div>

            <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white">Email Login <span class="text-red-500">*</span></label>
            <input v-model="localForm.email" type="email" required placeholder="email@contoh.com" class="w-full rounded-lg border border-gray-200 bg-transparent px-5 py-3 text-sm outline-none transition focus:border-brand-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white" />
            </div>

            <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white">Role Pengguna <span class="text-red-500">*</span></label>
            <div class="relative">
                <select v-model="localForm.role" required class="w-full appearance-none rounded-lg border border-gray-200 bg-transparent px-5 py-3 text-sm outline-none focus:border-brand-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white">
                <option value="kasir" class="dark:bg-gray-900">Kasir</option>
                <option value="admin" class="dark:bg-gray-900">Administrator</option>
                </select>
                <span class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 7l-6 6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            </div>
            </div>

            <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white">Password <span v-if="!localForm.id" class="text-red-500">*</span></label>
            <input v-model="localForm.password" type="password" :required="!localForm.id" :placeholder="localForm.id ? 'Kosongkan jika tidak ingin mengubah' : 'Minimal 6 karakter'" class="w-full rounded-lg border border-gray-200 bg-transparent px-5 py-3 text-sm outline-none transition focus:border-brand-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white" />
            </div>

            <div class="flex items-center gap-4 pt-4 lg:col-span-2 border-t border-gray-100 dark:border-gray-800 mt-2">
            <button type="submit" :disabled="isSaving" class="rounded-lg bg-brand-500 px-8 py-3 font-medium text-white hover:bg-brand-600 transition shadow-md disabled:opacity-50">
                {{ isSaving ? 'Menyimpan...' : 'Simpan Pengguna' }}
            </button>
            <button type="button" @click="$emit('cancel')" class="rounded-lg border border-gray-200 px-8 py-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 transition">Batal</button>
            </div>
        </div>
        </form>
    </div>
    </template>

    <script setup lang="ts">
    import { reactive, onMounted } from 'vue'

        interface User {
        id: number | null;
        name: string;
        email: string;
        password: string;
        role: 'admin' | 'kasir';
        }

        const props = defineProps<{
        initialData: User | null;
        isSaving: boolean;
        }>();

        defineEmits(['submit', 'cancel']);

        const localForm = reactive<User>({
        id: null,
        name: '',
        email: '',
        password: '',
        role: 'kasir'
        });

    onMounted(() => {
    if (props.initialData) {
        localForm.id = props.initialData.id;
        localForm.name = props.initialData.name;
        localForm.email = props.initialData.email;
        localForm.role = props.initialData.role || 'kasir';
    }
    });
    </script>