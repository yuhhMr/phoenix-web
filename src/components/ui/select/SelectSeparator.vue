<script setup lang="ts">
import { cn } from '@/utils/cn'

interface Props {
  class?: string
}

withDefaults(defineProps<Props>(), {
  class: '',
})
</script>

<template>
  <div :class="cn('-mx-1 my-1 h-px bg-border', $props.class)" role="separator" />
</template>
