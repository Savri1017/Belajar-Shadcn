<script setup>
import { ref, computed, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/userStore'

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

// Urutkan data supaya baris dengan peran "Admin" selalu tampil
// di atas baris dengan peran "User". Pakai computed (bukan mengubah
// userStore.dataPengguna langsung) supaya data asli dari backend tetap
// utuh, dan urutan ini otomatis kehitung ulang tiap kali data berubah
// (tambah, edit, hapus, atau refetch).
const dataPenggunaTerurut = computed(() => {
  return [...userStore.dataPengguna].sort((a, b) => {
    const isAdminA = a.peran === 'Admin'
    const isAdminB = b.peran === 'Admin'

    if (isAdminA === isAdminB) return 0   // sama-sama Admin / sama-sama User -> urutan asli dipertahankan
    return isAdminA ? -1 : 1              // Admin (-1) selalu dianggap "lebih kecil" -> naik ke atas
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
