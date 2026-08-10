<template>
  <header class="h-14 bg-surface border-b border-border flex items-center justify-between px-4 shrink-0">
    <div class="flex items-center gap-3 min-w-0">
      <!-- 侧边栏折叠切换 -->
      <button
        class="p-2 rounded-md hover:bg-background transition-colors text-text-secondary"
        @click="appStore.toggleSidebar"
      >
        <icon-lucide-panel-left-close v-if="!appStore.sidebarCollapsed" class="w-5 h-5" />
        <icon-lucide-panel-left-open v-else class="w-5 h-5" />
      </button>

      <!-- 面包屑：route.matched 自带父级链（/ → /system → /system/user），
           过滤无 title 的纯容器路由；末级是当前页，不给链接 -->
      <nav class="flex items-center gap-1 text-sm min-w-0">
        <template v-for="(item, idx) in breadcrumbs" :key="item.path">
          <span v-if="idx > 0" class="text-text-secondary">/</span>
          <span v-if="idx === breadcrumbs.length - 1" class="text-text font-medium truncate">
            {{ item.title }}
          </span>
          <RouterLink
            v-else
            :to="item.path"
            class="text-text-secondary hover:text-primary transition-colors truncate"
          >
            {{ item.title }}
          </RouterLink>
        </template>
      </nav>
    </div>

    <!-- 用户下拉：自绘简单实现（项目只有"退出登录"一个菜单项，引入 ark-ui Menu 不划算） -->
    <div ref="dropdownRef" class="relative">
      <button
        class="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-background transition-colors"
        @click="dropdownOpen = !dropdownOpen"
      >
        <span class="text-sm">{{ displayName }}</span>
        <icon-lucide-chevron-down
          class="w-4 h-4 text-text-secondary transition-transform duration-200"
          :class="{ 'rotate-180': dropdownOpen }"
        />
      </button>
      <div
        v-if="dropdownOpen"
        class="absolute right-0 top-full mt-1 w-36 bg-surface border border-border rounded-md shadow-lg py-1 z-50"
      >
        <button
          class="w-full flex items-center gap-2 px-3 py-2 text-sm text-text hover:bg-background transition-colors"
          @click="handleLogout"
        >
          <icon-lucide-log-out class="w-4 h-4 text-text-secondary" />
          {{ t('navbar.logout') }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { onClickOutside } from '@vueuse/core'
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const appStore = useAppStore()
const userStore = useUserStore()

const displayName = computed(
  () => userStore.userInfo?.nickname || userStore.userInfo?.username || '',
)

// matched 链里 redirect 容器（/）没有 title，天然被过滤掉
const breadcrumbs = computed(() =>
  route.matched
    .filter((r) => r.meta?.title)
    .map((r) => ({ path: r.path, title: String(r.meta.title) })),
)

const dropdownRef = ref<HTMLElement | null>(null)
const dropdownOpen = ref(false)
onClickOutside(dropdownRef, () => {
  dropdownOpen.value = false
})

const handleLogout = () => {
  dropdownOpen.value = false
  // 权限/页签的联动清理封装在 logout 内部（见 store/user.ts 注释）
  userStore.logout()
  router.push('/login')
}
</script>
