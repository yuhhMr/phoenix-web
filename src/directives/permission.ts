import type { Directive } from 'vue'
import { usePermissionStore } from '@/store/permission'

function checkPerm(value: string | string[]): boolean {
  const permissionStore = usePermissionStore()
  if (Array.isArray(value)) {
    return value.some((p) => permissionStore.hasPerm(p))
  }
  return permissionStore.hasPerm(value)
}

export const vPerm: Directive<HTMLElement, string | string[]> = {
  mounted(el, binding) {
    if (!checkPerm(binding.value)) {
      el.parentNode?.removeChild(el)
    }
  },
}

export default vPerm
