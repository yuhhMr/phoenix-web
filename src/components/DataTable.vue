<script setup lang="ts" generic="T extends object">
import type { ColumnDef } from '@tanstack/vue-table'
import { DataTable } from '@/components/ui/data-table'

interface Props {
  data: T[]
  columns: ColumnDef<T, any>[]
  loading?: boolean
  total: number
  current: number
  size: number
}

defineProps<Props>()

const emit = defineEmits<{
  'update:current': [page: number]
}>()
</script>

<template>
  <DataTable
    :data="data"
    :columns="columns"
    :loading="loading"
    :total="total"
    :current="current"
    :size="size"
    @update:current="emit('update:current', $event)"
  />
</template>
