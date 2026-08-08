<template>
  <li class="select-none">
    <div class="flex items-center gap-2 py-1.5 px-2 hover:bg-background rounded-md">
      <button v-if="hasChildren" class="w-4 h-4 text-text-secondary" @click="expanded = !expanded">
        <icon-lucide-chevron-right v-if="!expanded" class="w-4 h-4" />
        <icon-lucide-chevron-down v-else class="w-4 h-4" />
      </button>
      <span v-else class="w-4"></span>
      <span class="text-sm">{{ node.orgName }}</span>
      <span class="text-xs text-text-secondary">({{ node.orgCode }})</span>
      <span class="ml-auto flex gap-2">
        <button
          v-perm="'system:org:create'"
          class="text-xs text-primary hover:underline"
          @click.stop="emits('add', node.orgId)"
        >
          新增
        </button>
        <button
          v-perm="'system:org:update'"
          class="text-xs text-primary hover:underline"
          @click.stop="emits('edit', node)"
        >
          编辑
        </button>
        <button
          v-perm="'system:org:delete'"
          class="text-xs text-red-500 hover:underline"
          @click.stop="emits('remove', node.orgId)"
        >
          删除
        </button>
      </span>
    </div>
    <ul v-if="hasChildren && expanded" class="pl-6 space-y-1">
      <OrgTreeNode
        v-for="child in node.children"
        :key="child.orgId"
        :node="child"
        @edit="(n) => emits('edit', n)"
        @add="(pid) => emits('add', pid)"
        @remove="(id) => emits('remove', id)"
      />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { OrgTreeItem } from '@/api/org'

const props = defineProps<{ node: OrgTreeItem }>()
const emits = defineEmits<{
  edit: [node: OrgTreeItem]
  add: [parentId: number]
  remove: [id: number]
}>()

const expanded = ref(true)
const hasChildren = computed(() => !!props.node.children?.length)
</script>
