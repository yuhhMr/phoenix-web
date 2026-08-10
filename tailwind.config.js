/**
 * Tailwind CSS 配置入口。
 *
 * 本文件解决什么问题：
 * - 声明 Tailwind 扫描范围（content），只有这些文件里出现的类名才会被打包；
 * - 扩展主题色（primary / background / surface / border / text 等），
 *   与 src/style.css 和 layout 组件共同构成项目设计系统；
 * - 当前主题色为静态令牌，后续若要做「设置面板切换主题色」，
 *   可改为 CSS 变量并在本文件引用。
 *
 * 修改注意点：
 * - 新增页面/组件后无需改 content（已覆盖 src 下所有 vue/ts）；
 * - 新增颜色变量时，同步更新 src/style.css 中可能硬编码的色值。
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        'primary-dark': '#1d4ed8',
        background: '#f8fafc',
        surface: '#ffffff',
        border: '#e2e8f0',
        text: '#1e293b',
        'text-secondary': '#64748b',
      },
    },
  },
  plugins: [],
}
