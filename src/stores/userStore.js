import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  const dataPengguna = ref([])
  const isLoading = ref(false)

  // URL Endpoint API dari Laravel Anda
  const API_URL = 'http://localhost:8000/api/penggunas'

  // 1. GET ALL
  async function fetchPengguna() {
    isLoading.value = true
    try {
      const response = await axios.get(API_URL)
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
      await axios.post(API_URL, payload)
      await fetchPengguna() // Refresh data otomatis setelah simpan
    } catch (error) {
      console.error('Gagal tambah data:', error)
    }
  }

  // 3. UPDATE (PUT)
  async function updatePengguna(id, payload) {
    try {
      await axios.put(`${API_URL}/${id}`, payload)
      await fetchPengguna() // Refresh data otomatis setelah update
    } catch (error) {
      console.error('Gagal update data:', error)
    }
  }

  // 4. DELETE
  async function hapusPengguna(id) {
    try {
      await axios.delete(`${API_URL}/${id}`)
      await fetchPengguna() // Refresh data otomatis setelah hapus
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