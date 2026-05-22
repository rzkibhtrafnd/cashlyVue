    <template>
    <div class="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="border-b border-gray-200 px-7 py-5 dark:border-gray-800">
        <h3 class="text-lg font-bold text-gray-800 dark:text-white">
            {{ localForm.id ? 'Edit Kategori' : 'Tambah Kategori Baru' }}
        </h3>
        </div>

        <form @submit.prevent="$emit('submit', localForm)" class="p-7">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="md:col-span-2 lg:col-span-1">
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white">Nama Kategori <span class="text-red-500">*</span></label>
            <input 
                v-model="localForm.name" 
                type="text" 
                required
                placeholder="Contoh: Minuman Dingin" 
                class="w-full rounded-lg border border-gray-200 bg-transparent px-5 py-3 text-sm outline-none transition focus:border-brand-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white" 
            />
            </div>

            <div class="flex items-center gap-4 pt-2 md:col-span-2 border-t border-gray-100 dark:border-gray-800 mt-4">
            <button type="submit" :disabled="isSaving" class="rounded-lg bg-brand-500 px-8 py-3 font-medium text-white hover:bg-brand-600 transition shadow-md disabled:opacity-50">
                {{ isSaving ? 'Menyimpan...' : 'Simpan Kategori' }}
            </button>
            <button type="button" @click="$emit('cancel')" class="rounded-lg border border-gray-200 px-8 py-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 transition">
                Batal
            </button>
            </div>
        </div>
        </form>
    </div>
    </template>

    <script setup lang="ts">
    import { reactive, onMounted } from 'vue'

    const props = defineProps<{
    initialData: any;
    isSaving: boolean;
    }>();

    defineEmits(['submit', 'cancel']);

    const localForm = reactive({
    id: null as number | null,
    name: ''
    });

    onMounted(() => {
    if (props.initialData) {
        localForm.id = props.initialData.id;
        localForm.name = props.initialData.name;
    }
    });
    </script>