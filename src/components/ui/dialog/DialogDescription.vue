<script setup lang="ts">
import { DialogDescription, type DialogDescriptionProps } from '@ark-ui/vue'
import { cn } from '@/utils/cn'

interface Props extends DialogDescriptionProps {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <DialogDescription :class="cn('text-sm text-muted-foreground', props.class)" v-bind="props">
    <slot />
  </DialogDescription>
</template>
