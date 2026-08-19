<script setup>
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const profil = ref({
  nama: 'Budi Santoso',
  email: 'budi@gmail.com',
  peran: 'Admin',
})

const sedangEdit = ref(false)
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
          <input v-model="profil.nama" :readonly="!sedangEdit" class="info-value" />
        </div>
        <div class="info-row">
          <span class="info-label">Email</span>
          <input v-model="profil.email" :readonly="!sedangEdit" class="info-value" />
        </div>
        <div class="info-row">
          <span class="info-label">Peran</span>
          <input v-model="profil.peran" :readonly="!sedangEdit" class="info-value" />
        </div>
      </div>

      <div class="profil-actions">
        <Button v-if="!sedangEdit" variant="outline" @click="sedangEdit = true">
          Edit Profil
        </Button>
        <Button v-else @click="sedangEdit = false">
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

.profil-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
