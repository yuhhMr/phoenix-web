<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="w-full max-w-md bg-surface rounded-xl shadow-lg p-8">
      <h1 class="text-2xl font-bold text-center mb-8">{{ $t('login.title') }}</h1>

      <form class="space-y-5" @submit.prevent="handleLogin">
        <div>
          <label class="block text-sm font-medium mb-1">{{ $t('login.username') }}</label>
          <input
            v-model="form.username"
            type="text"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="admin"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">{{ $t('login.password') }}</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="******"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">{{ $t('login.captcha') }}</label>
          <div class="flex gap-2">
            <input
              v-model="form.code"
              type="text"
              class="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="验证码"
            />
            <img
              v-if="captcha?.img"
              :src="captcha.img"
              class="h-10 w-28 cursor-pointer border border-border rounded-md"
              @click="loadCaptcha"
              alt="captcha"
            />
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2.5 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ loading ? $t('login.loading') : $t('login.submit') }}
        </button>
      </form>

      <p v-if="errorMsg" class="mt-4 text-sm text-red-500 text-center">{{ errorMsg }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCaptcha, login } from '@/api/auth'
import { useUserStore } from '@/store/user'
import { usePermissionStore } from '@/store/permission'
import type { CaptchaRes } from '@/api/auth'

const router = useRouter()
const userStore = useUserStore()
const permissionStore = usePermissionStore()

const form = reactive({
  username: 'admin',
  password: '',
  code: '',
  uuid: '',
})

const captcha = ref<CaptchaRes | null>(null)
const loading = ref(false)
const errorMsg = ref('')

const loadCaptcha = async () => {
  try {
    captcha.value = await getCaptcha()
    form.uuid = captcha.value?.uuid || ''
  } catch (e) {
    errorMsg.value = '验证码加载失败'
  }
}

const handleLogin = async () => {
  if (!form.username || !form.password || !form.code) {
    errorMsg.value = '请填写完整登录信息'
    return
  }
  loading.value = true
  errorMsg.value = ''
  try {
    const res = await login(form)
    userStore.setToken(res.token)
    userStore.setUserInfo(res.userInfo)
    permissionStore.setPerms(res.perms || [])
    router.push('/')
  } catch (e: any) {
    errorMsg.value = e.message || '登录失败'
    loadCaptcha()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCaptcha()
})
</script>
