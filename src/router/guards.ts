import type { Router } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from '@/store/user'
import { usePermissionStore } from '@/store/permission'
import { useTabsStore } from '@/store/tabs'
import { buildRedirectPath } from './utils'
import { APP_TITLE } from '@/config/app'
import { RouteNames, RoutePaths } from './constants'

NProgress.configure({ showSpinner: false })

export function setupGuards(router: Router) {
  router.beforeEach(async (to) => {
    NProgress.start()
    const userStore = useUserStore()
    const permissionStore = usePermissionStore()

    // 未登录：非登录页跳登录页（带 redirect），登录页放行
    if (!userStore.isAuthenticated) {
      if (to.name !== RouteNames.Login) {
        return { name: RouteNames.Login, query: { redirect: buildRedirectPath(to) } }
      }
      return true
    }

    // 已登录访问登录页：直接回首页
    if (to.name === RouteNames.Login) {
      return { name: RouteNames.Index }
    }

    // 已登录但动态路由未加载：先拉取菜单树并生成路由，再重新导航
    if (!permissionStore.isRoutesLoaded) {
      try {
        const generated = await permissionStore.generateRoutes(router)
        // 访问根路径时，重定向到第一个有权限的动态菜单；无动态路由则回退静态首页
        if (to.path === '/') {
          const firstRoute = generated.find((r) => permissionStore.hasPerm(r.meta?.perm as string | undefined))
          if (firstRoute) {
            return { path: firstRoute.path, replace: true }
          }
          return { path: RoutePaths.Index, replace: true }
        }
        return { path: to.fullPath, replace: true, query: to.query }
      } catch (error) {
        console.error('[路由守卫] 动态路由加载失败:', error)
        userStore.logout()
        return { name: RouteNames.Login, query: { redirect: buildRedirectPath(to) } }
      }
    }

    // 已登录且动态路由已加载：校验权限，无权限跳 403
    if (!permissionStore.hasPerm(to.meta.perm as string | undefined)) {
      console.warn('[路由守卫] 无权访问:', to.path)
      return { name: RouteNames.Forbidden, replace: true }
    }

    return true
  })

  router.afterEach((to) => {
    document.title = APP_TITLE

    const noTabRoutes: string[] = [RouteNames.Login, RouteNames.Forbidden, RouteNames.NotFound]
    if (!noTabRoutes.includes(String(to.name)) && !to.meta.noTagsView) {
      useTabsStore().addTab(to)
    }

    NProgress.done()
  })

  router.onError((error) => {
    console.error('[路由错误]', error)
  })
}
