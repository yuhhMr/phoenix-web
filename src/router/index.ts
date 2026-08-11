import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'
import { setupGuards } from './guards'
import { RouteNames, RoutePaths } from './constants'

// 静态路由表：仅保留登录页、布局壳、403、404。
// 业务路由由后端 /system/menu/tree 驱动，登录后通过 permission store 动态 addRoute。
const routes: RouteRecordRaw[] = [
  {
    path: RoutePaths.Login,
    name: RouteNames.Login,
    component: () => import('@/views/login/index.vue'),
    meta: { public: true, titleKey: 'route.login' },
  },
  {
    path: '/',
    component: Layout,
    redirect: RoutePaths.Index,
    children: [],
    meta: { titleKey: 'route.index' },
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
  scrollBehavior: () => false,
})

setupGuards(router)

export default router
export { routes, RouteNames, RoutePaths }
