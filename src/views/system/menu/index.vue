<template>
  <div class="bg-surface rounded-xl p-4 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold">菜单管理</h2>
      <button class="px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary-dark text-sm">新增</button>
    </div>
    <div v-if="loading" class="py-8 text-center text-text-secondary">加载中...</div>
    <ul v-else-if="tree.length" class="space-y-1">
      <MenuTreeNode v-for="node in tree" :key="node.menuId" :node="node" />
    </ul>
    <div v-else class="py-8 text-center text-text-secondary">暂无数据</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MenuTreeNode from './MenuTreeNode.vue'
import { fetchMenuTree, type MenuTreeItem } from '@/api/menu'

const tree = ref<MenuTreeItem[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    tree.value = await fetchMenuTree()
  } finally {
    loading.value = false
  }
})
</script>
