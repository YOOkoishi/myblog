---
title: Git & Github
author:
header: 索思科技协会技术分享会
footer: 2025年10月 | Git & Github
showPageNumber: "true"
---


# 第三部分

## Git 与 GitHub

# 什么是 Git？

**分布式版本控制系统**

## 核心概念

- **Repository（仓库）** - 项目存储位置
- **Commit（提交）** - 代码快照
- **Branch（分支）** - 独立开发线
- **Remote（远程）** - 服务器上的仓库

# Git 基础配置

## 第一次使用 Git

```bash
# 设置用户信息
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# 查看配置
git config --list

# 初始化仓库
git init
```

# Git 基本工作流

## 四步提交流程

```bash
# 1. 查看状态
git status

# 2. 添加到暂存区
git add file.txt        # 添加单个文件
git add .               # 添加所有修改

# 3. 提交更改
git commit -m "Add feature"

# 4. 查看历史
git log --oneline
```

# 分支操作

## 创建和切换分支

```bash
# 查看分支
git branch

# 创建分支
git branch feature-login

# 切换分支
git checkout feature-login
# 或（推荐）
git switch feature-login

# 创建并切换
git checkout -b feature-login
git switch -c feature-login
```

# 分支合并

## Merge 工作流

```bash
# 在 feature 分支工作
git checkout feature-login
# ... 进行修改和提交 ...

# 切回主分支
git checkout main

# 合并 feature 分支
git merge feature-login

# 删除已合并的分支
git branch -d feature-login
```

# 远程操作

## 与 GitHub 协作

```bash
# 添加远程仓库
git remote add origin https://github.com/user/repo.git

# 推送到远程
git push -u origin main

# 从远程拉取
git pull origin main

# 查看远程仓库
git remote -v
```

# Git 最佳实践

## 提交信息规范

```bash
# ✅ 好的提交信息
git commit -m "feat: Add user login feature"
git commit -m "fix: Resolve memory leak in parser"
git commit -m "docs: Update installation guide"

# ❌ 糟糕的提交信息
git commit -m "update"
git commit -m "fix bug"
git commit -m "..."
```

**格式：** `<type>: <description>`

**类型：** feat, fix, docs, style, refactor, test, chore

# .gitignore 文件

## 忽略不需要版本控制的文件

```gitignore
# Python
__pycache__/
*.pyc
venv/

# Node.js
node_modules/
npm-debug.log

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# 敏感信息
.env
config/secrets.json
```
