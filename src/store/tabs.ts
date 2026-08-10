import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LocationQuery, RouteParams } from 'vue-router'
import { getRouteTitle } from '@/utils/routeTitle'

/**
 * 标签页（页签）状态管理。
 *
 * ⚠️ 注意：此 store 不直接操作 router，路由跳转由组件层处理，
 * 避免在 store 中引入 router，保持 store 的纯净性。
 *
 * 关键约定：
 * 1. 持久化用 pinia-plugin-persistedstate，storage key 即 store id 'tabs'。
 * 2. 首页判定统一走 HOME_PATH：'/' 只是 redirect 壳，首页实体是 '/index'；
 *    页签路径必须是实体路由，否则产生一个永远打不开的幻影首页页签。
 * 3. keepAlive 语义：路由表约定页面默认参与缓存、meta.keepAlive=false 显式关闭
 *    （见 router/index.ts 顶部注释），此处按同一约定取缺省 true。
 */

/** phoenix 首页实体路径（'/' 仅 redirect 到此） */
export const HOME_PATH = '/index'

/** addTab/updateTabFromRoute 接受的最小路由形状（RouteLocationNormalized 天然兼容） */
export interface RouteLike {
  path: string
  name?: string | symbol | null
  query?: LocationQuery
  params?: RouteParams
  meta?: {
    title?: string
    titleKey?: string
    keepAlive?: boolean
  }
}

/**
 * 页签项。keepAlive 快照自路由 meta，放在 meta 字段下——
 * AppMain 的 keep-alive include 直接消费它，避免页签栏与缓存策略两处各自读路由。
 */
export interface TabItem {
  path: string
  /** 路由 name，必须与页面组件 defineOptions name 一致（keep-alive include 按组件名匹配） */
  name: string
  title: string
  /**
   * 路由 meta.titleKey 快照（语言切换时 updateTabsTitle 重新翻译的依据）。
   * phoenix 当前路由表标题多为 meta.title 直写中文，titleKey 为将来多语言预留。
   */
  titleKey?: string
  /** 首页页签不可关闭 */
  closable: boolean
  query: LocationQuery
  params: RouteParams
  meta: {
    keepAlive: boolean
  }
}

export const useTabsStore = defineStore(
  'tabs',
  () => {
    // 标签页列表
    const tabs = ref<TabItem[]>([])

    // 当前激活的标签页路径
    const activeTab = ref('')

    // 刷新 key，用于触发组件重新渲染（AppMain 拼进组件 key）
    const refreshKey = ref(0)

    // 获取所有标签页
    const getTabs = computed(() => tabs.value)

    // 获取当前激活的标签页
    const getActiveTab = computed(() => activeTab.value)

    // 获取刷新 key
    const getRefreshKey = computed(() => refreshKey.value)

    /**
     * 添加标签页
     * @param route - 路由对象
     */
    function addTab(route: RouteLike) {
      if (!route || !route.path) return

      // 检查是否已存在相同路径的标签页
      const existingTab = tabs.value.find((tab) => tab.path === route.path)
      if (existingTab) {
        // 如果已存在，激活该标签页
        activeTab.value = route.path
        return
      }

      // 创建新标签页，使用 getRouteTitle 获取标题（meta.title 优先，其次 titleKey 翻译）
      const tab: TabItem = {
        path: route.path,
        name: String(route.name || route.path),
        title: getRouteTitle(route),
        titleKey: route.meta?.titleKey,
        closable: route.path !== HOME_PATH, // 首页不可关闭
        query: route.query || {},
        params: route.params || {},
        // 是否 keep-alive 缓存该页面（来自路由 meta；缺省缓存，见文件头约定 3）
        meta: { keepAlive: route.meta?.keepAlive !== false },
      }

      tabs.value.push(tab)
      activeTab.value = route.path
    }

    /**
     * 移除标签页
     * @param path - 标签页路径
     * @returns 返回需要导航到的路径信息 { path, shouldNavigate }
     */
    function removeTab(path: string): { path?: string; shouldNavigate: boolean } {
      const index = tabs.value.findIndex((tab) => tab.path === path)
      if (index === -1) return { shouldNavigate: false }

      let navigateTo: string | null = null

      // 如果移除的是当前激活的标签页，需要激活另一个标签页
      if (activeTab.value === path) {
        // 尝试激活前一个标签页，如果没有则激活后一个
        if (index > 0) {
          navigateTo = tabs.value[index - 1].path
        } else if (tabs.value.length > 1) {
          navigateTo = tabs.value[index + 1].path
        }
        activeTab.value = navigateTo || ''
      }

      tabs.value.splice(index, 1)

      // 如果移除后没有标签页了，返回首页路径
      if (tabs.value.length === 0) {
        return { path: HOME_PATH, shouldNavigate: true }
      }

      // 如果有新的激活标签页，返回该路径
      if (navigateTo) {
        return { path: navigateTo, shouldNavigate: true }
      }

      return { shouldNavigate: false }
    }

    /**
     * 设置激活的标签页
     * @param path - 标签页路径
     * @returns 是否找到对应标签页
     */
    function setActiveTab(path: string): boolean {
      const tab = tabs.value.find((t) => t.path === path)
      if (tab) {
        activeTab.value = path
        return true
      }
      return false
    }

    /**
     * 关闭其他标签页
     * @param path - 保留的标签页路径
     */
    function closeOtherTabs(path: string) {
      if (!path) return
      tabs.value = tabs.value.filter((tab) => tab.path === path || tab.path === HOME_PATH)
      activeTab.value = path
    }

    /**
     * 关闭所有标签页（首页保留）
     * @returns 返回需要导航到的路径信息 { path, shouldNavigate }
     */
    function closeAllTabs(): { path: string; shouldNavigate: boolean } {
      tabs.value = tabs.value.filter((tab) => tab.path === HOME_PATH)
      activeTab.value = HOME_PATH
      return { path: HOME_PATH, shouldNavigate: true }
    }

    // 刷新当前标签页（refreshKey 自增，AppMain 的组件 key 随之变化触发重挂载）
    function refreshTab() {
      refreshKey.value++
    }

    /**
     * 更新所有标签页的标题（语言切换时调用）。
     * addTab 时已快照 titleKey，直接拿快照重新翻译更不易错；
     * 无 titleKey 的页签（标题来自 meta.title 直写）保持原标题。
     */
    function updateTabsTitle() {
      tabs.value = tabs.value.map((tab) => {
        if (!tab.titleKey) return tab
        return {
          ...tab,
          title: getRouteTitle({ path: tab.path, name: tab.name, meta: { titleKey: tab.titleKey } }),
        }
      })
    }

    // 根据路由信息更新标签页（路由变化时由 TagsView 调用）
    function updateTabFromRoute(route: RouteLike) {
      if (!route.path) return

      // 检查是否已存在该标签页
      const existingTab = tabs.value.find((tab) => tab.path === route.path)
      if (!existingTab) {
        // 如果是首页，自动添加（保证首页页签始终存在）
        if (route.path === HOME_PATH) {
          addTab(route)
        }
        return
      }

      // 更新激活状态
      activeTab.value = route.path
    }

    // 初始化时添加首页（layout 挂载时调用；页签已持久化时为空操作）
    function init() {
      if (tabs.value.length === 0) {
        addTab({ path: HOME_PATH, name: 'Index', meta: { titleKey: 'menu.index' } })
      }
    }

    /**
     * 清空页签（登出时由 userStore.logout 调用）。
     * 页签与用户态同生命周期：换账号登录时绝不能残留上一账号的页签。
     */
    function reset() {
      tabs.value = []
      activeTab.value = ''
    }

    return {
      tabs,
      activeTab,
      getTabs,
      getActiveTab,
      getRefreshKey,
      addTab,
      removeTab,
      setActiveTab,
      closeOtherTabs,
      closeAllTabs,
      refreshTab,
      updateTabFromRoute,
      updateTabsTitle,
      init,
      reset,
    }
  },
  {
    // 页签持久化：刷新浏览器后页签栏不丢
    persist: {
      pick: ['tabs', 'activeTab'],
    },
  },
)
