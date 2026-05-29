module.exports = {
  types: [
    { value: 'feat',     name: 'feat:     新增功能' },
    { value: 'fix',      name: 'fix:      修复缺陷' },
    { value: 'docs',     name: 'docs:     文档变更' },
    { value: 'style',    name: 'style:    代码格式（不影响功能）' },
    { value: 'refactor', name: 'refactor: 代码重构（既不是新增功能，也不是修复缺陷）' },
    { value: 'perf',     name: 'perf:     性能优化' },
    { value: 'test',     name: 'test:     添加或修改测试' },
    { value: 'build',    name: 'build:    构建系统或外部依赖（webpack、vite、npm 等）' },
    { value: 'ci',       name: 'ci:       持续集成配置（GitHub Actions、Jenkins 等）' },
    { value: 'chore',    name: 'chore:    其他杂项（不修改 src 或 test 文件）' },
    { value: 'revert',   name: 'revert:   回滚提交' },
  ],

  scopes: [
    { name: 'components' },
    { name: 'views' },
    { name: 'router' },
    { name: 'stores' },
    { name: 'api' },
    { name: 'composables' },
    { name: 'types' },
    { name: 'assets' },
    { name: 'config' },
  ],

  messages: {
    type: '选择你的提交类型：',
    scope: '选择影响范围（可选）：',
    customScope: '输入自定义范围：',
    subject: '写一个简短的描述：\n',
    body: '写一个详细的描述（可选）。使用 "|" 换行：\n',
    breaking: '列出 BREAKING CHANGES（可选）：\n',
    footer: '列出关联的 ISSUES，例如："Closes #123"（可选）：\n',
    confirmCommit: '确认提交以上信息？',
  },

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  subjectLimit: 100,
  breaklineChar: '|',
}
