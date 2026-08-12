<script setup>
import { ref } from 'vue'

import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'
import { Button } from '@/components/ui/button'

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

const isModalOpen = ref(false)
const dataPengguna = ref([
  { id: 1, nama: 'Budi Santoso', email: 'budi@gmail.com', peran: 'Admin' },
  { id: 2, nama: 'Siti Rahma', email: 'siti@gmail.com', peran: 'User' },
  { id: 3, nama: 'Andi Wijaya', email: 'andi@gmail.com', peran: 'User' },
])

const namaInput = ref('')
const emailInput = ref('')
const peranInput = ref('User')
const idEdit = ref(null)

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

function simpanData() {
  if (!namaInput.value || !emailInput.value) {
    alert('Nama dan Email wajib diisi!')
    return
  }

  if (idEdit.value !== null) {
    const index = dataPengguna.value.findIndex(item => item.id === idEdit.value)
    if (index !== -1) {
      dataPengguna.value[index] = {
        id: idEdit.value,
        nama: namaInput.value,
        email: emailInput.value,
        peran: peranInput.value
      }
    }
  } else {
    dataPengguna.value.push({
      id: Date.now(),
      nama: namaInput.value,
      email: emailInput.value,
      peran: peranInput.value
    })
  }

  isModalOpen.value = false
}

function hapusData(id) {
  if (confirm('Yakin ingin menghapus data ini?')) {
    dataPengguna.value = dataPengguna.value.filter(item => item.id !== id)
  }
}
</script>

<template>
  <div class="app-layout">
    <Sidebar />

    <div class="main-wrapper">
      <Navbar />
      
      <main class="content-area">
        <h2>Dashboard</h2>

        <div class="content-grid">
          <div class="table-card">
            <div class="table-header-box">
              <h3>Daftar Pengguna</h3>
              <Button class="action-button-modal" variant="outline" @click="bukaModalTambah">Tambah Pengguna</Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Peran</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="(item, index) in dataPengguna" :key="item.id">
                  <TableCell>{{ index + 1 }}</TableCell>
                  <TableCell>{{ item.nama }}</TableCell>
                  <TableCell>{{ item.email }}</TableCell>
                  <TableCell>{{ item.peran }}</TableCell>
                  <TableCell class="action-buttons">
                    <Button variant="outline" size="sm" @click="editData(item)">
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" @click="hapusData(item.id)">
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
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-area {
  padding: 24px;
}

.content-area h2 {
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
</style>