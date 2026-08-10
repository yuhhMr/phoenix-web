import type { Component } from 'vue'
import IconLayoutDashboard from '~icons/lucide/layout-dashboard'
import IconMonitor from '~icons/lucide/monitor'
import IconSettings from '~icons/lucide/settings'
import IconUsers from '~icons/lucide/users'
import IconClock from '~icons/lucide/clock'
import IconFileText from '~icons/lucide/file-text'
import IconUser from '~icons/lucide/user'
import IconShield from '~icons/lucide/shield'
import IconMenu from '~icons/lucide/menu'
import IconBuilding2 from '~icons/lucide/building-2'
import IconBookOpen from '~icons/lucide/book-open'
import IconSlidersHorizontal from '~icons/lucide/sliders-horizontal'
import IconBell from '~icons/lucide/bell'
import IconCircleDot from '~icons/lucide/circle-dot'

/**
 * 菜单图标静态映射：meta.icon（lucide kebab-case 名）→ 组件。
 *
 * 为什么不用动态 <component :is="'icon-lucide-' + name">：
 * unplugin-icons 的自动注册是编译期从模板静态分析出来的，
 * 运行时拼接的名字不会被解析。显式 import + 查表是唯一可靠做法，
 * 代价是新增菜单图标要在此登记一行（有意为之的白名单）。
 */
const iconMap: Record<string, Component> = {
  'layout-dashboard': IconLayoutDashboard,
  monitor: IconMonitor,
  settings: IconSettings,
  users: IconUsers,
  clock: IconClock,
  'file-text': IconFileText,
  user: IconUser,
  shield: IconShield,
  menu: IconMenu,
  'building-2': IconBuilding2,
  'book-open': IconBookOpen,
  'sliders-horizontal': IconSlidersHorizontal,
  bell: IconBell,
}

/** 未登记/未配置 icon 时回退到圆点，保证菜单不留空洞 */
export function getMenuIcon(name?: string): Component {
  return (name && iconMap[name]) || IconCircleDot
}
