import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePermissionStore = defineStore(
  'permission',
  () => {
    const perms = ref<string[]>([])

    const setPerms = (list: string[]) => {
      perms.value = list
    }

    const hasPerm = (perm: string | undefined) => {
      if (!perm) return true
      return perms.value.includes(perm) || perms.value.includes('*:*:*')
    }

    /** 登出时由 userStore.logout 调用，避免各退出入口各自记得清理 */
    const reset = () => {
      perms.value = []
    }

    return { perms, setPerms, hasPerm, reset }
  },
  {
    persist: true,
  },
)
