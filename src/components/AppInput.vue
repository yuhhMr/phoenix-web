<script setup lang="ts">
import { computed } from 'vue'
import { Input } from '@/components/ui/input'

interface Props {
  modelValue: string
  type?: 'text' | 'password'
  placeholder?: string
  maxlength?: number | string
  autocomplete?: string
  clearable?: boolean
  disabled?: boolean
  error?: boolean
  variant?: 'default' | 'glass'
  size?: 'md' | 'lg'
  clearTitle?: string
  showTitle?: string
  hideTitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: undefined,
  maxlength: undefined,
  autocomplete: undefined,
  clearable: true,
  disabled: false,
  error: false,
  variant: 'default',
  size: 'md',
  clearTitle: '清空',
  showTitle: '显示密码',
  hideTitle: '隐藏密码',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  enter: []
  clear: []
}>()

const inputClass = computed(() => {
  const classes: string[] = []
  if (props.size === 'md') {
    classes.push('h-10')
  } else if (props.size === 'lg') {
    classes.push('h-11', 'text-[15px]')
  }
  if (props.variant === 'glass') {
    classes.push(
      'bg-white/90',
      'text-slate-800',
      'placeholder:text-slate-400',
      'border-white/40',
      'focus:bg-white',
      'focus:border-primary',
    )
  }
  return classes.join(' ')
})
</script>

<template>
  <Input
    :model-value="modelValue"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    :error="error"
    :class="inputClass"
    @update:model-value="$emit('update:modelValue', $event)"
    @keyup.enter="$emit('enter')"
  >
    <template v-if="$slots.prefix" #prefix>
      <slot name="prefix" />
    </template>
    <template v-if="$slots.suffix" #suffix>
      <slot name="suffix" />
    </template>
  </Input>
</template>
