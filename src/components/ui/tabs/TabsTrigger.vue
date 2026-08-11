<script setup lang="ts">
import { TabTrigger, type TabTriggerProps } from '@ark-ui/vue'
import { cn } from '@/utils/cn'

interface Props extends TabTriggerProps {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <TabTrigger
    :class="
      cn(
        'inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap transition-all',
        'focus-visible:ring-2 focus-visible:ring-ring/50',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
        props.class,
      )
    "
    v-bind="props"
  >
    <slot />
  </TabTrigger>
</template>
