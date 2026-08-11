<script setup lang="ts">
/**
 * 徽章组件：用于展示状态、标签、计数等小面积高优先级信息。
 * - 支持 as-child，可渲染为链接或按钮并保持徽章样式。
 */
import { cloneVNode, computed, h, mergeProps, useAttrs, useSlots } from 'vue'
import { cn } from '@/utils/cn'
import { badgeVariants, type BadgeVariants } from './badgeVariants'

interface Props {
  variant?: BadgeVariants['variant']
  asChild?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  asChild: false,
  class: '',
})

defineOptions({
  inheritAttrs: false,
})

const slots = useSlots()
const attrs = useAttrs()

const classes = computed(() => cn(badgeVariants({ variant: props.variant }), props.class))

const BadgeRender = () => {
  if (props.asChild) {
    const children = slots.default?.() ?? []
    // 找到第一个有效的 VNode（字符串/数字等文本节点跳过）
    const first = children.find(
      (c): c is NonNullable<typeof c> =>
        c !== null && typeof c === 'object' && (typeof c.type === 'string' || typeof c.type === 'object'),
    )
    if (first) {
      return cloneVNode(first, mergeProps({ class: classes.value }, attrs))
    }
  }
  return h('span', { class: classes.value, ...attrs }, slots.default?.())
}
</script>

<template>
  <BadgeRender />
</template>
