import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

// https://vite.dev/config/
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
      resolvers: [
        IconsResolver({ prefix: 'icon' }),
      ],
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
