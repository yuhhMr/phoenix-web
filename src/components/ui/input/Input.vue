<script setup lang="ts">
/**
 * 通用输入框：统一文本/密码输入的样式与交互。
 *
 * 设计要点：
 * - 默认显示清空按钮，可在登录表单等场景关闭。
 * - 密码框有值时自动显示可视化切换，业务层无需再包 eye 按钮。
 * - 前缀图标与尾部按钮会动态调整 input 内边距，防止文字被遮挡。
 * - 样式逻辑委托给 inputVariants，组件内只保留状态计算与事件转发。
 */
import { computed, ref, useAttrs } from 'vue'
import { cn } from '@/utils/cn'
import IconClose from '~icons/lucide/x'
import IconEye from '~icons/lucide/eye'
import IconEyeOff from '~icons/lucide/eye-off'
import { inputVariants, type InputVariants } from './inputVariants'

interface Props {
  modelValue?: string
  type?: 'text' | 'password'
  size?: InputVariants['size']
  placeholder?: string
  maxlength?: number | string
  autocomplete?: string
  disabled?: boolean
  error?: boolean
  clearable?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  size: 'default',
  placeholder: undefined,
  maxlength: undefined,
  autocomplete: undefined,
  disabled: false,
  error: false,
  clearable: true,
  class: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  enter: []
  clear: []
}>()

const slots = defineSlots<{
  prefix?: () => unknown
}>()

defineOptions({
  inheritAttrs: false,
})

const attrs = useAttrs()

// 密码框可视化状态由组件内部维护，避免与外部 type 控制产生双状态源
const passwordVisible = ref(false)

const isPassword = computed(() => props.type === 'password')
const actualType = computed(() => (isPassword.value && passwordVisible.value ? 'text' : props.type))
const hasValue = computed(() => props.modelValue.length > 0)
const showClear = computed(() => props.clearable && !props.disabled && hasValue.value)
const showPasswordToggle = computed(() => isPassword.value && !props.disabled && hasValue.value)
const hasPrefix = computed(() => !!slots.prefix)

// 根据尾部按钮数量计算右侧内边距，保证文字与按钮不重叠
const suffixCount = computed(() => {
  let count = 0
  if (showClear.value) count++
  if (showPasswordToggle.value) count++
  return count === 0 ? 'none' : count === 1 ? 'single' : 'multiple'
})

const inputClass = computed(() =>
  cn(
    inputVariants({
      size: props.size,
      error: props.error,
      prefix: hasPrefix.value,
      suffix: suffixCount.value as Exclude<InputVariants['suffix'], null | undefined>,
    }),
    props.class,
  ),
)

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

function onClear() {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<template>
  <div class="relative flex items-center">
    <span
      v-if="hasPrefix"
      class="pointer-events-none absolute left-3 flex items-center text-muted-foreground"
    >
      <slot name="prefix" />
    </span>

    <input
      :value="modelValue"
      :type="actualType"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :class="inputClass"
      v-bind="attrs"
      @input="onInput"
      @keyup.enter="$emit('enter')"
    />

    <div class="absolute right-2 flex items-center gap-0.5">
      <button
        v-if="showClear"
        type="button"
        tabindex="-1"
        class="rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        title="清空"
        @click="onClear"
      >
        <IconClose class="size-3.5" />
      </button>
      <button
        v-if="showPasswordToggle"
        type="button"
        tabindex="-1"
        class="rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        :title="passwordVisible ? '隐藏密码' : '显示密码'"
        @click="passwordVisible = !passwordVisible"
      >
        <IconEyeOff v-if="passwordVisible" class="size-4" />
        <IconEye v-else class="size-4" />
      </button>
    </div>
  </div>
</template>
