<template>
  <!-- Logo：折叠态只留首字母，保持品牌识别（对齐 Jarvis-web Sidebar/Logo.vue 职责） -->
  <div class="h-14 flex items-center justify-center border-b border-border shrink-0">
    <span class="font-bold text-lg text-primary">
      {{ collapsed ? 'P' : 'Phoenix' }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  collapsed: boolean
}>()
</script>
