<template>
  <div class="relative flex items-center">
    <!-- 前缀图标插槽（如用户/锁形图标） -->
    <span v-if="$slots.prefix" class="pointer-events-none absolute left-3 flex items-center" :class="iconColor">
      <slot name="prefix" />
    </span>

    <input
      :type="actualType"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength"
      :autocomplete="autocomplete"
      class="w-full rounded-md border outline-none transition-colors"
      :class="[sizeClass, variantClass, paddingClass]"
      @input="onInput"
      @keyup.enter="$emit('enter')"
    />

    <div class="absolute right-2 flex items-center gap-0.5">
      <!-- 清空按钮：有值且可清空时出现 -->
      <button
        v-if="showClear"
        type="button"
        tabindex="-1"
        class="rounded p-1 transition-colors"
        :class="suffixBtnClass"
        :title="clearTitle"
        @click="onClear"
      >
        <IconClose class="size-3.5" />
      </button>
      <!-- 密码可视化切换：仅密码框且有输入时出现（避免与浏览器原生 reveal 重复） -->
      <button
        v-if="showPasswordToggle"
        type="button"
        tabindex="-1"
        class="rounded p-1 transition-colors"
        :class="suffixBtnClass"
        :title="passwordVisible ? hideTitle : showTitle"
        @click="passwordVisible = !passwordVisible"
      >
        <IconEyeOff v-if="passwordVisible" class="size-4" />
        <IconEye v-else class="size-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import IconClose from '~icons/lucide/x'
import IconEye from '~icons/lucide/eye'
import IconEyeOff from '~icons/lucide/eye-off'

/**
 * 通用输入框（语义化样式封装，Vue + Tailwind 实现）。
 * <p>
 * 输入/按钮这类纯样式壳不需要 ark-ui 逻辑层，ark-ui 留给
 * Dialog/Select 等有交互逻辑的组件（见 AppModal）。
 * variant="glass" 用于登录页磨砂卡片等深色背景场景。
 * </p>
 */
const props = withDefaults(
  defineProps<{
    modelValue: string
    type?: 'text' | 'password'
    placeholder?: string
    maxlength?: number | string
    autocomplete?: string
    /** 尾部清空按钮，默认开 */
    clearable?: boolean
    disabled?: boolean
    error?: boolean
    variant?: 'default' | 'glass'
    size?: 'md' | 'lg'
    clearTitle?: string
    showTitle?: string
    hideTitle?: string
  }>(),
  {
    type: 'text',
    clearable: true,
    disabled: false,
    error: false,
    variant: 'default',
    size: 'md',
    clearTitle: '清空',
    showTitle: '显示密码',
    hideTitle: '隐藏密码',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  enter: []
  clear: []
}>()

const passwordVisible = ref(false)
const isPassword = computed(() => props.type === 'password')
const actualType = computed(() => (isPassword.value && passwordVisible.value ? 'text' : props.type))
const showClear = computed(() => props.clearable && !props.disabled && props.modelValue.length > 0)
/** 密码可视切换与清空按钮同节奏：有输入才出现（浏览器原生 reveal 已在样式中屏蔽） */
const showPasswordToggle = computed(() => isPassword.value && !props.disabled && props.modelValue.length > 0)

const sizeClass = computed(() => (props.size === 'lg' ? 'h-11 text-[15px]' : 'h-10 text-sm'))

const variantClass = computed(() => {
  if (props.variant === 'glass') {
    // 原型是白底深字（设计/登录页.jpg），不是透明白字
    return [
      'bg-white/90 text-slate-800 placeholder:text-slate-400',
      props.error ? 'border-red-400/80' : 'border-white/40',
      'focus:bg-white focus:border-primary',
      'disabled:opacity-50',
    ]
  }
  return [
    'bg-background text-text placeholder:text-text-secondary',
    props.error ? 'border-red-500 focus-visible:ring-red-500/30' : 'border-border',
    'focus:border-primary focus:ring-2 focus:ring-primary/30',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ]
})

/** 前缀图标与尾部按钮的空间补偿（完整类名字面量，保证 Tailwind 扫描到） */
const slots = useSlots()
const paddingClass = computed(() => {
  const pl = slots.prefix ? 'pl-9' : 'pl-3'
  const rightCount = (showClear.value ? 1 : 0) + (showPasswordToggle.value ? 1 : 0)
  const pr = rightCount === 0 ? 'pr-3' : rightCount === 1 ? 'pr-9' : 'pr-14'
  return `${pl} ${pr}`
})

const iconColor = computed(() => (props.variant === 'glass' ? 'text-slate-400' : 'text-text-secondary'))
const suffixBtnClass = computed(() =>
  props.variant === 'glass' ? 'text-slate-400 hover:bg-slate-200/70 hover:text-slate-600' : 'text-text-secondary hover:bg-slate-100 hover:text-text',
)

const onInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}

const onClear = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<style scoped>
/* 屏蔽浏览器（Edge/IE 系）密码框自带的 reveal/clear 按钮，避免与组件按钮重复 */
input::-ms-reveal,
input::-ms-clear {
  display: none;
}
</style>
