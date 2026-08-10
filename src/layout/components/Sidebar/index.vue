<template>
  <aside
    class="bg-surface border-r border-border flex flex-col transition-all duration-300 shrink-0"
    :class="appStore.sidebarCollapsed ? 'w-16' : 'w-56'"
  >
    <Logo :collapsed="appStore.sidebarCollapsed" />
    <nav class="flex-1 overflow-y-auto py-2 px-2 space-y-1">
      <TreeMenu v-for="item in menuTree" :key="item.path" :item="item" :collapsed="appStore.sidebarCollapsed" />
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/app'
import { usePermissionStore } from '@/store/permission'
import { buildMenuTree, type MenuItem } from '@/router/utils'
import Logo from './Logo.vue'
import TreeMenu from './TreeMenu.vue'

const appStore = useAppStore()
const permissionStore = usePermissionStore()
const router = useRouter()

/**
 * 菜单数据源：layout 下的静态路由 children，按 meta.perm 过滤。
 * 契约冻结没有 listRouters 端点，详见 router/index.ts 顶部注释；
 * perms 变化（登录/登出）时 computed 自动重算，菜单即时收敛。
 */
const menuTree = computed<MenuItem[]>(() => {
  const layoutRoute = router.options.routes.find((r) => r.path === '/')
  return buildMenuTree(layoutRoute?.children ?? [], permissionStore.hasPerm)
})
</script>
