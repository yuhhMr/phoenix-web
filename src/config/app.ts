/**
 * 应用级站点配置。取值的唯一事实源是环境变量文件（.env / .env.development / .env.production），
 * 本模块只做代码侧的读取收口与默认值兜底。
 */
export const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'phoenix'
