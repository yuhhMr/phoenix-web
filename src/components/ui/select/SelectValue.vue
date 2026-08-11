<script setup lang="ts">
import { SelectValueText, type SelectValueTextProps } from '@ark-ui/vue'

interface Props extends SelectValueTextProps {
  placeholder?: string
}

const props = defineProps<Props>()
</script>

<template>
  <SelectValueText v-bind="props">
    <slot />
  </SelectValueText>
</template>
