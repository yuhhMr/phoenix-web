<template>
  <!-- 设置抽屉：自绘实现（Teleport + 固定右侧面板），与 components/AppModal.vue 同款思路——
       Element el-drawer 的交互（遮罩点击关闭、v-model 可见性）用少量 Tailwind 即可等价，
       不值得为此引入 ark-ui Dialog 再自行改成抽屉形态 -->
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-50">
      <!-- 遮罩：点击关闭（对应 el-drawer 的 close-on-click-modal） -->
      <div class="absolute inset-0 bg-black/50" @click="appStore.closeSettings()"></div>
      <div class="absolute right-0 top-0 h-full w-80 bg-surface shadow-xl flex flex-col">
        <!-- 头部 -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 class="text-base font-semibold">{{ t('settings.title') }}</h3>
          <button class="text-text-secondary hover:text-text" @click="appStore.closeSettings()">
            <icon-lucide-x class="w-5 h-5" />
          </button>
        </div>

        <!-- 内容区 -->
        <div class="flex-1 overflow-y-auto py-3">
          <!-- 界面设置 -->
          <div class="px-5">
            <h3 class="flex items-center gap-2 text-sm font-semibold mb-4">
              <icon-lucide-palette class="w-4 h-4 text-primary" />
              {{ t('settings.interface') }}
            </h3>

            <div class="flex items-center justify-between mb-4">
              <span class="text-sm text-text-secondary">{{ t('settings.themeMode') }}</span>
              <!-- 主题模式分段开关（对应 el-radio-group） -->
              <div class="flex border border-border rounded-md overflow-hidden">
                <button
                  v-for="opt in themeOptions"
                  :key="opt.value"
                  class="flex items-center gap-1 px-3 py-1.5 text-sm transition-colors"
                  :class="
                    settings.theme === opt.value ? 'bg-primary text-white' : 'text-text-secondary hover:bg-background'
                  "
                  @click="handleThemeChange(opt.value)"
                >
                  <component :is="opt.icon" class="w-4 h-4" />
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between mb-4">
              <span class="text-sm text-text-secondary">{{ t('settings.themeColor') }}</span>
              <!-- 原生取色器替代 el-color-picker -->
              <input
                type="color"
                :value="settings.themeColor"
                class="w-8 h-8 p-0 border border-border rounded cursor-pointer bg-transparent"
                @input="handleColorChange(($event.target as HTMLInputElement).value)"
              />
            </div>
            <div class="flex justify-end mb-4">
              <div class="grid grid-cols-4 gap-2">
                <div
                  v-for="color in presetColors"
                  :key="color"
                  class="w-5 h-5 rounded cursor-pointer border-2 transition-all"
                  :class="settings.themeColor === color ? 'border-text' : 'border-transparent hover:border-primary'"
                  :style="{ backgroundColor: color }"
                  @click="handleColorChange(color)"
                ></div>
              </div>
            </div>
          </div>

          <div class="border-t border-border my-2"></div>

          <!-- 语言设置 -->
          <div class="px-5">
            <h3 class="flex items-center gap-2 text-sm font-semibold mb-4">
              <icon-lucide-languages class="w-4 h-4 text-primary" />
              {{ t('settings.language') }}
            </h3>

            <div class="flex items-center justify-between mb-4">
              <span class="text-sm text-text-secondary">{{ t('settings.systemLanguage') }}</span>
              <!-- en-US 语言包未建（locales/ 目前只有 zh-CN），选项暂只列中文，待语言包补齐后加回 -->
              <select
                :value="settings.language"
                class="w-36 px-2 py-1.5 text-sm border border-border rounded-md bg-surface"
                @change="handleLanguageChange(($event.target as HTMLSelectElement).value)"
              >
                <option value="zh-CN">{{ t('settings.langZhCN') }}</option>
              </select>
            </div>
          </div>

          <div class="border-t border-border my-2"></div>

          <!-- 其他设置 -->
          <div class="px-5">
            <h3 class="flex items-center gap-2 text-sm font-semibold mb-4">
              <icon-lucide-settings class="w-4 h-4 text-primary" />
              {{ t('settings.other') }}
            </h3>

            <div class="flex items-center justify-between mb-4">
              <span class="text-sm text-text-secondary">{{ t('settings.messageNotify') }}</span>
              <!-- 自绘开关（对应 el-switch）。该开关暂只存值：Navbar 消息铃铛依赖
                   用户侧未读数端点（当前 notice API 只有管理端 CRUD），待接 -->
              <button
                role="switch"
                :aria-checked="settings.messageNotify"
                class="w-10 h-5 rounded-full transition-colors relative"
                :class="settings.messageNotify ? 'bg-primary' : 'bg-border'"
                @click="appStore.updateSettings('messageNotify', !settings.messageNotify)"
              >
                <span
                  class="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                  :class="settings.messageNotify ? 'left-[calc(100%-1.25rem)]' : 'left-0.5'"
                ></span>
              </button>
            </div>
          </div>
        </div>

        <!-- 底部 -->
        <div class="flex justify-end gap-2 px-5 py-4 border-t border-border">
          <button class="px-4 py-2 text-sm border border-border rounded-md hover:bg-background" @click="handleReset">
            {{ t('settings.reset') }}
          </button>
          <button class="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary-dark" @click="handleSave">
            {{ t('settings.save') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * 设置面板。
 *
 * 实现要点：
 * - 抽屉/分段开关/取色器/下拉/开关均为自绘 Tailwind 控件（理由见模板注释）；
 * - 主题是 Tailwind 静态令牌，没有运行时可改写的 CSS 变量层：
 *   主题模式只切 <html> dark class 占位、主题色只持久化存值，可视效果待令牌变量化后接
 *   （详见 utils/theme.ts 文件头注释）；
 * - 各操作不做成功提示：项目无全局 toast 组件；
 * - 语言切换后更新页签标题（updateTabsTitle）。
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore, type AppSettings } from '@/store/app'
import { useTabsStore } from '@/store/tabs'
import { applyThemeMode, PRESET_COLORS } from '@/utils/theme'
import IconSun from '~icons/lucide/sun'
import IconMoon from '~icons/lucide/moon'

const appStore = useAppStore()
const tabsStore = useTabsStore()
const { t, locale } = useI18n()

// 预设主题色（常量集中在 utils/theme.ts，面板与主题工具共用一份）
const presetColors = PRESET_COLORS

// 面板可见性：直读 appStore（见 layout/index.vue 注释：不做 v-model 冗余绑定）
const visible = computed(() => appStore.settingsVisible)

const settings = computed(() => appStore.settings)

// 主题模式选项（light/dark 分段开关）
const themeOptions = computed(() => [
  { value: 'light' as const, label: t('settings.light'), icon: IconSun },
  { value: 'dark' as const, label: t('settings.dark'), icon: IconMoon },
])

// 处理主题切换
function handleThemeChange(theme: AppSettings['theme']) {
  applyThemeMode(theme)
  appStore.updateSettings('theme', theme)
}

// 处理主题色切换（仅存值，样式待接——见文件头注释）
function handleColorChange(color: string) {
  appStore.updateSettings('themeColor', color)
}

// 处理语言切换
function handleLanguageChange(lang: string) {
  locale.value = lang
  appStore.updateSettings('language', lang)
  // 更新所有标签页的标题
  tabsStore.updateTabsTitle()
}

// 恢复默认设置
function handleReset() {
  appStore.resetSettings()
  // 重置主题（dark class 回放）
  applyThemeMode('light')
}

// 保存设置（pinia 持久化插件已自动落 localStorage，这里只关面板）
function handleSave() {
  appStore.closeSettings()
}
</script>
