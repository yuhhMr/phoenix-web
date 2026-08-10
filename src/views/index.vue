<template>
  <div class="bg-surface rounded-xl p-6 shadow-sm">
    <h2 class="text-xl font-semibold mb-4">欢迎回来</h2>
    <p class="text-text-secondary">Phoenix-Fast 管理端工作台</p>
  </div>
</template>

<script setup lang="ts">
// keep-alive 按组件 name 缓存，组件 name 须与路由 name 一致（约定见 router/index.ts）
defineOptions({ name: 'Index' })
</script>
