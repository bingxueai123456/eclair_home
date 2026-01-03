---
name: code-review
allowed-tools: [Bash(git:*), Read(*), Grep(*), Glob(*), Task(*)]
description: 智能 Git 提交命令，包含代码审查
version: "2.0.0"
author: "Ice"
---

# Intelligent Git Commit Command with Code Review

这是一个智能的 Git 提交命令，在提交前会自动进行代码审查。

## 核心工作流程

### 步骤 1: 检查变更状态
```bash
git status
git diff --cached
```

### 步骤 1.5: 自动暂存变更（可选但推荐）
检查 git status 输出：
- 如果存在 `Untracked files` 且不是以 `.` 开头的隐藏文件/目录，执行 `git add .` 暂存所有非隐藏文件
- 只排除 `.` 开头的隐藏文件（如 `.claude/`、`.git/` 等），其他文件都应被暂存

### 步骤 2: 执行代码审查 (关键步骤)
**必须调用 code-reviewer agent 进行代码审查:**
```
使用 code-reviewer agent 分析当前暂存的代码变更
```

根据 code-reviewer 的返回结果:
- 如果存在 🔴 **Critical Issues**: 输出 "代码存在严重问题，无法提交"，并展示修改建议，然后 **停止执行**
- 如果只有 🟡 **Warnings**: 显示警告信息，继续执行提交
- 🟢 **No Issues (Review Passed)**: 代码审查通过，可以直接执行提交，无需额外拦截

### 步骤 3: 生成提交信息
分析变更内容，使用 Conventional Commit 格式:
```
<type>(<scope>): <subject>
```

类型映射:
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `build`: 构建系统
- `chore`: 其他更改

### 步骤 4: 执行提交
```bash
git commit -m "<生成的提交信息>"
```

### 步骤 5: 推送到远程
```bash
git push
```

## 代码审查拦截规则

| 问题等级 | 拦截行为 | 输出信息 |
|---------|---------|---------|
| 🔴 Critical | ✅ **必须拦截** | "代码存在严重问题，无法提交。请先修复以下问题：" |
| 🟡 Warnings | ❌ 不拦截 | 显示警告，但允许用户继续 |
| 🟢 Suggestions | ❌ 不拦截 | 显示建议，但允许用户继续 |

## 使用示例

```
>> /cc
>> /cc 修复登录bug
>> /cc feat: 添加用户模块
```

## 重要说明

1. **必须先调用 code-reviewer**: 在执行任何 git 操作之前，必须先调用 code-reviewer agent
2. **拦截逻辑**: 遇到 Critical Issues 时，必须停止执行并返回修改建议，如果没有 Critical Issues 则继续执行提交
3. **语言**: 提交信息默认使用中文
4. **格式**: 必须符合 Conventional Commit 标准
