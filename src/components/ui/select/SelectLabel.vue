<script setup lang="ts">
import { SelectLabel, type SelectLabelProps } from '@ark-ui/vue'
import { cn } from '@/utils/cn'

interface Props extends SelectLabelProps {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <SelectLabel :class="cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', props.class)" v-bind="props">
    <slot />
  </SelectLabel>
</template>
