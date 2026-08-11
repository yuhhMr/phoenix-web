<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/utils/cn'

interface Props {
  modelValue?: string
  type?: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: undefined,
  disabled: false,
  error: false,
  class: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const hasPrefix = computed(() => !!slots.prefix)
const hasSuffix = computed(() => !!slots.suffix)
const slots = defineSlots<{
  prefix?: () => unknown
  suffix?: () => unknown
}>()

const inputClass = computed(() =>
  cn(
    'flex h-9 w-full min-w-0 rounded-md border border-input bg-input-background px-3 py-1 text-sm text-foreground shadow-sm transition-[color,box-shadow] outline-none placeholder:text-muted-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50',
    props.error && 'border-destructive focus-visible:ring-destructive/30',
    hasPrefix.value && 'pl-9',
    hasSuffix.value && 'pr-9',
    props.class,
  ),
)

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="relative flex items-center">
    <span
      v-if="hasPrefix"
      class="pointer-events-none absolute left-3 flex items-center text-muted-foreground"
    >
      <slot name="prefix" />
    </span>

    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClass"
      @input="onInput"
    />

    <span
      v-if="hasSuffix"
      class="pointer-events-none absolute right-3 flex items-center text-muted-foreground"
    >
      <slot name="suffix" />
    </span>
  </div>
</template>
