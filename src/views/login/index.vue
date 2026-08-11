<template>
  <div class="login-page">
    <div class="login-card">
      <h2 class="login-title">Phoenix</h2>

      <form class="login-form" @submit.prevent="handleLogin">
        <AppInput
          v-model="form.username"
          variant="glass"
          size="lg"
          :placeholder="$t('login.username')"
          autocomplete="username"
          @enter="handleLogin"
        >
          <template #prefix><IconUser /></template>
        </AppInput>

        <AppInput
          v-model="form.password"
          type="password"
          variant="glass"
          size="lg"
          :placeholder="$t('login.password')"
          autocomplete="current-password"
          :clear-title="$t('login.clear')"
          :show-title="$t('login.showPassword')"
          :hide-title="$t('login.hidePassword')"
          @enter="handleLogin"
        >
          <template #prefix><IconLock /></template>
        </AppInput>

        <div class="captcha-row">
          <AppInput
            v-model="form.captchaCode"
            variant="glass"
            size="lg"
            :placeholder="$t('login.captcha')"
            :maxlength="4"
            :clear-title="$t('login.clear')"
            @enter="handleLogin"
          >
            <template #prefix><IconShield /></template>
          </AppInput>
          <img
            v-if="captchaImg"
            :src="captchaImg"
            class="captcha-img"
            :alt="$t('login.captcha')"
            :title="$t('login.captchaRefresh')"
            @click="loadCaptcha"
          />
          <div v-else class="captcha-img captcha-placeholder" @click="loadCaptcha">
            {{ $t('login.captchaRefresh') }}
          </div>
        </div>

        <label class="remember">
          <input v-model="form.rememberMe" type="checkbox" />
          <span>{{ $t('login.rememberMe') }}</span>
        </label>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

        <AppButton native-type="submit" size="lg" class="w-full tracking-[6px]" :loading="loading">
          {{ loading ? $t('login.loading') : $t('login.submit') }}
        </AppButton>
      </form>
    </div>

    <footer class="login-footer">Copyright © 2026 byteloop.xyz All Rights Reserved.</footer>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import IconUser from '~icons/lucide/user'
import IconLock from '~icons/lucide/lock'
import IconShield from '~icons/lucide/shield-check'
import AppInput from '@/components/AppInput.vue'
import AppButton from '@/components/AppButton.vue'
import { getCaptcha, getPublicKey, login, getLoginInfo } from '@/api/auth'
import { useUserStore } from '@/store/user'
import { usePermissionStore } from '@/store/permission'
import { rsaEncrypt } from '@/utils/rsa'
import { getDeviceId } from '@/utils/device'

const REMEMBER_KEY = 'phoenix-remember-username'

const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()
const permissionStore = usePermissionStore()

const form = reactive({
  username: '',
  password: '',
  captchaCode: '',
  rememberMe: false,
})

const captchaImg = ref('')
const captchaUuid = ref('')
const loading = ref(false)
const errorMsg = ref('')

const loadCaptcha = async () => {
  try {
    const res = await getCaptcha()
    captchaImg.value = res.img
    captchaUuid.value = res.uuid
    form.captchaCode = ''
  } catch {
    errorMsg.value = t('login.captchaLoadFailed')
    captchaImg.value = ''
  }
}

const handleLogin = async () => {
  // 输入框 Enter 与表单原生 submit 会双触发，loading 兼作重入锁
  if (loading.value) {
    return
  }
  if (!form.username || !form.password || !form.captchaCode) {
    errorMsg.value = t('login.formIncomplete')
    return
  }
  loading.value = true
  errorMsg.value = ''
  try {
    const { publicKey } = await getPublicKey()
    const res = await login({
      username: form.username,
      password: rsaEncrypt(form.password, publicKey),
      captchaCode: form.captchaCode,
      captchaUuid: captchaUuid.value,
      deviceId: getDeviceId(),
    })
    userStore.setToken(res.token)
    const info = await getLoginInfo()
    userStore.setUserInfo(info)
    permissionStore.setPerms(info.perms || [])

    // 记住我：只存用户名，口令永不落盘
    if (form.rememberMe) {
      localStorage.setItem(REMEMBER_KEY, form.username)
    } else {
      localStorage.removeItem(REMEMBER_KEY)
    }

    const redirect = (router.currentRoute.value.query.redirect as string) || '/'
    router.push(redirect)
  } catch (e: any) {
    errorMsg.value = e.message || t('login.loginFailed')
    loadCaptcha()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // 已登录用户访问登录页：直接回跳目标页，不重复登录
  if (userStore.token) {
    const redirect = (router.currentRoute.value.query.redirect as string) || '/'
    router.replace(redirect)
    return
  }
  const remembered = localStorage.getItem(REMEMBER_KEY)
  if (remembered) {
    form.username = remembered
    form.rememberMe = true
  }
  loadCaptcha()
})
</script>

<style scoped>
/* 全屏背景（原型：设计/登录页.jpg） */
.login-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-image: url('@/assets/img/login-bg.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  overflow: hidden;
}

/* 磨砂玻璃卡片：右侧 10%，移动端居中 */
.login-card {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  width: 380px;
  max-height: 90vh;
  padding: 32px 38px 30px;
  box-sizing: border-box;
  overflow: auto;
  background-color: rgba(255, 255, 255, 0.14);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-right-color: rgba(255, 255, 255, 0.12);
  border-bottom-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 20px 45px -12px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
}

@media (max-width: 768px) {
  .login-card {
    right: 50%;
    transform: translate(50%, -50%);
    width: 90%;
    max-width: 380px;
  }
}

.login-title {
  margin: 0 0 24px;
  color: #60a5fa;
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  letter-spacing: 2px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.captcha-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.captcha-row > :first-child {
  flex: 1;
}

.captcha-img {
  width: 112px;
  height: 44px;
  flex-shrink: 0;
  cursor: pointer;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  background-color: #f7f8fa;
  object-fit: cover;
}

.captcha-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.remember {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  cursor: pointer;
  user-select: none;
}

.error-msg {
  margin: 0;
  color: #fca5a5;
  font-size: 13px;
  text-align: center;
}

.login-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: rgba(255, 255, 255, 0.75);
  font-size: 13px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
</style>
