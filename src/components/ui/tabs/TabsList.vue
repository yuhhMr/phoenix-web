<script setup lang="ts">
import { TabList, type TabListProps } from '@ark-ui/vue'
import { cn } from '@/utils/cn'

interface Props extends TabListProps {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <TabList
    :class="
      cn(
        'inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
        props.class,
      )
    "
    v-bind="props"
  >
    <slot />
  </TabList>
</template>
