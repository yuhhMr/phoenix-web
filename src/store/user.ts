import { defineStore } from 'pinia'
import { ref } from 'vue'

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

    const logout = () => {
      token.value = null
      userInfo.value = null
    }

    return { token, userInfo, setToken, setUserInfo, logout }
  },
  {
    persist: true,
  },
)
