<script setup lang="ts">
import { cn } from '@/utils/cn'

interface Props {
  class?: string
}

withDefaults(defineProps<Props>(), {
  class: '',
})
</script>

<template>
  <div
    :class="
      cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-border shadow-sm',
        $props.class,
      )
    "
  >
    <slot />
  </div>
</template>
