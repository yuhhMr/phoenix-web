<script setup lang="ts">
import { cn } from '@/utils/cn'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <caption data-slot="table-caption" :class="cn('mt-4 text-sm text-muted-foreground', props.class)">
    <slot />
  </caption>
</template>
