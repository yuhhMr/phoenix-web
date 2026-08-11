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
  <div :class="cn('animate-pulse rounded-md bg-muted', $props.class)">
    <slot />
  </div>
</template>
