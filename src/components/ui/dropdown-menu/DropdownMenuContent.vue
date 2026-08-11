<script setup lang="ts">
import { MenuContent, MenuPositioner, type MenuContentProps } from '@ark-ui/vue'
import { cn } from '@/utils/cn'

interface Props extends MenuContentProps {
  class?: string
  sideOffset?: number
}

withDefaults(defineProps<Props>(), {
  class: '',
  sideOffset: 4,
})
</script>

<template>
  <MenuPositioner>
    <MenuContent
      :class="
        cn(
          'z-50 max-h-[var(--available-height)] min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md',
          $props.class,
        )
      "
      v-bind="$props"
    >
      <slot />
    </MenuContent>
  </MenuPositioner>
</template>
