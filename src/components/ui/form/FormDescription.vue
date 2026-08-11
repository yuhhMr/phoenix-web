<script setup lang="ts">
import { cn } from '@/utils/cn'

interface Props {
  class?: string
  id?: string
}

const props = defineProps<Props>()
</script>

<template>
  <p :id="props.id" data-slot="form-description" :class="cn('text-sm text-muted-foreground', props.class)">
    <slot />
  </p>
</template>
