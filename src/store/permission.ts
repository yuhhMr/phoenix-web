import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Router, RouteRecordRaw } from 'vue-router'
import { fetchMenuTree } from '@/api/menu'
import { generateRoutesFromMenu } from '@/router/dynamic'
import { filterPermissionRoutes, hasRoutePermission } from '@/router/utils'
import { useUserStore } from './user'

// 与静态路由冲突的路径应跳过，避免重复注册及控制台警告
const STATIC_PATHS = new Set(['/login', '/', '/index', '/403', '/404'])

// 权限与动态路由状态管理
export const usePermissionStore = defineStore(
  'permission',
  () => {
    // 用户权限标识列表
    const perms = ref<string[]>([])
    // 由菜单树生成的动态路由（原始数据，未过滤）
    const permissionRoutes = ref<RouteRecordRaw[]>([])
    // 动态路由是否已加载
    const isRoutesLoaded = ref(false)

    // 是否有某个权限
    const hasPerm = (perm: string | undefined) => {
      if (!perm) return true
      return perms.value.includes(perm) || perms.value.includes('*:*:*') || useUserStore().isRoot
    }

    // 是否有任意一个权限
    const hasAnyPerm = (permissions: string[]) => {
      if (!permissions.length) return true
      return permissions.some((p) => hasPerm(p))
    }

    // 是否拥有全部权限
    const hasAllPerm = (permissions: string[]) => {
      if (!permissions.length) return true
      return permissions.every((p) => hasPerm(p))
    }

    // 设置权限列表
    const setPerms = (list: string[]) => {
      perms.value = list
    }

    // 按当前权限过滤后的动态路由
    const accessibleRoutes = computed(() => filterPermissionRoutes(permissionRoutes.value, perms.value))

    // 侧边栏菜单树：从过滤后的动态路由生成
    const menuTree = computed(() => {
      const userStore = useUserStore()
      return buildMenuTree(accessibleRoutes.value, (perm) => hasRoutePermission({ meta: { perm } }, userStore.perms))
    })

    // 生成并注册动态路由
    async function generateRoutes(router?: Router): Promise<RouteRecordRaw[]> {
      if (isRoutesLoaded.value) return permissionRoutes.value

      try {
        const menuTreeData = await fetchMenuTree()
        const generated = generateRoutesFromMenu(menuTreeData)
        permissionRoutes.value = generated

        if (router) {
          generated.forEach((route) => {
            if (!STATIC_PATHS.has(route.path)) {
              router.addRoute(route)
            }
          })
        }

        isRoutesLoaded.value = true
        return generated
      } catch (error) {
        console.error('[动态路由] 加载失败:', error)
        throw error
      }
    }

    // 重置状态（登录态失效/切换账号时调用）
    const reset = () => {
      perms.value = []
      permissionRoutes.value = []
      isRoutesLoaded.value = false
    }

    return {
      perms,
      permissionRoutes,
      isRoutesLoaded,
      hasPerm,
      hasAnyPerm,
      hasAllPerm,
      setPerms,
      accessibleRoutes,
      menuTree,
      generateRoutes,
      reset,
    }
  },
  {
    persist: {
      pick: ['perms'],
    },
  },
)

// 从路由树构建菜单树（供 Sidebar 使用）
function buildMenuTree(
  routes: readonly RouteRecordRaw[],
  hasPerm: (perm: string | undefined) => boolean,
  basePath = '',
): import('@/router/utils').MenuItem[] {
  const menus: import('@/router/utils').MenuItem[] = []
  for (const route of routes) {
    if (route.meta?.showInMenu === false) continue
    if (!hasPerm(route.meta?.perm as string | undefined)) continue

    const path = route.path.startsWith('/') ? route.path : `${basePath.replace(/\/$/, '')}/${route.path}`
    const children = route.children ? buildMenuTree(route.children, hasPerm, path) : []

    const title = route.meta?.title || ''
    if (!title && !children.length) continue
    if (route.children?.length && children.length === 0) continue

    menus.push({
      path,
      title,
      icon: route.meta?.icon as string | undefined,
      children: children.length ? children : undefined,
    })
  }
  return menus
}
