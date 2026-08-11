import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { LoginInfoRes } from '@/api/auth'
import { usePermissionStore } from './permission'
import { useTabsStore } from './tabs'

// 用户会话状态管理（token、用户信息、权限快捷判断）
export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref<string | null>(null)
    const userInfo = ref<LoginInfoRes | null>(null)

    const setToken = (t: string) => {
      token.value = t
    }

    const setUserInfo = (info: LoginInfoRes) => {
      userInfo.value = info
    }

    // 是否已登录
    const isAuthenticated = computed(() => !!token.value)

    // 当前用户权限标识列表
    const perms = computed(() => userInfo.value?.perms ?? [])

    // 是否为超级管理员
    const isRoot = computed(() => userInfo.value?.root === true)

    // 会话级状态统一回收：Navbar 退出、request 401 回跳都汇聚到这里
    const logout = () => {
      token.value = null
      userInfo.value = null
      usePermissionStore().reset()
      useTabsStore().reset()
    }

    return {
      token,
      userInfo,
      setToken,
      setUserInfo,
      logout,
      isAuthenticated,
      perms,
      isRoot,
    }
  },
  {
    persist: true,
  },
)
