<script setup lang="ts">
/**
 * 通用按钮：封装 variant/size/loading/disabled/asChild 等常用语义。
 * - loading 时自动显示 spinner 并禁用点击，避免业务层重复写 loading 状态判断。
 * - asChild=true 时把样式合并到第一个子元素，用于在 RouterLink/a 等标签上呈现按钮样式。
 */
import { cloneVNode, computed, h, mergeProps, useAttrs, useSlots } from 'vue'
import { cn } from '@/utils/cn'
import IconLoader from '~icons/lucide/loader-circle'
import { buttonVariants, type ButtonVariants } from './buttonVariants'

interface Props {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  asChild?: boolean
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  asChild: false,
  loading: false,
  disabled: false,
  type: 'button',
})

defineOptions({
  inheritAttrs: false,
})

const slots = useSlots()
const attrs = useAttrs()

// 合并 cva 生成的变体类名与外部传入的 class
const classes = computed(() =>
  cn(buttonVariants({ variant: props.variant, size: props.size }), attrs.class as string | undefined),
)

// loading 状态视为禁用，防止重复提交
const disabled = computed(() => props.disabled || props.loading)

const ButtonRender = () => {
  if (props.asChild) {
    const children = slots.default?.() ?? []
    // 找到第一个有效的 VNode（字符串/数字等文本节点跳过）
    const first = children.find(
      (c): c is NonNullable<typeof c> =>
        c !== null && typeof c === 'object' && (typeof c.type === 'string' || typeof c.type === 'object'),
    )
    if (first) {
      return cloneVNode(first, mergeProps({ class: classes.value, disabled: disabled.value }, attrs))
    }
  }
  return h(
    'button',
    {
      class: classes.value,
      disabled: disabled.value,
      type: props.type,
      ...attrs,
    },
    props.loading ? h(IconLoader, { class: 'animate-spin' }) : slots.default?.(),
  )
}
</script>

<template>
  <ButtonRender />
</template>
