<template>
  <!-- 布局骨架（对照 Jarvis-web src/layout/index.vue 的分层与职责，Tailwind 重写）：
       Sidebar / Navbar / TagsView / AppMain 四个关注点各自独立，本组件只负责摆放。
       侧边栏宽度/折叠样式在 Sidebar 组件内部自理（对应 Jarvis 的 sidebarWidth/sidebarClass）。 -->
  <div class="flex h-screen bg-background text-text">
    <Sidebar />
    <div class="flex-1 flex flex-col min-w-0">
      <Navbar />
      <TagsView />
      <AppMain />
    </div>
  </div>

  <!-- 设置面板（对照 Jarvis：随布局挂载，可见性由 appStore.settingsVisible 控制。
       Jarvis 在此额外传了 v-model:visible，但其 Settings 内部本就直读 appStore，
       属冗余双向绑定，此处省略，面板内部自取自关） -->
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
  // 初始化标签页（对照 Jarvis：确保首页页签存在；已持久化时为空操作）
  tabsStore.init()
  // 启动时回放持久化的主题设置（Settings 面板内切换时会即时应用，这里兜刷新场景）
  applyThemeMode(appStore.settings.theme)
})
</script>
