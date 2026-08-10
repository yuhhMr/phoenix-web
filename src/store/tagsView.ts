import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

/**
 * TagsView 页签项。keepAlive 快照自路由 meta——
 * AppMain 的 keep-alive include 直接消费它，避免页签栏与缓存策略两处各自读路由。
 */
export interface TagView {
  path: string
  /** 路由 name，必须与页面组件 defineOptions name 一致（keep-alive include 按组件名匹配） */
  name: string
  title: string
  keepAlive: boolean
}

export const useTagsViewStore = defineStore(
  'tagsView',
  () => {
    const visitedViews = ref<TagView[]>([])

    /** 路由进入时登记页签；幂等——同 path 只更新快照，不重复追加 */
    const addView = (route: RouteLocationNormalized) => {
      if (route.meta.noTagsView || !route.meta.title || !route.name) return
      const view: TagView = {
        path: route.path,
        name: String(route.name),
        title: route.meta.title,
        keepAlive: route.meta.keepAlive !== false,
      }
      const idx = visitedViews.value.findIndex((v) => v.path === view.path)
      if (idx >= 0) {
        visitedViews.value[idx] = view
      } else {
        visitedViews.value.push(view)
      }
    }

    const delView = (path: string) => {
      visitedViews.value = visitedViews.value.filter((v) => v.path !== path)
    }

    /** 只保留指定页签（"关闭其他"） */
    const delOthersViews = (path: string) => {
      visitedViews.value = visitedViews.value.filter((v) => v.path === path)
    }

    const reset = () => {
      visitedViews.value = []
    }

    return { visitedViews, addView, delView, delOthersViews, reset }
  },
  {
    // 页签持久化：刷新浏览器后页签栏不丢；登出时由 userStore.logout 统一 reset
    persist: true,
  },
)
