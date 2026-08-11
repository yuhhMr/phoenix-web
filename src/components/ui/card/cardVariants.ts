import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Card 系列样式变体。
 *
 * 设计要点：
 * - 把卡片各子区域的样式集中管理，组件文件只负责渲染结构。
 * - Card 使用 cva，方便后续扩展尺寸、阴影等变体。
 * - Header / Title / Description / Content / Footer 使用独立变体函数，保持可组合性。
 */
export const cardVariants = cva(
  'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-border shadow-sm',
  {
    variants: {},
  },
)

export type CardVariants = VariantProps<typeof cardVariants>

export const cardHeaderVariants = cva('flex flex-col gap-1.5 px-6 pt-6')

export const cardTitleVariants = cva('text-lg leading-none font-semibold tracking-tight')

export const cardDescriptionVariants = cva('text-sm text-muted-foreground')

export const cardContentVariants = cva('px-6 pb-6')

export const cardFooterVariants = cva('flex items-center px-6 pb-6')
