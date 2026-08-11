<template>
  <!-- 应用根组件，只负责挂载路由视图；布局、侧边栏、页签等由 layout/index.vue 统一编排 -->
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>
