# UI 组件库

本项目 UI 组件层参考 shadcn/ui 的设计语义，使用 Vue 3 + TypeScript + ark-ui + Tailwind CSS 实现。

设计目标：

- 样式与交互逻辑解耦：纯样式组件直接 Tailwind 实现；复杂交互（Dialog、Select 等）基于 ark-ui 的 headless primitive。
- 类型完整：所有 Props/Slots/Emits 都带 TypeScript 类型。
- 可组合：高阶组件（如 DataTable）基于底层组件（Table、Button）拼装，不重复维护样式。

---

## Button 按钮

```vue
<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <Button>默认</Button>
  <Button variant="outline">描边</Button>
  <Button variant="danger">危险</Button>
  <Button variant="ghost">幽灵</Button>
  <Button size="sm">小</Button>
  <Button size="lg">大</Button>
  <Button loading>加载中</Button>
  <Button as-child>
    <a href="/">作为子元素渲染</a>
  </Button>
</template>
```

### Props

| 属性     | 类型                                                  | 默认值  | 说明                   |
| -------- | ----------------------------------------------------- | ------- | ---------------------- |
| variant  | default / secondary / outline / ghost / danger / link | default | 视觉变体               |
| size     | default / sm / lg / icon                              | default | 尺寸                   |
| loading  | boolean                                               | false   | 加载状态，显示 spinner |
| disabled | boolean                                               | false   | 禁用                   |
| type     | button / submit / reset                               | button  | 原生 button type       |
| as-child | boolean                                               | false   | 是否将样式合并到子元素 |

---

## Input 输入框

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'

const value = ref('')
</script>

<template>
  <Input v-model="value" placeholder="请输入" />
  <Input v-model="value" type="password" placeholder="密码" />
  <Input v-model="value" :clearable="false" placeholder="不可清空" />
  <Input v-model="value" placeholder="带前缀">
    <template #prefix><IconUser /></template>
  </Input>
</template>
```

### 设计说明

- 清空按钮默认开启（`clearable=true`），输入有值且非禁用时显示。
- 密码框有值时自动显示 eye/eye-off 切换，组件内部维护可视化状态。
- 前缀图标会调整左侧内边距；清空/可视化按钮会调整右侧内边距，避免文字被遮挡。
- 表单提交应使用外层 `<form @submit>`，不在 Input 上额外监听 `@keyup.enter`。

### Props

| 属性         | 类型            | 默认值 | 说明              |
| ------------ | --------------- | ------ | ----------------- |
| modelValue   | string          | ''     | 绑定值            |
| type         | text / password | text   | 类型              |
| placeholder  | string          | -      | 占位符            |
| maxlength    | number / string | -      | 最大长度          |
| autocomplete | string          | -      | 原生 autocomplete |
| disabled     | boolean         | false  | 禁用              |
| error        | boolean         | false  | 错误态样式        |
| clearable    | boolean         | true   | 是否显示清空按钮  |

### Slots

| 插槽   | 说明         |
| ------ | ------------ |
| prefix | 左侧前缀图标 |

### Emits

| 事件              | 说明         |
| ----------------- | ------------ |
| update:modelValue | 值变化       |
| enter             | 按下回车     |
| clear             | 点击清空按钮 |

---

## Dialog 对话框

基于 ark-ui Dialog 的复合组件，支持两种使用方式。

### 方式一：组合式（推荐业务弹窗）

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const open = ref(false)
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger as-child>
      <Button>打开</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>标题</DialogTitle>
        <DialogDescription>描述文本</DialogDescription>
      </DialogHeader>
      <div>内容区</div>
      <DialogFooter>
        <Button variant="outline" @click="open = false">取消</Button>
        <Button @click="open = false">确认</Button>
      </DialogFooter>
    </DialogContent>
  </DialogRoot>
</template>
```

### 方式二：DialogModal 便捷组件（兼容旧 AppModal API）

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DialogModal } from '@/components/ui/dialog'

const visible = ref(false)
const saving = ref(false)

const handleSubmit = () => {
  // 保存逻辑
}
</script>

<template>
  <DialogModal v-model:open="visible" title="新增用户" :loading="saving" @submit="handleSubmit">
    <div class="space-y-4">表单内容</div>
  </DialogModal>
</template>
```

---

## Table / DataTable 表格

### 基础表格（纯样式）

```vue
<script setup lang="ts">
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>用户名</TableHead>
        <TableHead>状态</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>admin</TableCell>
        <TableCell>正常</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
```

### DataTable 数据表格（业务层）

基于 `@tanstack/vue-table` 实现表头、行渲染、loading、空数据、分页。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { createColumnHelper } from '@tanstack/vue-table'
import { DataTable } from '@/components/ui/table'
import type { UserItem } from '@/api/user'

const columnHelper = createColumnHelper<UserItem>()
const columns = [
  columnHelper.accessor('username', { header: '用户名' }),
  columnHelper.accessor('status', { header: '状态' }),
]

const list = ref<UserItem[]>([])
const total = ref(0)
const current = ref(1)
const size = ref(10)
const loading = ref(false)
</script>

<template>
  <DataTable v-model:current="current" :data="list" :columns="columns" :loading="loading" :total="total" :size="size" />
</template>
```

### DataTable Props

| 属性    | 类型                | 必填 | 说明     |
| ------- | ------------------- | ---- | -------- |
| data    | T[]                 | 是   | 列表数据 |
| columns | ColumnDef<T, any>[] | 是   | 列定义   |
| loading | boolean             | 否   | 加载状态 |
| total   | number              | 是   | 总条数   |
| current | number              | 是   | 当前页   |
| size    | number              | 是   | 每页条数 |

### Emits

| 事件           | 说明     |
| -------------- | -------- |
| update:current | 页码变化 |
