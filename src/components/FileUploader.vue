<script setup>
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { uploadMedia } from '@/services/media.js'

const props = defineProps({
  modelType: { type: String, required: true },
  modelId: { type: [Number, String], required: true },
  collection: { type: String, default: 'default' },
  accept: { type: String, default: 'image/*,.pdf,.doc,.docx,.xls,.xlsx' },
})

const emit = defineEmits(['uploaded'])
const selectedFile = ref(null)
const uploading = ref(false)
const error = ref('')

const chooseFile = (event) => {
  selectedFile.value = event.target.files?.[0] ?? null
  error.value = ''
}

const upload = async () => {
  if (!selectedFile.value) {
    error.value = 'Pilih file terlebih dahulu.'
    return
  }

  uploading.value = true
  error.value = ''

  try {
    const response = await uploadMedia(
      props.modelType,
      props.modelId,
      selectedFile.value,
      props.collection,
    )
    emit('uploaded', response.data)
    selectedFile.value = null
  } catch (err) {
    error.value = err.response?.data?.message || 'Upload file gagal.'
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div class="space-y-3">
    <input
      type="file"
      :accept="accept"
      :disabled="uploading"
      @change="chooseFile"
      class="block w-full text-sm"
    />

    <div class="flex items-center gap-3">
      <Button :disabled="!selectedFile || uploading" @click="upload">
        {{ uploading ? 'Mengupload...' : 'Upload File' }}
      </Button>
      <span v-if="selectedFile" class="text-sm text-muted-foreground">
        {{ selectedFile.name }}
      </span>
    </div>

    <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
  </div>
</template>
