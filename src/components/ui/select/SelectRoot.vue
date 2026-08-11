<script setup lang="ts">
import { SelectRoot, type SelectRootProps, type SelectRootEmits } from '@ark-ui/vue'
import type { CollectionItem } from '@ark-ui/vue'

const props = defineProps<SelectRootProps<CollectionItem>>()
const emit = defineEmits<SelectRootEmits<CollectionItem>>()
</script>

<template>
  <SelectRoot
    v-bind="props"
    @update:model-value="emit('update:modelValue', $event)"
    @update:open="emit('update:open', $event)"
    @value-change="emit('valueChange', $event)"
  >
    <slot />
  </SelectRoot>
</template>
