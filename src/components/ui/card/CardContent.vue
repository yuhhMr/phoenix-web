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
  <div :class="cn('px-6 pb-6', $props.class)">
    <slot />
  </div>
</template>
