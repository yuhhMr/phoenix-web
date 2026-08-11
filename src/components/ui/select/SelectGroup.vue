<script setup lang="ts">
import { SelectItemGroup, type SelectItemGroupProps } from '@ark-ui/vue'

const props = defineProps<SelectItemGroupProps>()
</script>

<template>
  <SelectItemGroup v-bind="props">
    <slot />
  </SelectItemGroup>
</template>
