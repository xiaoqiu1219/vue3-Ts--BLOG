---
name: commit-and-push
description: 用于提交和推送代码。当用户说"提交代码"、"推送代码"、"push"、"commit"、"提交并推送"、"发布代码"时触发。自动完成代码审查、简化、提交和双远程推送。
---

# 提交并推送代码

提交代码的标准化流程，确保每次都经过质量检查并推送到所有远程仓库。

## 触发条件

当用户提出以下任一意图时使用此 skill：
- 提交代码、commit、提交
- 推送代码、push、推送
- 提交并推送
- 发布代码

## 远程仓库

本项目有**两个**远程仓库，推送时必须**同时推送**：

| 远程名 | 地址 |
|--------|------|
| `origin` | `https://gitee.com/garvey-jia/practice-with-vue3.git`（Gitee） |
| `github` | `https://github.com/xiaoqiu1219/vue3-Ts--BLOG.git`（GitHub） |

GitHub 仓库关联了 GitHub Actions 自动部署到 GitHub Pages，只推到 Gitee 不会触发线上更新。

## 提交流程

### 第 1 步：查看工作区状态

```bash
git status
```

了解当前有哪些文件被修改、暂存或未跟踪。如果没有任何改动，告知用户并结束。

### 第 2 步：代码审查

**必须先审查再提交**，顺序如下：

1. **/code-review** — 检查 diff 中的正确性 bug 和可复用/简化/效率问题
2. 修复 code-review 发现的问题
3. **/simplify** — 仅检查代码复用、简化、效率、架构层面（不找 bug）
4. 应用 simplify 的建议

> 注：如果是纯二进制文件（如 favicon.ico、图片等），可跳过 /code-review 和 /simplify，但仍需执行 /simplify 检查是否有其他代码改动需要清理。

### 第 3 步：暂存并提交

将改动暂存并创建提交：

```bash
git add <files>
git commit -m "type(scope): 中文描述"
```

**提交信息要求**：
- 使用**中文**描述
- 遵循 conventional commits 格式：`type(scope): 中文描述`
- 常用 type：`feat`（新功能）、`fix`（修复）、`chore`（杂项）、`style`（样式）、`refactor`（重构）、`docs`（文档）、`ci`（CI/CD）

提交前 preCommit hooks 会自动执行 ESLint + vue-tsc 检查。

### 第 4 步：双远程推送

**必须同时推送到两个远程仓库**：

```bash
git push origin master
git push github master
```

如果某个远程推送失败，报告错误但不要阻塞 — 另一个远程可能仍然推送成功。

### 第 5 步：确认结果

汇总提交和推送结果，告知用户：
- 提交的 hash 和 message
- origin（Gitee）推送状态
- github（GitHub）推送状态
- 如果推到了 GitHub，部署到 GitHub Pages 通常需要 1-2 分钟
