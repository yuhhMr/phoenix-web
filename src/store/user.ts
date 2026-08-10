import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usePermissionStore } from './permission'
import { useTagsViewStore } from './tagsView'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref<string | null>(null)
    const userInfo = ref<any>(null)

    const setToken = (t: string) => {
      token.value = t
    }

    const setUserInfo = (info: any) => {
      userInfo.value = info
    }

    /**
     * 会话级状态的统一回收口：Navbar 退出登录、request.ts 的 401 强制回跳
     * 都汇聚到这里，因此 permission/tagsView 的清空放在这一层联动，
     * 而不是散落在各调用点——permission 与 tagsView 和用户态同生命周期，
     * 换一个账号登录时绝不能残留上一个账号的权限与页签。
     */
    const logout = () => {
      token.value = null
      userInfo.value = null
      usePermissionStore().reset()
      useTagsViewStore().reset()
    }

    return { token, userInfo, setToken, setUserInfo, logout }
  },
  {
    persist: true,
  },
)
