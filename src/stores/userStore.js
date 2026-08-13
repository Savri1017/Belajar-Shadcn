import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 1. STATE GLOBAL
  const dataPengguna = ref([
    { id: 1, nama: 'Budi Santoso', email: 'budi@gmail.com', peran: 'Admin' },
    { id: 2, nama: 'Siti Rahma', email: 'siti@gmail.com', peran: 'User' },
    { id: 3, nama: 'Andi Wijaya', email: 'andi@gmail.com', peran: 'User' },
  ])
  const isLoading = ref(false)

  // 2. ACTIONS (Fungsi Kelola Data)
  
  // Nanti fungsi ini diisi pemanggilan API Backend (fetch/axios)
  async function fetchPengguna() {
    isLoading.value = true
    try {
      // Contoh jika nanti terkoneksi ke backend:
      // const res = await fetch('https://api-anda.com/users')
      // dataPengguna.value = await res.json()
    } catch (error) {
      console.error('Gagal mengambil data pengguna:', error)
    } finally {
      isLoading.value = false
    }
  }

  function tambahPengguna(payload) {
    dataPengguna.value.push({
      id: Date.now(),
      ...payload,
    })
  }

  function updatePengguna(id, payload) {
    const index = dataPengguna.value.findIndex(item => item.id === id)
    if (index !== -1) {
      dataPengguna.value[index] = { id, ...payload }
    }
  }

  function hapusPengguna(id) {
    dataPengguna.value = dataPengguna.value.filter(item => item.id !== id)
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