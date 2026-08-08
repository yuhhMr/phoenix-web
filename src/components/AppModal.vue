<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="close">
      <div class="bg-surface rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        <div class="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 class="font-semibold">{{ title }}</h3>
          <button class="text-text-secondary hover:text-text" @click="close">
            <icon-lucide-x class="w-5 h-5" />
          </button>
        </div>
        <div class="p-4">
          <slot />
        </div>
        <div class="flex justify-end gap-2 px-4 py-3 border-t border-border bg-background/50">
          <button class="px-4 py-2 border border-border rounded-md hover:bg-background" @click="close">取消</button>
          <button class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark" :disabled="loading" @click="submit">
            {{ loading ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  title: string
  loading?: boolean
}>()

const emits = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: []
}>()

const close = () => emits('update:modelValue', false)
const submit = () => emits('submit')
</script>
