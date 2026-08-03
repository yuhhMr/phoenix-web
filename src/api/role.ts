import request from './request'
import type { PageRes } from '@/types/api'

export interface RoleItem {
  roleId: number
  roleName: string
  roleCode: string
  dataScope: number
  status: string
  createdAt: string
}

export interface RolePageQuery {
  pageNum?: number
  pageSize?: number
  roleName?: string
  status?: string
}

export const fetchRolePage = (params: RolePageQuery): Promise<PageRes<RoleItem>> =>
  request.get('/system/role', { params })

export const deleteRole = (id: number): Promise<void> => request.delete(`/system/role/${id}`)
