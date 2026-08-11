<template>
  <aside
    class="bg-surface border-r border-border flex flex-col transition-all duration-300 shrink-0"
    :class="appStore.sidebarCollapsed ? 'w-16' : 'w-56'"
  >
    <Logo :collapsed="appStore.sidebarCollapsed" />
    <nav class="flex-1 overflow-y-auto py-2 px-2 space-y-1">
      <TreeMenu
        v-for="item in menuTree"
        :key="item.path"
        :item="item"
        :collapsed="appStore.sidebarCollapsed"
      />
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store/app'
import { usePermissionStore } from '@/store/permission'
import type { MenuItem } from '@/router/utils'
import Logo from './Logo.vue'
import TreeMenu from './TreeMenu.vue'

const appStore = useAppStore()
const permissionStore = usePermissionStore()

// 菜单数据源：由后端 /system/menu/tree 生成并过滤后的动态路由菜单树
const menuTree = computed<MenuItem[]>(() => permissionStore.menuTree)
</script>
