<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'

interface Props {
  open: boolean
  title: string
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: []
}>()

const close = () => emit('update:open', false)
const submit = () => emit('submit')
</script>

<template>
  <DialogRoot :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
      </DialogHeader>
      <div class="space-y-4">
        <slot />
      </div>
      <DialogFooter>
        <Button variant="outline" @click="close">取消</Button>
        <Button :loading="loading" @click="submit">保存</Button>
      </DialogFooter>
    </DialogContent>
  </DialogRoot>
</template>
