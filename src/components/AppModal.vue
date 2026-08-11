<script setup lang="ts">
import { DialogModal } from '@/components/ui/dialog'

interface Props {
  modelValue: boolean
  title: string
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: []
}>()
</script>

<template>
  <DialogModal
    :open="modelValue"
    :title="title"
    :loading="loading"
    @update:open="$emit('update:modelValue', $event)"
    @submit="$emit('submit')"
  >
    <slot />
  </DialogModal>
</template>
