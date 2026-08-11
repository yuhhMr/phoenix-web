<script setup lang="ts">
import { cn } from '@/utils/cn'

interface Props {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div data-slot="form-item" :class="cn('grid gap-2', props.class)">
    <slot />
  </div>
</template>
