/**
 * Vite 构建配置入口。
 *
 * 本文件解决什么问题：
 * - 提供 Vue 3 + TypeScript 的编译环境；
 * - 通过 unplugin-auto-import 自动导入 vue / vue-router / pinia / vueuse / vue-i18n，
 *   页面里可直接使用 ref、computed、useRoute 等而无需手写 import；
 * - 通过 unplugin-vue-components + unplugin-icons 实现图标组件按需自动注册，
 *   使用 <icon-lucide-xxx /> 时无需 import；
 * - 配置 `@` 指向 `src/` 的路径别名；
 * - 开发服务器代理 `/api` 到后端，并剥离 `/api` 前缀（后端路由本身无前缀）。
 *
 * 修改注意点：
 * - 新增 auto-import 库时，同步更新 AutoImport.imports；
 * - 新增图标集时，同步 Components.resolvers；
 * - 后端地址变更不要改这里，改 `.env.development` 的 `VITE_APP_BASE_API`。
 */
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname)
  return {
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia', '@vueuse/core', 'vue-i18n'],
        dts: 'src/types/auto-imports.d.ts',
        dirs: ['src/composables', 'src/store', 'src/utils'],
        vueTemplate: true,
      }),
      Components({
        dts: 'src/types/components.d.ts',
        resolvers: [IconsResolver({ prefix: 'icon' })],
      }),
      Icons({ autoInstall: true }),
    ],
    resolve: {
      alias: {
        '@': resolve(import.meta.dirname, 'src'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          // 后端地址由环境变量驱动（.env.development / .env.production）
          target: env.VITE_APP_BASE_API,
          changeOrigin: true,
          // 后端无前缀路由（/auth/**、/system/**），必须剥掉 /api 前缀——
          // 否则 8080/api/auth/captcha 直接 404
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
