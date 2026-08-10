<template>
  <div class="h-9 bg-surface border-b border-border shadow-sm shrink-0">
    <div class="flex items-center h-full px-1 py-0.5 gap-1 overflow-x-auto whitespace-nowrap">
      <div
        v-for="tab in tabs"
        :key="tab.path"
        class="inline-flex items-center h-[26px] px-2 text-xs border rounded-md cursor-pointer select-none transition-colors"
        :class="
          activeTab === tab.path
            ? 'bg-primary text-surface border-primary'
            : 'text-text-secondary border-border bg-surface hover:text-primary hover:border-primary'
        "
        @click="handleTabClick(tab)"
        @contextmenu.prevent="handleContextMenu($event, tab)"
      >
        <span class="mr-1">{{ tab.title }}</span>
        <component
          :is="IconX"
          v-if="tab.closable"
          class="w-3.5 h-3.5 rounded-full opacity-70 hover:opacity-100"
          :class="activeTab === tab.path ? 'hover:bg-white/25' : 'hover:bg-black/10'"
          @click.stop="handleTabRemove(tab.path)"
        />
      </div>
    </div>
  </div>

  <!-- 右键菜单：teleport 到 body 避免页签栏 overflow 裁剪 -->
  <Teleport to="body">
    <ul
      v-show="contextMenu.visible"
      :style="contextMenu.style"
      class="fixed z-[3000] py-1 list-none bg-surface border border-border rounded-md shadow-lg text-[13px]"
    >
      <li :class="menuItemClass(false)" @click="handleCommand('refresh')">
        <component :is="IconRefresh" class="w-3.5 h-3.5 mr-2" />{{ t('tabs.refresh') }}
      </li>
      <li :class="menuItemClass(tabs.length <= 1)" @click="handleCommand('closeOther')">
        <component :is="IconCloseOther" class="w-3.5 h-3.5 mr-2" />{{ t('tabs.closeOther') }}
      </li>
      <li :class="menuItemClass(tabs.length <= 1)" @click="handleCommand('closeAll')">
        <component :is="IconCloseAll" class="w-3.5 h-3.5 mr-2" />{{ t('tabs.closeAll') }}
      </li>
      <li :class="menuItemClass(!hasLeftTabs)" @click="handleCommand('closeLeft')">
        <component :is="IconCloseLeft" class="w-3.5 h-3.5 mr-2" />{{ t('tabs.closeLeft') }}
      </li>
      <li :class="menuItemClass(!hasRightTabs)" @click="handleCommand('closeRight')">
        <component :is="IconCloseRight" class="w-3.5 h-3.5 mr-2" />{{ t('tabs.closeRight') }}
      </li>
    </ul>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 页签栏。
 * 右键菜单五项：刷新当前页/关闭其他/关闭全部/关闭左侧/关闭右侧，
 * 单个关闭由页签上的 × 承担。
 *
 * 样式为原生滚动容器 + lucide 图标 + Tailwind 令牌。一个交互细节：
 * hasLeftTabs/hasRightTabs 按"当前激活页"而非"右键目标页"计算禁用态，
 * 有意保留该行为。
 */
import { computed, watch, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTabsStore, type TabItem } from '@/store/tabs'
import IconX from '~icons/lucide/x'
import IconRefresh from '~icons/lucide/rotate-cw'
import IconCloseOther from '~icons/lucide/circle-x'
import IconCloseAll from '~icons/lucide/folder-x'
import IconCloseLeft from '~icons/lucide/arrow-left'
import IconCloseRight from '~icons/lucide/arrow-right'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const tabsStore = useTabsStore()

// 计算属性
const tabs = computed(() => tabsStore.getTabs)
const activeTab = computed({
  get: () => tabsStore.getActiveTab,
  set: (val: string) => tabsStore.setActiveTab(val),
})

// 右键菜单项样式（函数式生成：禁用态直接不带 hover 类，避免同级 specificity 覆盖问题）
function menuItemClass(disabled: boolean) {
  return [
    'flex items-center px-4 py-1.5 transition-colors',
    disabled ? 'text-text-secondary/50 cursor-not-allowed' : 'text-text cursor-pointer hover:bg-background',
  ]
}

// 计算是否有左侧/右侧标签页（基于当前激活页计算）
const hasLeftTabs = computed(() => {
  if (!activeTab.value || tabs.value.length <= 1) return false
  const currentIndex = tabs.value.findIndex((tab) => tab.path === activeTab.value)
  return currentIndex > 0
})

const hasRightTabs = computed(() => {
  if (!activeTab.value || tabs.value.length <= 1) return false
  const currentIndex = tabs.value.findIndex((tab) => tab.path === activeTab.value)
  return currentIndex < tabs.value.length - 1
})

// 右键菜单
const contextMenu = ref<{
  visible: boolean
  style: { left: string; top: string }
  currentTab: TabItem | null
}>({
  visible: false,
  style: { left: '0px', top: '0px' },
  currentTab: null,
})

// 监听路由变化，更新标签页（immediate 覆盖首次进入/刷新场景）
watch(
  () => route.path,
  () => {
    tabsStore.updateTabFromRoute(route)
  },
  { immediate: true },
)

// 标签页点击事件
function handleTabClick(tab: TabItem) {
  const path = tab.path
  tabsStore.setActiveTab(path)
  router.push(path)
}

// 右键菜单事件
function handleContextMenu(e: MouseEvent, tab: TabItem) {
  contextMenu.value.currentTab = tab
  contextMenu.value.style = {
    left: e.clientX + 'px',
    top: e.clientY + 'px',
  }
  contextMenu.value.visible = true
}

// 关闭右键菜单
function closeContextMenu() {
  contextMenu.value.visible = false
}

// 点击外部关闭右键菜单
onMounted(() => {
  document.addEventListener('click', closeContextMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeContextMenu)
})

// 标签页关闭事件
function handleTabRemove(path: string) {
  const result = tabsStore.removeTab(path)
  // 如果需要导航，由组件层处理路由跳转
  if (result.shouldNavigate && result.path) {
    router.push(result.path)
  }
}

// 关闭左侧标签页（保留首页和当前页及右侧的标签页）
function closeLeftTabs(currentPath: string) {
  const currentIndex = tabs.value.findIndex((tab) => tab.path === currentPath)
  if (currentIndex <= 0) return

  tabsStore.tabs = tabs.value.filter((tab, index) => {
    return index >= currentIndex || !tab.closable
  })
}

// 关闭右侧标签页（保留首页和当前页及左侧的标签页）
function closeRightTabs(currentPath: string) {
  const currentIndex = tabs.value.findIndex((tab) => tab.path === currentPath)
  if (currentIndex >= tabs.value.length - 1) return

  tabsStore.tabs = tabs.value.filter((tab, index) => {
    return index <= currentIndex || !tab.closable
  })
}

// 右键菜单命令处理
function handleCommand(command: string) {
  const currentPath = contextMenu.value.currentTab?.path || activeTab.value

  switch (command) {
    case 'refresh':
      // 刷新当前页（重新加载组件）
      tabsStore.refreshTab()
      break
    case 'closeOther':
      if (tabs.value.length > 1) {
        tabsStore.closeOtherTabs(currentPath)
      }
      break
    case 'closeAll':
      if (tabs.value.length > 1) {
        const result = tabsStore.closeAllTabs()
        if (result.shouldNavigate && result.path) {
          router.push(result.path)
        }
      }
      break
    case 'closeLeft':
      closeLeftTabs(currentPath)
      break
    case 'closeRight':
      closeRightTabs(currentPath)
      break
  }
  closeContextMenu()
}
</script>
