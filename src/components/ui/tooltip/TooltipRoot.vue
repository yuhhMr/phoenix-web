<script setup lang="ts">
import { TooltipRoot, type TooltipRootProps, type TooltipRootEmits } from '@ark-ui/vue'

const props = defineProps<TooltipRootProps>()
const emit = defineEmits<TooltipRootEmits>()
</script>

<template>
  <TooltipRoot
    v-bind="props"
    @update:open="emit('update:open', $event)"
    @open-change="emit('openChange', $event)"
  >
    <slot />
  </TooltipRoot>
</template>
