import request from './request'

export interface OrgTreeItem {
  orgId: number
  parentId: number
  orgName: string
  orgCode: string
  sort?: number
  orgPath?: string
  level: number
  status: string
  children?: OrgTreeItem[]
}

export const fetchOrgTree = (): Promise<OrgTreeItem[]> => request.get('/system/org/tree')
export const createOrg = (data: Partial<OrgTreeItem>): Promise<number> => request.post('/system/org', data)
export const updateOrg = (data: Partial<OrgTreeItem>): Promise<void> => request.put('/system/org', data)
export const deleteOrg = (id: number): Promise<void> => request.delete(`/system/org/${id}`)
