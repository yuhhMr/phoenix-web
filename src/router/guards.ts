import type { Router } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from '@/store/user'
import { useTabsStore } from '@/store/tabs'
import { buildRedirectPath, hasRoutePermission } from './utils'
import { APP_TITLE } from '@/config/app'

NProgress.configure({ showSpinner: false })

/**
 * 全局路由守卫。
 *
 * 设计要点：
 * 1. 路由静态注册，无动态路由加载段：当前后端契约未提供动态路由端点
 *    （docs/api/openapi-m2-frozen.json），菜单可见性由 meta.perm 前端过滤
 *    （router/utils.ts）。未来后端新增 /auth/routes 类端点时，在下方"场景2"
 *    注释处插入动态路由加载段即可。
 * 2. 认证失败不在守卫内弹重新登录对话框：401 统一由 api/request.ts 拦截器
 *    回收登录态并跳登录页，守卫只需兜住 token 缺失的场景。
 * 3. 无权访问时回退首页并打告警：当前暂无 403 页面（只有 404），
 *    403 页补齐后改回 next({ path: '/403', replace: true })。
 * 4. 登录页以路由 name 'Login' 判定。
 */

/**
 * 检查登录状态
 * @returns 是否已登录
 */
function checkAuthenticated(): boolean {
  return !!useUserStore().token
}

/**
 * 检查路由权限（使用 permissions 权限标识）
 * @param to - 目标路由
 * @param userPermissions - 用户权限标识列表
 * @returns 是否有权限
 */
function checkRoutePermission(
  to: Parameters<typeof hasRoutePermission>[0],
  userPermissions: string[],
): boolean {
  return hasRoutePermission(to, userPermissions)
}

export function setupGuards(router: Router) {
  // 前置守卫 - 核心权限控制逻辑
  router.beforeEach((to) => {
    NProgress.start()
    const userStore = useUserStore()

    // ========== 场景1: 未登录 ==========
    if (!checkAuthenticated()) {
      // 未登录访问非登录页 → 跳转到登录页（带 redirect，登录成功后原路返回）
      if (to.name !== 'Login') {
        return { name: 'Login', query: { redirect: buildRedirectPath(to) } }
      }
      // 未登录访问登录页 → 允许通过
      return true
    }

    // ========== 场景2: 已登录 ==========

    // 已登录访问登录页 → 跳转到首页
    if (to.name === 'Login') {
      return { path: '/' }
    }

    // [动态路由扩展点：未来后端提供 /auth/routes 类端点时在此加载路由。
    //  当前路由静态注册，此处无需等待路由加载。]

    // ========== 场景3: 已登录（路由静态注册即已就绪）==========
    // 检查路由权限（使用 permissions 权限标识）
    const userPermissions: string[] = userStore.userInfo?.perms || []
    if (!checkRoutePermission(to, userPermissions)) {
      console.warn('[路由守卫] 无权访问:', to.path)
      // 无 403 页，先回退首页（见文件头说明 3）
      return { path: '/', replace: true }
    }

    // 所有检查通过，允许访问
    return true
  })

  // 后置守卫
  router.afterEach((to) => {
    // 浏览器标签页标题固定为站点名（src/config/app.ts 下发），不随路由变化
    document.title = APP_TITLE

    // 添加标签页（排除登录页等不需要标签页的路由）；
    // 另支持 meta.noTagsView 约定（404 等路由显式声明不进页签）
    const noTabRoutes = ['Login', 'NotFound']
    if (!noTabRoutes.includes(String(to.name)) && !to.meta.noTagsView) {
      const tabsStore = useTabsStore()
      tabsStore.addTab(to)
    }

    NProgress.done()
  })

  // 路由错误处理
  router.onError((error) => {
    console.error('[路由错误]', error)
  })
}
