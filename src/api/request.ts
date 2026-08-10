import axios from 'axios'
import { useUserStore } from '@/store/user'
import router from '@/router'

/**
 * 统一请求封装。
 * <p>
 * 实现上必须遵守后端契约（docs/api/openapi-m2-frozen.json）的两个关键点：
 * 1. 认证失败是 HTTP 200 + body code=401（过滤器层与全局异常处理器同契约），
 *    不是 HTTP 状态码——必须按 body code 判定并回收登录态；
 * 2. JWT 过期但会话存活时，后端放行并在 X-Refreshed-Token 响应头回发新 JWT
 *    （FAST 5.1 滑动续期），前端收到即替换本地 token，用户无感续期。
 * </p>
 */
const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

request.interceptors.request.use((config) => {
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`
  }
  return config
})

/** 登录态回收：清 store + 带当前路径回跳登录页 */
const forceReLogin = () => {
  const userStore = useUserStore()
  userStore.logout()
  const current = router.currentRoute.value
  if (current.path !== '/login') {
    router.push({ path: '/login', query: { redirect: current.fullPath } })
  }
}

request.interceptors.response.use(
  (res) => {
    // 滑动续期：后端在响应头回发的新 JWT，静默替换
    const refreshedToken = res.headers['x-refreshed-token']
    if (refreshedToken) {
      useUserStore().setToken(refreshedToken)
    }

    const data = res.data
    if (data.code === 401) {
      forceReLogin()
      return Promise.reject(new Error(data.msg || '登录已失效'))
    }
    if (data.code !== 200) {
      return Promise.reject(new Error(data.msg || '请求失败'))
    }
    return data.data
  },
  (err) => {
    if (err.response?.status === 401) {
      forceReLogin()
    }
    return Promise.reject(err)
  },
)

export default request
