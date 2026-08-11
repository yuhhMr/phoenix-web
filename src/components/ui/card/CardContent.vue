<script setup lang="ts">
/**
 * 卡片内容区：承载卡片主要内容，控制水平与底部留白。
 */
import { cn } from '@/utils/cn'
import { cardContentVariants } from './cardVariants'

interface Props {
  class?: string
}

withDefaults(defineProps<Props>(), {
  class: '',
})
</script>

<template>
  <div :class="cn(cardContentVariants(), $props.class)">
    <slot />
  </div>
</template>
