import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 应用状态管理。
 *
 * 持久化用 pinia-plugin-persistedstate，key 即 store id 'app'。
 *
 * settings 中部分字段（主题模式/主题色等）依赖运行时可改写的主题变量层，
 * 而本项目是 Tailwind 静态令牌，暂只存值不生效，
 * 逐项的接线状态见 Settings 面板组件内注释。
 */
export interface AppSettings {
  // 主题设置
  theme: 'light' | 'dark' // 主题: light | dark
  themeColor: string // 主题色

  // 布局设置
  showTagsView: boolean // 是否显示标签页（设置项保留，面板/布局接线待做）
  fixedHeader: boolean // 是否固定头部（同上）

  // 语言设置
  language: string // 语言: zh-CN | en-US（en-US 语言包未建，暂只有 zh-CN）

  // 个人偏好
  pageAnimation: boolean // 页面动画（保留位，待接）
  tableSize: 'small' | 'default' | 'large' // 表格密度（保留位，待接）
  menuMode: 'vertical' | 'horizontal' // 菜单模式（保留位，待接）

  // 其他设置
  autoSave: boolean // 自动保存草稿（保留位，待接）
  messageNotify: boolean // 消息通知（Navbar 铃铛依赖用户侧未读端点，待接）
}

/** resetSettings 与初始值用同一份字面量，抽成函数避免两处漂移 */
function defaultSettings(): AppSettings {
  return {
    theme: 'light',
    themeColor: '#2563eb', // 与 tailwind.config.js 的 primary 一致
    showTagsView: true,
    fixedHeader: true,
    language: 'zh-CN',
    pageAnimation: true,
    tableSize: 'default',
    menuMode: 'vertical',
    autoSave: false,
    messageNotify: true,
  }
}

export const useAppStore = defineStore(
  'app',
  () => {
    // 侧边栏收缩状态
    const sidebarCollapsed = ref(false)

    // 设置面板显示状态
    const settingsVisible = ref(false)

    // 系统设置配置
    const settings = ref<AppSettings>(defaultSettings())

    // 切换侧边栏收缩状态
    function toggleSidebar() {
      sidebarCollapsed.value = !sidebarCollapsed.value
    }

    // 展开侧边栏
    function expandSidebar() {
      sidebarCollapsed.value = false
    }

    // 收缩侧边栏
    function collapseSidebar() {
      sidebarCollapsed.value = true
    }

    // 打开设置面板
    function openSettings() {
      settingsVisible.value = true
    }

    // 关闭设置面板
    function closeSettings() {
      settingsVisible.value = false
    }

    // 切换设置面板
    function toggleSettings() {
      settingsVisible.value = !settingsVisible.value
    }

    // 更新设置
    function updateSettings<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
      if (key in settings.value) {
        settings.value[key] = value
      }
    }

    // 批量更新设置
    function batchUpdateSettings(newSettings: Partial<AppSettings>) {
      settings.value = { ...settings.value, ...newSettings }
    }

    // 重置设置为默认值
    function resetSettings() {
      settings.value = defaultSettings()
    }

    return {
      sidebarCollapsed,
      settingsVisible,
      settings,
      toggleSidebar,
      expandSidebar,
      collapseSidebar,
      openSettings,
      closeSettings,
      toggleSettings,
      updateSettings,
      batchUpdateSettings,
      resetSettings,
    }
  },
  {
    // 持久化存储（只落 sidebarCollapsed/settings 两项）
    persist: {
      pick: ['sidebarCollapsed', 'settings'],
    },
  },
)
