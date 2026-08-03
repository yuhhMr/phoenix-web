import request from './request'
import type { PageRes } from '@/types/api'

export interface JobItem {
  jobId: number
  jobName: string
  beanName: string
  methodName: string
  params?: string
  cron: string
  status: string
  createdAt: string
}

export interface JobQuery {
  pageNum?: number
  pageSize?: number
  jobName?: string
  status?: string
}

export const fetchJobPage = (params: JobQuery): Promise<PageRes<JobItem>> =>
  request.get('/monitor/job/page', { params })

export const deleteJob = (id: number): Promise<void> => request.delete(`/monitor/job/${id}`)
