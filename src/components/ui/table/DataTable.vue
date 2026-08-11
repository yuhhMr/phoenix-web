<script setup lang="ts" generic="T extends object">
/**
 * 数据表格：基于 tanstack 表格逻辑 + ui/table 样式组件拼装。
 * 负责表头渲染、loading/空数据提示、分页控制，业务页只需传入 data/columns 和分页参数。
 */
import { computed } from 'vue'
import { useVueTable, getCoreRowModel, FlexRender, type ColumnDef } from '@tanstack/vue-table'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const props = defineProps<{
  data: T[]
  columns: ColumnDef<T, any>[]
  loading?: boolean
  total: number
  current: number
  size: number
}>()

const emit = defineEmits<{
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

<template>
  <div class="bg-surface rounded-xl shadow-sm overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            :style="{ width: header.getSize() ? `${header.getSize()}px` : undefined }"
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="loading">
          <TableCell :colspan="table.getAllColumns().length" class="py-8 text-center text-muted-foreground">
            加载中...
          </TableCell>
        </TableRow>
        <TableRow v-else-if="data.length === 0">
          <TableCell :colspan="table.getAllColumns().length" class="py-8 text-center text-muted-foreground">
            暂无数据
          </TableCell>
        </TableRow>
        <TableRow v-for="row in table.getRowModel().rows" :key="row.id">
          <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <!-- 分页 -->
    <div class="flex items-center justify-between px-4 py-3 border-t border-border">
      <span class="text-sm text-muted-foreground"> 共 {{ total }} 条，第 {{ current }} / {{ pageCount }} 页 </span>
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="current <= 1"
          @click="emit('update:current', current - 1)"
        >
          上一页
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="current >= pageCount"
          @click="emit('update:current', current + 1)"
        >
          下一页
        </Button>
      </div>
    </div>
  </div>
</template>
