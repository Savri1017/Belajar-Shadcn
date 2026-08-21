import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/config/api.js'

export const useJabatanStore = defineStore('jabatan', () => {
  const daftarJabatan = ref([])
  const isLoading = ref(false)

  async function fetchJabatan() {
    isLoading.value = true
    try {
      const response = await api.get('/jabatans')
      daftarJabatan.value = response.data
      return true
    } catch (error) {
      console.error('Gagal ambil data jabatan:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return { daftarJabatan, isLoading, fetchJabatan }
})