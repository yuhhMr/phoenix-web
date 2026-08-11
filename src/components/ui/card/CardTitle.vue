<script setup lang="ts">
/**
 * 卡片标题：大号加粗文本，用于卡片头部的主标题。
 */
import { cn } from '@/utils/cn'
import { cardTitleVariants } from './cardVariants'

interface Props {
  class?: string
}

withDefaults(defineProps<Props>(), {
  class: '',
})
</script>

<template>
  <h3 :class="cn(cardTitleVariants(), $props.class)">
    <slot />
  </h3>
</template>
