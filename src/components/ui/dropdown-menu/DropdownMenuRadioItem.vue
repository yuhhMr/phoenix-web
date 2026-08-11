<script setup lang="ts">
import { MenuItemIndicator, MenuRadioItem, type MenuRadioItemProps } from '@ark-ui/vue'
import { cn } from '@/utils/cn'
import IconCircle from '~icons/lucide/circle'

interface Props extends MenuRadioItemProps {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <MenuRadioItem
    :class="
      cn(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none transition-colors',
        'focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        '[&_svg]:size-2 [&_svg]:shrink-0',
        props.class,
      )
    "
    v-bind="props"
  >
    <span class="absolute left-2 flex size-3.5 items-center justify-center">
      <MenuItemIndicator>
        <IconCircle class="fill-current" />
      </MenuItemIndicator>
    </span>
    <slot />
  </MenuRadioItem>
</template>
