import type { RouteRecordRaw } from 'vue-router'
import { markRaw, defineAsyncComponent, defineComponent, h } from 'vue'
import Layout from '@/layout/index.vue'
import InnerLink from '@/layout/components/InnerLink/index.vue'
import type { MenuTreeItem } from '@/api/menu'

// 预加载所有视图组件，用于根据后端返回的 component 路径动态匹配
const views = import.meta.glob('@/views/**/*.vue')

const RawLayout = markRaw(Layout)
const RawInnerLink = markRaw(InnerLink)

// 目录菜单类型
const MENU_TYPE_DIR = 'M'

// 拼接完整路径
function getFullPath(parentPath: string, childPath: string): string {
  if (!childPath) return parentPath || ''
  if (childPath.startsWith('/')) return childPath
  if (parentPath && parentPath !== '/') {
    return `${parentPath.replace(/\/$/, '')}/${childPath}`
  }
  return `/${childPath}`
}

// 根据 component 字段加载对应视图组件
function loadComponent(component: string | undefined, name: string | undefined): RouteRecordRaw['component'] {
  if (component === 'Layout') return RawLayout
  if (component === 'InnerLink') return RawInnerLink
  if (!component) return undefined

  const key = `/src/views/${component}.vue`
  const loader = views[key]
  if (!loader) {
    console.warn(`[动态路由] 未找到组件: ${component}`)
    return undefined
  }

  const asyncComp = defineAsyncComponent(loader as () => Promise<Record<string, unknown>>)
  // 用与路由同名的具名组件包装异步页面，确保 keep-alive include 能按 name 命中
  return markRaw(
    defineComponent({
      name: name || component,
      render: () => h(asyncComp),
    }),
  )
}

// 构建单个路由节点
function buildRoute(item: MenuTreeItem, parentPath = '', isChild = false): RouteRecordRaw {
  const relativePath = item.path || ''
  const fullPath = getFullPath(parentPath, relativePath)
  const title = item.menuName || ''
  const isDir = item.menuType === MENU_TYPE_DIR

  const route = {
    path: isChild ? relativePath : fullPath,
    name: item.menuName,
    component: isDir ? RawLayout : loadComponent(item.component, item.menuName),
    meta: {
      title,
      titleKey: `route.${item.menuName}`,
      icon: item.icon,
      perm: item.perms,
      showInMenu: true,
      keepAlive: true,
    },
  } as RouteRecordRaw

  // 递归处理子节点：目录的子节点挂到当前路由 children 下
  if (item.children && item.children.length > 0) {
    const childRoutes = item.children
      .filter((child) => child.menuType !== 'F')
      .map((child) => buildRoute(child, fullPath, true))

    if (childRoutes.length) {
      route.children = childRoutes
      // 目录默认重定向到第一个可见子菜单
      if (isDir) {
        route.redirect = childRoutes[0].path
      }
    }
  }

  return route
}

// 从菜单树生成动态路由
export function generateRoutesFromMenu(data: MenuTreeItem[]): RouteRecordRaw[] {
  return data.filter((item) => item.menuType !== 'F').map((item) => buildRoute(item))
}
