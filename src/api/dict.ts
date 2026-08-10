import request from './request'
import type { PageRes } from '@/types/api'

export interface DictTypeItem {
  dictTypeId: number
  dictName: string
  dictType: string
  status: string
  createdAt: string
}

export interface DictTypeQuery {
  pageNum?: number
  pageSize?: number
  dictName?: string
  status?: string
}

export const fetchDictTypePage = (params: DictTypeQuery): Promise<PageRes<DictTypeItem>> =>
  request.get('/system/dict/type/page', { params })

export const createDictType = (data: Partial<DictTypeItem>): Promise<number> => request.post('/system/dict/type', data)

export const updateDictType = (data: Partial<DictTypeItem> & { dictTypeId: number }): Promise<void> =>
  request.put('/system/dict/type', data)

export const deleteDictType = (id: number): Promise<void> => request.delete(`/system/dict/type/${id}`)
