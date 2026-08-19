<script setup>
import { ref, computed, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUserStore } from '@/stores/userStore'
import { Search, Users, ShieldCheck, User } from 'lucide-vue-next'

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
  DialogFooter,
} from '@/components/ui/dialog'

const userStore = useUserStore()
const isModalOpen = ref(false)
const namaInput = ref('')
const emailInput = ref('')
const peranInput = ref('User')
const idEdit = ref(null)

onMounted(() => {
  if (userStore.fetchPengguna) {
    userStore.fetchPengguna()
  }
})

// ==== STATISTIK RINGKASAN (kotak-kotak di atas tabel) ====
// Selalu dihitung dari SELURUH data (bukan hasil pencarian), supaya
// angka totalnya tidak berubah-ubah cuma karena lagi ngetik di search bar.
const totalPengguna = computed(() => userStore.dataPengguna.length)
const totalAdmin = computed(
  () => userStore.dataPengguna.filter((item) => item.peran === 'Admin').length
)
const totalUser = computed(
  () => userStore.dataPengguna.filter((item) => item.peran !== 'Admin').length
)

// ==== SEARCH BAR ====
const searchQuery = ref('')

// Menyaring data berdasarkan kata kunci yang diketik di search bar.
// Dicocokkan ke ID, Nama, Email, dan Peran (huruf besar/kecil diabaikan).
// Kalau search bar kosong, semua data tetap tampil (tidak difilter).
const dataPenggunaTersaring = computed(() => {
  const kataKunci = searchQuery.value.trim().toLowerCase()
  if (!kataKunci) return userStore.dataPengguna

  return userStore.dataPengguna.filter((item) => {
    return (
      String(item.id).includes(kataKunci) ||
      (item.nama ?? '').toLowerCase().includes(kataKunci) ||
      (item.email ?? '').toLowerCase().includes(kataKunci) ||
      (item.peran ?? '').toLowerCase().includes(kataKunci)
    )
  })
})

// Hasil pencarian di atas, lalu diurutkan lagi: Admin tetap di atas User.
const dataPenggunaTerurut = computed(() => {
  return [...dataPenggunaTersaring.value].sort((a, b) => {
    const isAdminA = a.peran === 'Admin'
    const isAdminB = b.peran === 'Admin'

    if (isAdminA === isAdminB) return 0
    return isAdminA ? -1 : 1
  })
})

function bukaModalTambah() {
  idEdit.value = null
  namaInput.value = ''
  emailInput.value = ''
  peranInput.value = 'User'
  isModalOpen.value = true
}

function editData(item) {
  idEdit.value = item.id
  namaInput.value = item.nama
  emailInput.value = item.email
  peranInput.value = item.peran
  isModalOpen.value = true
}

async function simpanData() {
  if (!namaInput.value || !emailInput.value) {
    alert('Nama dan Email wajib diisi!')
    return
  }

  const payload = {
    nama: namaInput.value,
    email: emailInput.value,
    peran: peranInput.value,
  }

  if (idEdit.value !== null) {
    if (userStore.updatePengguna) {
      await userStore.updatePengguna(idEdit.value, payload)
    }
  } else {
    if (userStore.tambahPengguna) {
      await userStore.tambahPengguna(payload)
    }
  }

  isModalOpen.value = false
}

async function hapusData(id) {
  if (confirm('Yakin ingin menghapus data ini?')) {
    if (userStore.hapusPengguna) {
      await userStore.hapusPengguna(id)
    }
  }
}
</script>

<template>
  <div class="dashboard-page">
    <h2>Dashboard</h2>

    <div class="stats-grid">
      <div class="stat-card">
        <div>
          <p class="stat-label">Total Data</p>
          <p class="stat-value">{{ userStore.isLoading ? '-' : totalPengguna }}</p>        
        </div>
      </div>

      <div class="stat-card">
        <div>
          <p class="stat-label"> Total Admin</p>
          <p class="stat-value">{{ userStore.isLoading ? '-' : totalAdmin }}</p>         
        </div>
      </div>

      <div class="stat-card">
        <div>
          <p class="stat-label"> Total User</p>
          <p class="stat-value">{{ userStore.isLoading ? '-' : totalUser }}</p>
        </div>
      </div>
    </div>

    <!-- Search bar -->
    <div class="search-card">
      <Search class="search-icon" />
      <Input
        v-model="searchQuery"
        type="text"
        placeholder="Cari berdasarkan nama, email, ID, atau peran..."
        class="pl-9"
      />
    </div>

    <div class="content-grid">
      <div class="table-card">
        <div class="table-header-box">
          <h3>Daftar Pengguna</h3>
          <Button class="action-button-modal" variant="outline" @click="bukaModalTambah">
            Tambah Pengguna
          </Button>
        </div>

        <div v-if="userStore.isLoading" class="loading-state">
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
            <TableRow
              v-for="(item, index) in dataPenggunaTerurut"
              :key="item.id"
            >
              <TableCell>{{ index + 1 }}</TableCell>
              <TableCell>{{ item.nama }}</TableCell>
              <TableCell>{{ item.email }}</TableCell>
              <TableCell>
                <span class="peran-badge" :class="item.peran === 'Admin' ? 'peran-admin' : 'peran-user'">
                  {{ item.peran }}
                </span>
              </TableCell>
              <TableCell class="action-buttons">
                <Button variant="outline" size="sm" @click="editData(item)" class="edit-buttons">
                  Edit
                </Button>
                <Button variant="destructive" size="sm" @click="hapusData(item.id)" class="delete-buttons">
                  Hapus
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>

    <Dialog :open="isModalOpen" @update:open="isModalOpen = $event">
      <DialogContent class="modal-box">
        <DialogHeader>
          <DialogTitle>{{ idEdit ? 'Edit Pengguna' : 'Tambah Pengguna Baru' }}</DialogTitle>
        </DialogHeader>

        <div class="modal-form">
          <div class="form-group">
            <label>Nama Lengkap</label>
            <input v-model="namaInput" type="text" placeholder="Masukkan nama..." class="input-field" />
          </div>

          <div class="form-group">
            <label>Email</label>
            <input v-model="emailInput" type="email" placeholder="Masukkan email..." class="input-field" />
          </div>

          <div class="form-group">
            <label>Peran</label>
            <select v-model="peranInput" class="input-field">
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="isModalOpen = false">Batal</Button>
          <Button @click="simpanData">
            {{ idEdit ? 'Update' : 'Simpan' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped>
.dashboard-page h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
}

/* Kotak-kotak statistik */
.stats-grid {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background-color: #ffffff;
  box-shadow: -3px 0px 0px #eef600;
  border: 3px solid #e5e7eb;
  border-radius: 8px;
  padding: 15px 60px 40px 15px;
}

.stat-value {
  font-size: 1.375rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: rgb(128, 121, 121);
}

/* Search bar — komponen <Input> shadcn sudah punya border & bg sendiri,
   jadi wrapper ini transparan, cuma buat naruh icon Search di dalam input */
.search-card {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  max-width: 420px;
}

.search-icon {
  position: absolute;
  left: 12px;
  width: 16px;
  height: 16px;
  color: #9ca3af;
  pointer-events: none;
}

.content-grid {
  display: flex;
  align-items: flex-start;
  gap: 24px;
}

.table-card {
  flex: 1;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
}

.table-header-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
}

.table-header-box h3 {
  font-size: 1rem;
  font-weight: 600;
}

.action-button-modal {
  background-color: #0400f6;
  color: white;
}

.action-button-modal:hover {
  background-color: #2624a7;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.loading-state {
  padding: 16px;
  color: #6b7280;
  font-size: 0.875rem;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.input-field {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  outline: none;
}

.input-field:focus {
  border-color: #2563eb;
}

.peran-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 999px;
}

.peran-admin {
  background-color: #ede9fe;
  color: #6d28d9;
}

.peran-user {
  background-color: #f3f4f6;
  color: #4b5563;
}

.edit-buttons {
  background-color: rgb(246, 246, 28);
}

.edit-buttons:hover {
  background-color: rgb(188, 188, 22);
}

.delete-buttons:hover {
  background-color: rgb(204, 21, 21);
}
</style>
