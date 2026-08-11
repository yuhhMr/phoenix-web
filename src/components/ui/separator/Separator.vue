<script setup lang="ts">
import { cn } from '@/utils/cn'

interface Props {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
  class?: string
}

withDefaults(defineProps<Props>(), {
  orientation: 'horizontal',
  decorative: true,
  class: '',
})
</script>

<template>
  <div
    role="separator"
    :aria-orientation="orientation"
    :aria-hidden="decorative"
    :class="
      cn(
        'shrink-0 bg-border',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        $props.class,
      )
    "
  />
</template>
