import { ref } from 'vue'
import api from '@/api/axios'

interface SettingsData {
  logo: string
  logoDark: string
  logoIcon: string
  authLogo: string
}

const settings = ref<SettingsData | null>(null)
const isLoading = ref(false)

export const useSettings = () => {
  const fetchSettings = async () => {
    if (settings.value) return settings.value

    try {
      isLoading.value = true
      const token = localStorage.getItem('token')
      const response = await api.get('/settings', {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      })

      settings.value = response.data.data
      return settings.value
    } catch (error) {
      console.error('Gagal mengambil settings:', error)
      settings.value = {
        logo: '/images/logo/logo.svg',
        logoDark: '/images/logo/logo-dark.svg',
        logoIcon: '/images/logo/logo-icon.svg',
        authLogo: '/images/logo/auth-logo.svg'
      }
      return settings.value
    } finally {
      isLoading.value = false
    }
  }

  return {
    settings,
    isLoading,
    fetchSettings
  }
}
