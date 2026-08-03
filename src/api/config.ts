import request from './request'
import type { PageRes } from '@/types/api'

export interface ConfigItem {
  configId: number
  configName: string
  configKey: string
  configValue: string
  valueType: string
  isSystem: number
  createdAt: string
}

export interface ConfigQuery {
  pageNum?: number
  pageSize?: number
  configName?: string
  configKey?: string
}

export const fetchConfigPage = (params: ConfigQuery): Promise<PageRes<ConfigItem>> =>
  request.get('/system/config/page', { params })

export const deleteConfig = (id: number): Promise<void> => request.delete(`/system/config/${id}`)
