<script setup lang="ts">
import { MenuRadioItemGroup, type MenuRadioItemGroupProps, type MenuRadioItemGroupEmits } from '@ark-ui/vue'

const props = defineProps<MenuRadioItemGroupProps>()
const emit = defineEmits<MenuRadioItemGroupEmits>()
</script>

<template>
  <MenuRadioItemGroup v-bind="props" @update:model-value="emit('update:modelValue', $event)">
    <slot />
  </MenuRadioItemGroup>
</template>
