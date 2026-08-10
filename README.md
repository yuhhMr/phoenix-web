# phoenix-web

phoenix-fast 管理端前端（后端仓库：[phoenix-fast](https://github.com/yuhhMr/phoenix-fast)）。

基于 Vue 3 + TypeScript + Vite，UI 层为 ark-ui（headless 逻辑层）+ Tailwind CSS（原子化样式层），图标使用 lucide（unplugin-icons）。

## 技术栈

| 分类 | 选型 |
|------|------|
| 框架 | Vue 3（Composition API + `<script setup>`） |
| 语言 | TypeScript（vue-tsc 严格模式） |
| 构建 | Vite 8 |
| 组件逻辑层 | ark-ui（Dialog/Select 等交互组件）+ 自研样式壳（AppInput/AppButton/AppModal/DataTable） |
| 样式 | Tailwind CSS 3 |
| 表格 | TanStack Table（Vue） |
| 路由 / 状态 | Vue Router 4 / Pinia（persistedstate 持久化） |
| 请求 | axios（统一封装：token 注入、body code 判定、401 回收、滑动续期） |
| 国际化 | vue-i18n（zh-CN） |

## 环境要求

- Node.js ≥ 20（建议 22+）
- npm ≥ 10
- 后端：phoenix-fast dev 实例（默认 `http://localhost:8080`）

## 项目启动

```sh
# 安装依赖
npm install

# 开发（热更新，默认 5173 端口，/api 代理到后端）
npm run dev

# 类型检查 + 生产构建
npm run build

# 预览构建产物
npm run preview
```

## 环境变量

配置文件全部入库（前端无密钥——RSA 公钥由后端 `/auth/public-key` 动态下发）：

| 文件 | 用途 |
|------|------|
| `.env` | 共享配置（`VITE_APP_TITLE` 站点标题） |
| `.env.development` | 开发环境（`VITE_APP_BASE_API` 后端地址，vite 代理 target） |
| `.env.production` | 生产环境（同源部署，`VITE_APP_BASE_API=/`） |

## 目录结构

```
src/
├── api/           # 按后端领域划分的请求模块 + request 封装
├── assets/        # 静态资源（登录背景图等）
├── components/    # 通用组件层（AppInput/AppButton/AppModal/DataTable）
├── config/        # 站点配置（读 import.meta.env 的收口模块）
├── directives/    # v-perm 权限指令
├── layout/        # 布局：Sidebar / Navbar / TagsView / AppMain / Settings / InnerLink
├── locales/       # 国际化语言包
├── router/        # 静态路由 + 守卫（guards）+ 菜单/权限工具（utils）
├── store/         # Pinia：user / permission / tabs / app
├── types/         # 类型声明（env、router meta、自动生成的 d.ts）
├── utils/         # rsa / device / routeTitle / theme
└── views/         # 页面（login、index 首页、system/*、monitor/*、error/404）
```

## git 代码提交规范

### Commit Message

格式：`type: 描述`（type 与描述之间必须有冒号和一个空格）

例：`feat: 支持异步执行`

type 必须是以下之一（小写）：

- `feat`：修改/增加新功能
- `fix`：修改 bug 的变更
- `docs`：文档相关变更
- `style`：不影响代码含义的变更（空白、格式、缺少符号等）
- `refactor`：代码重构变更
- `perf`：改进性能的变更
- `test`：添加/修改现有的测试
- `chore`：构建、.gitignore 或辅助工具、库等变更

### 分支命名

分支必须以前缀开头：`bugfix/`、`feature/`、`release/`、`hotfix/`

## 依赖升级

```sh
npm outdated                    # 查看哪些依赖包有更新
npm update package-name -D      # 更新开发依赖
npm update package-name --save  # 更新生产依赖
```
