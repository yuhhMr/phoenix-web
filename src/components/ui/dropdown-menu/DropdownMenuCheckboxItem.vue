<script setup lang="ts">
import { MenuCheckboxItem, MenuItemIndicator, type MenuCheckboxItemProps, type MenuCheckboxItemEmits } from '@ark-ui/vue'
import { cn } from '@/utils/cn'
import IconCheck from '~icons/lucide/check'

interface Props extends MenuCheckboxItemProps {
  class?: string
}

const props = defineProps<Props>()
const emit = defineEmits<MenuCheckboxItemEmits>()
</script>

<template>
  <MenuCheckboxItem
    :class="
      cn(
        'relative flex cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none transition-colors',
        'focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        '[&_svg]:size-4 [&_svg]:shrink-0',
        props.class,
      )
    "
    v-bind="props"
    @update:checked="emit('update:checked', $event)"
  >
    <span class="absolute left-2 flex size-3.5 items-center justify-center">
      <MenuItemIndicator>
        <IconCheck />
      </MenuItemIndicator>
    </span>
    <slot />
  </MenuCheckboxItem>
</template>
