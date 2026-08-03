export interface PageQuery {
  current?: number
  size?: number
  [key: string]: any
}

export interface PageRes<T> {
  records: T[]
  total: number
  current: number
  size: number
}
