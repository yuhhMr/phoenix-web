import { createRouter, createWebHistory } from 'vue-router'
import { setupGuards } from './guards'
import { RouteNames, RoutePaths } from './constants'

// 路由表（静态）。
// 后端契约已冻结（docs/api/openapi-m2-frozen.json），无动态路由端点，
// 因此路由静态注册，菜单可见性由 meta.perm 前端过滤（router/utils.ts buildMenuTree）。
// 未来后端提供 /auth/routes 类端点时，可在 guards.ts 中动态 addRoute。
const routes = [
  {
    path: RoutePaths.Login,
    name: RouteNames.Login,
    component: () => import('@/views/login/index.vue'),
    meta: { public: true, titleKey: 'route.login' },
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: RoutePaths.Index,
    children: [
      {
        path: 'index',
        name: RouteNames.Index,
        component: () => import('@/views/index.vue'),
        meta: { titleKey: 'route.index', icon: 'layout-dashboard' },
      },
      {
        path: 'monitor',
        name: RouteNames.Monitor,
        redirect: '/monitor/online',
        meta: { titleKey: 'route.monitor', icon: 'monitor' },
        children: [
          {
            path: 'online',
            name: RouteNames.Online,
            component: () => import('@/views/monitor/online/index.vue'),
            meta: { titleKey: 'route.online', icon: 'users', perm: 'monitor:online:list' },
          },
          {
            path: 'job',
            name: RouteNames.Job,
            component: () => import('@/views/monitor/job/index.vue'),
            meta: { titleKey: 'route.job', icon: 'clock', perm: 'monitor:job:list' },
          },
          // TODO: 任务日志页待补齐
          // {
          //   path: 'job/log',
          //   name: RouteNames.JobLog,
          //   component: () => import('@/views/monitor/job/log.vue'),
          //   meta: { titleKey: 'route.jobLog', noTagsView: false },
          // },
          {
            path: 'log',
            name: RouteNames.Log,
            component: () => import('@/views/monitor/log/index.vue'),
            meta: { titleKey: 'route.log', icon: 'file-text', perm: 'log:list' },
          },
        ],
      },
      {
        path: 'system',
        name: RouteNames.System,
        redirect: '/system/user',
        meta: { titleKey: 'route.system', icon: 'settings' },
        children: [
          {
            path: 'user',
            name: RouteNames.User,
            component: () => import('@/views/system/user/index.vue'),
            meta: { titleKey: 'route.user', icon: 'user', perm: 'system:user:list' },
          },
          // TODO: 个人中心页待补齐
          // {
          //   path: 'user/profile',
          //   name: RouteNames.Profile,
          //   component: () => import('@/views/system/user/profile.vue'),
          //   meta: { titleKey: 'route.profile', noTagsView: false },
          // },
          {
            path: 'role',
            name: RouteNames.Role,
            component: () => import('@/views/system/role/index.vue'),
            meta: { titleKey: 'route.role', icon: 'shield', perm: 'system:role:list' },
          },
          {
            path: 'menu',
            name: RouteNames.SystemMenu,
            component: () => import('@/views/system/menu/index.vue'),
            meta: { titleKey: 'route.menu', icon: 'menu', perm: 'system:menu:list' },
          },
          {
            path: 'org',
            name: RouteNames.Org,
            component: () => import('@/views/system/org/index.vue'),
            meta: { titleKey: 'route.org', icon: 'building-2', perm: 'system:org:list' },
          },
          {
            path: 'dict',
            name: RouteNames.Dict,
            component: () => import('@/views/system/dict/index.vue'),
            meta: { titleKey: 'route.dict', icon: 'book-open', perm: 'system:dict:list' },
          },
          {
            path: 'config',
            name: RouteNames.Config,
            component: () => import('@/views/system/config/index.vue'),
            meta: { titleKey: 'route.config', icon: 'sliders-horizontal', perm: 'system:config:list' },
          },
          {
            path: 'notice',
            name: RouteNames.Notice,
            component: () => import('@/views/system/notice/index.vue'),
            meta: { titleKey: 'route.notice', icon: 'bell', perm: 'system:notice:list' },
          },
        ],
      },
    ],
  },
  {
    path: RoutePaths.Forbidden,
    name: RouteNames.Forbidden,
    component: () => import('@/views/error/Forbidden.vue'),
    meta: { titleKey: 'route.forbidden', noTagsView: true, keepAlive: false },
  },
  {
    path: '/:pathMatch(.*)*',
    name: RouteNames.NotFound,
    component: () => import('@/views/error/NotFound.vue'),
    meta: { titleKey: 'route.notFound', noTagsView: true, keepAlive: false },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // 不自动滚动到顶部，由页面自行控制滚动行为
  scrollBehavior: () => false,
})

setupGuards(router)

export default router
export { routes, RouteNames, RoutePaths }
