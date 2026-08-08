import request from './request'

export interface CaptchaRes {
  uuid: string
  img: string
}

export interface LoginReq {
  username: string
  password: string
  code: string
  uuid: string
}

export interface LoginRes {
  token: string
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
