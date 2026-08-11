<script setup lang="ts">
import { SelectContent, SelectList, SelectPositioner, type SelectContentProps } from '@ark-ui/vue'
import { cn } from '@/utils/cn'

interface Props extends SelectContentProps {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <SelectPositioner>
    <SelectContent
      :class="
        cn(
          'relative z-50 max-h-[var(--available-height)] min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md',
          props.class,
        )
      "
      v-bind="props"
    >
      <SelectList>
        <slot />
      </SelectList>
    </SelectContent>
  </SelectPositioner>
</template>
