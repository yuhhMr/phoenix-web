<script setup lang="ts">
/**
 * 卡片头部：通常包含标题与描述，负责顶部的留白与垂直间距。
 */
import { cn } from '@/utils/cn'
import { cardHeaderVariants } from './cardVariants'

interface Props {
  class?: string
}

withDefaults(defineProps<Props>(), {
  class: '',
})
</script>

<template>
  <div :class="cn(cardHeaderVariants(), $props.class)">
    <slot />
  </div>
</template>
