<script setup>
import { ref } from 'vue'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { KeyRound, LogOut } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

const isPasswordModalOpen = ref(false)
const passwordLama = ref('')
const passwordBaru = ref('')
const konfirmasiPassword = ref('')

const isLogoutModalOpen = ref(false)

function bukaModalPassword() {
  passwordLama.value = ''
  passwordBaru.value = ''
  konfirmasiPassword.value = ''
  isPasswordModalOpen.value = true
}

function simpanPasswordBaru() {
  if (!passwordLama.value || !passwordBaru.value || !konfirmasiPassword.value) {
    alert('Semua kolom password wajib diisi!')
    return
  }

  if (passwordBaru.value !== konfirmasiPassword.value) {
    alert('Password baru dan konfirmasi password tidak cocok!')
    return
  }

  alert('Password berhasil diperbarui!')
  isPasswordModalOpen.value = false
}

function bukaModalLogout() {
  isLogoutModalOpen.value = true 
}

function eksekusiLogout() { 
  alert('Anda berhasil Logout!')
  isLogoutModalOpen.value = false
}
</script>

<template>
  <nav class="navbar-container">
    <div class="navbar-logo">
      Vue Shadcn
    </div>

    <!-- <div class="navbar-menu">
      <a href="#" class="menu-link">Beranda</a>
      <a href="#" class="menu-link">Fitur</a>
      <a href="#" class="menu-link">Portofolio</a>
      <a href="#" class="menu-link">Kontak</a>
    </div> -->

    <div class="navbar-actions">
      <DropdownMenu>
        <DropdownMenuTrigger class="avatar-trigger">
          <Avatar class="avatar-box">
            <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel class="user-info">
            <p class="user-name">Budi Santoso</p>
            <p class="user-email">budi@gmail.com</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem class="dropdown-item" @click="bukaModalPassword">
            <KeyRound class="menu-icon" />
            <span>Ganti Password</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem class="dropdown-item logout" @click="bukaModalLogout">
            <LogOut class="menu-icon" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <Dialog v-model:open="isLogoutModalOpen"> 
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Logout</DialogTitle>
        </DialogHeader>

        <p class="text-sm text-gray-500">
          Apakah Anda Yakin Ingin Keluar?
        </p>
        <DialogFooter>
          <Button variant="outline" @click="isLogoutModalOpen = false">Batal</Button>
          <Button variant="destructive" @click="eksekusiLogout">Ya, Logout</Button> 
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="isPasswordModalOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ganti Password</DialogTitle>
        </DialogHeader>

        <div class="modal-form">
          <div class="form-group">
            <label>Password Saat Ini</label>
            <input v-model="passwordLama" type="password" placeholder="Masukkan password lama..." class="input-field" />
          </div>

          <div class="form-group">
            <label>Password Baru</label>
            <input v-model="passwordBaru" type="password" placeholder="Masukkan password baru..." class="input-field" />
          </div>

          <div class="form-group">
            <label>Konfirmasi Password Baru</label>
            <input v-model="konfirmasiPassword" type="password" placeholder="Ulangi password baru..." class="input-field" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="isPasswordModalOpen = false">Batal</Button>
          <Button @click="simpanPasswordBaru">Simpan Password</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </nav>
</template>

<style scoped>
.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #ffffff;
  margin: 0px 0px 30px 0px;
}

.navbar-logo {
  font-weight: bold;
  font-size: 1.125rem;
  color: #111827;
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 24px;
}

.menu-link {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  text-decoration: none;
  padding: 6px 15px 6px 15px;
  border-radius: 8px;
}

.menu-link:hover {
  background-color: #c7c2c241;
}

.avatar-trigger {
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 50%;
  outline: none;
}

.avatar-box {
  width: 36px;
  height: 36px;
  border-radius: 30%;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  font-size: 0.875rem;
  color: #111827;
}

.user-email {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: normal;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  font-size: 0.875rem;
}

.dropdown-item.logout {
  color: #dc2626;
}

.menu-icon {
  width: 16px;
  height: 16px;
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