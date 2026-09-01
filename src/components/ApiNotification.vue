<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const notifications = ref([])
let nextId = 1

function addNotification(event) {
  const detail = event.detail || {}
  const id = nextId++

  notifications.value.push({
    id,
    type: detail.type || 'success',
    title: detail.title || 'Informasi',
    message: detail.message || '',
  })

  setTimeout(() => removeNotification(id), 3500)
}

function removeNotification(id) {
  notifications.value = notifications.value.filter((item) => item.id !== id)
}

onMounted(() => {
  window.addEventListener('api-notification', addNotification)
})

onBeforeUnmount(() => {
  window.removeEventListener('api-notification', addNotification)
})
</script>

<template>
  <div class="notification-container" aria-live="polite">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
        :class="`notification-${notification.type}`"
      >
        <div class="notification-icon">
          {{ notification.type === 'success' ? '✓' : '!' }}
        </div>

        <div class="notification-content">
          <strong>{{ notification.title }}</strong>
          <p>{{ notification.message }}</p>
        </div>

        <button
          type="button"
          class="notification-close"
          aria-label="Tutup notifikasi"
          @click="removeNotification(notification.id)"
        >
          ×
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  width: min(380px, calc(100vw - 40px));
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.notification {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  pointer-events: auto;
}

.notification-success {
  border-left: 4px solid #16a34a;
}

.notification-error {
  border-left: 4px solid #dc2626;
}

.notification-icon {
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: #ffffff;
  background: #16a34a;
  font-weight: 700;
}

.notification-error .notification-icon {
  background: #dc2626;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-content strong {
  display: block;
  font-size: 14px;
  margin-bottom: 3px;
}

.notification-content p {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.4;
  word-break: break-word;
}

.notification-close {
  border: 0;
  background: transparent;
  color: #9ca3af;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  padding: 0 2px;
}

.notification-close:hover {
  color: #111827;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.25s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
