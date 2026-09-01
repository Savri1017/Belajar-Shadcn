<script setup>
import { computed, onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, FileText, Trash2, Camera } from 'lucide-vue-next'
import { useUserStore, ID_PENGGUNA_AKTIF } from '@/stores/userStore'
import { getMedia, uploadMedia, deleteMedia } from '@/services/media.js'
import FileUploader from '@/components/FileUploader.vue'

const STORAGE_URL = 'http://localhost:8000/storage'

const userStore = useUserStore()

const sedangEdit = ref(false)
const isSaving = ref(false)
const namaInput = ref('')
const emailInput = ref('')
const peranInput = ref('')
const errorSimpan = ref('')

// --- Avatar (collection: 'avatar') ---
// Data avatar diambil dari userStore (bukan state lokal) supaya
// Navbar.vue bisa ikut nampilin avatar yang sama & auto-update.
const isUploadingAvatar = ref(false)
const errorAvatar = ref('')
const inputFileAvatar = ref(null)

const avatarUrl = computed(() => userStore.avatarUrl ?? 'https://github.com/shadcn.png')

// --- Dokumen pendukung (collection: 'dokumen') ---
// Beda "label" doang dari avatar, tapi baris-barisnya kesimpan
// di tabel `media` yang SAMA PERSIS lewat relasi morphMany yang sama.
const daftarDokumen = ref([])
const isLoadingDokumen = ref(false)
const errorDokumen = ref('')

async function muatProfil() {
  const berhasil = await userStore.fetchPenggunaById(ID_PENGGUNA_AKTIF)
  if (berhasil && userStore.penggunaAktif) {
    namaInput.value = userStore.penggunaAktif.nama
    emailInput.value = userStore.penggunaAktif.email
    peranInput.value = userStore.penggunaAktif.peran
  }
}

async function muatDokumen() {
  isLoadingDokumen.value = true
  try {
    const response = await getMedia('pengguna', ID_PENGGUNA_AKTIF, 'dokumen')
    daftarDokumen.value = response.data
  } catch (error) {
    console.error('Gagal ambil dokumen:', error)
  } finally {
    isLoadingDokumen.value = false
  }
}

onMounted(async () => {
  await muatProfil()
  await userStore.fetchAvatarAktif()
  await muatDokumen()
})

async function simpanProfil() {
  if (isSaving.value) return
  errorSimpan.value = ''
  if (!namaInput.value.trim() || !emailInput.value.trim() || !peranInput.value.trim()) {
    errorSimpan.value = 'Nama, Email, dan Peran wajib diisi.'
    return
  }
  isSaving.value = true
  try {
    const berhasil = await userStore.updatePengguna(ID_PENGGUNA_AKTIF, {
      nama: namaInput.value.trim(),
      email: emailInput.value.trim(),
      peran: peranInput.value.trim(),
    })
    if (!berhasil) {
      errorSimpan.value = 'Gagal menyimpan perubahan. Coba lagi.'
      return
    }
    sedangEdit.value = false
  } finally {
    isSaving.value = false
  }
}

function bukaPilihAvatar() {
  inputFileAvatar.value?.click()
}

async function gantiAvatar(event) {
  const file = event.target.files?.[0]
  event.target.value = '' // biar bisa pilih file yang sama lagi kalau perlu
  if (!file) return

  errorAvatar.value = ''
  isUploadingAvatar.value = true
  try {
    // Hapus avatar lama dulu (kalau ada) supaya 1 pengguna cuma
    // punya 1 baris 'avatar' yang aktif di tabel media, bukan menumpuk.
    if (userStore.avatarAktif) {
      await deleteMedia(userStore.avatarAktif.id)
    }
    await uploadMedia('pengguna', ID_PENGGUNA_AKTIF, file, 'avatar')
    // Refresh lewat store (bukan state lokal) -> Navbar.vue yang juga
    // baca userStore.avatarUrl otomatis ikut ke-update saat ini selesai.
    await userStore.fetchAvatarAktif()
  } catch (err) {
    errorAvatar.value = err.response?.data?.message || 'Upload foto profil gagal.'
  } finally {
    isUploadingAvatar.value = false
  }
}

async function hapusDokumen(media) {
  errorDokumen.value = ''
  try {
    await deleteMedia(media.id)
    await muatDokumen()
  } catch (err) {
    errorDokumen.value = err.response?.data?.message || 'Gagal menghapus dokumen.'
  }
}

function formatUkuran(bytes) {
  if (!bytes) return '-'
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(0)} KB`
  return `${(kb / 1024).toFixed(1)} MB`
}
</script>

<template>
  <div class="profil-page">
    <h2>Profil</h2>

    <div class="profil-card">
      <div v-if="userStore.isLoadingProfil" class="loading-state">
        <Loader2 class="loading-icon" /><span>Memuat data profil...</span>
      </div>

      <template v-else>
        <div class="profil-header">
          <div class="avatar-wrapper">
            <Avatar class="profil-avatar">
              <AvatarImage :src="avatarUrl" alt="Foto profil" />
              <AvatarFallback>{{ namaInput.slice(0, 2).toUpperCase() }}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              class="avatar-edit-btn"
              :disabled="isUploadingAvatar"
              title="Ganti foto profil"
              @click="bukaPilihAvatar"
            >
              <Loader2 v-if="isUploadingAvatar" class="button-icon spinner" />
              <Camera v-else class="button-icon" />
            </button>
            <input
              ref="inputFileAvatar"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              class="hidden-input"
              @change="gantiAvatar"
            />
          </div>
          <div>
            <p class="profil-nama">{{ namaInput || '-' }}</p>
            <p class="profil-peran">{{ peranInput || '-' }}</p>
          </div>
        </div>
        <p v-if="errorAvatar" class="form-error">{{ errorAvatar }}</p>

        <div class="profil-info">
          <div class="info-row">
            <span class="info-label">Nama Lengkap</span>
            <input v-model="namaInput" :readonly="!sedangEdit" class="info-value" />
          </div>
          <div class="info-row">
            <span class="info-label">Email</span>
            <input v-model="emailInput" :readonly="!sedangEdit" class="info-value" />
          </div>
          <div class="info-row">
            <span class="info-label">Peran</span>
            <input v-model="peranInput" :readonly="!sedangEdit" class="info-value" />
          </div>
        </div>

        <p v-if="errorSimpan" class="form-error">{{ errorSimpan }}</p>

        <div class="profil-actions">
          <Button v-if="!sedangEdit" variant="outline" @click="sedangEdit = true">
            Edit Profil
          </Button>
          <Button v-else :disabled="isSaving" @click="simpanProfil">
            <Loader2 v-if="isSaving" class="button-icon spinner" />
            {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </Button>
        </div>
      </template>
    </div>

    <!-- Section baru: upload file SELAIN avatar, tetap ke tabel `media` yang sama,
         cuma beda nilai collection ('dokumen' vs 'avatar') -->
    <div class="profil-card dokumen-card">
      <h3 class="dokumen-title">Dokumen Pendukung</h3>
      <p class="dokumen-desc">
        Upload berkas lain seperti KTP, CV, atau sertifikat. Disimpan di tabel yang
        sama dengan foto profil, cuma ditandai dengan label <code>collection: dokumen</code>.
      </p>

      <FileUploader
        model-type="pengguna"
        :model-id="ID_PENGGUNA_AKTIF"
        collection="dokumen"
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
        @uploaded="muatDokumen"
      />

      <p v-if="errorDokumen" class="form-error">{{ errorDokumen }}</p>

      <div v-if="isLoadingDokumen" class="loading-state">
        <Loader2 class="loading-icon" /><span>Memuat dokumen...</span>
      </div>
      <p v-else-if="daftarDokumen.length === 0" class="dokumen-empty">
        Belum ada dokumen yang diupload.
      </p>
      <ul v-else class="dokumen-list">
        <li v-for="item in daftarDokumen" :key="item.id" class="dokumen-item">
          <FileText class="dokumen-icon" />
          <a :href="`${STORAGE_URL}/${item.path}`" target="_blank" class="dokumen-nama">
            {{ item.file_name }}
          </a>
          <span class="dokumen-ukuran">{{ formatUkuran(item.size) }}</span>
          <button type="button" class="dokumen-hapus" title="Hapus dokumen" @click="hapusDokumen(item)">
            <Trash2 class="button-icon" />
          </button>
        </li>
      </ul>
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
  margin-bottom: 8px;
}

.avatar-wrapper {
  position: relative;
}

.profil-avatar {
  width: 56px;
  height: 56px;
}

.avatar-edit-btn {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background-color: #2563eb;
  color: #fff;
  border: 2px solid #fff;
  cursor: pointer;
}

.avatar-edit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.profil-info {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 20px 0;
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

.profil-actions {
  display: flex;
  justify-content: flex-end;
}

.button-icon {
  width: 14px;
  height: 14px;
}

.spinner {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.form-error {
  color: #ff1414;
  font-size: 0.8rem;
  margin: 4px 0 0;
}

.dokumen-card {
  margin-top: 20px;
}

.dokumen-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.dokumen-desc {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 16px;
}

.dokumen-desc code {
  background-color: #f3f4f6;
  padding: 1px 5px;
  border-radius: 4px;
}

.dokumen-empty {
  font-size: 0.8rem;
  color: #9ca3af;
  margin-top: 12px;
}

.dokumen-list {
  list-style: none;
  padding: 0;
  margin: 14px 0 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dokumen-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.85rem;
}

.dokumen-icon {
  width: 16px;
  height: 16px;
  color: #6b7280;
  flex-shrink: 0;
}

.dokumen-nama {
  flex: 1;
  color: #2563eb;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dokumen-nama:hover {
  text-decoration: underline;
}

.dokumen-ukuran {
  font-size: 0.75rem;
  color: #9ca3af;
}

.dokumen-hapus {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #dc2626;
  cursor: pointer;
  border: none;
  background: none;
  padding: 4px;
}
</style>
