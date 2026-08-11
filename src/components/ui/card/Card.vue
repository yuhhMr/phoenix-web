<script setup lang="ts">
/**
 * 卡片容器：用于将相关内容分组展示，提供统一的背景、边框与圆角。
 */
import { cn } from '@/utils/cn'
import { cardVariants } from './cardVariants'

interface Props {
  class?: string
}

withDefaults(defineProps<Props>(), {
  class: '',
})
</script>

<template>
  <div :class="cn(cardVariants(), $props.class)">
    <slot />
  </div>
</template>
