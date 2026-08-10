<template>
  <header class="h-14 bg-surface border-b border-border flex items-center justify-between px-4 shrink-0">
    <div class="flex items-center gap-3 min-w-0">
      <!-- 侧边栏收缩/展开按钮 -->
      <button
        class="w-9 h-9 flex items-center justify-center rounded-md hover:bg-background transition-colors text-text-secondary"
        @click="appStore.toggleSidebar"
      >
        <icon-lucide-panel-left-close v-if="!appStore.sidebarCollapsed" class="w-5 h-5" />
        <icon-lucide-panel-left-open v-else class="w-5 h-5" />
      </button>

      <!-- 面包屑导航（优先菜单树查完整路径，回退 route.matched） -->
      <nav class="flex items-center gap-1 text-sm min-w-0">
        <template v-for="item in breadcrumb" :key="item.path">
          <span v-if="!item.isFirst" class="text-text-secondary">/</span>
          <span v-if="item.isCurrent" class="text-text font-medium truncate">{{ item.title }}</span>
          <RouterLink v-else :to="item.path" class="text-text-secondary hover:text-primary transition-colors truncate">
            {{ item.title }}
          </RouterLink>
        </template>
      </nav>
    </div>

    <div class="flex items-center gap-1.5">
      <!-- 全屏切换（直接用 vueuse 的 useFullscreen，不再自封装 hook） -->
      <button
        class="w-8 h-8 flex items-center justify-center rounded-md text-text-secondary hover:text-text hover:bg-background transition-colors"
        :title="isFullscreen ? t('navbar.exitFullscreen') : t('navbar.fullscreen')"
        @click="toggleFullscreen()"
      >
        <icon-lucide-minimize v-if="isFullscreen" class="w-[18px] h-[18px]" />
        <icon-lucide-maximize v-else class="w-[18px] h-[18px]" />
      </button>

      <!-- 消息通知铃铛：暂缺——后端 notice API 目前只有管理端 CRUD
           （api/notice.ts），没有用户侧未读数/标记已读端点可对接，
           待后端补齐后回补 -->

      <!-- 用户信息下拉：自绘实现（菜单项只有设置/退出两项，同项目既有约定——
           AppModal 同样自绘，不引入 ark-ui Menu） -->
      <div ref="dropdownRef" class="relative">
        <button
          class="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-background transition-colors"
          @click="dropdownOpen = !dropdownOpen"
        >
          <span class="text-sm">{{ userName }}</span>
          <icon-lucide-chevron-down
            class="w-4 h-4 text-text-secondary transition-transform duration-200"
            :class="{ 'rotate-180': dropdownOpen }"
          />
        </button>
        <div
          v-if="dropdownOpen"
          class="absolute right-0 top-full mt-1 w-36 bg-surface border border-border rounded-md shadow-lg py-1 z-50"
        >
          <!-- "个人中心"项暂缺：路由表无 /system/user/profile 页面，待页面补齐后恢复 -->
          <button
            class="w-full flex items-center gap-2 px-3 py-2 text-sm text-text hover:bg-background transition-colors"
            @click="handleUserCommand('settings')"
          >
            <icon-lucide-settings class="w-4 h-4 text-text-secondary" />
            {{ t('navbar.settings') }}
          </button>
          <div class="border-t border-border my-1"></div>
          <button
            class="w-full flex items-center gap-2 px-3 py-2 text-sm text-text hover:bg-background transition-colors"
            @click="handleUserCommand('logout')"
          >
            <icon-lucide-log-out class="w-4 h-4 text-text-secondary" />
            {{ t('navbar.logout') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 退出确认框：自绘（项目无全局 confirm/toast 组件；成功提示省略） -->
    <Teleport to="body">
      <div v-if="logoutConfirmVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="bg-surface rounded-xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
          <div class="px-4 py-3 border-b border-border">
            <h3 class="font-semibold">{{ t('navbar.logoutConfirmTitle') }}</h3>
          </div>
          <div class="p-4 text-sm text-text-secondary">{{ t('navbar.logoutConfirmMessage') }}</div>
          <div class="flex justify-end gap-2 px-4 py-3 border-t border-border bg-background/50">
            <button
              class="px-4 py-2 text-sm border border-border rounded-md hover:bg-background"
              @click="logoutConfirmVisible = false"
            >
              {{ t('common.cancel') }}
            </button>
            <button
              class="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary-dark"
              @click="confirmLogout"
            >
              {{ t('common.confirm') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </header>
</template>

<script setup lang="ts">
/**
 * 导航栏：折叠钮 / 面包屑（菜单树查找 + matched 回退）/ 全屏 / 用户下拉。
 * - 消息通知：暂缺（无用户侧未读端点，见模板注释）
 * - 个人中心：暂缺（无 profile 页面，见模板注释）
 * - 不放"刷新"按钮：刷新在 TagsView 右键菜单（refreshTab），此处不重复
 * - 头像：用户信息契约（LoginInfoRes）无 avatar 字段，只显示用户名
 */
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { onClickOutside, useFullscreen } from '@vueuse/core'
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'
import { usePermissionStore } from '@/store/permission'
import { buildMenuTree, type MenuItem } from '@/router/utils'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const appStore = useAppStore()
const userStore = useUserStore()
const permissionStore = usePermissionStore()
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

interface BreadcrumbItem {
  path: string
  title: string
  isFirst: boolean
  isCurrent: boolean
}

/**
 * 菜单树（面包屑查找的数据源）。
 * permission store 不引 router（避免 store→router→guards→store 循环依赖），
 * 菜单树由 buildMenuTree 从静态路由现算，与 Sidebar 同源——perms 变化时 computed 自动重算。
 */
const menuTree = computed<MenuItem[]>(() => {
  const layoutRoute = router.options.routes.find((r) => r.path === '/')
  return buildMenuTree(layoutRoute?.children ?? [], permissionStore.hasPerm)
})

// 从菜单树中查找路径对应的菜单项；
// MenuItem.title 在 buildMenuTree 时已解析，此处直接取用
function findMenuPath(
  menus: MenuItem[],
  targetPath: string,
  currentPath: { path: string; title: string }[] = [],
): { path: string; title: string }[] | null {
  for (const menu of menus) {
    const newPath = [...currentPath, { path: menu.path, title: menu.title }]
    if (menu.path === targetPath) {
      return newPath
    }
    if (menu.children && menu.children.length > 0) {
      const found = findMenuPath(menu.children, targetPath, newPath)
      if (found) return found
    }
  }
  return null
}

// 计算面包屑导航
const breadcrumb = computed<BreadcrumbItem[]>(() => {
  // 优先从菜单树中查找完整路径
  const menuPath = findMenuPath(menuTree.value, route.path)

  const items =
    menuPath && menuPath.length > 0
      ? menuPath
      : // 回退：使用 route.matched（过滤无 title 的纯容器路由）
        route.matched
          .filter((record) => record.meta && record.meta.title)
          .map((record) => ({ path: record.path, title: String(record.meta.title) }))

  return items.map((item, index) => ({
    ...item,
    isFirst: index === 0,
    isCurrent: index === items.length - 1,
  }))
})

// 用户信息（契约无 avatar，见文件头注释）
const userName = computed(() => userStore.userInfo?.nickname || userStore.userInfo?.username || '')

// 用户下拉
const dropdownRef = ref<HTMLElement | null>(null)
const dropdownOpen = ref(false)
onClickOutside(dropdownRef, () => {
  dropdownOpen.value = false
})

// 退出确认框
const logoutConfirmVisible = ref(false)

// 用户命令处理
function handleUserCommand(command: string) {
  dropdownOpen.value = false
  if (command === 'settings') {
    // 打开设置面板
    appStore.openSettings()
  } else if (command === 'logout') {
    logoutConfirmVisible.value = true
  }
}

// 确认退出登录（权限/页签的联动清理封装在 logout 内部，见 store/user.ts 注释）
function confirmLogout() {
  logoutConfirmVisible.value = false
  userStore.logout()
  router.push('/login')
}
</script>
