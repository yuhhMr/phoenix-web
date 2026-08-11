import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import i18n from './locales'
import { vPerm } from './directives/permission'
import './style.css'

// 创建 Pinia 并启用状态持久化（刷新后 token/页签/设置不丢失）
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 挂载 Vue 应用，按顺序注入状态、路由、国际化、权限指令
createApp(App).use(pinia).use(router).use(i18n).directive('perm', vPerm).mount('#app')
