<template>
  <!-- 布局骨架（对齐 Jarvis-web src/layout/index.vue 的分层与职责，Tailwind 重写）：
       Sidebar / Navbar / TagsView / AppMain 四个关注点各自独立，本组件只负责摆放。
       差异说明：Jarvis 的 Settings 设置面板与 InnerLink 外链容器未搬——
       phoenix 暂无主题设置项与外链路由，需求出现时按同结构回补 -->
  <div class="flex h-screen bg-background text-text">
    <Sidebar />
    <div class="flex-1 flex flex-col min-w-0">
      <Navbar />
      <TagsView />
      <AppMain />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './components/Sidebar/index.vue'
import Navbar from './components/Navbar.vue'
import TagsView from './components/TagsView/index.vue'
import AppMain from './components/AppMain.vue'
</script>
