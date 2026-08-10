/**
 * 主题应用工具。
 *
 * 本项目用 Tailwind 静态令牌（tailwind.config.js 的 primary 等），
 * 没有运行时可改写的 CSS 变量主题层，因此主题能力当前是"存值 + 占位"：
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
 * 预设主题色（取色器下方的快捷色板），首位即 tailwind.config.js 的 primary。
 */
export const PRESET_COLORS = ['#2563eb', '#18a058', '#f59e0b', '#ef4444', '#0ea5e9', '#64748b', '#8b5cf6', '#dc2626']
