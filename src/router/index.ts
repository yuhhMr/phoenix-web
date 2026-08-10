import { createRouter, createWebHistory } from 'vue-router'
import { setupGuards } from './guards'

/**
 * 路由表（静态）。
 *
 * ── meta 字段约定（类型见 src/types/router.d.ts）──
 * - public:     免登录（/login）
 * - title:      菜单 / 面包屑 / TagsView 页签 / document.title 共用的中文标题
 * - icon:       lucide 图标名（kebab-case），Sidebar/iconMap.ts 静态映射
 * - perm:       菜单可见权限标识，Sidebar 经 permissionStore.hasPerm 过滤
 * - keepAlive:  缺省 true，显式 false 则该页不进 keep-alive 缓存
 * - noTagsView: 为 true 时不生成 TagsView 页签（如 404）
 *
 * ── 为什么不做后端动态路由 ──
 * 后端契约已冻结（docs/api/openapi-m2-frozen.json），其中没有 Jarvis 的
 * listRouters 类端点，拿不到服务端菜单树。因此路由静态注册，
 * 菜单按 meta.perm 前端过滤（router/utils.ts buildMenuTree）。
 * 扩展点：未来后端提供 /auth/routes 类端点时，在 guards.ts 的 token
 * 校验通过后动态 addRoute，本表退化为登录/404 等公共路由。
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index.vue'),
          meta: { title: '首页', icon: 'layout-dashboard' },
        },
        {
          path: 'monitor',
          name: 'Monitor',
          redirect: '/monitor/online',
          meta: { title: '监控运维', icon: 'monitor' },
          children: [
            {
              path: 'online',
              name: 'Online',
              component: () => import('@/views/monitor/online/index.vue'),
              meta: { title: '在线用户', icon: 'users', perm: 'monitor:online:list' },
            },
            {
              path: 'job',
              name: 'Job',
              component: () => import('@/views/monitor/job/index.vue'),
              meta: { title: '定时任务', icon: 'clock', perm: 'monitor:job:list' },
            },
            {
              path: 'log',
              name: 'Log',
              component: () => import('@/views/monitor/log/index.vue'),
              meta: { title: '日志管理', icon: 'file-text', perm: 'log:list' },
            },
          ],
        },
        {
          path: 'system',
          name: 'System',
          redirect: '/system/user',
          meta: { title: '系统管理', icon: 'settings' },
          children: [
            {
              path: 'user',
              name: 'User',
              component: () => import('@/views/system/user/index.vue'),
              meta: { title: '用户管理', icon: 'user', perm: 'system:user:list' },
            },
            {
              path: 'role',
              name: 'Role',
              component: () => import('@/views/system/role/index.vue'),
              meta: { title: '角色管理', icon: 'shield', perm: 'system:role:list' },
            },
            {
              path: 'menu',
              name: 'Menu',
              component: () => import('@/views/system/menu/index.vue'),
              meta: { title: '菜单管理', icon: 'menu', perm: 'system:menu:list' },
            },
            {
              path: 'org',
              name: 'Org',
              component: () => import('@/views/system/org/index.vue'),
              meta: { title: '组织管理', icon: 'building-2', perm: 'system:org:list' },
            },
            {
              path: 'dict',
              name: 'Dict',
              component: () => import('@/views/system/dict/index.vue'),
              meta: { title: '字典管理', icon: 'book-open', perm: 'system:dict:list' },
            },
            {
              path: 'config',
              name: 'Config',
              component: () => import('@/views/system/config/index.vue'),
              meta: { title: '参数设置', icon: 'sliders-horizontal', perm: 'system:config:list' },
            },
            {
              path: 'notice',
              name: 'Notice',
              component: () => import('@/views/system/notice/index.vue'),
              meta: { title: '消息中心', icon: 'bell', perm: 'system:notice:list' },
            },
          ],
        },
      ],
    },
    {
      // 已登录访问不存在路径 → 404 页；无 token 时守卫已先一步挡到 /login
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/error/NotFound.vue'),
      meta: { title: '404', noTagsView: true, keepAlive: false },
    },
  ],
})

setupGuards(router)

export default router
