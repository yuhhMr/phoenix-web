<template>
  <main class="flex-1 p-4 overflow-auto min-h-0">
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <!-- keep-alive include 按组件 name 匹配：路由 name 与页面组件
             defineOptions name 一一对齐（约定见 router/index.ts 顶部注释）。
             未访问过的页面不在 include 里，首次加载即正常挂载。 -->
        <KeepAlive :include="cachedViews">
          <component :is="Component" :key="route.fullPath" />
        </KeepAlive>
      </Transition>
    </RouterView>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useTagsViewStore } from '@/store/tagsView'

const route = useRoute()
const tagsViewStore = useTagsViewStore()

// 页签关闭 → 组件名移出 include → 缓存随之销毁，两个关注点共用一份数据
const cachedViews = computed(() =>
  tagsViewStore.visitedViews.filter((v) => v.keepAlive).map((v) => v.name),
)
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
