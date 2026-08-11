<script setup lang="ts">
import { MenuTriggerItem, type MenuTriggerItemProps } from '@ark-ui/vue'
import { cn } from '@/utils/cn'
import IconChevronRight from '~icons/lucide/chevron-right'

interface Props extends MenuTriggerItemProps {
  class?: string
  inset?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  inset: false,
})
</script>

<template>
  <MenuTriggerItem
    :class="
      cn(
        'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
        'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
        inset && 'pl-8',
        props.class,
      )
    "
    v-bind="props"
  >
    <slot />
    <IconChevronRight class="ml-auto size-4" />
  </MenuTriggerItem>
</template>
