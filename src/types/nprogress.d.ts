/**
 * nprogress 无官方类型包（项目约束不新增依赖），这里只声明用到的最小 API 面。
 */
declare module 'nprogress' {
  interface NProgress {
    configure(options: { showSpinner?: boolean; minimum?: number; trickleSpeed?: number }): NProgress
    start(): NProgress
    done(force?: boolean): NProgress
  }
  const nprogress: NProgress
  export default nprogress
}
