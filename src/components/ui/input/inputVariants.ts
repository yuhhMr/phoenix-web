import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Input 样式变体。
 *
 * 设计要点：
 * - 将输入框的样式逻辑从组件模板中完全抽离，组件只负责状态组合与事件转发。
 * - 通过 size / error / prefix / suffix 变体控制布局，避免在组件内拼接大量字符串。
 * - 所有颜色引用语义 token，支持主题切换。
 */
export const inputVariants = cva(
  [
    'flex w-full min-w-0 rounded-md border border-input bg-input-background px-3 py-1',
    'text-sm text-foreground shadow-sm transition-[color,box-shadow] outline-none',
    'placeholder:text-muted-foreground',
    'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50',
  ].join(' '),
  {
    variants: {
      size: {
        default: 'h-9',
        sm: 'h-8',
        lg: 'h-11',
      },
      error: {
        true: 'border-destructive focus-visible:ring-destructive/30',
        false: '',
      },
      prefix: {
        true: 'pl-9',
        false: '',
      },
      suffix: {
        none: '',
        single: 'pr-9',
        multiple: 'pr-14',
      },
    },
    defaultVariants: {
      size: 'default',
      error: false,
      prefix: false,
      suffix: 'none',
    },
  },
)

export type InputVariants = VariantProps<typeof inputVariants>
