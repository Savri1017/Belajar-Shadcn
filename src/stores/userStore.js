import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/config/api.js'

export const useUserStore = defineStore('user', () => {
  const dataPengguna = ref([])
  const isLoading = ref(false)

  async function fetchPengguna() {
    isLoading.value = true
    try {
      const response = await api.get('/penggunas')
      dataPengguna.value = response.data
      return true
    } catch (error) {
      console.error('Gagal ambil data dari Laravel:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function tambahPengguna(payload) {
    try {
      await api.post('/penggunas', payload)
      await fetchPengguna()
      return true
    } catch (error) {
      console.error('Gagal tambah data:', error)
      return false
    }
  }

  async function updatePengguna(id, payload) {
    try {
      await api.put(`/penggunas/${id}`, payload)
      await fetchPengguna()
      return true
    } catch (error) {
      console.error('Gagal update data:', error)
      return false
    }
  }

  async function hapusPengguna(id) {
    try {
      await api.delete(`/penggunas/${id}`)
      await fetchPengguna()
      return true
    } catch (error) {
      console.error('Gagal hapus data:', error)
      return false
    }
  }

  return {
    dataPengguna,
    isLoading,
    fetchPengguna,
    tambahPengguna,
    updatePengguna,
    hapusPengguna,
  }
})
