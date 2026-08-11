<script setup lang="ts">
import { SelectIndicator, SelectTrigger, type SelectTriggerProps } from '@ark-ui/vue'
import { cn } from '@/utils/cn'
import IconChevronDown from '~icons/lucide/chevron-down'

interface Props extends SelectTriggerProps {
  class?: string
  size?: 'sm' | 'default'
}

withDefaults(defineProps<Props>(), {
  class: '',
  size: 'default',
})
</script>

<template>
  <SelectTrigger
    :class="
      cn(
        'flex w-full items-center justify-between gap-2 rounded-md border border-input bg-input-background px-3 py-2 text-sm text-foreground shadow-sm transition-[color,box-shadow] outline-none',
        'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50',
        'disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground',
        'data-[size=default]:h-9 data-[size=sm]:h-8',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
        $props.class,
      )
    "
    v-bind="$props"
  >
    <slot />
    <SelectIndicator>
      <IconChevronDown class="opacity-50" />
    </SelectIndicator>
  </SelectTrigger>
</template>
