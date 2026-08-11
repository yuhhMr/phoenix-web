<script setup lang="ts">
import { DialogTitle, type DialogTitleProps } from '@ark-ui/vue'
import { cn } from '@/utils/cn'

interface Props extends DialogTitleProps {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <DialogTitle :class="cn('text-lg leading-none font-semibold tracking-tight', props.class)" v-bind="props">
    <slot />
  </DialogTitle>
</template>
