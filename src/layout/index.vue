<template>
  <!-- 布局容器：Sidebar / Navbar / TagsView / AppMain 四个关注点各自独立，本组件只负责摆放。
       侧边栏宽度/折叠样式在 Sidebar 组件内部自理。 -->
  <div class="flex h-screen bg-background text-text">
    <Sidebar />
    <div class="flex-1 flex flex-col min-w-0">
      <Navbar />
      <TagsView />
      <AppMain />
    </div>
  </div>

  <!-- 设置面板：随布局挂载，可见性由 appStore.settingsVisible 控制；
       不传 v-model——面板内部直读 appStore，自取自关，避免冗余双向绑定 -->
  <Settings />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Sidebar from './components/Sidebar/index.vue'
import Navbar from './components/Navbar.vue'
import TagsView from './components/TagsView/index.vue'
import AppMain from './components/AppMain.vue'
import Settings from './components/Settings/index.vue'
import { useTabsStore } from '@/store/tabs'
import { useAppStore } from '@/store/app'
import { applyThemeMode } from '@/utils/theme'

const tabsStore = useTabsStore()
const appStore = useAppStore()

onMounted(() => {
  // 初始化标签页（确保首页页签存在；已持久化时为空操作）
  tabsStore.init()
  // 启动时回放持久化的主题设置（Settings 面板内切换时会即时应用，这里兜刷新场景）
  applyThemeMode(appStore.settings.theme)
})
</script>
