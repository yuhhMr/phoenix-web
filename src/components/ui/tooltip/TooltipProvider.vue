<script setup lang="ts">
interface Props {
  delayDuration?: number
}

withDefaults(defineProps<Props>(), {
  delayDuration: 0,
})
</script>

<template>
  <slot />
</template>
