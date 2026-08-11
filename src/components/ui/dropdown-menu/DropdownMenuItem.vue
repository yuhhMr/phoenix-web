<script setup lang="ts">
import { MenuItem, type MenuItemProps } from '@ark-ui/vue'
import { cn } from '@/utils/cn'

interface Props extends MenuItemProps {
  class?: string
  inset?: boolean
  variant?: 'default' | 'destructive'
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  inset: false,
  variant: 'default',
})
</script>

<template>
  <MenuItem
    :class="
      cn(
        'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
        'focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        variant === 'destructive' && 'text-destructive focus:bg-destructive/10 focus:text-destructive',
        inset && 'pl-8',
        '[&_svg]:size-4 [&_svg]:shrink-0',
        props.class,
      )
    "
    v-bind="props"
  >
    <slot />
  </MenuItem>
</template>
