# phoenix-web 配置基座完善计划

> 在继续填充 views 页面之前，先把项目底层配置、工程规范、全局能力补齐。
> 目标：让后续写页面时只关注业务，不再为 lint、类型、提示、文件下载等分心。

## 一、三大件现状评估

| 模块       | 状态                 | 主要问题                                                                                                                                      |
| ---------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **layout** | 骨架可用，但细节粗糙 | ① Logo 硬编码文字，无品牌图；② 消息通知铃铛缺失；③ 用户下拉无头像/个人中心；④ Settings 面板很多设置项未接线（主题色、页签显隐、表格密度等）。 |
| **router** | 静态路由 + 守卫可用  | ① 403 场景直接回退首页（TODO）；② 外链路由（InnerLink）已在但无菜单项接入；③ 路由表 title 多为直写中文，titleKey 覆盖率不足。                 |
| **store**  | 结构清晰             | ① `userInfo: any` 类型缺失；② permission store 只有标识数组，缺少 `hasAnyPerm`/`hasAllPerm`；③ tabs store 已较完整。                          |

## 二、配置层粗糙点清单

### 2.0 项目清理与配置说明（你刚指出的问题，优先处理）

| 项                                                                 | 现状                                                                             | 补齐内容                                                                                 |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| README scripts 说明                                                | 写了 dev/build/preview，但没解释每个命令的作用和常用组合                         | 在 README「项目启动」节补充每个 script 的用途，例如 `npm run lint`、`npm run type-check` |
| `.vscode` 目录                                                     | 只有一个 `extensions.json`，推荐 Vue.volar，对当前项目几乎无意义                 | 删除或改成有实际价值的配置（推荐插件 + 设置），否则直接移除                              |
| `phoenix-web.code-workspace`                                       | 空配置                                                                           | 删除                                                                                     |
| `public/icons.svg`                                                 | Vite 默认模板里的社交图标集（bluesky/discord/github 等）                         | 删除                                                                                     |
| `public/favicon.svg`                                               | Vite 默认图标                                                                    | 替换为 Phoenix 项目品牌 favicon                                                          |
| `src/components/HelloWorld.vue`                                    | Vite 默认模板组件，只在首页占位                                                  | 删除                                                                                     |
| `src/assets/vite.svg`、`src/assets/vue.svg`、`src/assets/hero.png` | Vite 默认模板资源                                                                | 删除                                                                                     |
| 根配置注释                                                         | `postcss.config.js`、`tailwind.config.js`、`vite.config.ts` 等没有说明为什么存在 | 每份根配置顶部加注释，写明「它是谁的入口、解决了什么问题、修改时要同步哪里」             |

### 2.1 工程规范（P0：必须先补）

| 项                   | 现状                   | 补齐内容                                                                              |
| -------------------- | ---------------------- | ------------------------------------------------------------------------------------- |
| ESLint               | 缺失                   | 接入 `eslint` + `@antfu/eslint-config` 或 Vue 官方配置，统一单引号、分号、import 排序 |
| Prettier             | 缺失                   | 配置 `.prettierrc.json`，与 ESLint 不冲突                                             |
| EditorConfig         | 缺失                   | 配置 `.editorconfig`（缩进、换行、末尾空行）                                          |
| Husky + lint-staged  | 缺失                   | 提交前自动 `vue-tsc --noEmit` + `eslint --fix`                                        |
| commitlint           | 缺失                   | 按 README 的 type 规则拦截不规范提交                                                  |
| package.json scripts | 只有 dev/build/preview | 增加 `lint`、`lint:fix`、`format`、`type-check`、`prepare`                            |
| .env.example         | 缺失                   | 提供模板（即使 .env 已入库，example 仍是规范）                                        |

### 2.2 类型与工具函数（P0）

| 项              | 现状                 | 补齐内容                                                                              |
| --------------- | -------------------- | ------------------------------------------------------------------------------------- |
| `userInfo` 类型 | `any`                | 定义 `LoginInfoRes` 接口（token 外字段：userId、username、nickname、perms、roles 等） |
| `PageQuery`     | `[key: string]: any` | 拆分为 `BasePageQuery` + 各业务 query，避免 any                                       |
| 表单校验        | 缺失                 | 新建 `src/utils/validate.ts`，统一邮箱、手机、用户名、密码规则                        |
| 日期格式化      | 缺失                 | 新建 `src/utils/datetime.ts`，基于 dayjs，统一 `formatDateTime`、`dateRange`          |
| 文件下载        | 缺失                 | 新建 `src/utils/download.ts`，处理 Blob / 文件名提取                                  |
| 字典翻译 hook   | 缺失                 | 新建 `src/hooks/useDicts.ts`，与 Jarvis-web `useDicts` 行为对齐                       |

### 2.3 全局反馈组件（P0）

| 项                  | 现状      | 补齐内容                                                              |
| ------------------- | --------- | --------------------------------------------------------------------- |
| AppMessage          | 缺失      | 基于 ark-ui Toast 或自绘轻提示，支持 success/error/warning/info       |
| AppConfirm          | 缺失      | 基于 ark-ui Dialog 或自绘确认框，替代原生 confirm/Navbar 内的自绘弹窗 |
| request.ts 错误提示 | 只 reject | 非 401 业务错误默认 toast 提示，可传入 `silent: true` 关闭            |

### 2.4 请求封装增强（P1）

| 项       | 现状 | 补齐内容                                        |
| -------- | ---- | ----------------------------------------------- |
| 文件导出 | 缺失 | `request.export` / `request.download` 方法      |
| 文件导入 | 缺失 | `request.upload` 方法（multipart/form-data）    |
| 下载模板 | 缺失 | 复用文件下载方法                                |
| 请求取消 | 缺失 | 为部分查询接口提供 AbortController 支持（可选） |

### 2.5 通用组件层增强（P1）

| 组件          | 现状                | 补齐内容                                     |
| ------------- | ------------------- | -------------------------------------------- |
| DataTable     | 只有基础表格 + 分页 | 增加多选列、排序、空状态、错误状态、加载骨架 |
| AppPagination | 内嵌在 DataTable    | 抽离独立组件，支持页码输入、每页条数         |
| AppSwitch     | 缺失                | 行内状态开关                                 |
| AppDropdown   | 缺失                | 操作列「更多」下拉                           |
| AppTransfer   | 缺失                | 分配角色/菜单                                |
| AppTreeSelect | 缺失                | 机构/上级菜单选择                            |
| AppAvatar     | 缺失                | 头像/文字头像/彩色背景                       |
| AppTag        | 缺失                | 状态/性别标签                                |
| AppSearchForm | 缺失                | 查询区域统一布局                             |

### 2.6 国际化文案（P1）

| 项            | 现状                     | 补齐内容                                                                    |
| ------------- | ------------------------ | --------------------------------------------------------------------------- |
| 语言包        | 只有登录/菜单/navbar/404 | 补充 system/_、monitor/_ 页面文案；补充通用表格操作、表单校验、确认提示文案 |
| 路由 titleKey | 少量                     | 路由表统一使用 titleKey，页签语言切换才能生效                               |

### 2.7 主题与设置（P2）

| 项       | 现状   | 补齐内容                                               |
| -------- | ------ | ------------------------------------------------------ |
| 主题模式 | 只存值 | Tailwind 配置 dark 模式令牌，Settings「浅色/深色」生效 |
| 主题色   | 只存值 | 将 primary 改为 CSS 变量，Settings 色板即时生效        |
| 页签显隐 | 只存值 | layout 读取 `showTagsView` 控制 TagsView 显隐          |
| 表格密度 | 只存值 | DataTable 读取 `tableSize` 切换 padding                |

### 2.8 部署配置（P2）

| 项         | 现状 | 补齐内容                                        |
| ---------- | ---- | ----------------------------------------------- |
| nginx.conf | 缺失 | 提供前端部署配置（history 模式回退 index.html） |
| Dockerfile | 缺失 | 多阶段构建镜像                                  |

## 三、执行顺序建议

按「先 P0、后 P1、再 P2」分阶段推进，每阶段完成后本地 `npm run build` 与 `npm run lint` 必须绿：

### 阶段 0：项目清理与配置说明

1. 删除冗余文件：`.vscode/`、`phoenix-web.code-workspace`、`public/icons.svg`、`src/components/HelloWorld.vue`、模板资源。
2. 替换 `public/favicon.svg` 为项目品牌图标。
3. 给 `postcss.config.js`、`tailwind.config.js`、`vite.config.ts` 等根配置加注释。
4. 更新 README，补充 `package.json` 每个 script 的说明。

### 阶段 1：工程规范 + 类型基础（P0）

1. 安装 ESLint / Prettier / EditorConfig / Husky / lint-staged / commitlint。
2. 配置 lint 规则并跑一遍全仓库格式化。
3. 补齐 `src/types/user.ts`、`src/types/api.ts` 精炼。
4. 补齐 `src/utils/validate.ts`、`src/utils/datetime.ts`、`src/utils/download.ts`。

### 阶段 2：全局反馈 + 请求增强（P0）

1. 实现 `AppMessage`、`AppConfirm`。
2. `request.ts` 接入全局错误提示与文件下载/上传方法。
3. 用 `AppConfirm` 替换 Navbar/Login 等处的原生 confirm 和自绘弹窗。

### 阶段 3：公共组件层（P1）

1. 增强 `DataTable`（多选/排序/空状态）。
2. 新增 `AppPagination`、`AppSwitch`、`AppDropdown`、`AppTransfer`、`AppTreeSelect`、`AppAvatar`、`AppTag`、`AppSearchForm`。

### 阶段 4：国际化 + 主题（P1/P2）

1. 扩充 `locales/zh-CN.ts`。
2. 路由表统一 `titleKey`。
3. Tailwind 接入 CSS 变量主题（可选，可在 views 迁移完后再做）。

### 阶段 5：部署配置（P2）

1. 补充 `nginx.conf`、`Dockerfile`。

## 四、阻塞后续视图迁移的关键项

以下如不先补齐，每写一页都要重复造轮子：

1. **表单校验**（user/role/menu/org 都要用）。
2. **日期格式化**（所有列表页都要用）。
3. **字典翻译 hook**（状态/性别/角色等字典列都要用）。
4. **AppMessage / AppConfirm**（保存/删除/状态切换的反馈）。
5. **文件下载/上传**（user 导入导出、操作日志导出）。
6. **AppTransfer**（user 分配角色、role 分配菜单）。
7. **AppTreeSelect**（user 选择机构、menu 选择上级）。

## 五、下一步建议

建议先进入 **阶段 1（工程规范 + 类型基础）**，同步把阶段 2 的 `AppMessage` / `AppConfirm` / request 增强也做了。
等基础能力全绿后，再按原《phoenix-web-migration-plan.md》逐页迁移 views。
