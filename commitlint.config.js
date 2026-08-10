/**
 * commitlint 配置入口。
 *
 * 本文件解决什么问题：
 * - 拦截不规范的 commit message，强制使用 README 中约定的 type 前缀；
 * - 与 Husky prepare-commit-msg 钩子配合，在本地提交前校验。
 *
 * 修改注意点：
 * - 新增 type 时，同步更新 README「git 代码提交规范」和此处 rules。
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore']],
    'type-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
  },
}
