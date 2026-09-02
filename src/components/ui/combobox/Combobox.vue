<script setup>
import { CheckIcon, ChevronsUpDownIcon } from "@lucide/vue";
import { computed } from "vue";
import { ComboboxRoot } from "reka-ui";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ComboboxAnchor from "./ComboboxAnchor.vue";
import ComboboxEmpty from "./ComboboxEmpty.vue";
import ComboboxGroup from "./ComboboxGroup.vue";
import ComboboxInput from "./ComboboxInput.vue";
import ComboboxItem from "./ComboboxItem.vue";
import ComboboxItemIndicator from "./ComboboxItemIndicator.vue";
import ComboboxList from "./ComboboxList.vue";
import ComboboxTrigger from "./ComboboxTrigger.vue";
import ComboboxViewport from "./ComboboxViewport.vue";

// Self-contained, editable combobox: pass `options` (array of strings, or
// { label, value } objects) and use it with v-model just like a normal
// text field. Selecting a suggestion fills the field; you can still type
// a value that isn't in the list.
const props = defineProps({
  modelValue: { type: String, required: false, default: "" },
  options: { type: Array, required: false, default: () => [] },
  placeholder: { type: String, required: false, default: "Pilih opsi..." },
  emptyText: { type: String, required: false, default: "Tidak ada hasil." },
  disabled: { type: Boolean, required: false },
  class: {
    type: [Boolean, null, String, Object, Array],
    required: false,
    skipCheck: true,
  },
});

const emits = defineEmits(["update:modelValue", "update:open"]);

const normalizedOptions = computed(() =>
  props.options.map((option) =>
    typeof option === "string" ? { label: option, value: option } : option,
  ),
);

const internalValue = computed({
  get: () => props.modelValue || undefined,
  set: (value) => emits("update:modelValue", value ?? ""),
});
</script>

<template>
  <ComboboxRoot
    v-model="internalValue"
    :disabled="disabled"
    reset-search-term-on-blur
    class="w-full"
    @update:open="emits('update:open', $event)"
  >
    <ComboboxAnchor as-child class="w-full">
      <ComboboxTrigger as-child>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          :disabled="disabled"
          :class="
            cn(
              'w-full justify-between font-normal',
              !modelValue && 'text-muted-foreground',
              props.class,
            )
          "
        >
          <span class="truncate">{{ modelValue || placeholder }}</span>
          <ChevronsUpDownIcon class="opacity-50" />
        </Button>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxList class="w-full">
      <ComboboxInput :placeholder="placeholder" />
      <ComboboxEmpty>{{ emptyText }}</ComboboxEmpty>
      <ComboboxViewport>
        <ComboboxGroup>
          <ComboboxItem
            v-for="option in normalizedOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
            <ComboboxItemIndicator>
              <CheckIcon />
            </ComboboxItemIndicator>
          </ComboboxItem>
        </ComboboxGroup>
      </ComboboxViewport>
    </ComboboxList>
  </ComboboxRoot>
</template>
