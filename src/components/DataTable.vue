<template>
  <div class="bg-surface rounded-xl shadow-sm overflow-hidden">
    <table class="w-full text-left text-sm">
      <thead class="bg-background border-b border-border">
        <tr>
          <th
            v-for="header in table.getFlatHeaders()"
            :key="header.id"
            class="px-4 py-3 font-medium text-text-secondary"
            :style="{ width: header.getSize() ? `${header.getSize()}px` : undefined }"
          >
            <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-border">
        <tr v-if="loading">
          <td :colspan="table.getAllColumns().length" class="px-4 py-8 text-center text-text-secondary">加载中...</td>
        </tr>
        <tr v-else-if="data.length === 0">
          <td :colspan="table.getAllColumns().length" class="px-4 py-8 text-center text-text-secondary">暂无数据</td>
        </tr>
        <tr v-for="row in table.getRowModel().rows" :key="row.id" class="hover:bg-background/50">
          <td v-for="cell in row.getVisibleCells()" :key="cell.id" class="px-4 py-3">
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 分页 -->
    <div class="flex items-center justify-between px-4 py-3 border-t border-border">
      <span class="text-sm text-text-secondary"> 共 {{ total }} 条，第 {{ current }} / {{ pageCount }} 页 </span>
      <div class="flex items-center gap-2">
        <button
          class="px-3 py-1 border border-border rounded-md hover:bg-background disabled:opacity-50"
          :disabled="current <= 1"
          @click="emits('update:current', current - 1)"
        >
          上一页
        </button>
        <button
          class="px-3 py-1 border border-border rounded-md hover:bg-background disabled:opacity-50"
          :disabled="current >= pageCount"
          @click="emits('update:current', current + 1)"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends object">
import { computed } from 'vue'
import { useVueTable, getCoreRowModel, FlexRender, type ColumnDef } from '@tanstack/vue-table'

const props = defineProps<{
  data: T[]
  columns: ColumnDef<T, any>[]
  loading?: boolean
  total: number
  current: number
  size: number
}>()

const emits = defineEmits<{
  'update:current': [page: number]
}>()

const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  getCoreRowModel: getCoreRowModel(),
})

const pageCount = computed(() => Math.ceil(props.total / props.size))
</script>
