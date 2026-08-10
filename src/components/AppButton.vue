<template>
  <button
    :type="nativeType"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60 [&_svg]:size-4"
    :class="[variantClass, sizeClass]"
  >
    <IconLoading v-if="loading" class="animate-spin" />
    <slot v-else name="icon" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import IconLoading from '~icons/lucide/loader-circle'

/**
 * 通用按钮（variant/size 两级语义化变体，Vue + Tailwind 实现）。
 * 纯样式壳，不需要 ark-ui 逻辑层（见 AppInput 注释）。
 */
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    /** 加载中：显示 spinner 并禁用点击 */
    loading?: boolean
    disabled?: boolean
    nativeType?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    nativeType: 'button',
  },
)

const variantClass = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-slate-200 text-text hover:bg-slate-300'
    case 'outline':
      return 'border border-border bg-transparent text-text hover:bg-slate-100'
    case 'ghost':
      return 'text-text hover:bg-slate-100'
    case 'danger':
      return 'bg-red-600 text-white hover:bg-red-700'
    default:
      return 'bg-primary text-white hover:bg-primary-dark'
  }
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-8 px-3 text-xs'
    case 'lg':
      return 'h-11 px-6 text-[15px]'
    default:
      return 'h-9 px-4 text-sm'
  }
})
</script>
