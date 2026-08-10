import i18n from '@/locales'

/**
 * 路由标题解析。
 * 直接用 i18n 实例的 global.t 翻译（不经组合式 hook，store 等组件外场景同样可用）。
 *
 * 优先级：meta.title（直写标题）→ meta.titleKey（i18n 翻译）→ 路由 name → 兜底文案。
 */

/** 接受的最小路由形状（RouteLocationNormalized / RouteRecordRaw / 页签快照均兼容） */
export interface RouteTitleSource {
  path?: string
  name?: string | symbol | null
  meta?: {
    title?: string
    titleKey?: string
    displayTitle?: string
  }
}

/**
 * 获取路由的显示标题
 * @param route - 路由对象
 * @returns 路由标题
 */
export function getRouteTitle(route: RouteTitleSource | null | undefined): string {
  const t = i18n.global.t
  if (!route || !route.meta) {
    return t('route.unknown')
  }

  // 优先使用直写的 title
  if (route.meta.title) {
    return route.meta.title
  }

  // 其次使用 titleKey 进行国际化翻译
  if (route.meta.titleKey) {
    const translated = t(route.meta.titleKey)
    // 如果翻译结果不是 key 本身，返回翻译结果
    if (translated !== route.meta.titleKey) {
      return translated
    }
  }

  // 最后使用路由名称
  return route.name ? String(route.name) : t('route.unknown')
}

/**
 * 为路由对象添加 displayTitle 属性
 * @param route - 路由对象
 * @returns 添加了 displayTitle 的路由对象
 */
export function addDisplayTitle<T extends RouteTitleSource>(route: T): T {
  if (route && route.meta) {
    route.meta.displayTitle = getRouteTitle(route)
  }
  return route
}
