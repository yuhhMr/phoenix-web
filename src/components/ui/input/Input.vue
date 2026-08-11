<script setup lang="ts">
import { computed, ref } from 'vue'
import { cn } from '@/utils/cn'
import IconClose from '~icons/lucide/x'
import IconEye from '~icons/lucide/eye'
import IconEyeOff from '~icons/lucide/eye-off'

interface Props {
  modelValue?: string
  type?: 'text' | 'password'
  placeholder?: string
  maxlength?: number | string
  autocomplete?: string
  disabled?: boolean
  error?: boolean
  clearable?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: undefined,
  maxlength: undefined,
  autocomplete: undefined,
  disabled: false,
  error: false,
  clearable: true,
  class: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  enter: []
  clear: []
}>()

const slots = defineSlots<{
  prefix?: () => unknown
}>()

const passwordVisible = ref(false)

const isPassword = computed(() => props.type === 'password')
const actualType = computed(() => (isPassword.value && passwordVisible.value ? 'text' : props.type))
const hasValue = computed(() => props.modelValue.length > 0)
const showClear = computed(() => props.clearable && !props.disabled && hasValue.value)
const showPasswordToggle = computed(() => isPassword.value && !props.disabled && hasValue.value)
const hasPrefix = computed(() => !!slots.prefix)

const suffixCount = computed(() => {
  let count = 0
  if (showClear.value) count++
  if (showPasswordToggle.value) count++
  return count
})

const inputClass = computed(() =>
  cn(
    'flex h-9 w-full min-w-0 rounded-md border border-input bg-input-background px-3 py-1 text-sm text-foreground shadow-sm transition-[color,box-shadow] outline-none placeholder:text-muted-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50',
    props.error && 'border-destructive focus-visible:ring-destructive/30',
    hasPrefix.value && 'pl-9',
    suffixCount.value === 1 && 'pr-9',
    suffixCount.value >= 2 && 'pr-14',
    props.class,
  ),
)

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

function onClear() {
  emit('update:modelValue', '')
  emit('clear')
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
      :type="actualType"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :class="inputClass"
      @input="onInput"
      @keyup.enter="$emit('enter')"
    />

    <div class="absolute right-2 flex items-center gap-0.5">
      <button
        v-if="showClear"
        type="button"
        tabindex="-1"
        class="rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        title="清空"
        @click="onClear"
      >
        <IconClose class="size-3.5" />
      </button>
      <button
        v-if="showPasswordToggle"
        type="button"
        tabindex="-1"
        class="rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        :title="passwordVisible ? '隐藏密码' : '显示密码'"
        @click="passwordVisible = !passwordVisible"
      >
        <IconEyeOff v-if="passwordVisible" class="size-4" />
        <IconEye v-else class="size-4" />
      </button>
    </div>
  </div>
</template>
