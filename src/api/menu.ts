import request from './request'

export interface MenuTreeItem {
  menuId: number
  parentId: number
  menuName: string
  menuType: string
  path?: string
  component?: string
  perms?: string
  icon?: string
  sort: number
  status: string
  children?: MenuTreeItem[]
}

export const fetchMenuTree = (): Promise<MenuTreeItem[]> => request.get('/system/menu/tree')
export const createMenu = (data: Partial<MenuTreeItem>): Promise<number> => request.post('/system/menu', data)
export const updateMenu = (data: Partial<MenuTreeItem>): Promise<void> => request.put('/system/menu', data)
export const deleteMenu = (id: number): Promise<void> => request.delete(`/system/menu/${id}`)
