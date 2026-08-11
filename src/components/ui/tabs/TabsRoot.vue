<script setup lang="ts">
import { TabsRoot, type TabsRootProps, type TabsRootEmits } from '@ark-ui/vue'

const props = defineProps<TabsRootProps>()
const emit = defineEmits<TabsRootEmits>()
</script>

<template>
  <TabsRoot
    v-bind="props"
    @update:model-value="emit('update:modelValue', $event)"
    @value-change="emit('valueChange', $event)"
  >
    <slot />
  </TabsRoot>
</template>
