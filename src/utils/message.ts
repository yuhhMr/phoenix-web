/**
 * 全局轻提示（Message / Toast）。
 *
 * 本文件解决什么问题：
 * - 替代页面里散落使用的 alert 和原生 confirm；
 * - 提供函数式调用，无需在每个页面引入组件；
 * - 基于纯 DOM + Tailwind，不依赖 UI 库，后续若换 ark-ui Toast 只需替换实现。
 *
 * 修改注意点：
 * - 提示文案优先从 vue-i18n 读取，当前简化为直接传字符串；
 * - 同时存在多条提示时自动垂直堆叠。
 */

type MessageType = 'success' | 'error' | 'warning' | 'info'

interface MessageOptions {
  type?: MessageType
  duration?: number
}

const TYPE_STYLES: Record<MessageType, string> = {
  success: 'bg-emerald-500 text-white',
  error: 'bg-red-500 text-white',
  warning: 'bg-amber-500 text-white',
  info: 'bg-blue-500 text-white',
}

let container: HTMLDivElement | null = null

function ensureContainer(): HTMLDivElement {
  if (!container) {
    container = document.createElement('div')
    container.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none'
    document.body.appendChild(container)
  }
  return container
}

/**
 * 显示轻提示。
 * @param content - 提示内容
 * @param options - 类型与停留时长
 */
export function message(content: string, options: MessageOptions = {}): void {
  const { type = 'info', duration = 3000 } = options
  const el = document.createElement('div')
  el.className = [
    'px-4 py-2 rounded-md shadow-lg text-sm font-medium',
    'transition-all duration-300',
    'opacity-0 translate-y-[-8px]',
    TYPE_STYLES[type],
  ].join(' ')
  el.textContent = content

  const wrapper = ensureContainer()
  wrapper.appendChild(el)

  // 触发动画
  requestAnimationFrame(() => {
    el.classList.remove('opacity-0', 'translate-y-[-8px]')
  })

  setTimeout(() => {
    el.classList.add('opacity-0', 'translate-y-[-8px]')
    el.addEventListener('transitionend', () => {
      el.remove()
      if (wrapper.childElementCount === 0) {
        wrapper.remove()
        container = null
      }
    })
  }, duration)
}

export function successMessage(content: string): void {
  message(content, { type: 'success' })
}

export function errorMessage(content: string): void {
  message(content, { type: 'error' })
}

export function warningMessage(content: string): void {
  message(content, { type: 'warning' })
}

export function infoMessage(content: string): void {
  message(content, { type: 'info' })
}
