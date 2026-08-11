<script setup lang="ts">
import { DialogTrigger, type DialogTriggerProps } from '@ark-ui/vue'

const props = defineProps<DialogTriggerProps>()
</script>

<template>
  <DialogTrigger v-bind="props">
    <slot />
  </DialogTrigger>
</template>
