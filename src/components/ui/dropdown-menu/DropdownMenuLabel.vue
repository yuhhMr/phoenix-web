<script setup lang="ts">
import { MenuItemGroupLabel, type MenuItemGroupLabelProps } from '@ark-ui/vue'
import { cn } from '@/utils/cn'

interface Props extends MenuItemGroupLabelProps {
  class?: string
  inset?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  inset: false,
})
</script>

<template>
  <MenuItemGroupLabel
    :class="cn('px-2 py-1.5 text-sm font-medium text-foreground', inset && 'pl-8', props.class)"
    v-bind="props"
  >
    <slot />
  </MenuItemGroupLabel>
</template>
