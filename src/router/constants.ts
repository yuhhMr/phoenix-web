// 路由名称常量，避免守卫/页签/面包屑中硬编码字符串
export const RouteNames = {
  Login: 'Login',
  Index: 'Index',
  Forbidden: 'Forbidden',
  NotFound: 'NotFound',
  Monitor: 'Monitor',
  Online: 'Online',
  Job: 'Job',
  JobLog: 'JobLog',
  Log: 'Log',
  System: 'System',
  User: 'User',
  Profile: 'Profile',
  Role: 'Role',
  SystemMenu: 'SystemMenu',
  Org: 'Org',
  Dict: 'Dict',
  Config: 'Config',
  Notice: 'Notice',
} as const

// 路由路径常量
export const RoutePaths = {
  Login: '/login',
  Index: '/index',
  Forbidden: '/403',
  NotFound: '/404',
} as const
