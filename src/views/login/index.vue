<template>
  <div class="login-page">
    <div class="login-card">
      <h2 class="login-title">Phoenix</h2>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="field">
          <IconUser class="field-icon" />
          <input v-model.trim="form.username" type="text" :placeholder="$t('login.username')" autocomplete="username" />
        </div>

        <div class="field">
          <IconLock class="field-icon" />
          <input v-model="form.password" type="password" :placeholder="$t('login.password')"
            autocomplete="current-password" />
        </div>

        <div class="captcha-row">
          <div class="field captcha-field">
            <IconShield class="field-icon" />
            <input v-model.trim="form.captchaCode" type="text" :placeholder="$t('login.captcha')" maxlength="4" />
          </div>
          <img v-if="captchaImg" :src="captchaImg" class="captcha-img" :alt="$t('login.captcha')"
            :title="$t('login.captchaRefresh')" @click="loadCaptcha" />
          <div v-else class="captcha-img captcha-placeholder" @click="loadCaptcha">
            {{ $t('login.captchaRefresh') }}
          </div>
        </div>

        <label class="remember">
          <input v-model="form.rememberMe" type="checkbox" />
          <span>{{ $t('login.rememberMe') }}</span>
        </label>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? $t('login.loading') : $t('login.submit') }}
        </button>
      </form>
    </div>

    <footer class="login-footer">Copyright © 2026 byteloop.xyz All Rights Reserved.</footer>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import IconUser from '~icons/lucide/user'
import IconLock from '~icons/lucide/lock'
import IconShield from '~icons/lucide/shield-check'
import { getCaptcha, getPublicKey, login, getLoginInfo } from '@/api/auth'
import { useUserStore } from '@/store/user'
import { usePermissionStore } from '@/store/permission'
import { rsaEncrypt } from '@/utils/rsa'
import { getDeviceId } from '@/utils/device'

const REMEMBER_KEY = 'phoenix-remember-username'

const router = useRouter()
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
    errorMsg.value = '验证码加载失败，点击刷新重试'
    captchaImg.value = ''
  }
}

const handleLogin = async () => {
  if (!form.username || !form.password || !form.captchaCode) {
    errorMsg.value = '请填写完整登录信息'
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
    userStore.setUserInfo({
      userId: info.userId,
      username: info.username,
      nickname: info.nickname,
      root: info.root,
    })
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
    errorMsg.value = e.message || '登录失败'
    loadCaptcha()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const remembered = localStorage.getItem(REMEMBER_KEY)
  if (remembered) {
    form.username = remembered
    form.rememberMe = true
  }
  loadCaptcha()
})
</script>

<style scoped>
/* 全屏背景（原型：设计/登录页.jpg，背景图来自 Jarvis-web 同款） */
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

/* 带前缀图标的输入框 */
.field {
  position: relative;
  display: flex;
  align-items: center;
}

.field-icon {
  position: absolute;
  left: 12px;
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 0.75);
  pointer-events: none;
}

.field input {
  width: 100%;
  height: 42px;
  padding: 0 12px 0 36px;
  box-sizing: border-box;
  color: #fff;
  background-color: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s, background-color 0.2s;
}

.field input::placeholder {
  color: rgba(255, 255, 255, 0.55);
}

.field input:focus {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(96, 165, 250, 0.8);
}

.captcha-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.captcha-field {
  flex: 1;
}

.captcha-img {
  width: 112px;
  height: 42px;
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

.submit-btn {
  height: 44px;
  border: none;
  border-radius: 8px;
  background-color: #2563eb;
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
