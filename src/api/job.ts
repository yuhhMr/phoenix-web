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
  remark?: string
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

export const createJob = (data: Partial<JobItem>): Promise<number> => request.post('/monitor/job', data)

export const updateJob = (data: Partial<JobItem>): Promise<void> => request.put('/monitor/job', data)

export const deleteJob = (id: number): Promise<void> => request.delete(`/monitor/job/${id}`)

export const changeJobStatus = (id: number, status: string): Promise<void> =>
  request.put(`/monitor/job/${id}/status/${status}`)

export const runJobOnce = (id: number): Promise<void> => request.post(`/monitor/job/${id}/run`)
