<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
import { Input } from '@/components/ui/input'
import { useUserStore } from '@/stores/userStore'
import { useJabatanStore } from '@/stores/jabatanStore'
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,} from '@/components/ui/dialog'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table'
import {Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious,} from '@/components/ui/pagination'
import { Briefcase, Loader2, Pencil, Search, ShieldCheck, Trash2, User, Users } from 'lucide-vue-next'

const userStore = useUserStore()
const jabatanStore = useJabatanStore()
const daftarJabatanNama = computed(() => jabatanStore.daftarJabatan.map((j) => j.nama_jabatan))

const isModalOpen = ref(false)
const isSubmitting = ref(false)
const isDeleteModalOpen = ref(false)
const isDeleting = ref(false)
const penggunaYangDihapus = ref(null)
const namaInput = ref('')
const emailInput = ref('')
const peranInput = ref('')
const idEdit = ref(null)
const errorMessage = ref('')
const deleteErrorMessage = ref('')
const searchQuery = ref('')
const itemsPerPage = 10
const currentPage = ref(1)
let searchDebounceTimer = null

function refreshData() {
  return userStore.fetchPengguna({
    search: searchQuery.value.trim(),
    page: currentPage.value,
    perPage: itemsPerPage,
  })
}

onMounted(() => {
  refreshData()
})

function onJabatanOpenChange(open) {
  if (open) jabatanStore.fetchJabatan()
}

watch(currentPage, () => {
  refreshData()
})

watch(searchQuery, () => {
  clearTimeout(searchDebounceTimer)
  searchDebounceTimer = setTimeout(() => {
    if (currentPage.value !== 1) {
      currentPage.value = 1
    } else {
      refreshData()
    }
  }, 400)
})

function bukaModalTambah() {
  if (isSubmitting.value || isDeleting.value) return
  idEdit.value = null
  namaInput.value = ''
  emailInput.value = ''
  peranInput.value = ''
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
  if (!namaInput.value.trim() || !emailInput.value.trim() || !peranInput.value.trim()) {
    errorMessage.value = 'Nama, Email, dan Jabatan wajib diisi.'
    return
  }
  if (!daftarJabatanNama.value.includes(peranInput.value.trim())) {
    errorMessage.value = 'Jabatan harus dipilih dari daftar yang tersedia.'
    return
  }
  const payload = {
    nama: namaInput.value.trim(),
    email: emailInput.value.trim(),
    peran: peranInput.value.trim(),
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
    await refreshData()
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
    if (userStore.dataPengguna.length === 1 && currentPage.value > 1) {
      currentPage.value -= 1
    } else {
      await refreshData()
    }
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
        <div><p class="stat-label">Total Data</p><p class="stat-value">{{ userStore.isLoading ? '-' : userStore.stats.total }}</p></div>
        <Users class="stat-icon" />
      </div>
      <div class="stat-card2">
        <div><p class="stat-label">Total Admin</p><p class="stat-value">{{ userStore.isLoading ? '-' : userStore.stats.admin }}</p></div>
        <ShieldCheck class="stat-icon stat-admin" />
      </div>
      <div class="stat-card3">
        <div><p class="stat-label">Total Manager</p><p class="stat-value">{{ userStore.isLoading ? '-' : userStore.stats.manager }}</p></div>
        <Briefcase class="stat-icon stat-manager" />
      </div>
      <div class="stat-card4">
        <div><p class="stat-label">Total Staff</p><p class="stat-value">{{ userStore.isLoading ? '-' : userStore.stats.staff }}</p></div>
        <User class="stat-icon stat-staff" />
      </div>
    </div>

    <div class="search-card">
      <Search class="search-icon" />
      <Input v-model="searchQuery" type="text" placeholder="Cari berdasarkan Nama, Email atau Jabatan..." class="pl-9" />
    </div>

    <div class="content-grid">
      <div class="table-card">
        <div class="table-header-box">
          <div><h3>Daftar Pengguna</h3></div>
          <Button class="action-button-modal" :disabled="isSubmitting || isDeleting" @click="bukaModalTambah">Tambah Pengguna</Button>
        </div>

        <div v-if="userStore.isLoading" class="loading-state"><Loader2 class="loading-icon" /><span>Sedang memuat data dari database...</span></div>
        <div v-else-if="userStore.dataPengguna.length === 0" class="loading-state">Tidak ada data yang cocok dengan pencarian "{{ searchQuery }}".</div>

        <Table v-else>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Jabatan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(item, index) in userStore.dataPengguna" :key="item.id">
              <TableCell>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</TableCell>
              <TableCell>{{ item.nama }}</TableCell>
              <TableCell>{{ item.email }}</TableCell>
              <TableCell>
                <span class="peran-badge" :class="{
                  'peran-admin': item.peran === 'Admin',
                  'peran-manager': item.peran === 'Manager',
                  'peran-staff': item.peran === 'Staff',
                }">{{ item.peran }}</span>
              </TableCell>
              <TableCell class="action-buttons">
                <Button variant="outline" size="sm" class="edit-buttons" :disabled="isSubmitting || isDeleting" @click="editData(item)"><Pencil class="button-icon" /></Button>
                <Button variant="outline" size="sm" class="delete-buttons" :disabled="isSubmitting || isDeleting" @click="bukaModalHapus(item)"><Trash2 class="button-icon-delete" /></Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div v-if="userStore.dataPengguna.length > 0" class="pagination-footer">
          <p class="pagination-info">
            Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPage, userStore.meta.total) }}
            dari {{ userStore.meta.total }} data
          </p>

          <Pagination
            v-model:page="currentPage"
            :items-per-page="itemsPerPage"
            :total="userStore.meta.total"
            :sibling-count="1"
            show-edges
          >
            <PaginationContent v-slot="{ items }">
              <PaginationPrevious />

              <template v-for="(item, idx) in items" :key="idx">
                <PaginationItem
                  v-if="item.type === 'page'"
                  :value="item.value"
                  :is-active="item.value === currentPage"
                >
                  {{ item.value }}
                </PaginationItem>
                <PaginationEllipsis v-else />
              </template>

              <PaginationNext />
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>

    <Dialog :open="isModalOpen" @update:open="isModalOpen = $event">
      <DialogContent :show-close-button="!isSubmitting">
        <DialogHeader>
          <DialogTitle>{{ idEdit !== null ? 'Edit Pengguna' : 'Tambah Pengguna Baru' }}</DialogTitle>
          <DialogDescription>{{ idEdit !== null ? 'Perbarui informasi pengguna.' : 'Isi data pengguna baru di bawah ini.' }}</DialogDescription>
        </DialogHeader>
        <form class="modal-form" @submit.prevent="simpanData">
          <div class="form-group"><label for="nama">Nama Lengkap</label><Input id="nama" v-model="namaInput" :disabled="isSubmitting" placeholder="Masukkan nama..." /></div>
          <div class="form-group"><label for="email">Email</label><Input id="email" v-model="emailInput" type="email" :disabled="isSubmitting" placeholder="Masukkan email..." /></div>
          <div class="form-group"><label for="peran">Jabatan</label><Combobox id="peran" v-model="peranInput" :options="daftarJabatanNama" placeholder="Pilih Jabatan..." :empty-text="jabatanStore.isLoading ? 'Memuat jabatan...' : 'Tidak ada hasil.'" :disabled="isSubmitting" @update:open="onJabatanOpenChange" /></div>
          <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
          <DialogFooter>
            <Button type="button" variant="outline" :disabled="isSubmitting" @click="tutupModalForm">Batal</Button>
            <Button type="submit" :disabled="isSubmitting"><Loader2 v-if="isSubmitting" class="button-icon spinner" />{{ isSubmitting ? (idEdit !== null ? 'Menyimpan perubahan...' : 'Menyimpan data...') : (idEdit !== null ? 'Update' : 'Simpan') }}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <Dialog :open="isDeleteModalOpen" @update:open="isDeleteModalOpen = $event">
      <DialogContent :show-close-button="!isDeleting">
        <DialogHeader>
          <DialogTitle>Hapus Pengguna?</DialogTitle>
          <DialogDescription>Data <strong>{{ penggunaYangDihapus?.nama }}</strong> akan dihapus secara permanen dan tidak dapat dikembalikan.</DialogDescription>
        </DialogHeader>
        <p v-if="deleteErrorMessage" class="form-error">{{ deleteErrorMessage }}</p>
        <DialogFooter>
          <Button variant="outline" :disabled="isDeleting" @click="tutupModalHapus">Batal</Button>
          <Button variant="destructive" :disabled="isDeleting" @click="konfirmasiHapus"><Loader2 v-if="isDeleting" class="button-icon spinner" />{{ isDeleting ? 'Menghapus...' : 'Ya, Hapus Data' }}</Button>
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

.stats-grid {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 40px;
  background-color: #fff;
  box-shadow: -3px 0 0 #1d00f6bc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px 30px 15px 15px;
}

.stat-card2{
  display: flex;
  align-items: center;
  gap: 40px;
  background-color: #fff;
  box-shadow: -3px 0 0 #037905b3;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px 30px 15px 15px;
}

.stat-card3 {
  display: flex;
  align-items: center;
  gap: 40px;
  background-color: #fff;
  box-shadow: -3px 0 0 #dada03;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px 30px 15px 15px;
}

.stat-card4 {
  display: flex;
  align-items: center;
  gap: 40px;
  background-color: #fff;
  box-shadow: -3px 0 0 #888698bc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px 30px 15px 15px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  padding: 11px;
  border-radius: 10px;
  background-color: #4438ca49;
  color: #4338ca;
}

.stat-admin {
  background-color: #7cd87965;
  color: #0e8b48;
}

.stat-manager {
  background-color: #fef3c7;
  color: #b45309;
}

.stat-staff {
  background-color: #f3f4f6;
  color: #4b5563;
}

.stat-value {
  font-size: 1.375rem;
  font-weight: 700;
  color: #111827;
  line-height: 2.1;
  margin-left: 8px;
}

.stat-label {
  font-size: 15px;
  font-weight: bold;
  color: rgb(128, 121, 121);
}

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
  z-index: 1;
}

.content-grid {
  display: flex;
  align-items: flex-start;
  gap: 24px;
}

.table-card {
  flex: 1;
  background-color: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
}

.table-header-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 50px;
}

.table-header-box h3 {
  font-size: 1rem;
  font-weight: 600;
}

.table-description {
  color: #6b7280;
  font-size: 0.8rem;
  margin-top: 3px;
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

.button-icon {
  width: 15px;
  height: 15px;
}

.button-icon-delete {
  width: 15px;
  height: 15px;
  color: #ff1414e4;
}


.loading-state {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  color: #6b7280;
  font-size: 0.875rem;
}

.loading-icon, 
.spinner {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 0;
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

.form-error {
  color: #ff1414;
  font-size: 0.875rem;
}

.peran-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 999px;
}

.peran-admin {
  font-size: 13px;
  color: #0e8b48;
}

.peran-manager {
  font-size: 13px;
  color: #c48509;
}

.peran-staff {
  font-size: 13px;
  color: #4b5563;
}

.edit-buttons:hover {
  background-color: rgba(153, 153, 147, 0.419);
}

.delete-buttons:hover {
  background-color: rgba(153, 153, 147, 0.419);
}

.pagination-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.pagination-info {
  color: #6b7280;
  font-size: 0.8rem;
}
</style>
