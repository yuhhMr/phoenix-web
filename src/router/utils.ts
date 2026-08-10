import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

/**
 * 路由工具函数。
 *
 * 前半部分（buildRedirectPath … buildBreadcrumb）全量对照 Jarvis-web src/router/utils.js
 * 移植——phoenix 契约冻结、暂无 listRouters 类动态路由端点，这些工具当前主要服务
 * 守卫的 redirect 构建与权限校验，并为将来 /auth/routes 端点留好形状
 * （动态路由生成时 generateTree/filterPermissionRoutes 可直接复用）。
 *
 * 后半部分（MenuItem/buildMenuTree）是 phoenix 静态路由下的菜单构建，
 * 供 Sidebar/Navbar 消费。
 */

/**
 * 构建不带 redirect 参数的 redirect 值（避免登录回跳时 redirect 嵌套）
 * @param to - 路由对象
 * @returns 构建后的路径
 */
export function buildRedirectPath(to: RouteLocationNormalized): string {
  // 复制查询对象，移除 redirect 参数
  const query = { ...to.query }
  delete query.redirect
  // 构建查询字符串
  const entries = Object.entries(query).map(([k, v]) => [k, String(v)] as [string, string])
  const queryStr = entries.length > 0 ? '?' + new URLSearchParams(entries).toString() : ''
  return to.path + queryStr
}

/** 路由记录最小形状（name/path 比对用） */
type RouteNamePath = { path: string; name?: string | symbol | null }

/**
 * 检查路由是否已存在
 * @param existingRoutes - 已存在的路由数组
 * @param route - 要检查的路由对象
 * @returns 是否已存在
 */
export function isRouteExists(existingRoutes: RouteNamePath[], route: RouteNamePath): boolean {
  return existingRoutes.some((r) => r.path === route.path && r.name === route.name)
}

/**
 * 扁平化路由树，获取所有路由路径
 * @param routes - 路由数组
 * @param result - 结果数组
 * @returns 扁平化后的路由路径数组
 */
export function flattenRoutes(routes: RouteRecordRaw[], result: string[] = []): string[] {
  routes.forEach((route) => {
    result.push(route.path)
    if (route.children && route.children.length > 0) {
      flattenRoutes(route.children, result)
    }
  })
  return result
}

/**
 * 获取路由的完整路径
 * @param parentPath - 父路径
 * @param childPath - 子路径
 * @returns 完整路径
 */
export function getFullPath(parentPath: string, childPath: string): string {
  // 确保 childPath 不为空
  if (!childPath) {
    return parentPath || ''
  }

  let fullPath = childPath
  if (parentPath && parentPath !== '/') {
    // 如果 child path 以 '/' 开头，去掉重复斜杠后拼接
    if (fullPath.startsWith('/')) {
      fullPath = parentPath.replace(/\/$/, '') + fullPath
    } else {
      fullPath = parentPath.replace(/\/$/, '') + '/' + fullPath
    }
  } else if (!fullPath.startsWith('/')) {
    // 如果没有 parentPath 且 childPath 不以 '/' 开头，添加 '/'
    fullPath = '/' + fullPath
  }

  return fullPath
}

/**
 * 检查用户是否有权限访问指定路由。
 * 与 Jarvis 的差异：Jarvis 的 meta.perms 是权限标识数组（满足其一即可），
 * phoenix 路由表约定单条 meta.perm（见 router/index.ts 顶部注释），判定逻辑等价。
 * @param route - 路由对象
 * @param permissions - 用户权限数组
 * @returns 是否有权限
 */
export function hasRoutePermission(
  route: Pick<RouteLocationNormalized, 'meta'> | RouteRecordRaw,
  permissions: string[],
): boolean {
  const perm = route.meta?.perm
  if (perm) {
    // 超级权限通配符：拥有全部权限
    if (Array.isArray(permissions) && permissions.includes('*:*:*')) {
      return true
    }
    return permissions.includes(perm)
  }
  return true
}

/**
 * 过滤权限路由（递归裁剪无权限节点；注意会原地改写 children，与 Jarvis 一致——
 * 设计用途是消费动态生成的路由树，不要直接对 router.options.routes 使用）
 * @param routes - 路由数组
 * @param permissions - 用户权限数组
 * @returns 过滤后的路由数组
 */
export function filterPermissionRoutes(
  routes: RouteRecordRaw[],
  permissions: string[],
): RouteRecordRaw[] {
  return routes.filter((route) => {
    if (hasRoutePermission(route, permissions)) {
      if (route.children && route.children.length > 0) {
        route.children = filterPermissionRoutes(route.children, permissions)
      }
      return true
    }
    return false
  })
}

/**
 * 递归查找路由
 * @param routes - 路由数组
 * @param name - 路由名称
 * @returns 找到的路由对象或 null
 */
export function findRouteByName(routes: RouteRecordRaw[], name: string): RouteRecordRaw | null {
  for (const route of routes) {
    if (route.name === name) {
      return route
    }
    if (route.children && route.children.length > 0) {
      const found = findRouteByName(route.children, name)
      if (found) {
        return found
      }
    }
  }
  return null
}

/**
 * 递归查找路由（根据路径）
 * @param routes - 路由数组
 * @param path - 路由路径
 * @returns 找到的路由对象或 null
 */
export function findRouteByPath(routes: RouteRecordRaw[], path: string): RouteRecordRaw | null {
  for (const route of routes) {
    if (route.path === path) {
      return route
    }
    if (route.children && route.children.length > 0) {
      const found = findRouteByPath(route.children, path)
      if (found) {
        return found
      }
    }
  }
  return null
}

/**
 * 构建面包屑导航数据
 * @param routes - 路由数组
 * @param currentPath - 当前路径
 * @returns 面包屑导航数据
 */
export function buildBreadcrumb(routes: RouteRecordRaw[], currentPath: string) {
  const breadcrumb: { name?: RouteRecordRaw['name']; path: string; meta?: RouteRecordRaw['meta'] }[] = []
  const currentRoute = findRouteByPath(routes, currentPath)

  if (currentRoute) {
    breadcrumb.push({
      name: currentRoute.name,
      path: currentRoute.path,
      meta: currentRoute.meta,
    })
  }

  return breadcrumb
}

/**
 * 侧边栏菜单项：从路由树过滤裁剪后的轻量结构。
 * 不直接复用 RouteRecordRaw——菜单只需要 path/title/icon/children，
 * 与路由解耦后未来切换后端动态菜单（/auth/routes 类端点）时 UI 层零改动。
 */
export interface MenuItem {
  /** 解析后的绝对路径，兼作菜单 key 与激活匹配依据 */
  path: string
  title: string
  icon?: string
  children?: MenuItem[]
}

/**
 * 按权限过滤路由树，产出侧边栏菜单树（纯函数，方便测试与复用）。
 *
 * 规则：
 * - 无 meta.title 的路由（纯 redirect 节点）不进菜单；
 * - meta.perm 经 hasPerm 判定，root（*:*:*）天然全放行；
 * - 目录下所有子项都被过滤掉时，目录本身也不显示（空壳菜单无意义）。
 */
export function buildMenuTree(
  routes: readonly RouteRecordRaw[],
  hasPerm: (perm: string | undefined) => boolean,
  basePath = '',
): MenuItem[] {
  const menus: MenuItem[] = []
  for (const route of routes) {
    const path = route.path.startsWith('/')
      ? route.path
      : `${basePath.replace(/\/$/, '')}/${route.path}`

    if (!hasPerm(route.meta?.perm)) continue

    const children = route.children ? buildMenuTree(route.children, hasPerm, path) : []
    if (!route.meta?.title) continue
    // 有 children 定义但全部被权限过滤掉的目录，不产出空壳
    if (route.children?.length && children.length === 0) continue

    menus.push({
      path,
      title: route.meta.title,
      icon: route.meta.icon,
      children: children.length ? children : undefined,
    })
  }
  return menus
}
