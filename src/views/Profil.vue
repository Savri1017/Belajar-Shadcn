<script setup>
import { computed, onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import {Avatar, AvatarFallback, AvatarImage,} from '@/components/ui/avatar'
import { Combobox } from '@/components/ui/combobox'
import { useJabatanStore } from '@/stores/jabatanStore'
import {useUserStore,ID_PENGGUNA_AKTIF,} from '@/stores/userStore'
import {uploadMedia,deleteMedia,} from '@/services/media.js'

const jabatanStore = useJabatanStore()
const userStore = useUserStore()

const me = computed(() => userStore.penggunaAktif ?? {})

const formProfil = ref({
  nama: '',
  email: '',
  peran: '',
})

const daftarJabatanNama = computed(() =>
  jabatanStore.daftarJabatan.map((j) => j.nama_jabatan)
)

const sedangEdit = ref(false)

const errors = ref({
  nama: '',
  email: '',
  peran: '',
  foto: '',
})

const selectedFile = ref(null)
const previewFoto = ref(null)
const sedangUpload = ref(false)

const fotoTampil = computed(() => previewFoto.value ?? userStore.avatarUrl ?? null)

const namaFallback = computed(() => {
  return (me.value.nama || 'CN')
    .slice(0, 2)
    .toUpperCase()
})

onMounted(async () => {
  await userStore.fetchPenggunaById(ID_PENGGUNA_AKTIF)
  await userStore.fetchAvatarAktif()
  syncForm()
})

function syncForm() {
  formProfil.value = {
    nama: me.value.nama || '',
    email: me.value.email || '',
    peran: me.value.peran || '',
  }
}

function onJabatanOpenChange(open) {
  if (open) {
    jabatanStore.fetchJabatan()
  }
}

function pilihFoto(event) {
  const file = event.target.files?.[0] ?? null
  if (!file) return

  errors.value.foto = ''

  if (!file.type.startsWith('image/')) {
    errors.value.foto = 'File yang dipilih harus berupa gambar.'
    selectedFile.value = null
    previewFoto.value = null
    return
  }

  if (file.size > 10 * 1024 * 1024) {
    errors.value.foto = 'Ukuran foto maksimal 10 MB.'
    selectedFile.value = null
    previewFoto.value = null
    return
  }

  selectedFile.value = file

  if (previewFoto.value) {
    URL.revokeObjectURL(previewFoto.value)
  }

  previewFoto.value = URL.createObjectURL(file)
}

async function simpanFoto() {
  if (!selectedFile.value) {
    errors.value.foto = 'Pilih foto terlebih dahulu.'
    return
  }

  sedangUpload.value = true
  errors.value.foto = ''

  try {
    const avatarLama = userStore.avatarAktif
    const response = await uploadMedia(
      'pengguna',
      ID_PENGGUNA_AKTIF,
      selectedFile.value,
      'avatar',
      'Foto profil'
    )

    userStore.avatarAktif = response.data

    if (avatarLama && avatarLama.id !== response.data.id) {
      try {
        await deleteMedia(avatarLama.id)
      } catch (deleteError) {
        console.error('Avatar lama gagal dihapus:', deleteError)
      }
    }

    if (previewFoto.value) {
      URL.revokeObjectURL(previewFoto.value)
    }

    previewFoto.value = null
    selectedFile.value = null
    await userStore.fetchAvatarAktif()
  } catch (error) {
    console.error('Upload foto gagal:', error)
    errors.value.foto =
      error.response?.data?.message ?? 'Foto gagal diupload.'
  } finally {
    sedangUpload.value = false
  }
}

function validasiForm() {
  errors.value = {
    nama: '',
    email: '',
    peran: '',
    foto: '',
  }

  let valid = true

  if (!formProfil.value.nama?.trim()) {
    errors.value.nama = 'Nama tidak boleh kosong.'
    valid = false
  }

  if (!formProfil.value.email?.trim()) {
    errors.value.email = 'Email tidak boleh kosong.'
    valid = false
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formProfil.value.email.trim())
  ) {
    errors.value.email = 'Format email tidak valid.'
    valid = false
  }

  if (!formProfil.value.peran?.trim()) {
    errors.value.peran = 'Jabatan tidak boleh kosong.'
    valid = false
  } else if (!daftarJabatanNama.value.includes(formProfil.value.peran.trim())) {
    errors.value.peran = 'Jabatan harus dipilih dari daftar yang tersedia.'
    valid = false
  }

  return valid
}

function mulaiEdit() {
  syncForm()
  errors.value = {
    nama: '',
    email: '',
    peran: '',
    foto: '',
  }
  sedangEdit.value = true
}

async function simpanProfil() {
  if (!validasiForm()) {
    return
  }
  sedangEdit.value = false
}
</script>

<template>
  <div class="profil-page">
    <h2>Profil</h2>

    <div class="profil-card">
      <div class="profil-header">
        <div class="foto-wrapper">
          <Avatar class="profil-avatar">
            <AvatarImage
              v-if="fotoTampil"
              :src="fotoTampil"
              alt="Foto profil"
            />
            <AvatarImage :src="userStore.avatarUrl ?? 'https://github.com/shadcn.png'" alt="User Avatar" />
            <AvatarFallback>
              {{ namaFallback }}
            </AvatarFallback>
          </Avatar>

          <label for="foto-profil" class="ubah-foto-button">
            Ubah Foto
          </label>

          <input
            id="foto-profil"
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            class="hidden-input"
            :disabled="sedangUpload"
            @change="pilihFoto"
          />
        </div>

        <div>
          <p class="profil-nama">
            {{ me.nama || 'Memuat...' }}
          </p>
          <p class="profil-peran">
            {{ me.peran }}
          </p>
        </div>
      </div>

      <div
        v-if="selectedFile"
        class="upload-preview"
      >
        <div>
          <p class="preview-title">Foto baru</p>
          <p class="preview-name">{{ selectedFile.name }}</p>
        </div>

        <Button
          :disabled="sedangUpload"
          @click="simpanFoto"
        >
          {{ sedangUpload ? 'Mengupload...' : 'Simpan Foto' }}
        </Button>
      </div>

      <p
        v-if="errors.foto"
        class="field-error"
      >
        {{ errors.foto }}
      </p>

      <div class="profil-info">
        <div class="info-row">
          <span class="info-label">Nama Lengkap</span>
          <input
            v-model="formProfil.nama"
            :readonly="!sedangEdit"
            class="info-value"
            :class="{ 'info-value-error': errors.nama }"
            @input="errors.nama = ''"
          />
          <p
            v-if="errors.nama"
            class="field-error"
          >
            {{ errors.nama }}
          </p>
        </div>

        <div class="info-row">
          <span class="info-label">Email</span>
          <input
            v-model="formProfil.email"
            :readonly="!sedangEdit"
            class="info-value"
            :class="{ 'info-value-error': errors.email }"
            @input="errors.email = ''"
          />
          <p
            v-if="errors.email"
            class="field-error"
          >
            {{ errors.email }}
          </p>
        </div>

        <div class="info-row">
          <span class="info-label">Jabatan</span>

          <input
            v-if="!sedangEdit"
            :value="formProfil.peran"
            readonly
            class="info-value"
          />

          <Combobox
            v-else
            v-model="formProfil.peran"
            :options="daftarJabatanNama"
            placeholder="Pilih Jabatan..."
            :empty-text="
              jabatanStore.isLoading
                ? 'Memuat jabatan...'
                : 'Tidak ada hasil.'
            "
            :class="{ 'info-value-error': errors.peran }"
            @update:open="onJabatanOpenChange"
            @update:model-value="errors.peran = ''"
          />

          <p
            v-if="errors.peran"
            class="field-error"
          >
            {{ errors.peran }}
          </p>
        </div>
      </div>

      <div class="profil-actions">
        <Button
          v-if="!sedangEdit"
          variant="outline"
          @click="mulaiEdit"
        >
          Edit Profil
        </Button>

        <Button
          v-else
          @click="simpanProfil"
        >
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
  max-width: 520px;
}

.profil-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;
}

.foto-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.profil-avatar {
  width: 72px;
  height: 72px;
}

.ubah-foto-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 15px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  background-color: #ffffff;
  color: #374151;
  margin-top: 4px;
}

.ubah-foto-button:hover {
  background-color: #d9dadae4;
}

.hidden-input {
  display: none;
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

.upload-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #f9fafb;
}

.preview-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #111827;
}

.preview-name {
  margin-top: 2px;
  font-size: 0.75rem;
  color: #6b7280;
  word-break: break-all;
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