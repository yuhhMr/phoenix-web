<template>
  <div v-if="!link" class="flex items-center justify-center h-full text-2xl text-text-secondary">404</div>
  <div v-else class="w-full h-full">
    <iframe :src="link" frameborder="no" scrolling="auto" class="w-full h-full"></iframe>
  </div>
</template>

<script setup lang="ts">
/**
 * 外链容器：路由 meta.link 存在时以 iframe 内嵌外链页面。
 * 当前静态路由表未配 meta.link，组件先就位，
 * 将来动态路由（/auth/routes 端点）落地时供 component='InnerLink' 的菜单使用。
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const link = computed(() => route.meta.link)
</script>
