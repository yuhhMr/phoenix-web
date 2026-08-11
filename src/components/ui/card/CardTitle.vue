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
  <h3 :class="cn('text-lg leading-none font-semibold tracking-tight', $props.class)">
    <slot />
  </h3>
</template>
