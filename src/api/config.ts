import request from './request'
import type { PageRes } from '@/types/api'

export interface ConfigItem {
  configId: number
  configName: string
  configKey: string
  configValue: string
  valueType: string
  isSystem: number
  remark?: string
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

export const createConfig = (data: Partial<ConfigItem>): Promise<number> => request.post('/system/config', data)

export const updateConfig = (data: Partial<ConfigItem> & { configId: number }): Promise<void> =>
  request.put('/system/config', data)

export const deleteConfig = (id: number): Promise<void> => request.delete(`/system/config/${id}`)
