<script setup lang="ts">
import { DialogCloseTrigger, type DialogCloseTriggerProps } from '@ark-ui/vue'

const props = defineProps<DialogCloseTriggerProps>()
</script>

<template>
  <DialogCloseTrigger v-bind="props">
    <slot />
  </DialogCloseTrigger>
</template>
