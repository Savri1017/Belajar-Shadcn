import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/config/api.js'

export const useUserStore = defineStore('user', () => {
  const dataPengguna = ref([])
  const isLoading = ref(false)
  const meta = ref({ currentPage: 1, lastPage: 1, total: 0, perPage: 10 })
  const stats = ref({ total: 0, admin: 0, manager: 0, staff: 0 })

  async function fetchPengguna({ search = '', page = 1, perPage = 10 } = {}) {
    isLoading.value = true
    try {
      const response = await api.get('/penggunas', {
        params: { search, page, per_page: perPage },
      })
      dataPengguna.value = response.data.data
      meta.value = {
        currentPage: response.data.current_page,
        lastPage: response.data.last_page,
        total: response.data.total,
        perPage: response.data.per_page,
      }
      stats.value = response.data.stats
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
      return true
    } catch (error) {
      console.error('Gagal tambah data:', error)
      return false
    }
  }

  async function updatePengguna(id, payload) {
    try {
      await api.put(`/penggunas/${id}`, payload)
      return true
    } catch (error) {
      console.error('Gagal update data:', error)
      return false
    }
  }

  async function hapusPengguna(id) {
    try {
      await api.delete(`/penggunas/${id}`)
      return true
    } catch (error) {
      console.error('Gagal hapus data:', error)
      return false
    }
  }

  return {
    dataPengguna, isLoading, meta, stats,
    fetchPengguna, tambahPengguna, updatePengguna, hapusPengguna,
  }
})