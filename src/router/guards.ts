import type { Router } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from '@/store/user'
import { useTabsStore } from '@/store/tabs'
import { buildRedirectPath, hasRoutePermission } from './utils'
import { APP_TITLE } from '@/config/app'
import { RouteNames } from './constants'

NProgress.configure({ showSpinner: false })

// 检查登录状态
function checkAuthenticated(): boolean {
  return !!useUserStore().token
}

// 检查路由权限（复用 router/utils.ts 的 hasRoutePermission）
function checkRoutePermission(to: Parameters<typeof hasRoutePermission>[0], userPermissions: string[]): boolean {
  return hasRoutePermission(to, userPermissions)
}

export function setupGuards(router: Router) {
  router.beforeEach((to) => {
    NProgress.start()
    const userStore = useUserStore()

    // 未登录：非登录页跳登录页（带 redirect），登录页放行
    if (!checkAuthenticated()) {
      if (to.name !== RouteNames.Login) {
        return { name: RouteNames.Login, query: { redirect: buildRedirectPath(to) } }
      }
      return true
    }

    // 已登录访问登录页：直接回首页
    if (to.name === RouteNames.Login) {
      return { path: '/' }
    }

    // 动态路由扩展点：后端提供 /auth/routes 时，可在此先加载路由再 next({ path: to.fullPath })

    // 已登录：校验路由权限，无权限跳 403
    const userPermissions: string[] = userStore.userInfo?.perms || []
    if (!checkRoutePermission(to, userPermissions)) {
      console.warn('[路由守卫] 无权访问:', to.path)
      return { name: RouteNames.Forbidden, replace: true }
    }

    return true
  })

  router.afterEach((to) => {
    // 浏览器标签页标题固定为站点名，不随路由变化
    document.title = APP_TITLE

    // 添加页签（排除登录页、403、404 等显式声明不进页签的路由）
    const noTabRoutes: string[] = [RouteNames.Login, RouteNames.Forbidden, RouteNames.NotFound]
    if (!noTabRoutes.includes(String(to.name)) && !to.meta.noTagsView) {
      useTabsStore().addTab(to)
    }

    NProgress.done()
  })

  // 路由错误处理
  router.onError((error) => {
    console.error('[路由错误]', error)
  })
}
