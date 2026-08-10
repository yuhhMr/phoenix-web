import request from './request'

export interface CaptchaRes {
  uuid: string
  img: string
}

/** 与后端 LoginRequest 对齐：captchaCode/captchaUuid 不可改名（契约冻结，docs/api/openapi-m2-frozen.json） */
export interface LoginReq {
  username: string
  password: string
  captchaCode: string
  captchaUuid: string
  deviceId: string
}

export interface LoginRes {
  token: string
  tokenType: string
  expiresIn: number
}

export interface LoginInfoRes {
  userId: number
  username: string
  nickname: string
  root: boolean
  perms: string[]
}

export const getCaptcha = (): Promise<CaptchaRes> => request.get('/auth/captcha')

export const getPublicKey = (): Promise<{ publicKey: string }> => request.get('/auth/public-key')

export const login = (data: LoginReq): Promise<LoginRes> => request.post('/auth/login', data)

export const getLoginInfo = (): Promise<LoginInfoRes> => request.get('/auth/info')
