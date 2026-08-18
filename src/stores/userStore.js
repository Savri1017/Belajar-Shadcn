import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API_BASE_URL } from '@/config/api.js'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  const dataPengguna = ref([])
  const isLoading = ref(false)
  
  // 1. GET ALL
  async function fetchPengguna() {
    isLoading.value = true
    try {
      const response = await axios.get(`${API_BASE_URL}/penggunas`)
      dataPengguna.value = response.data
    } catch (error) {
      console.error('Gagal ambil data dari Laravel:', error)
    } finally {
      isLoading.value = false
    }
  }

  // 2. CREATE (POST)
  async function tambahPengguna(payload) {
    try {
      await axios.post(`${API_BASE_URL}/penggunas`, payload)
      await fetchPengguna()
    } catch (error) {
      console.error('Gagal tambah data:', error)
    }
  }

  // 3. UPDATE (PUT)
  async function updatePengguna(id, payload) {
    try {
      await axios.put(`${API_BASE_URL}/penggunas/${id}`, payload)
      await fetchPengguna()
    } catch (error) {
      console.error('Gagal update data:', error)
    }
  }

  // 4. DELETE
  async function hapusPengguna(id) {
    try {
      await axios.delete(`${API_BASE_URL}/penggunas/${id}`)
      await fetchPengguna()
    } catch (error) {
      console.error('Gagal hapus data:', error)
    }
  }

  return {
    dataPengguna,
    isLoading,
    fetchPengguna,
    tambahPengguna,
    updatePengguna,
    hapusPengguna
  }
})