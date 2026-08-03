import request from './request'
import type { PageRes } from '@/types/api'

export interface OnlineUserItem {
  jti: string
  username: string
  nickname: string
  loginIp: string
  loginLocation: string
  loginTime: string
}

export interface OnlineQuery {
  pageNum?: number
  pageSize?: number
  username?: string
}

export const fetchOnlinePage = (params: OnlineQuery): Promise<PageRes<OnlineUserItem>> =>
  request.get('/monitor/online/page', { params })

export const kickOnlineUser = (jti: string): Promise<void> => request.delete(`/monitor/online/${jti}`)
