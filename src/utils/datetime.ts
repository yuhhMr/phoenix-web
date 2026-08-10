/**
 * 日期时间工具函数集合。
 *
 * 本文件解决什么问题：
 * - 统一列表页、详情页、表单的日期展示与解析格式；
 * - 基于 dayjs，保持轻量且可扩展。
 *
 * 修改注意点：
 * - 新增格式模板时，同步在 formatDateTime 的 format 参数中暴露；
 * - 所有展示函数对非法值返回占位符（默认 '—'）。
 */
import dayjs from 'dayjs'

/** 默认日期时间格式 */
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
/** 默认日期格式 */
export const DATE_FORMAT = 'YYYY-MM-DD'
/** 默认时间格式 */
export const TIME_FORMAT = 'HH:mm:ss'

/**
 * 格式化日期时间为字符串。
 * @param value - 可解析的日期值
 * @param format - 输出格式模板
 * @param placeholder - 非法值占位符
 * @returns 格式化后的字符串
 */
export function formatDateTime(
  value: string | number | Date | undefined | null,
  format = DATE_TIME_FORMAT,
  placeholder = '—',
): string {
  if (!value) return placeholder
  const d = dayjs(value)
  return d.isValid() ? d.format(format) : placeholder
}

/**
 * 格式化日期。
 */
export function formatDate(value: string | number | Date | undefined | null, placeholder = '—'): string {
  return formatDateTime(value, DATE_FORMAT, placeholder)
}

/**
 * 格式化时间。
 */
export function formatTime(value: string | number | Date | undefined | null, placeholder = '—'): string {
  return formatDateTime(value, TIME_FORMAT, placeholder)
}

/**
 * 计算两个日期之间的天数差。
 */
export function daysBetween(start: string | number | Date, end: string | number | Date): number {
  return dayjs(end).diff(dayjs(start), 'day')
}

/**
 * 获取今天的开始/结束时间字符串（常用于查询条件日期范围）。
 */
export function todayRange(format = DATE_TIME_FORMAT): [string, string] {
  const start = dayjs().startOf('day').format(format)
  const end = dayjs().endOf('day').format(format)
  return [start, end]
}
