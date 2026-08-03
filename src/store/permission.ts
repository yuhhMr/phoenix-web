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

    return { perms, setPerms, hasPerm }
  },
  {
    persist: true,
  },
)
