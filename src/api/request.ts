import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { useUserStore } from '@/store/user'
import router from '@/router'
import { errorMessage } from '@/utils/message'
import { downloadBlob, extractFilename } from '@/utils/download'

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

/** 业务错误默认 toast 提示；config.silent 为 true 时关闭 */
function notifyError(err: unknown, config?: AxiosRequestConfig) {
  if ((config as { silent?: boolean } | undefined)?.silent) return
  const msg = err instanceof Error ? err.message : '请求失败'
  errorMessage(msg)
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
      const error = new Error(data.msg || '请求失败')
      notifyError(error, res.config)
      return Promise.reject(error)
    }
    return data.data
  },
  (err) => {
    if (err.response?.status === 401) {
      forceReLogin()
    }
    notifyError(err, err.config)
    return Promise.reject(err)
  },
)

/**
 * 文件导出 / 下载。
 * @param url - 后端导出地址
 * @param params - 查询参数
 * @param filename - 默认文件名（后端返回 Content-Disposition 时优先使用后端名称）
 */
export async function download(url: string, params?: Record<string, unknown>, filename = 'download'): Promise<void> {
  const res: AxiosResponse<Blob> = await request.get(url, {
    params,
    responseType: 'blob',
  })
  const finalName = extractFilename(res.headers['content-disposition'], filename)
  downloadBlob(res.data, finalName)
}

/**
 * 文件上传（multipart/form-data）。
 * @param url - 上传地址
 * @param file - 文件对象
 * @param fieldName - 表单字段名，默认 file
 * @param onProgress - 上传进度回调
 */
export function upload<T = unknown>(
  url: string,
  file: File,
  fieldName = 'file',
  onProgress?: (percent: number) => void,
): Promise<T> {
  const formData = new FormData()
  formData.append(fieldName, file)
  return request.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (event.total && onProgress) {
        onProgress(Math.round((event.loaded * 100) / event.total))
      }
    },
  }) as Promise<T>
}

export default request
