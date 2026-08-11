import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并 Tailwind 类名。
 * - clsx 负责条件/数组类名拼接
 * - tailwind-merge 负责去重与覆盖（如 px-2 px-4 → px-4）
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
