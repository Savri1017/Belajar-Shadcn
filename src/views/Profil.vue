<script setup>
import { computed, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Combobox } from '@/components/ui/combobox'
import { useJabatanStore } from '@/stores/jabatanStore'

const jabatanStore = useJabatanStore()
const daftarJabatanNama = computed(() => jabatanStore.daftarJabatan.map((j) => j.nama_jabatan))

const profil = ref({
  nama: 'Budi Santoso',
  email: 'budi@gmail.com',
  peran: 'Admin',
})

const sedangEdit = ref(false)

// Setiap field punya slot error sendiri, jadi peringatan bisa muncul
// tepat di bawah kolom yang bermasalah, bukan jadi satu pesan gabungan.
const errors = ref({ nama: '', email: '', peran: '' })

function onJabatanOpenChange(open) {
  if (open) jabatanStore.fetchJabatan()
}

function validasiForm() {
  errors.value = { nama: '', email: '', peran: '' }
  let valid = true

  if (!profil.value.nama.trim()) {
    errors.value.nama = 'Nama tidak boleh kosong.'
    valid = false
  }

  if (!profil.value.email.trim()) {
    errors.value.email = 'Email tidak boleh kosong.'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profil.value.email.trim())) {
    errors.value.email = 'Format email tidak valid.'
    valid = false
  }

  if (!profil.value.peran.trim()) {
    errors.value.peran = 'Jabatan tidak boleh kosong.'
    valid = false
  } else if (!daftarJabatanNama.value.includes(profil.value.peran.trim())) {
    errors.value.peran = 'Jabatan harus dipilih dari daftar yang tersedia.'
    valid = false
  }

  return valid
}

function mulaiEdit() {
  errors.value = { nama: '', email: '', peran: '' }
  sedangEdit.value = true
}

function simpanProfil() {
  if (!validasiForm()) return
  sedangEdit.value = false
}
</script>

<template>
  <div class="profil-page">
    <h2>Profil</h2>

    <div class="profil-card">
      <div class="profil-header">
        <Avatar class="profil-avatar">
          <AvatarImage src="https://github.com/shadcn.png" alt="Foto profil" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <p class="profil-nama">{{ profil.nama }}</p>
          <p class="profil-peran">{{ profil.peran }}</p>
        </div>
      </div>

      <div class="profil-info">
        <div class="info-row">
          <span class="info-label">Nama Lengkap</span>
          <input
            v-model="profil.nama"
            :readonly="!sedangEdit"
            class="info-value"
            :class="{ 'info-value-error': errors.nama }"
            @input="errors.nama = ''"
          />
          <p v-if="errors.nama" class="field-error">{{ errors.nama }}</p>
        </div>
        <div class="info-row">
          <span class="info-label">Email</span>
          <input
            v-model="profil.email"
            :readonly="!sedangEdit"
            class="info-value"
            :class="{ 'info-value-error': errors.email }"
            @input="errors.email = ''"
          />
          <p v-if="errors.email" class="field-error">{{ errors.email }}</p>
        </div>
        <div class="info-row">
          <span class="info-label">Jabatan</span>
          <input v-if="!sedangEdit" :value="profil.peran" readonly class="info-value" />
          <Combobox
            v-else
            v-model="profil.peran"
            :options="daftarJabatanNama"
            placeholder="Pilih Jabatan..."
            :empty-text="jabatanStore.isLoading ? 'Memuat jabatan...' : 'Tidak ada hasil.'"
            :class="{ 'info-value-error': errors.peran }"
            @update:open="onJabatanOpenChange"
            @update:model-value="errors.peran = ''"
          />
          <p v-if="errors.peran" class="field-error">{{ errors.peran }}</p>
        </div>
      </div>

      <div class="profil-actions">
        <Button v-if="!sedangEdit" variant="outline" @click="mulaiEdit">
          Edit Profil
        </Button>
        <Button v-else @click="simpanProfil">
          Simpan Perubahan
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profil-page h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.profil-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  max-width: 480px;
}

.profil-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.profil-avatar {
  width: 56px;
  height: 56px;
}

.profil-nama {
  font-weight: 600;
  font-size: 1rem;
  color: #111827;
}

.profil-peran {
  font-size: 0.8rem;
  color: #6b7280;
}

.profil-info {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #374151;
}

.info-value {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.875rem;
  outline: none;
  color: #111827;
  background-color: #f9fafb;
}

.info-value:read-only {
  background-color: #f9fafb;
  color: #4b5563;
}

.info-value:not(:read-only) {
  background-color: #ffffff;
  border-color: #2563eb;
}

.info-value-error,
:deep(.info-value-error) {
  border-color: #dc2626 !important;
}

.field-error {
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 2px;
}

.profil-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
