import 'vue-router'

/**
 * 路由 meta 字段约定（与 src/router/index.ts 顶部注释一一对应）。
 * 集中在此声明，保证守卫、菜单、页签三处消费 meta 时类型一致。
 */
declare module 'vue-router' {
  interface RouteMeta {
    /** 免登录可访问（如 /login） */
    public?: boolean
    /** 菜单/面包屑/页签/document.title 共用的中文标题；无 title 的路由不进菜单和页签 */
    title?: string
    /** lucide 图标名（kebab-case），由 Sidebar/iconMap.ts 静态映射为组件 */
    icon?: string
    /** 访问该菜单所需权限标识；缺省视为无需权限 */
    perm?: string
    /** 是否参与 keep-alive 缓存；缺省 true，显式 false 才跳过 */
    keepAlive?: boolean
    /** 为 true 时访问后不生成 TagsView 页签 */
    noTagsView?: boolean
  }
}

export {}
