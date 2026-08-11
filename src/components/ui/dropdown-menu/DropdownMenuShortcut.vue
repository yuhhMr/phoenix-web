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
  <span :class="cn('ml-auto text-xs tracking-widest text-muted-foreground', $props.class)">
    <slot />
  </span>
</template>
