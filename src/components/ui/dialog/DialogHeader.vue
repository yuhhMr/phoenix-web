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
  <div :class="cn('flex flex-col gap-2 text-center sm:text-left', $props.class)">
    <slot />
  </div>
</template>
