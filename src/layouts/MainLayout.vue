<template>
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
// 布局骨架：Sidebar / Navbar / TagsView / AppMain 四个关注点各自独立，
// 本组件只负责摆放，不承载任何状态
import Sidebar from './components/Sidebar/index.vue'
import Navbar from './components/Navbar.vue'
import TagsView from './components/TagsView.vue'
import AppMain from './components/AppMain.vue'
</script>
