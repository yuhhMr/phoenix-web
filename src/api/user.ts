import request from './request'
import type { PageQuery, PageRes } from '@/types/api'

export interface UserItem {
  userId: number
  username: string
  nickname: string
  email?: string
  phone?: string
  status: string
  orgId?: number
  createdAt: string
}

export interface UserPageQuery extends PageQuery {
  username?: string
  nickname?: string
  status?: string
}

export const fetchUserPage = (params: UserPageQuery): Promise<PageRes<UserItem>> =>
  request.get('/system/user', { params })

export const fetchUserDetail = (id: number): Promise<UserItem> => request.get(`/system/user/${id}`)

export const createUser = (data: Partial<UserItem> & { password: string }): Promise<number> =>
  request.post('/system/user', data)

export const updateUser = (data: Partial<UserItem> & { userId: number }): Promise<void> =>
  request.put('/system/user', data)

export const deleteUser = (id: number): Promise<void> => request.delete(`/system/user/${id}`)

export const updateUserStatus = (id: number, status: string): Promise<void> =>
  request.put(`/system/user/${id}/status`, { status })
