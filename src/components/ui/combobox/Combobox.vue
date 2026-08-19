<script setup>
import { computed, ref, watch } from 'vue'
import { Check, ChevronDown, Search } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Pilih atau ketik...',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const searchValue = ref('')

const filteredOptions = computed(() => {
  const keyword = searchValue.value.trim().toLowerCase()
  if (!keyword) return props.options
  return props.options.filter((option) => option.toLowerCase().includes(keyword))
})

watch(() => props.modelValue, (value) => {
  if (!isOpen.value) searchValue.value = value || ''
}, { immediate: true })

function toggleOpen() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  searchValue.value = props.modelValue || ''
}

function pilihOption(option) {
  emit('update:modelValue', option)
  searchValue.value = option
  isOpen.value = false
}

function updateSearch(value) {
  searchValue.value = value
  if (!isOpen.value) isOpen.value = true
  emit('update:modelValue', value)
}

function handleBlur() {
  window.setTimeout(() => {
    isOpen.value = false
    searchValue.value = props.modelValue || ''
  }, 150)
}
</script>

<template>
  <div class="relative w-full">
    <div class="relative">
      <Input
        :model-value="searchValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="pr-10"
        @update:model-value="updateSearch"
        @focus="isOpen = true"
        @blur="handleBlur"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        :disabled="disabled"
        class="absolute right-1 top-1 h-8 w-8 p-0"
        @mousedown.prevent
        @click="toggleOpen"
      >
        <ChevronDown class="h-4 w-4" />
      </Button>
    </div>

    <div
      v-if="isOpen && !disabled"
      class="absolute z-50 mt-1 w-full rounded-md border bg-white p-1 shadow-md"
    >
      <div class="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-500">
        <Search class="h-3.5 w-3.5" />
        <span>Pilih atau ketik peran</span>
      </div>

      <div v-if="filteredOptions.length === 0" class="px-2 py-2 text-sm text-gray-500">
        Peran tidak ditemukan.
      </div>

      <button
        v-for="option in filteredOptions"
        :key="option"
        type="button"
        class="flex w-full items-center justify-between rounded-sm px-2 py-2 text-left text-sm hover:bg-gray-100"
        @mousedown.prevent
        @click="pilihOption(option)"
      >
        <span>{{ option }}</span>
        <Check v-if="modelValue === option" class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>
