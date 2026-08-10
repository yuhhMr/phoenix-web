<template>
  <div class="h-9 bg-surface border-b border-border flex items-center gap-1 px-2 overflow-x-auto shrink-0">
    <div
      v-for="tag in tagsViewStore.visitedViews"
      :key="tag.path"
      class="flex items-center gap-1 h-6 px-2 rounded border text-xs cursor-pointer select-none whitespace-nowrap transition-colors"
      :class="
        tag.path === route.path
          ? 'bg-primary text-surface border-primary'
          : 'text-text-secondary border-border hover:text-primary hover:border-primary'
      "
      @click="go(tag)"
      @contextmenu.prevent="openContextMenu($event, tag)"
    >
      <span>{{ tag.title }}</span>
      <!-- 当前页签不可关：关闭后无处落脚，且容易误触丢掉正在操作的页面 -->
      <button
        v-if="tag.path !== route.path"
        class="rounded-full p-0.5 hover:bg-black/10 transition-colors"
        @click.stop="closeTag(tag)"
      >
        <icon-lucide-x class="w-3 h-3" />
      </button>
    </div>
  </div>

  <!-- 右键菜单：teleport 到 body 避免 overflow-x-auto 裁剪 -->
  <Teleport to="body">
    <ul
      v-if="contextMenu.visible"
      :style="{ left: contextMenu.left + 'px', top: contextMenu.top + 'px' }"
      class="fixed z-50 py-1 min-w-28 bg-surface border border-border rounded-md shadow-lg text-sm"
    >
      <li
        class="px-3 py-1.5 transition-colors"
        :class="
          contextMenu.target?.path === route.path
            ? 'text-text-secondary/50 cursor-not-allowed'
            : 'text-text hover:bg-background cursor-pointer'
        "
        @click="closeFromMenu"
      >
        {{ t('tagsView.close') }}
      </li>
      <li
        class="px-3 py-1.5 transition-colors"
        :class="
          tagsViewStore.visitedViews.length <= 1
            ? 'text-text-secondary/50 cursor-not-allowed'
            : 'text-text hover:bg-background cursor-pointer'
        "
        @click="closeOthersFromMenu"
      >
        {{ t('tagsView.closeOthers') }}
      </li>
    </ul>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 页签栏（参照 Jarvis-web TagsView，逻辑裁剪到"关闭/关闭其他"两项）。
 * 页签数据在 store 持久化；组件只负责登记当前路由与交互。
 */
import { reactive, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTagsViewStore, type TagView } from '@/store/tagsView'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const tagsViewStore = useTagsViewStore()

// 路由变化即登记页签（store 内幂等）；immediate 覆盖首次进入/刷新场景
watch(
  () => route.path,
  () => tagsViewStore.addView(route),
  { immediate: true },
)

const go = (tag: TagView) => {
  if (tag.path !== route.path) router.push(tag.path)
}

// 被关的页签必然不是当前页（当前页没有关闭入口），无需处理导航
const closeTag = (tag: TagView) => {
  tagsViewStore.delView(tag.path)
}

const contextMenu = reactive<{ visible: boolean; left: number; top: number; target: TagView | null }>({
  visible: false,
  left: 0,
  top: 0,
  target: null,
})

const openContextMenu = (e: MouseEvent, tag: TagView) => {
  contextMenu.target = tag
  contextMenu.left = e.clientX
  contextMenu.top = e.clientY
  contextMenu.visible = true
}

const closeContextMenu = () => {
  contextMenu.visible = false
}

const closeFromMenu = () => {
  if (contextMenu.target && contextMenu.target.path !== route.path) {
    tagsViewStore.delView(contextMenu.target.path)
  }
  closeContextMenu()
}

// "关闭其他"以右键目标为保留对象；目标不是当前页时顺带跳过去
const closeOthersFromMenu = () => {
  if (contextMenu.target && tagsViewStore.visitedViews.length > 1) {
    tagsViewStore.delOthersViews(contextMenu.target.path)
    if (contextMenu.target.path !== route.path) {
      router.push(contextMenu.target.path)
    }
  }
  closeContextMenu()
}

onMounted(() => document.addEventListener('click', closeContextMenu))
onUnmounted(() => document.removeEventListener('click', closeContextMenu))
</script>
