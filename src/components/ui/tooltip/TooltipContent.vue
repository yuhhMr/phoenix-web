<script setup lang="ts">
import { TooltipArrow, TooltipArrowTip, TooltipContent, TooltipPositioner, type TooltipContentProps } from '@ark-ui/vue'
import { cn } from '@/utils/cn'

interface Props extends TooltipContentProps {
  class?: string
  sideOffset?: number
}

withDefaults(defineProps<Props>(), {
  class: '',
  sideOffset: 4,
})
</script>

<template>
  <TooltipPositioner>
    <TooltipContent
      :class="
        cn(
          'z-50 w-fit rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md',
          $props.class,
        )
      "
      v-bind="$props"
    >
      <slot />
      <TooltipArrow>
        <TooltipArrowTip class="fill-primary" />
      </TooltipArrow>
    </TooltipContent>
  </TooltipPositioner>
</template>
