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
    /** i18n 标题键（多语言切换时页签据此重新翻译，当前路由表多为直写 title） */
    titleKey?: string
    /** 外链地址（配合 InnerLink 容器以 iframe 内嵌展示） */
    link?: string
    /** 详情页等场景指定侧边栏高亮的菜单路径（当前未使用） */
    activeMenu?: string
    /** lucide 图标名（kebab-case），由 Sidebar/iconMap.ts 静态映射为组件 */
    icon?: string
    /** 访问该菜单所需权限标识；缺省视为无需权限 */
    perm?: string
    /** 是否参与 keep-alive 缓存；缺省 true，显式 false 才跳过 */
    keepAlive?: boolean
    /** 为 true 时访问后不生成 TagsView 页签 */
    noTagsView?: boolean
    /** 是否在菜单中显示；false 表示路由可访问但不在侧边栏展示 */
    showInMenu?: boolean
  }
}

export {}
