<script setup lang="ts">
import { MenuTrigger, type MenuTriggerProps } from '@ark-ui/vue'

const props = defineProps<MenuTriggerProps>()
</script>

<template>
  <MenuTrigger v-bind="props" as-child>
    <slot />
  </MenuTrigger>
</template>
