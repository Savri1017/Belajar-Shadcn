<script setup>
import { ref } from 'vue'
import { uploadMedia } from '@/services/media.js'
import { Button } from '@/components/ui/button'

const props = defineProps({
  modelType: { type: String, required: true },
  modelId: { type: [Number, String], required: true },
  collection: { type: String, default: 'default' },
  accept: { type: String, default: 'image/*,.pdf,.doc,.docx,.xls,.xlsx' },
  replace: { type: Boolean, default: false },
})

const emit = defineEmits(['uploaded', 'error'])
const input = ref(null)
const file = ref(null)
const uploading = ref(false)
const errorMessage = ref('')

function pilihFile(event) {
  file.value = event.target.files?.[0] || null
  errorMessage.value = ''
}

async function upload() {
  if (!file.value || uploading.value) return

  uploading.value = true
  errorMessage.value = ''

  try {
    const media = await uploadMedia(props.modelType, props.modelId, file.value, {
      collection: props.collection,
      replace: props.replace,
    })

    emit('uploaded', media)
    file.value = null
    if (input.value) input.value.value = ''
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'File gagal diupload.'
    emit('error', error)
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div class="space-y-3">
    <input
      ref="input"
      type="file"
      :accept="accept"
      class="block w-full text-sm"
      @change="pilihFile"
    />

    <div class="flex items-center gap-3">
      <span v-if="file" class="text-sm text-muted-foreground truncate">
        {{ file.name }}
      </span>x  
      <Button type="button" :disabled="!file || uploading" @click="upload">
        {{ uploading ? 'Mengupload...' : 'Upload File' }}
      </Button>
    </div>

    <p v-if="errorMessage" class="text-sm text-red-600">
      {{ errorMessage }}
    </p>
  </div>
</template>
