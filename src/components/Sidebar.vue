<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Folder, Settings, User } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const route = useRoute()

const menuUtama = [
  { nama: 'Dashboard', path: '/', icon: LayoutDashboard },
  { nama: 'Proyek', path: '/proyek', icon: Folder },
  { nama: 'Profil', path: '/profil', icon: User },
]

function isMenuAktif(path) {
  return route.path === path
}
</script>

<template>
  <aside class="sidebar-container">
    <div class="sidebar-title">
      <Avatar class="avatar-box">
        <AvatarImage src="https://github.com/evilrabbit.png" alt="Logo Avatar" />
          <AvatarFallback>ER</AvatarFallback>
      </Avatar>
      <div class="title">
        Perusahaan
        <p class="desc-title">Dashboard Admin</p>
      </div>   
    </div>

    <nav class="sidebar-nav">
      <Button
        v-for="menu in menuUtama"
        :key="menu.path"
        as-child
        variant="ghost"
        class="sidebar-btn"
        :class="{ 'sidebar-btn-active': isMenuAktif(menu.path) }"
      >
        <RouterLink :to="menu.path">
          <component :is="menu.icon" class="icon" />
          {{ menu.nama }}
        </RouterLink>
      </Button>
    </nav>

    <div class="sidebar-footer">
      <Button
        as-child
        class="sidebar-btn"
        :class="{ 'sidebar-btn-active': isMenuAktif('/pengaturan') }">
        <RouterLink to="/pengaturan">
            <Settings class="icon"/> Pengaturan
        </RouterLink>
      </Button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-container {
  width: 256px;
  height: 100vh;
  background-color: #ffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  padding: 36px;
  position: sticky;
  top: 0;
}

.avatar-box {
  border-radius: 10px;
  height: 45px;
  width: 45px;
}

.sidebar-title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 50px;
  padding: 0 8px;
  color: #111827;
  display: flex;
  gap: 20px;
}

.desc-title {
  font-size: 12px;
  font-weight: 450;
  color: #5c5959;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.sidebar-footer {
  border-top: 1px solid #000000;
  padding-top: 16px;
}

.sidebar-btn {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 25px;
}

.sidebar-btn-active {
  background-color: #eef2ff;
  color: #4338ca;
  font-weight: 600;
}

.icon {
  width: 16px;
  height: 16px;
}
</style>
