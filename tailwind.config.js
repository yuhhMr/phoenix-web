/**
 * Tailwind CSS 配置入口。
 *
 * 本文件职责：
 * - 声明 Tailwind 扫描范围（content）。
 * - 把 src/style.css 中定义的 CSS 变量（Design Tokens）映射为 Tailwind 工具类。
 * - 主题切换（浅色/暗色/品牌色）完全由 CSS 变量驱动，本文件只负责引用，不硬编码色值。
 *
 * 设计令牌来源：src/style.css
 * - 颜色变量使用 HSL 分量形式，如 --primary: 217.2 91.2% 59.8%
 * - Tailwind 通过 hsl(var(--primary) / <alpha-value>) 解析，支持 bg-primary/50 等透明度写法
 *
 * 修改注意点：
 * - 新增颜色时，先在 style.css 定义变量，再在这里添加映射。
 * - 不要在本文件写死 hex/rgb，避免破坏主题切换能力。
 */

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
          dark: 'hsl(var(--primary-hover) / <alpha-value>)',
          hover: 'hsl(var(--primary-hover) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        border: 'hsl(var(--border) / <alpha-value>)',
        input: {
          DEFAULT: 'hsl(var(--input) / <alpha-value>)',
          background: 'hsl(var(--input-background) / <alpha-value>)',
        },
        ring: 'hsl(var(--ring) / <alpha-value>)',
        surface: {
          DEFAULT: 'hsl(var(--surface) / <alpha-value>)',
          foreground: 'hsl(var(--surface-foreground) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'hsl(var(--success) / <alpha-value>)',
          foreground: 'hsl(var(--success-foreground) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning) / <alpha-value>)',
          foreground: 'hsl(var(--warning-foreground) / <alpha-value>)',
        },
        info: {
          DEFAULT: 'hsl(var(--info) / <alpha-value>)',
          foreground: 'hsl(var(--info-foreground) / <alpha-value>)',
        },
        // 兼容旧变量，新代码优先使用 foreground / muted-foreground
        text: {
          DEFAULT: 'hsl(var(--text) / <alpha-value>)',
          secondary: 'hsl(var(--text-secondary) / <alpha-value>)',
        },
        switch: {
          background: 'hsl(var(--muted) / <alpha-value>)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },
    },
  },
  plugins: [],
}
