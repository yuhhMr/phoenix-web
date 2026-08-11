<script setup lang="ts">
import { computed } from 'vue'
import { Button, type ButtonVariants } from '@/components/ui/button'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  nativeType?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  nativeType: 'button',
})

const buttonVariant = computed<ButtonVariants['variant']>(() => {
  if (props.variant === 'primary') return 'default'
  return props.variant
})

const buttonSize = computed<ButtonVariants['size']>(() => {
  if (props.size === 'md') return 'default'
  return props.size
})
</script>

<template>
  <Button
    :variant="buttonVariant"
    :size="buttonSize"
    :loading="loading"
    :disabled="disabled"
    :type="nativeType"
  >
    <slot name="icon" />
    <slot />
  </Button>
</template>
