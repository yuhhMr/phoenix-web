<script setup lang="ts">
import { cn } from '@/utils/cn'

interface Props {
  for?: string
  class?: string
}

withDefaults(defineProps<Props>(), {
  for: undefined,
  class: '',
})
</script>

<template>
  <label
    :for="$props.for"
    :class="
      cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none text-foreground',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        $props.class,
      )
    "
  >
    <slot />
  </label>
</template>
