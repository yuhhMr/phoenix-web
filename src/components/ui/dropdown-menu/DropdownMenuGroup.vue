<script setup lang="ts">
import { MenuItemGroup, type MenuItemGroupProps } from '@ark-ui/vue'

const props = defineProps<MenuItemGroupProps>()
</script>

<template>
  <MenuItemGroup v-bind="props">
    <slot />
  </MenuItemGroup>
</template>
