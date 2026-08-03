import request from './request'

export interface OrgTreeItem {
  orgId: number
  parentId: number
  orgName: string
  orgCode: string
  orgPath?: string
  level: number
  status: string
  children?: OrgTreeItem[]
}

export const fetchOrgTree = (): Promise<OrgTreeItem[]> => request.get('/system/org/tree')
export const deleteOrg = (id: number): Promise<void> => request.delete(`/system/org/${id}`)
