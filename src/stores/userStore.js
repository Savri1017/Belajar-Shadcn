import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/config/api.js'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  const dataPengguna = ref([])
  const isLoading = ref(false)
  
  // 1. GET ALL
  async function fetchPengguna() {
    isLoading.value = true
    try {
      const response = await api.get(`/penggunas`)
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
      await api.post(`/penggunas`, payload)
      await fetchPengguna()
    } catch (error) {
      console.error('Gagal tambah data:', error)
    }
  }

  // 3. UPDATE (PUT)
  async function updatePengguna(id, payload) {
    try {
      await api.put(`/penggunas/${id}`, payload)
      await fetchPengguna()
    } catch (error) {
      console.error('Gagal update data:', error)
    }
  }

  // 4. DELETE
  async function hapusPengguna(id) {
    try {
      await api.delete(`/penggunas/${id}`)
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