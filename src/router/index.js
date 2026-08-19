import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Proyek from '@/views/Proyek.vue'
import Profil from '@/views/Profil.vue'
import Pengaturan from '@/views/Pengaturan.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta: { title: 'Dashboard' },
  },
  {
    path: '/proyek',
    name: 'proyek',
    component: Proyek,
    meta: { title: 'Proyek' },
  },
  {
    path: '/profil',
    name: 'profil',
    component: Profil,
    meta: { title: 'Profil' },
  },
  {
    path: '/pengaturan',
    name: 'pengaturan',
    component: Pengaturan,
    meta: { title: 'Pengaturan' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach((to) => {
  document.title = to.meta?.title ? `${to.meta.title} · Belajar Shadcn` : 'Belajar Shadcn'
})

export default router
