import request from './request'
import type { PageRes } from '@/types/api'

export interface NoticeItem {
  noticeId: number
  noticeType: string
  title: string
  priority: number
  publishScope: string
  publishStatus: string
  publishTime?: string
  publisherId?: number
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

export const deleteNotice = (id: number): Promise<void> => request.delete(`/system/notice/${id}`)
