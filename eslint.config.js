/**
 * ESLint 配置入口（Flat Config 格式）。
 *
 * 本文件解决什么问题：
 * - 统一 JavaScript / TypeScript / Vue 单文件组件的代码风格；
 * - 与 Prettier 集成，避免格式规则冲突；
 * - 扫描 src/ 下的 .ts / .vue 文件，排除自动生成的类型声明和构建产物。
 *
 * 修改注意点：
 * - 新增目录或文件类型时，同步调整 files / ignores；
 * - 临时关闭某条规则时，在对应规则对象中注释说明原因。
 */
import js from '@eslint/js'
import ts from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import prettier from 'eslint-plugin-prettier/recommended'
import globals from 'globals'

export default ts.config(
  // 基础推荐规则
  js.configs.recommended,
  ...ts.configs.recommended,
  ...pluginVue.configs['flat/recommended'],

  // Prettier 放在最后，覆盖可能的格式冲突
  prettier,

  {
    files: ['src/**/*.ts', 'src/**/*.vue', '*.config.{js,ts}', 'vite.config.ts'],
    languageOptions: {
      // 浏览器全局变量（document、window、localStorage、alert、confirm 等）
      globals: globals.browser,
      parserOptions: {
        parser: ts.parser,
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      // Vue 多单词组件名对通用组件要求过严，本项目允许 User / Login 等单单词页面名
      'vue/multi-word-component-names': 'off',
      // TypeScript 已做类型检查，关闭运行时 any 警告以减少噪音
      '@typescript-eslint/no-explicit-any': 'off',
      // 未使用变量由 tsconfig noUnusedLocals 处理，ESLint 不再重复报错
      '@typescript-eslint/no-unused-vars': 'off',
      // 页面里暂时保留 alert/confirm，后续统一替换为 AppMessage/AppConfirm
      'no-alert': 'off',
      // TypeScript 与 unplugin-auto-import 已覆盖未定义检查，ESLint 不再重复
      'no-undef': 'off',
    },
  },

  {
    ignores: ['dist/', 'node_modules/', 'src/types/auto-imports.d.ts', 'src/types/components.d.ts'],
  },
)
