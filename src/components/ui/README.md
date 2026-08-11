# Phoenix UI 组件库

本项目 UI 组件层参考 [shadcn/ui](https://ui.shadcn.com) 的设计语义，使用 **Vue 3 + TypeScript + ark-ui + Tailwind CSS** 实现。

设计目标：

- **样式与交互逻辑解耦**：纯样式组件由 Tailwind 工具类 + `class-variance-authority` 驱动；复杂交互（Dialog、Select、Dropdown 等）基于 ark-ui 的 headless primitive。
- **类型完整**：所有 Props / Slots / Emits 都带 TypeScript 类型声明。
- **主题可切换**：颜色、圆角、阴影等视觉常量全部以 CSS 变量形式定义在 `src/style.css`，Tailwind 只负责映射，不硬编码色值。
- **可组合**：高阶组件（如 DataTable）基于底层组件（Table、Button）拼装，不重复维护样式。

---

<!-- TOC -->

- [Phoenix UI 组件库](#phoenix-ui-组件库)
  - [设计原则](#设计原则)
  - [设计令牌与主题](#设计令牌与主题)
    - [令牌分层](#令牌分层)
    - [浅色 / 暗色切换](#浅色--暗色切换)
  - [组件目录](#组件目录)
    - [Button 按钮](#button-按钮)
    - [Input 输入框](#input-输入框)
    - [Badge 徽章](#badge-徽章)
    - [Card 卡片](#card-卡片)
    - [Dialog 对话框](#dialog-对话框)
    - [Table / DataTable 表格](#table--datatable-表格)
  - [扩展新组件](#扩展新组件)

<!-- /TOC -->

---

## 设计原则

1. **语义化 Token 优先**
   组件代码中不出现 hex / rgb 硬编码，统一使用 `bg-primary`、`text-muted-foreground`、`border-input` 等语义类名。主题切换只需修改变量，业务代码零改动。

2. **样式变体集中管理**
   Button / Input / Card / Badge 等组件的样式逻辑抽离到 `*Variants.ts`，由 `cva` 统一维护。组件文件只负责：状态计算、事件转发、插槽渲染。

3. **最小可组合单元**
   复杂组件拆分为多个可单独使用的小组件（如 Card = CardHeader + CardTitle + CardContent + CardFooter），避免 props 爆炸。

4. **无障碍与交互细节**
   - 所有可交互组件提供 `focus-visible` 焦点环。
   - Loading 状态自动禁用并显示 spinner，避免重复提交。
   - 输入框清空、密码可视化等高频交互内聚到组件内部。

---

## 设计令牌与主题

### 令牌分层

| 层级         | 作用                   | 示例                                                    |
| ------------ | ---------------------- | ------------------------------------------------------- |
| **基础常量** | 圆角、阴影、间距       | `--radius-md`、`--shadow-md`、`--space-4`               |
| **语义颜色** | 背景、文字、边框、主色 | `--background`、`--foreground`、`--primary`、`--border` |
| **组件颜色** | 输入框、卡片、浮层     | `--input-background`、`--card`、`--popover`             |
| **状态颜色** | 成功、警告、错误、信息 | `--success`、`--warning`、`--destructive`、`--info`     |

颜色变量使用 **HSL 分量**形式，例如：

```css
--primary: 217.2 91.2% 59.8%;
```

Tailwind 通过 `hsl(var(--primary) / <alpha-value>)` 解析，因此支持 `bg-primary/50`、`text-primary/80` 等透明度写法。

### 浅色 / 暗色切换

在 `html` 或任意祖先元素上添加 `.dark` 类即可切换暗色主题：

```html
<html class="dark">
  ...
</html>
```

切换逻辑可封装在应用设置里：

```ts
// src/composables/useTheme.ts（示例）
export function useTheme() {
  const isDark = ref(false)

  function toggle() {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  return { isDark, toggle }
}
```

> 业务代码中不要直接引用 `--background` 等 CSS 变量，应通过 Tailwind 语义类名（`bg-background`、`text-foreground`）使用。

---

## 组件目录

### Button 按钮

```vue
<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <Button>默认</Button>
  <Button variant="outline">描边</Button>
  <Button variant="destructive">危险</Button>
  <Button variant="ghost">幽灵</Button>
  <Button variant="link">链接</Button>
  <Button size="sm">小</Button>
  <Button size="lg">大</Button>
  <Button loading>加载中</Button>
  <Button as-child>
    <a href="/">作为子元素渲染</a>
  </Button>
</template>
```

#### Props

| 属性     | 类型                                                                   | 默认值  | 说明                   |
| -------- | ---------------------------------------------------------------------- | ------- | ---------------------- |
| variant  | `default` / `secondary` / `outline` / `ghost` / `destructive` / `link` | default | 视觉变体               |
| size     | `default` / `sm` / `lg` / `icon`                                       | default | 尺寸                   |
| loading  | `boolean`                                                              | false   | 加载状态，显示 spinner |
| disabled | `boolean`                                                              | false   | 禁用                   |
| type     | `button` / `submit` / `reset`                                          | button  | 原生 button type       |
| as-child | `boolean`                                                              | false   | 是否将样式合并到子元素 |

> `loading` 会自动等同于 `disabled`，防止重复提交。

---

### Input 输入框

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'

const value = ref('')
</script>

<template>
  <Input v-model="value" placeholder="请输入" />
  <Input v-model="value" type="password" placeholder="密码" />
  <Input v-model="value" size="lg" placeholder="大尺寸" />
  <Input v-model="value" :clearable="false" placeholder="不可清空" />
  <Input v-model="value" :error="true" placeholder="错误状态" />
  <Input v-model="value" placeholder="带前缀">
    <template #prefix><IconUser /></template>
  </Input>
</template>
```

#### 设计说明

- 清空按钮默认开启（`clearable=true`），输入有值且非禁用时显示。
- 密码框有值时自动显示 `eye` / `eye-off` 切换，组件内部维护可视化状态。
- 前缀图标会调整左侧内边距；清空 / 可视化按钮会调整右侧内边距，避免文字被遮挡。
- 表单提交应使用外层 `<form @submit>`，不在 Input 上额外监听 `@keyup.enter`。

#### Props

| 属性         | 类型                    | 默认值  | 说明              |
| ------------ | ----------------------- | ------- | ----------------- |
| modelValue   | `string`                | `''`    | 绑定值            |
| type         | `text` / `password`     | text    | 类型              |
| size         | `default` / `sm` / `lg` | default | 尺寸（控制高度）  |
| placeholder  | `string`                | -       | 占位符            |
| maxlength    | `number` / `string`     | -       | 最大长度          |
| autocomplete | `string`                | -       | 原生 autocomplete |
| disabled     | `boolean`               | false   | 禁用              |
| error        | `boolean`               | false   | 错误态样式        |
| clearable    | `boolean`               | true    | 是否显示清空按钮  |
| class        | `string`                | -       | 额外样式类        |

#### Slots

| 插槽   | 说明         |
| ------ | ------------ |
| prefix | 左侧前缀图标 |

#### Emits

| 事件              | 说明         |
| ----------------- | ------------ |
| update:modelValue | 值变化       |
| enter             | 按下回车     |
| clear             | 点击清空按钮 |

---

### Badge 徽章

```vue
<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
</script>

<template>
  <Badge>默认</Badge>
  <Badge variant="secondary">次级</Badge>
  <Badge variant="destructive">危险</Badge>
  <Badge variant="outline">描边</Badge>
  <Badge as-child>
    <a href="/">链接徽章</a>
  </Badge>
</template>
```

#### Props

| 属性     | 类型                                                | 默认值  | 说明                   |
| -------- | --------------------------------------------------- | ------- | ---------------------- |
| variant  | `default` / `secondary` / `destructive` / `outline` | default | 视觉变体               |
| as-child | `boolean`                                           | false   | 是否将样式合并到子元素 |
| class    | `string`                                            | -       | 额外样式类             |

---

### Card 卡片

```vue
<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>卡片标题</CardTitle>
      <CardDescription>这是一段补充说明。</CardDescription>
    </CardHeader>
    <CardContent>
      <p>主要内容区域。</p>
    </CardContent>
    <CardFooter class="justify-end gap-2">
      <Button variant="outline">取消</Button>
      <Button>确认</Button>
    </CardFooter>
  </Card>
</template>
```

#### 组件清单

| 组件              | 说明       |
| ----------------- | ---------- |
| `Card`            | 卡片容器   |
| `CardHeader`      | 头部区域   |
| `CardTitle`       | 标题       |
| `CardDescription` | 描述文本   |
| `CardContent`     | 内容区     |
| `CardFooter`      | 底部操作栏 |

所有子组件都支持 `class` prop，用于覆盖或扩展默认样式。

---

### Dialog 对话框

基于 ark-ui Dialog 的复合组件，支持两种使用方式。

#### 方式一：组合式（推荐业务弹窗）

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

#### 方式二：DialogModal 便捷组件（兼容旧 AppModal API）

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

### Table / DataTable 表格

#### 基础表格（纯样式）

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

#### DataTable 数据表格（业务层）

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

#### DataTable Props

| 属性    | 类型                  | 必填 | 说明     |
| ------- | --------------------- | ---- | -------- |
| data    | `T[]`                 | 是   | 列表数据 |
| columns | `ColumnDef<T, any>[]` | 是   | 列定义   |
| loading | `boolean`             | 否   | 加载状态 |
| total   | `number`              | 是   | 总条数   |
| current | `number`              | 是   | 当前页   |
| size    | `number`              | 是   | 每页条数 |

#### Emits

| 事件           | 说明     |
| -------------- | -------- |
| update:current | 页码变化 |

---

## 扩展新组件

若需新增基础组件，请遵循以下流程：

1. **先在 `src/style.css` 声明新令牌**（如 `--foo: ...`）。
2. **在 `tailwind.config.js` 添加映射**（如 `foo: 'hsl(var(--foo) / <alpha-value>)'`）。
3. **创建 `src/components/ui/foo/fooVariants.ts`**，用 `cva` 管理变体。
4. **创建 `src/components/ui/foo/Foo.vue`**，组件只负责状态与事件，样式委托给 `fooVariants`。
5. **更新 `src/components/ui/foo/index.ts`** 导出组件与变体。
6. **更新本 README**，补充组件说明、Props / Slots / Events 表格。
7. **运行 `npm run type-check && npm run lint && npm run build` 并实际查看页面**。

---

> 本文档是组件层的唯一入口，后续新增或修改组件时，请同步维护。
