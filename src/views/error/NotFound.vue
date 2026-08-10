<template>
  <div class="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
    <p class="text-6xl font-bold text-primary">{{ t('notFound.title') }}</p>
    <p class="text-text-secondary">{{ t('notFound.message') }}</p>
    <button
      class="px-4 py-2 rounded-md bg-primary text-surface hover:bg-primary-dark transition-colors"
      @click="router.push('/')"
    >
      {{ t('notFound.backHome') }}
    </button>
  </div>
</template>

<script setup lang="ts">
// 独立于 MainLayout 的全屏页：已登录访问不存在路径时由守卫放行到此处
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()
</script>
