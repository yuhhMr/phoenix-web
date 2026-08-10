<template>
  <main class="flex-1 p-4 overflow-auto min-h-0">
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <!-- keep-alive include 按组件 name 匹配：路由 name 与页面组件
             defineOptions name 一一对应（约定见 router/index.ts 顶部注释）。
             key 拼 refreshKey：页签右键"刷新当前页"
             让 refreshKey 自增 → key 变化 → 组件强制重挂载。
             未访问过的页面不在 include 里，首次加载即正常挂载。 -->
        <KeepAlive :include="cachedViews">
          <component :is="Component" :key="route.fullPath + '-' + refreshKey" />
        </KeepAlive>
      </Transition>
    </RouterView>
  </main>
</template>

<script setup lang="ts">
/**
 * 主内容区。
 * - 进度条不在此挂载：router/guards.ts 的前后守卫直接驱动 NProgress；
 * - 页面切换带淡入淡出 Transition（短时长避免拖慢操作感，见 style 注释）。
 */
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useTabsStore } from '@/store/tabs'

const route = useRoute()
const tabsStore = useTabsStore()

// 刷新 key，用于触发组件重新渲染
const refreshKey = computed(() => tabsStore.getRefreshKey)

// 页签关闭 → 组件名移出 include → 缓存随之销毁，两个关注点共用一份数据
const cachedViews = computed(() => tabsStore.getTabs.filter((tab) => tab.meta.keepAlive).map((tab) => tab.name))
</script>

<style scoped>
/* 页面切换淡入淡出：短时长避免拖慢操作感 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
