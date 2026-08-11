<script setup lang="ts">
import { TabContent, type TabContentProps } from '@ark-ui/vue'
import { cn } from '@/utils/cn'

interface Props extends TabContentProps {
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <TabContent :class="cn('mt-2 outline-none', props.class)" v-bind="props">
    <slot />
  </TabContent>
</template>
