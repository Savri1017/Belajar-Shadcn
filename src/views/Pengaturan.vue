<script setup>
import { ref } from 'vue'
import { Button } from '@/components/ui/button'

const notifikasiEmail = ref(true)
const notifikasiPush = ref(false)
const modeGelap = ref(false)
</script>

<template>
  <div class="pengaturan-page">
    <h2>Pengaturan</h2>
    <div class="pengaturan-card">
      <h3>Preferensi</h3>
      <div class="setting-row">
        <div>
          <p class="setting-title">Notifikasi Email</p>
          <p class="setting-desc">Terima ringkasan aktivitas lewat email</p>
        </div>
        <input type="checkbox" v-model="notifikasiEmail" class="setting-toggle" />
      </div>

      <div class="setting-row">
        <div>
          <p class="setting-title">Notifikasi Push</p>
          <p class="setting-desc">Terima notifikasi langsung di perangkat</p>
        </div>
        <input type="checkbox" v-model="notifikasiPush" class="setting-toggle" />
      </div>
      
      <div class="setting-row">
        <div>
          <p class="setting-title">Mode Gelap</p>
          <p class="setting-desc">Ganti tampilan aplikasi ke tema gelap</p>
        </div>
        <input type="checkbox" v-model="modeGelap" class="setting-toggle" />
      </div>

      <div class="pengaturan-actions">
        <Button>Simpan Pengaturan</Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pengaturan-page h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.pengaturan-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  max-width: 480px;
}

.pengaturan-card h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid #f3f4f6;
}

.setting-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.setting-desc {
  font-size: 0.75rem;
  color: #6b7280;
}

.setting-toggle {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.pengaturan-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
