<script setup lang="ts">
import { cn } from '@/utils/cn'

interface Props {
  class?: string
  for?: string
  error?: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <label
    data-slot="form-label"
    :for="props.for"
    :class="cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', props.error && 'text-destructive', props.class)"
  >
    <slot />
  </label>
</template>
