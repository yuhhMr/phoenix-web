<script setup lang="ts">
/**
 * 卡片底部：通常放置操作按钮，使用 flex 布局便于左/右对齐。
 */
import { cn } from '@/utils/cn'
import { cardFooterVariants } from './cardVariants'

interface Props {
  class?: string
}

withDefaults(defineProps<Props>(), {
  class: '',
})
</script>

<template>
  <div :class="cn(cardFooterVariants(), $props.class)">
    <slot />
  </div>
</template>
