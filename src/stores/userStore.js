import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 1. STATE (Wadah data global)
  const users = ref([])
  const isLoading = ref(false)

  // 2. ACTION (Fungsi Call API dari Backend / Dummy API)
  async function fetchUsers() {
    isLoading.value = true
    try {
      // Mengambil data dummy publik (Bisa diganti URL API Backend Anda nanti)
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      const data = await response.json()
      
      // Simpan data hasil dari API ke dalam state `users`
      users.value = data
    } catch (error) {
      console.error('Gagal mengambil data user:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Export variabel dan fungsi agar bisa dipakai komponen lain
  return {
    users,
    isLoading,
    fetchUsers,
  }
})