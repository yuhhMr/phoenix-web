import request from './request'
import type { PageRes } from '@/types/api'

export interface NoticeItem {
  noticeId: number
  noticeType: string
  title: string
  content?: string
  priority: number
  publishScope: string
  publishStatus: string
  publishTarget?: number[]
  publishTime?: string
  publisherId?: number
  expireTime?: string
  remark?: string
  createdAt: string
}

export interface NoticeQuery {
  pageNum?: number
  pageSize?: number
  title?: string
  noticeType?: string
  publishStatus?: string
}

export const fetchNoticePage = (params: NoticeQuery): Promise<PageRes<NoticeItem>> =>
  request.get('/system/notice/page', { params })

export const createNotice = (data: Partial<NoticeItem>): Promise<number> =>
  request.post('/system/notice', data)

export const updateNotice = (data: Partial<NoticeItem>): Promise<void> =>
  request.put('/system/notice', data)

export const deleteNotice = (id: number): Promise<void> => request.delete(`/system/notice/${id}`)

export const publishNotice = (id: number): Promise<void> => request.post(`/system/notice/${id}/publish`)

export const offlineNotice = (id: number): Promise<void> => request.post(`/system/notice/${id}/offline`)
