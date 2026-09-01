import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/config/api.js'
import { getMedia } from '@/services/media.js'

// Backend belum punya sistem login, jadi untuk sementara SEMUA komponen
// (Navbar, Profil, dst) yang butuh tau "pengguna yang lagi aktif" pakai
// konstanta ini. Taruh di satu tempat biar gampang diganti nanti kalau
// fitur auth sudah ada (tinggal isi dengan id user yang login).
export const ID_PENGGUNA_AKTIF = 1

const STORAGE_URL = 'http://localhost:8000/storage'

export const useUserStore = defineStore('user', () => {
  const dataPengguna = ref([])
  const isLoading = ref(false)
  const meta = ref({ currentPage: 1, lastPage: 1, total: 0, perPage: 10 })
  const stats = ref({ total: 0, admin: 0, manager: 0, staff: 0 })

  // Dipakai halaman Profil: data 1 pengguna aja, bukan daftar
  const penggunaAktif = ref(null)
  const isLoadingProfil = ref(false)

  // Avatar pengguna aktif. Ditaruh di store (bukan di Profil.vue aja)
  // supaya Navbar.vue bisa baca data yang SAMA. Begitu Profil upload
  // avatar baru dan manggil fetchAvatarAktif() lagi, semua komponen
  // yang pakai avatarUrl dari sini otomatis ikut ke-update (reaktif).
  const avatarAktif = ref(null)
  const avatarUrl = computed(() =>
    avatarAktif.value ? `${STORAGE_URL}/${avatarAktif.value.path}` : null
  )

  async function fetchAvatarAktif() {
    try {
      const response = await getMedia('pengguna', ID_PENGGUNA_AKTIF, 'avatar')
      avatarAktif.value = response.data[0] ?? null
    } catch (error) {
      console.error('Gagal ambil avatar:', error)
    }
  }

  async function fetchPenggunaById(id) {
    isLoadingProfil.value = true
    try {
      const response = await api.get(`/penggunas/${id}`)
      penggunaAktif.value = response.data
      return true
    } catch (error) {
      console.error('Gagal ambil data profil:', error)
      return false
    } finally {
      isLoadingProfil.value = false
    }
  }

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
    penggunaAktif, isLoadingProfil, fetchPenggunaById,
    avatarAktif, avatarUrl, fetchAvatarAktif,
  }
})