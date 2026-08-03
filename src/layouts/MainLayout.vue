<template>
  <div class="flex h-screen">
    <!-- 侧边栏 -->
    <aside
      class="bg-surface border-r border-border transition-all duration-300 flex flex-col"
      :class="appStore.sidebarCollapsed ? 'w-16' : 'w-56'"
    >
      <div class="h-14 flex items-center justify-center border-b border-border">
        <span class="font-bold text-lg" v-if="!appStore.sidebarCollapsed">Phoenix</span>
        <span class="font-bold text-lg" v-else>P</span>
      </div>
      <nav class="flex-1 overflow-y-auto py-2">
        <ul class="space-y-1 px-2">
          <li v-for="route in menuRoutes" :key="route.path">
            <RouterLink
              :to="route.path"
              class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-background transition-colors"
              active-class="bg-background text-primary"
            >
              <icon-lucide-layout-dashboard v-if="route.name === 'Dashboard'" class="w-5 h-5" />
              <icon-lucide-settings v-else class="w-5 h-5" />
              <span v-if="!appStore.sidebarCollapsed">{{ $t(`menu.${String(route.name).toLowerCase()}`) }}</span>
            </RouterLink>
          </li>
        </ul>
      </nav>
      <div class="p-3 border-t border-border">
        <button
          class="flex items-center justify-center w-full py-2 rounded-md hover:bg-background"
          @click="appStore.toggleSidebar"
        >
          <icon-lucide-panel-left-close v-if="!appStore.sidebarCollapsed" class="w-5 h-5" />
          <icon-lucide-panel-left-open v-else class="w-5 h-5" />
        </button>
      </div>
    </aside>

    <!-- 主内容区 -->
    <div class="flex-1 flex flex-col min-w-0">
      <header class="h-14 bg-surface border-b border-border flex items-center justify-between px-4">
        <h1 class="font-medium">{{ pageTitle }}</h1>
        <div class="flex items-center gap-4">
          <span class="text-sm text-text-secondary">{{ userStore.userInfo?.nickname }}</span>
          <button class="text-sm text-primary hover:underline" @click="logout">退出</button>
        </div>
      </header>
      <main class="flex-1 p-4 overflow-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink, RouterView } from 'vue-router'
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'
import router from '@/router'

const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()

const menuRoutes = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Monitor', path: '/monitor/online' },
  { name: 'System', path: '/system/user' },
]

const pageTitle = computed(() => {
  return String(route.meta?.title || 'Phoenix-Fast')
})

const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script>
