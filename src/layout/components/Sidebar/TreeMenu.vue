<template>
  <!-- 叶子菜单：直接路由跳转 -->
  <RouterLink
    v-if="!hasChildren"
    :to="item.path"
    :title="collapsed ? item.title : undefined"
    class="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors"
    :class="[
      collapsed ? 'justify-center' : '',
      isActive ? 'bg-primary/10 text-primary font-medium' : 'text-text hover:bg-background',
    ]"
  >
    <component :is="icon" class="w-5 h-5 shrink-0" />
    <span v-if="!collapsed" class="truncate">{{ item.title }}</span>
  </RouterLink>

  <!-- 目录菜单：本地状态展开/收起，当前路由命中子项时自动展开 -->
  <div v-else>
    <button
      :title="collapsed ? item.title : undefined"
      class="flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full transition-colors"
      :class="[
        collapsed ? 'justify-center' : '',
        isChildActive ? 'text-primary' : 'text-text hover:bg-background',
      ]"
      @click="open = !open"
    >
      <component :is="icon" class="w-5 h-5 shrink-0" />
      <template v-if="!collapsed">
        <span class="flex-1 text-left truncate">{{ item.title }}</span>
        <icon-lucide-chevron-down
          class="w-4 h-4 shrink-0 transition-transform duration-200"
          :class="{ '-rotate-90': !open }"
        />
      </template>
    </button>
    <div v-show="open" class="space-y-1" :class="collapsed ? 'mt-1' : 'mt-1 pl-3'">
      <TreeMenu
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :collapsed="collapsed"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 递归菜单项（参照 Jarvis-web TreeMenu.vue，样式 Tailwind 重写）。
 * 展开状态放组件本地而非全局 store：目录层级少（当前仅两级），
 * 本地 ref + 路由联动已足够，无需引入跨组件状态。
 */
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import type { MenuItem } from '@/router/utils'
import { getMenuIcon } from './iconMap'

const props = defineProps<{
  item: MenuItem
  collapsed: boolean
}>()

const route = useRoute()

const hasChildren = computed(() => !!props.item.children?.length)
const icon = computed(() => getMenuIcon(props.item.icon))
const isActive = computed(() => !hasChildren.value && route.path === props.item.path)
const isChildActive = computed(
  () => hasChildren.value && route.path.startsWith(props.item.path + '/'),
)

const open = ref(false)
// 路由变化时若命中本目录的子项则自动展开；用户手动收起不强制回弹（仅单向展开）
watch(
  () => route.path,
  () => {
    if (isChildActive.value) open.value = true
  },
  { immediate: true },
)
</script>
