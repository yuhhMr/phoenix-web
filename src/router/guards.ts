import type { Router } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from '@/store/user'
import { APP_TITLE } from '@/config/app'

NProgress.configure({ showSpinner: false })

/**
 * 全局路由守卫。
 *
 * 与 Jarvis-web guards.js 的关键差异：后端契约（docs/api/openapi-m2-frozen.json）
 * 没有 listRouters 之类的动态路由端点，因此这里只有 token 校验，
 * 没有"动态路由加载"阶段——菜单可见性由 Sidebar 按 meta.perm 前端过滤兜底。
 * 未来若新增 /auth/routes 类端点，在本守卫 token 校验通过后插入动态注册即可。
 */
export function setupGuards(router: Router) {
  router.beforeEach((to) => {
    NProgress.start()
    const userStore = useUserStore()

    if (to.meta.public) {
      // 已登录用户不应再看到登录页
      return to.name === 'Login' && userStore.token ? { path: '/' } : true
    }
    if (!userStore.token) {
      // 带上 redirect，登录成功后原路返回（登录页已消费该 query）
      return {
        path: '/login',
        query: to.fullPath === '/' ? {} : { redirect: to.fullPath },
      }
    }
    return true
  })

  router.afterEach((to) => {
    // 站点标题统一由配置下发，页面标题拼在前面
    document.title = to.meta.title ? `${to.meta.title} - ${APP_TITLE}` : APP_TITLE
    NProgress.done()
  })
}
