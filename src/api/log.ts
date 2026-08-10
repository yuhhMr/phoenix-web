import request from './request'
import type { PageRes } from '@/types/api'

export interface LogItem {
  logId: number
  logType: string
  username: string
  module: string
  action: string
  requestMethod: string
  requestUrl: string
  ip: string
  ipRegion: string
  status: string
  costMs: number
  createdAt: string
}

export interface LogQuery {
  pageNum?: number
  pageSize?: number
  logType?: string
  username?: string
  status?: string
  startTime?: string
  endTime?: string
}

export const fetchLogPage = (params: LogQuery): Promise<PageRes<LogItem>> => request.get('/log/page', { params })
