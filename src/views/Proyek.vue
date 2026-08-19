<script setup>
import { ref } from 'vue'
import { Folder, MoreVertical } from 'lucide-vue-next'

const daftarProyek = ref([
  { id: 1, nama: 'Website Company Profile', status: 'Berjalan', anggota: 4 },
  { id: 2, nama: 'Aplikasi Inventaris', status: 'Selesai', anggota: 3 },
  { id: 3, nama: 'Redesign Dashboard Admin', status: 'Perencanaan', anggota: 2 },
])
</script>

<template>
  <div class="proyek-page">
    <h2>Proyek</h2>

    <div class="proyek-grid">
      <div v-for="p in daftarProyek" :key="p.id" class="proyek-card">
        <div class="proyek-card-header">
          <Folder class="proyek-icon" />
          <MoreVertical class="more-icon" />
        </div>
        <h3>{{ p.nama }}</h3>
        <span class="status-badge" :class="'status-' + p.status.toLowerCase().replace(' ', '-')">
          {{ p.status }}
        </span>
        <p class="proyek-anggota">{{ p.anggota }} anggota</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.proyek-page h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.proyek-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.proyek-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
}

.proyek-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.proyek-icon {
  width: 20px;
  height: 20px;
  color: #4338ca;
}

.more-icon {
  width: 16px;
  height: 16px;
  color: #9ca3af;
}

.proyek-card h3 {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #111827;
}

.status-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 2px 10px;
  border-radius: 999px;
  margin-bottom: 10px;
}

.status-berjalan {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.status-selesai {
  background-color: #dcfce7;
  color: #15803d;
}

.status-perencanaan {
  background-color: #fef9c3;
  color: #a16207;
}

.proyek-anggota {
  font-size: 0.8rem;
  color: #6b7280;
}
</style>
