/// <reference types="vite/client" />

/** 项目环境变量类型声明（与 .env 系列文件对应） */
interface ImportMetaEnv {
  /** 浏览器标签页标题 */
  readonly VITE_APP_TITLE: string
  /** 后端 API 地址（dev 代理 target / prod 同源路径） */
  readonly VITE_APP_BASE_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
