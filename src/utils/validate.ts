/**
 * 表单校验规则集合。
 *
 * 本文件解决什么问题：
 * - 统一邮箱、手机号、用户名、密码等常用字段的校验逻辑；
 * - 规则既可单独使用（如 <input pattern>），也可在自定义校验函数中组合使用。
 *
 * 修改注意点：
 * - 新增规则时同步补充单元测试或至少一个使用示例；
 * - 正则调整时需确认后端校验口径一致。
 */

/** 校验结果形状 */
export interface ValidateResult {
  valid: boolean
  message?: string
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
// 宽松手机号：1 开头，第二位 3-9，共 11 位
const PHONE_REGEX = /^1[3-9]\d{9}$/
// 用户名：字母/数字/下划线，2-16 位
const USERNAME_REGEX = /^[a-zA-Z0-9_]{2,16}$/
// 密码：8-32 位，至少包含字母和数字
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=[\]{}|;:,.<>?]{8,32}$/

/** 校验邮箱 */
export function isEmail(value: string): boolean {
  return EMAIL_REGEX.test(value)
}

/** 校验手机号 */
export function isPhone(value: string): boolean {
  return PHONE_REGEX.test(value)
}

/** 校验用户名 */
export function isUsername(value: string): boolean {
  return USERNAME_REGEX.test(value)
}

/** 校验密码强度 */
export function isPassword(value: string): boolean {
  return PASSWORD_REGEX.test(value)
}

/** 必填校验 */
export function required(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

/** 长度校验（闭区间） */
export function lengthRange(value: string, min: number, max: number): boolean {
  const len = value?.length ?? 0
  return len >= min && len <= max
}

/** 常用表单规则生成器（配合自定义表单校验使用） */
export const formRules = {
  email: (message = '邮箱格式不正确'): ValidateResult => ({
    valid: false,
    message,
  }),
  phone: (message = '手机号格式不正确'): ValidateResult => ({
    valid: false,
    message,
  }),
}
