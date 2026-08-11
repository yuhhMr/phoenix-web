<script setup lang="ts">
/**
 * 卡片描述：辅助说明文本，颜色较浅，用于补充标题信息。
 */
import { cn } from '@/utils/cn'
import { cardDescriptionVariants } from './cardVariants'

interface Props {
  class?: string
}

withDefaults(defineProps<Props>(), {
  class: '',
})
</script>

<template>
  <p :class="cn(cardDescriptionVariants(), $props.class)">
    <slot />
  </p>
</template>
