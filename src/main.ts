import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import i18n from './locales'
import { vPerm } from './directives/permission'
import { APP_TITLE } from './config/app'
import './style.css'

// 浏览器标签页标题由站点配置统一下发（src/config/app.ts）
document.title = APP_TITLE

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App)
  .use(pinia)
  .use(router)
  .use(i18n)
  .directive('perm', vPerm)
  .mount('#app')
