<script setup>
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Folder, Settings, User } from 'lucide-vue-next'

const menuAktif = ref('Dashboard')

function klikMenu(menu) {
  menuAktif.value = menu
}
</script>

<template>
  <aside class="sidebar-container">
    <div class="sidebar-title">
      Menu Utama
    </div>

    <nav class="sidebar-nav">
      <Button variant="ghost" class="sidebar-btn" @click="klikMenu('Dashboard')">
        <LayoutD ashboard class="icon" />
        Dashboard
      </Button>

      <Button variant="ghost" class="sidebar-btn" @click="klikMenu('Proyek')">
        <Folder class="icon" />
        Proyek
      </Button>

      <Button variant="ghost" class="sidebar-btn" @click="klikMenu('Profil')">
        <User class="icon" />
        Profil
      </Button>
    </nav>

    <div class="sidebar-footer">
      <Button class="sidebar-btn" @click="klikMenu('Pengaturan')">
        <Settings class="icon" />
        Pengaturan
      </Button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-container {
  width: 256px;
  height: 100vh;
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  padding: 36px;  
}

.sidebar-title {
  font-weight: bold;
  font-size: 1.25rem;
  margin-bottom: 32px;
  padding: 0 8px;
  color: #111827;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-footer {
  border-top: 1px solid #e5e7eb;
  padding-top: 16px;
}

.sidebar-btn {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
}

.icon {
  width: 16px;
  height: 16px;
}
</style>