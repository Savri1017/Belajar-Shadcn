import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css' // Sesuaikan dengan file CSS Anda

// 1. Buat instance aplikasi Vue dulu
const app = createApp(App)

// 2. Pasang Pinia ke aplikasi
app.use(createPinia())

// 3. Mount aplikasi ke HTML
app.mount('#app')