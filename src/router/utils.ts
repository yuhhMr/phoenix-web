import type { RouteRecordRaw } from 'vue-router'

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
