    <template>
    <form @submit.prevent="handleSubmit" class="p-6">
        <div class="flex flex-col lg:flex-row gap-8">
        
        <div class="flex-1">
            <h4 class="mb-5 text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Data Informasi Toko
            </h4>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Toko</label>
                <input 
                v-model="localForm.companyName" 
                type="text" 
                placeholder="Masukkan nama toko" 
                class="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-gray-800 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white" 
                />
            </div>

            <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Email Bisnis</label>
                <input 
                v-model="localForm.email" 
                type="email" 
                placeholder="email@toko.com" 
                class="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-gray-800 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white" 
                />
            </div>

            <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Nomor Telepon</label>
                <input 
                v-model="localForm.phone" 
                type="text" 
                placeholder="08123456789" 
                class="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-gray-800 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white" 
                />
            </div>

            <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Alamat</label>
                <input 
                v-model="localForm.address" 
                type="text" 
                placeholder="Jl. Raya No. 1" 
                class="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-gray-800 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white" 
                />
            </div>

            <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Nama WiFi (SSID)</label>
                <input 
                v-model="localForm.wifi" 
                type="text" 
                placeholder="Toko Free WiFi" 
                class="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-gray-800 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white" 
                />
            </div>

            <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Password WiFi</label>
                <input 
                v-model="localForm.wifiPassword" 
                type="text" 
                placeholder="Password WiFi" 
                class="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-gray-800 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white" 
                />
            </div>
            </div>
        </div>

        <div class="hidden lg:block w-px bg-gray-200 dark:bg-gray-800"></div>

        <div class="w-full lg:w-80 xl:w-96 flex flex-col gap-6 pt-6 lg:pt-0 border-t lg:border-t-0 border-gray-200 dark:border-gray-800">
            <h4 class="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Media & Gambar
            </h4>
            
            <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Logo Toko</label>
            <div class="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 transition hover:border-brand-500 dark:border-gray-700 dark:bg-gray-900">
                <input type="file" accept="image/*" @change="handleFileChange($event, 'logo')" class="w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-brand-600 dark:text-gray-400" />
                
                <div v-if="currentLogo" class="mt-4 flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
                <img :src="getImageUrl(currentLogo)" alt="Logo Aktif" class="h-12 w-12 rounded-lg object-contain bg-gray-100 dark:bg-gray-800" />
                <div class="flex flex-col">
                    <span class="text-sm font-semibold text-gray-800 dark:text-white">Logo Saat Ini</span>
                    <span class="text-xs font-medium text-green-600 dark:text-green-400">Tersimpan di sistem</span>
                </div>
                </div>
            </div>
            </div>

            <div>
            <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Gambar QRIS</label>
            <div class="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 transition hover:border-brand-500 dark:border-gray-700 dark:bg-gray-900">
                <input type="file" accept="image/*" @change="handleFileChange($event, 'qris')" class="w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-brand-600 dark:text-gray-400" />
                
                <div v-if="currentQris" class="mt-4 flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
                <img :src="getImageUrl(currentQris)" alt="QRIS Aktif" class="h-16 w-16 rounded-lg object-contain border border-gray-100 dark:border-gray-700" />
                <div class="flex flex-col">
                    <span class="text-sm font-semibold text-gray-800 dark:text-white">QRIS Saat Ini</span>
                    <span class="text-xs font-medium text-green-600 dark:text-green-400">Tersimpan di sistem</span>
                </div>
                </div>
            </div>
            </div>
        </div>

        </div>

        <div class="mt-6">
        <slot name="alert-zone"></slot>
        </div>

        <div class="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end dark:border-white/[0.05]">
        <button type="button" @click="$emit('reset')" class="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:border-brand-500 hover:text-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
            Reset
        </button>
        <button :disabled="isSaving" type="submit" class="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50">
            <svg v-if="isSaving" class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
            {{ isSaving ? 'Menyimpan Pengaturan...' : 'Simpan Pengaturan' }}
        </button>
        </div>
    </form>
    </template>

    <script setup lang="ts">
    import { reactive, ref, watch } from 'vue'

    const props = defineProps<{
    initialData: {
        companyName: string
        email: string
        phone: string
        address: string
        wifi: string
        wifiPassword: string
    }
    currentLogo: string
    currentQris: string
    isSaving: boolean;
    getImageUrl: (filename: string) => string
    }>();

    const emit = defineEmits(['submit', 'reset']);

    const localForm = reactive({ ...props.initialData });
    const fileLogo = ref<File | null>(null);
    const fileQris = ref<File | null>(null);

    watch(() => props.initialData, (newVal) => {
    Object.assign(localForm, newVal);
    fileLogo.value = null;
    fileQris.value = null;
    }, { deep: true });

    const handleFileChange = (event: Event, type: 'logo' | 'qris') => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        if (type === 'logo') fileLogo.value = target.files[0];
        if (type === 'qris') fileQris.value = target.files[0];
    }
    };

    const handleSubmit = () => {
    emit('submit', {
        form: localForm,
        logo: fileLogo.value,
        qris: fileQris.value
    });
    };
    </script>