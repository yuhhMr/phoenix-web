import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

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
          path: 'system',
          name: 'System',
          redirect: '/system/user',
          meta: { title: '系统管理', icon: 'settings' },
          children: [
            {
              path: 'user',
              name: 'User',
              component: () => import('@/views/system/user/index.vue'),
              meta: { title: '用户管理', perm: 'system:user:list' },
            },
            {
              path: 'role',
              name: 'Role',
              component: () => import('@/views/system/role/index.vue'),
              meta: { title: '角色管理', perm: 'system:role:list' },
            },
            {
              path: 'menu',
              name: 'Menu',
              component: () => import('@/views/system/menu/index.vue'),
              meta: { title: '菜单管理', perm: 'system:menu:list' },
            },
            {
              path: 'org',
              name: 'Org',
              component: () => import('@/views/system/org/index.vue'),
              meta: { title: '组织管理', perm: 'system:org:list' },
            },
            {
              path: 'dict',
              name: 'Dict',
              component: () => import('@/views/system/dict/index.vue'),
              meta: { title: '字典管理', perm: 'system:dict:list' },
            },
            {
              path: 'config',
              name: 'Config',
              component: () => import('@/views/system/config/index.vue'),
              meta: { title: '参数设置', perm: 'system:config:list' },
            },
          ],
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login',
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  if (!to.meta.public && !userStore.token) {
    next('/login')
  } else {
    next()
  }
})

export default router
