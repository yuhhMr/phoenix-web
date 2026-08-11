<script setup lang="ts">
/**
 * 便捷弹窗：在组合式 Dialog 之上封装旧 AppModal 的 API（title/loading/submit）。
 * 适合简单的新增/编辑弹窗；复杂弹窗建议直接使用 DialogRoot/DialogContent 组合。
 */
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
