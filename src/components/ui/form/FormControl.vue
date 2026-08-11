<script setup lang="ts">
interface Props {
  id?: string
  error?: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <slot
    :id="props.id"
    :aria-invalid="props.error"
  />
</template>
