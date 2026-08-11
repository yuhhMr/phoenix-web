<script setup lang="ts">
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

const classes = computed(() =>
  cn(buttonVariants({ variant: props.variant, size: props.size }), attrs.class as string | undefined),
)

const disabled = computed(() => props.disabled || props.loading)

const ButtonRender = () => {
  if (props.asChild) {
    const children = slots.default?.() ?? []
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
