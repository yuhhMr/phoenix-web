<template>
  <li class="select-none">
    <div class="flex items-center gap-2 py-1.5 px-2 hover:bg-background rounded-md">
      <button v-if="hasChildren" class="w-4 h-4 text-text-secondary" @click="expanded = !expanded">
        <icon-lucide-chevron-right v-if="!expanded" class="w-4 h-4" />
        <icon-lucide-chevron-down v-else class="w-4 h-4" />
      </button>
      <span v-else class="w-4"></span>
      <span class="text-sm">{{ node.menuName }}</span>
      <span class="text-xs text-text-secondary">({{ typeLabel }} / {{ node.perms || '-' }})</span>
    </div>
    <ul v-if="hasChildren && expanded" class="pl-6 space-y-1">
      <MenuTreeNode v-for="child in node.children" :key="child.menuId" :node="child" />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { MenuTreeItem } from '@/api/menu'

const props = defineProps<{ node: MenuTreeItem }>()

const expanded = ref(true)
const hasChildren = computed(() => !!props.node.children?.length)

const typeLabel = computed(() => {
  const map: Record<string, string> = { M: '目录', C: '菜单', F: '按钮' }
  return map[props.node.menuType] || props.node.menuType
})
</script>
