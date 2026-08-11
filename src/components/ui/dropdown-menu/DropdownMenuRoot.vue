<script setup lang="ts">
import { MenuRoot, type MenuRootProps, type MenuRootEmits } from '@ark-ui/vue'

const props = defineProps<MenuRootProps>()
const emit = defineEmits<MenuRootEmits>()
</script>

<template>
  <MenuRoot v-bind="props" @update:open="emit('update:open', $event)" @open-change="emit('openChange', $event)">
    <slot />
  </MenuRoot>
</template>
