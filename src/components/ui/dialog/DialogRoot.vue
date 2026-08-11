<script setup lang="ts">
import { DialogRoot, type DialogRootProps, type DialogRootEmits } from '@ark-ui/vue'

const props = defineProps<DialogRootProps>()
const emit = defineEmits<DialogRootEmits>()
</script>

<template>
  <DialogRoot v-bind="props" @update:open="emit('update:open', $event)" @open-change="emit('openChange', $event)">
    <slot />
  </DialogRoot>
</template>
