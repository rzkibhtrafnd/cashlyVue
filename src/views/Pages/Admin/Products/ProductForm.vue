    <template>
    <div class="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="border-b border-gray-200 px-7 py-5 dark:border-gray-800">
        <h3 class="text-lg font-bold text-gray-800 dark:text-white">
            {{ localForm.id ? 'Edit Produk' : 'Tambah Produk Baru' }}
        </h3>
        </div>

        <form @submit.prevent="handleSubmit" class="p-7">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            
            <!-- Gambar Produk -->
            <div class="md:col-span-2">
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white">Gambar Produk</label>
            <div class="flex items-center gap-6">
                <div class="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900 flex items-center justify-center">
                <img v-if="previewImage" :src="previewImage" alt="Preview" class="h-full w-full object-cover" />
                <svg v-else class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <div class="flex-1">
                <input @change="handleFileUpload" type="file" accept="image/*" class="w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-brand-600 dark:text-gray-400" />
                <p class="mt-2 text-xs text-gray-500">Format: JPG, PNG. Maksimal ukuran file 2MB.</p>
                </div>
            </div>
            </div>

            <!-- Nama Produk -->
            <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white">Nama Produk <span class="text-red-500">*</span></label>
            <input v-model="localForm.name" type="text" placeholder="Contoh: Es Teh Manis" required class="w-full rounded-lg border border-gray-200 bg-transparent px-5 py-3 text-sm outline-none transition focus:border-brand-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white" />
            </div>

            <!-- Kategori -->
            <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white">Kategori <span class="text-red-500">*</span></label>
            <div class="relative">
                <select v-model="localForm.categoryId" required class="w-full appearance-none rounded-lg border border-gray-200 bg-transparent px-5 py-3 text-sm outline-none focus:border-brand-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white">
                <option value="" disabled class="dark:bg-gray-900">Pilih Kategori</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id" class="dark:bg-gray-900">{{ cat.name }}</option>
                </select>
                <span class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 7l-6 6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
            </div>
            </div>

            <!-- Harga -->
            <div>
            <label class="mb-2.5 block text-sm font-medium text-gray-800 dark:text-white">Harga Jual (Rp) <span class="text-red-500">*</span></label>
            <input v-model="localForm.price" type="number" min="0" placeholder="0" required class="w-full rounded-lg border border-gray-200 bg-transparent px-5 py-3 text-sm outline-none transition focus:border-brand-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white" />
            </div>

            <!-- Tombol Aksi -->
            <div class="flex items-center gap-4 pt-4 md:col-span-2 border-t border-gray-100 dark:border-gray-800 mt-2">
            <button type="submit" :disabled="isSaving" class="rounded-lg bg-brand-500 px-8 py-3 font-medium text-white hover:bg-brand-600 transition shadow-md disabled:opacity-50">
                {{ isSaving ? 'Menyimpan...' : 'Simpan Produk' }}
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
    import { reactive, ref, onMounted } from 'vue'

        interface Category {
        id: number;
        name: string;
        }

        interface Product {
        id: number | null;
        name: string;
        price: string | number;
        categoryId: string | number;
        image?: string;
        category?: Category;
        }

        const props = defineProps<{
        initialData: Product | null;
        categories: Category[];
        isSaving: boolean;
        getImageUrl: (filename: string) => string;
        }>();

    const emit = defineEmits(['submit', 'cancel']);

    const localForm = reactive({
    id: null as number | null,
    name: '',
    price: '',
    categoryId: '' as string | number,
    });

    const fileImage = ref<File | null>(null);
    const previewImage = ref<string | null>(null);

    const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        fileImage.value = target.files[0];
        previewImage.value = URL.createObjectURL(target.files[0]);
    }
    };

    const handleSubmit = () => {
    emit('submit', {
        form: localForm,
        file: fileImage.value
    });
    };

    onMounted(() => {
    if (props.initialData) {
        localForm.id = props.initialData.id;
        localForm.name = props.initialData.name;
        localForm.price = props.initialData.price.toString();
        localForm.categoryId = props.initialData.category ? props.initialData.category.id : '';
        previewImage.value = props.initialData.image ? props.getImageUrl(props.initialData.image) : null;
    }
    });
    </script>