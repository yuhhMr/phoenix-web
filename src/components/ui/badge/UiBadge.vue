<script setup lang="ts">
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

const classes = computed(() =>
  cn(badgeVariants({ variant: props.variant }), attrs.class as string | undefined, props.class),
)

const BadgeRender = () => {
  if (props.asChild) {
    const children = slots.default?.() ?? []
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
