<script setup lang="ts">
import { MenuSeparator, type MenuSeparatorProps } from '@ark-ui/vue'
import { cn } from '@/utils/cn'

interface Props extends MenuSeparatorProps {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <MenuSeparator :class="cn('-mx-1 my-1 h-px bg-border', props.class)" v-bind="props" />
</template>
