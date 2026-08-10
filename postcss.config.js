/**
 * PostCSS 配置入口。
 *
 * 本文件解决什么问题：
 * - 注册 tailwindcss 插件，把 @tailwind 指令编译为最终 CSS；
 * - 注册 autoprefixer 插件，自动补全浏览器前缀（-webkit-、-moz- 等）。
 *
 * 修改注意点：
 * - 一般不需要改动；
 * - 若引入 postcss-nested 等插件，在此数组中按执行顺序追加。
 */
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
