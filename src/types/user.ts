/**
 * 用户/登录相关类型定义。
 *
 * 本文件解决什么问题：
 * - 替代 store/user.ts 中 `userInfo: any` 的粗糙类型；
 * - 统一登录接口、用户信息、权限相关字段的形状，
 *   让 router/guards、Navbar、request 拦截器等消费点都有类型提示。
 */

/** 登录请求参数 */
export interface LoginReq {
  username: string
  password: string
  captcha: string
  uuid: string
}

/** 登录成功响应（token + 用户概览） */
export interface LoginRes {
  token: string
  userId: number
  username: string
  nickname: string
  avatar?: string
}

/** 登录后获取的完整用户信息 */
export interface LoginInfoRes {
  userId: number
  username: string
  nickname: string
  avatar?: string
  /** 权限标识数组，例如 ['system:user:list', 'system:user:add'] */
  perms: string[]
  /** 角色标识数组 */
  roles: string[]
  /** 数据权限范围（如需） */
  dataScope?: string
}
