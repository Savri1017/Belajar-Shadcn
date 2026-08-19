<script setup>
import { ref, computed, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUserStore } from '@/stores/userStore'
import { Search, Users, ShieldCheck, User, Loader2, Pencil, Trash2 } from 'lucide-vue-next'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

const userStore = useUserStore()

const isModalOpen = ref(false)
const isSubmitting = ref(false)
const isDeleteModalOpen = ref(false)
const isDeleting = ref(false)
const penggunaYangDihapus = ref(null)

const namaInput = ref('')
const emailInput = ref('')
const peranInput = ref('User')
const idEdit = ref(null)
const errorMessage = ref('')
const deleteErrorMessage = ref('')
const searchQuery = ref('')

onMounted(() => {
  userStore.fetchPengguna()
})

const totalPengguna = computed(() => userStore.dataPengguna.length)
const totalAdmin = computed(() => userStore.dataPengguna.filter((item) => item.peran === 'Admin').length)
const totalUser = computed(() => userStore.dataPengguna.filter((item) => item.peran !== 'Admin').length)

const dataPenggunaTersaring = computed(() => {
  const kataKunci = searchQuery.value.trim().toLowerCase()
  if (!kataKunci) return userStore.dataPengguna

  return userStore.dataPengguna.filter((item) => (
    String(item.id).includes(kataKunci) ||
    (item.nama ?? '').toLowerCase().includes(kataKunci) ||
    (item.email ?? '').toLowerCase().includes(kataKunci) ||
    (item.peran ?? '').toLowerCase().includes(kataKunci)
  ))
})

const dataPenggunaTerurut = computed(() => {
  return [...dataPenggunaTersaring.value].sort((a, b) => {
    const isAdminA = a.peran === 'Admin'
    const isAdminB = b.peran === 'Admin'
    if (isAdminA === isAdminB) return 0
    return isAdminA ? -1 : 1
  })
})

function bukaModalTambah() {
  if (isSubmitting.value) return
  idEdit.value = null
  namaInput.value = ''
  emailInput.value = ''
  peranInput.value = 'User'
  errorMessage.value = ''
  isModalOpen.value = true
}

function editData(item) {
  if (isSubmitting.value || isDeleting.value) return
  idEdit.value = item.id
  namaInput.value = item.nama
  emailInput.value = item.email
  peranInput.value = item.peran
  errorMessage.value = ''
  isModalOpen.value = true
}

function tutupModalForm() {
  if (!isSubmitting.value) isModalOpen.value = false
}

async function simpanData() {
  if (isSubmitting.value) return
  errorMessage.value = ''

  if (!namaInput.value.trim() || !emailInput.value.trim()) {
    errorMessage.value = 'Nama dan Email wajib diisi.'
    return
  }

  const payload = {
    nama: namaInput.value.trim(),
    email: emailInput.value.trim(),
    peran: peranInput.value,
  }

  isSubmitting.value = true

  try {
    const berhasil = idEdit.value !== null
      ? await userStore.updatePengguna(idEdit.value, payload)
      : await userStore.tambahPengguna(payload)

    if (!berhasil) {
      errorMessage.value = idEdit.value !== null
        ? 'Data gagal diperbarui. Silakan coba lagi.'
        : 'Data gagal disimpan. Silakan coba lagi.'
      return
    }

    isModalOpen.value = false
  } finally {
    isSubmitting.value = false
  }
}

function bukaModalHapus(item) {
  if (isDeleting.value || isSubmitting.value) return
  penggunaYangDihapus.value = item
  deleteErrorMessage.value = ''
  isDeleteModalOpen.value = true
}

function tutupModalHapus() {
  if (!isDeleting.value) isDeleteModalOpen.value = false
}

async function konfirmasiHapus() {
  if (isDeleting.value || !penggunaYangDihapus.value) return

  deleteErrorMessage.value = ''
  isDeleting.value = true

  try {
    const berhasil = await userStore.hapusPengguna(penggunaYangDihapus.value.id)

    if (!berhasil) {
      deleteErrorMessage.value = 'Data gagal dihapus. Silakan coba lagi.'
      return
    }

    isDeleteModalOpen.value = false
    penggunaYangDihapus.value = null
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="dashboard-page">
    <h2>Dashboard</h2>

    <div class="stats-grid">
      <div class="stat-card">
        <Users class="stat-icon" />
        <div>
          <p class="stat-label">Total Data</p>
          <p class="stat-value">{{ userStore.isLoading ? '-' : totalPengguna }}</p>
        </div>
      </div>
      <div class="stat-card">
        <ShieldCheck class="stat-icon" />
        <div>
          <p class="stat-label">Total Admin</p>
          <p class="stat-value">{{ userStore.isLoading ? '-' : totalAdmin }}</p>
        </div>
      </div>
      <div class="stat-card">
        <User class="stat-icon" />
        <div>
          <p class="stat-label">Total User</p>
          <p class="stat-value">{{ userStore.isLoading ? '-' : totalUser }}</p>
        </div>
      </div>
    </div>

    <div class="search-card">
      <Search class="search-icon" />
      <Input v-model="searchQuery" type="text" placeholder="Cari berdasarkan nama, email, ID, atau peran..." class="pl-9" />
    </div>

    <div class="content-grid">
      <div class="table-card">
        <div class="table-header-box">
          <div>
            <h3>Daftar Pengguna</h3>
            <p class="table-description">Kelola data pengguna dari sini.</p>
          </div>
          <Button class="action-button-modal" :disabled="isSubmitting || isDeleting" @click="bukaModalTambah">
            Tambah Pengguna
          </Button>
        </div>

        <div v-if="userStore.isLoading" class="loading-state">
          <Loader2 class="loading-icon" />
          Sedang memuat data dari database...
        </div>
        <div v-else-if="dataPenggunaTerurut.length === 0" class="loading-state">
          Tidak ada data yang cocok dengan pencarian "{{ searchQuery }}".
        </div>

        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Peran</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(item, index) in dataPenggunaTerurut" :key="item.id">
              <TableCell>{{ index + 1 }}</TableCell>
              <TableCell>{{ item.nama }}</TableCell>
              <TableCell>{{ item.email }}</TableCell>
              <TableCell>
                <span class="peran-badge" :class="item.peran === 'Admin' ? 'peran-admin' : 'peran-user'">
                  {{ item.peran }}
                </span>
              </TableCell>
              <TableCell class="action-buttons">
                <Button variant="outline" size="sm" class="edit-buttons" :disabled="isSubmitting || isDeleting" @click="editData(item)">
                  <Pencil class="button-icon" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" class="delete-buttons" :disabled="isSubmitting || isDeleting" @click="bukaModalHapus(item)">
                  <Trash2 class="button-icon" />
                  Hapus
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>

    <Dialog :open="isModalOpen" @update:open="isModalOpen = $event">
      <DialogContent class="modal-box" :show-close-button="!isSubmitting">
        <DialogHeader>
          <DialogTitle>{{ idEdit !== null ? 'Edit Pengguna' : 'Tambah Pengguna Baru' }}</DialogTitle>
          <DialogDescription>
            {{ idEdit !== null ? 'Perbarui informasi pengguna.' : 'Isi data pengguna baru di bawah ini.' }}
          </DialogDescription>
        </DialogHeader>

        <form class="modal-form" @submit.prevent="simpanData">
          <div class="form-group">
            <label for="nama">Nama Lengkap</label>
            <Input id="nama" v-model="namaInput" :disabled="isSubmitting" placeholder="Masukkan nama..." />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <Input id="email" v-model="emailInput" type="email" :disabled="isSubmitting" placeholder="Masukkan email..." />
          </div>
          <div class="form-group">
            <label for="peran">Peran</label>
            <select id="peran" v-model="peranInput" class="input-field" :disabled="isSubmitting">
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>

          <DialogFooter>
            <Button type="button" variant="outline" :disabled="isSubmitting" @click="tutupModalForm">Batal</Button>
            <Button type="submit" :disabled="isSubmitting">
              <Loader2 v-if="isSubmitting" class="button-icon spinner" />
              {{ isSubmitting ? (idEdit !== null ? 'Menyimpan perubahan...' : 'Menyimpan data...') : (idEdit !== null ? 'Update' : 'Simpan') }}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <Dialog :open="isDeleteModalOpen" @update:open="isDeleteModalOpen = $event">
      <DialogContent :show-close-button="!isDeleting">
        <DialogHeader>
          <DialogTitle>Hapus Pengguna?</DialogTitle>
          <DialogDescription>
            Data <strong>{{ penggunaYangDihapus?.nama }}</strong> akan dihapus secara permanen dan tidak dapat dikembalikan.
          </DialogDescription>
        </DialogHeader>

        <p v-if="deleteErrorMessage" class="form-error">{{ deleteErrorMessage }}</p>

        <DialogFooter>
          <Button variant="outline" :disabled="isDeleting" @click="tutupModalHapus">Batal</Button>
          <Button variant="destructive" :disabled="isDeleting" @click="konfirmasiHapus">
            <Loader2 v-if="isDeleting" class="button-icon spinner" />
            {{ isDeleting ? 'Menghapus...' : 'Ya, Hapus Data' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped>
.dashboard-page h2 { font-size: 1.5rem; font-weight: bold; margin-bottom: 20px; }
.stats-grid { display: flex; gap: 30px; margin-bottom: 20px; }
.stat-card { display: flex; align-items: center; gap: 14px; background-color: #fff; box-shadow: -3px 0 0 #1d00f6bc; border: 3px solid #e5e7eb; border-radius: 8px; padding: 15px 60px 15px 15px; }
.stat-icon { width: 25px; height: 25px; color: #4338ca; }
.stat-value { font-size: 1.375rem; font-weight: 700; color: #111827; line-height: 2.1; }
.stat-label { font-size: 15px; font-weight: bold; color: rgb(128, 121, 121); }
.search-card { position: relative; display: flex; align-items: center; margin-bottom: 20px; max-width: 420px; }
.search-icon { position: absolute; left: 12px; width: 16px; height: 16px; color: #9ca3af; pointer-events: none; z-index: 1; }
.content-grid { display: flex; align-items: flex-start; gap: 24px; }
.table-card { flex: 1; background-color: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; }
.table-header-box { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; gap: 20px; }
.table-header-box h3 { font-size: 1rem; font-weight: 600; }
.table-description { color: #6b7280; font-size: .8rem; margin-top: 3px; }
.action-button-modal { background-color: #0400f6; color: white; }
.action-button-modal:hover { background-color: #2624a7; }
.action-buttons { display: flex; gap: 8px; }
.button-icon { width: 15px; height: 15px; }
.loading-state { display: flex; align-items: center; gap: 8px; padding: 16px; color: #6b7280; font-size: .875rem; }
.loading-icon, .spinner { animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.modal-form { display: flex; flex-direction: column; gap: 16px; padding: 8px 0; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: .875rem; font-weight: 500; color: #374151; }
.input-field { width: 100%; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: .875rem; outline: none; background: white; }
.input-field:focus { border-color: #2563eb; }
.input-field:disabled { cursor: not-allowed; opacity: .6; }
.form-error { color: #dc2626; font-size: .875rem; }
.peran-badge { display: inline-block; font-size: .75rem; font-weight: 600; padding: 2px 10px; border-radius: 999px; }
.peran-admin { background-color: #ede9fe; color: #6d28d9; }
.peran-user { background-color: #f3f4f6; color: #4b5563; }
.edit-buttons { background-color: rgb(246, 246, 28); }
.edit-buttons:hover { background-color: rgb(188, 188, 22); }
.delete-buttons:hover { background-color: rgb(204, 21, 21); }
</style>
