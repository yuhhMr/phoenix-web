<script setup lang="ts">
import { MenuContent, MenuPositioner, type MenuContentProps } from '@ark-ui/vue'
import { cn } from '@/utils/cn'

interface Props extends MenuContentProps {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <MenuPositioner>
    <MenuContent
      :class="
        cn(
          'z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg',
          props.class,
        )
      "
      v-bind="props"
    >
      <slot />
    </MenuContent>
  </MenuPositioner>
</template>
