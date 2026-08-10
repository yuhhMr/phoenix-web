/**
 * 主题应用工具 —— 对照 Jarvis-web src/assets/theme/index.js 的裁剪移植。
 *
 * 有意裁剪的说明：Jarvis 的主题体系操作 Element Plus 的 CSS 变量
 * （--el-color-primary 及其 light/dark 阶梯），phoenix 用 Tailwind 静态令牌
 * （tailwind.config.js 的 primary 等），没有对应的运行时变量层：
 * - 主题模式：仅切换 <html> 的 dark class 占位，Tailwind 未配置 dark 令牌，
 *   暂无可视效果，待令牌变量化后生效；
 * - 主题色：仅持久化存储（app store settings.themeColor），不改写任何样式，待接。
 */

/** 应用主题模式（light/dark） */
export function applyThemeMode(theme: string) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

/**
 * 预设主题色 —— 色值照搬 Jarvis base.css 的 --preset-color-* 八个，
 * 仅把首位换成 phoenix 的 primary（#2563eb）。
 */
export const PRESET_COLORS = [
  '#2563eb',
  '#18a058',
  '#f59e0b',
  '#ef4444',
  '#0ea5e9',
  '#64748b',
  '#8b5cf6',
  '#dc2626',
]
