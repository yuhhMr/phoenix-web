# phoenix-web views 逐页重构计划

> 目标：把 Jarvis-web 已验证的业务逻辑与交互，按「TS + ark-ui + Tailwind」技术栈迁移到 phoenix-web，
> 不复制 Element Plus 皮肤，只复用经过生产检验的数据流、字段集合、校验规则、交互路径。
> 后端契约已冻结在 `phoenix-fast/docs/api/openapi-m2-frozen.json`。

## 一、现状速览

| 页面           | phoenix-web 当前行数 | Jarvis-web 参考行数 | 差距                                                           | 优先级     |
| -------------- | -------------------- | ------------------- | -------------------------------------------------------------- | ---------- |
| system/user    | 253                  | 1077                | 缺少批量、导入导出、重置密码、分配角色、详情、头像、性别、机构 | P0（样板） |
| system/role    | 166                  | 786                 | 缺少菜单授权、数据权限、批量、状态切换                         | P1         |
| system/menu    | 182                  | 1008                | 缺少图标选择器、树形拖拽、可见性/缓存/外链开关                 | P1         |
| system/org     | 145                  | 599                 | 缺少树展开/拖拽、机构状态、负责人                              | P1         |
| system/dict    | 137                  | 714                 | 缺少字典类型页 + 字典数据页联动                                | P2         |
| system/config  | 147                  | -                   | 后端有 `/system/config/page`，可独立完成                       | P2         |
| system/notice  | 208                  | 237                 | 差距最小，消息已读/标记逻辑                                    | P2         |
| monitor/online | 86                   | 266                 | 强踢、查询条件                                                 | P3         |
| monitor/job    | 190                  | 1129                | 缺少表达式生成器、执行日志、单次执行                           | P3         |
| monitor/log    | 87                   | 452                 | 缺少操作日志详情、清空、多条件筛选                             | P3         |

> Jarvis-web 的 `system/tenant`、`system/model`、`system/codegen` 不在当前后端契约内，本次不迁移。

## 二、迁移顺序

按「依赖少 → 依赖多 → 复杂度低 → 复杂度高」排列：

1. **system/user（样板页）**：依赖 org/role/dict，但可作为通用组件试金石。
2. **system/role**：依赖 menu，完成后 role 选项数据可用于 user。
3. **system/org / system/menu**：基础主数据，很多页面依赖机构树和菜单树。
4. **system/dict**：被 config/notice 等页引用，且本身分类型/数据两页。
5. **system/config / system/notice**：相对独立，收尾主数据。
6. **monitor/online / monitor/log / monitor/job**：监控类页面最后统一处理。

## 三、公共组件缺口（先于页面补齐）

迁移 user 页前，先把以下通用组件补齐到 `src/components`，避免每个页面重复实现：

| 组件                | 用途                                            | 依赖                |
| ------------------- | ----------------------------------------------- | ------------------- |
| `AppSearchForm.vue` | 查询表单项 + 重置/查询按钮的统一布局            | AppInput、AppButton |
| `AppPagination.vue` | 替换 DataTable 内嵌分页，支持页码跳转、每页条数 | -                   |
| `AppSwitch.vue`     | 行内状态开关（ark-ui Switch + Tailwind 样式）   | -                   |
| `AppDropdown.vue`   | 操作列「更多」下拉（ark-ui Menu）               | -                   |
| `AppAvatar.vue`     | 头像/文字头像/彩色背景头像                      | -                   |
| `AppTransfer.vue`   | 分配角色/分配菜单的双向穿梭框                   | -                   |
| `AppTreeSelect.vue` | 机构选择、上级菜单选择                          | -                   |
| `AppTag.vue`        | 状态/性别标签                                   | -                   |
| `AppConfirm.vue`    | 二次确认弹窗（替代原生 confirm）                | AppModal            |
| `AppMessage.vue`    | 轻提示（替代 alert）                            | -                   |

## 四、每页验收 Checklist（user 页示例，后续每页复用同一套维度）

### system/user 验收项

- [ ] 查询：用户名、昵称、状态下拉（字典 `sys_status`），支持回车触发。
- [ ] 表格：多选、头像、性别标签、状态开关、创建时间格式化、操作列。
- [ ] 操作列：编辑、删除、更多（查看详情 / 重置密码 / 分配角色 / 启用 / 停用）。
- [ ] 新增：用户名、初始密码、昵称、性别、邮箱、手机号、机构选择、状态。
- [ ] 编辑：禁用用户名，可改昵称、性别、邮箱、手机号、机构。
- [ ] 表单校验：用户名 2-16 位、密码 8-32 位、邮箱/手机格式。
- [ ] 批量删除：表格多选后 toolbar 批量删除按钮可用。
- [ ] 重置密码：弹窗内两次输入一致校验，提交后提示成功。
- [ ] 分配角色：Transfer 组件展示可选角色，回填当前角色，提交保存。
- [ ] 用户详情：卡片式弹窗，展示头像、性别/状态标签、邮箱/手机/机构/角色/创建时间/最后登录时间。
- [ ] 权限控制：所有按钮按 `system:user:*` 权限标识显隐。
- [ ] 国际化：页面所有文案走 `vue-i18n`（zh-CN 即可）。
- [ ] 类型安全：页面通过 `vue-tsc` 无报错。

## 五、提交与分支建议

- 分支：`feature/m2-views-migration`
- 提交粒度：每完成一页 + 其依赖 API/组件后单独 commit。
  - `feat(components): 补齐 AppPagination/AppSwitch/AppDropdown 等通用组件`
  - `feat(views): system/user 完整迁移（查询/表单/批量/重置密码/分配角色/详情）`
  - `feat(views): system/role 完整迁移（含菜单授权）`
  - ……
- 每页完成后 push，在浏览器逐项验收。

## 六、当前阻塞点

1. phoenix-web 缺少 `AppPagination`、`AppSwitch`、`AppDropdown`、`AppTransfer`、`AppTreeSelect` 等组件。
2. `src/api/user.ts` 只实现了分页/详情/增/改/删/改状态，缺少重置密码、分配角色、批量删除、导入导出。
3. 后端契约中用户相关接口路径为 `/system/user/...`，需确认与现有 `request.ts` 前缀一致。

## 七、下一步行动

1. 补齐公共组件层（约 10 个组件）。
2. 补齐 `src/api/user.ts` 缺失接口。
3. 重写 `src/views/system/user/index.vue` 作为样板页。
4. 本地 `npm run build` 通过，浏览器逐项验收。
5. 提交 push 后继续下一页。
