---
title: git 详细操作
description: git 的原理和详细操作，以及高阶技巧。
pubDate: 2025-10-12
image: /image/git.png
categories:
  - tech
tags:
  - blog
  - git
---

## 什么是 Git？

### 核心概念

**分布式版本控制系统**

- **Repository（仓库）** - 项目存储位置
- **Commit（提交）** - 代码快照
- **Branch（分支）** - 独立开发线
- **Remote（远程）** - 服务器上的仓库

## Git 基础配置

### 第一次使用 Git

```bash
# 设置用户信息
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# 查看配置
git config --list
git config user.name                  # 查看单项配置

# 配置编辑器
git config --global core.editor vim

# 初始化仓库
git init
git init my-project                   # 创建并初始化
```

## Git 数据模型（核心）

### Git 如何存储数据？

**Git 是一个内容寻址文件系统**

```
objects/
├── blob (文件内容)
├── tree (目录结构)
└── commit (提交信息)
```

**每个对象都有 SHA-1 哈希值标识**

```bash
# 查看对象类型
git cat-file -t <hash>

# 查看对象内容
git cat-file -p <hash>
```

## Git 数据模型：对象类型

### 三种核心对象

**Blob（二进制大对象）**

- 存储文件内容
- 不包含文件名、权限等元数据

**Tree（树对象）**

- 类似目录结构
- 包含 blobs 和其他 trees 的引用
- 存储文件名和权限

**Commit（提交对象）**

- 指向一个 tree（项目快照）
- 包含作者、日期、提交信息
- 指向父提交（形成历史链）

## Git 历史：DAG 有向无环图

### 提交历史是图结构

```
o <-- o <-- o <-- o (main)
            ^
             \
              o <-- o (feature)
```

**每个提交都指向父提交：**

```bash
# 查看提交历史图
git log --all --graph --decorate --oneline

# 示例输出：
* a3f5b21 (main) Merge feature branch
|\  
| * 9d2c1e4 (feature) Add new feature
* | 7b8a3c2 Fix bug in main
|/  
* 5c1d9f3 Initial commit
```

## Git 引用（References）

### 指向提交的指针

**分支（Branches）**

```bash
# 分支只是指向提交的可变指针
cat .git/refs/heads/main
# 输出：a3f5b217e9c8...（某个 commit 的 SHA-1）
```

**HEAD**

- 指向当前分支的特殊引用
- 决定"你现在在哪里"

```bash
cat .git/HEAD
# ref: refs/heads/main
```

**Tags（标签）**

- 指向提交的不可变指针
- 用于标记版本发布

```bash
git tag v1.0.0
git tag -a v1.0.0 -m "Release version 1.0"
```

## Git 基本工作流

### 四步提交流程

```bash
# 1. 查看状态
git status

# 2. 添加到暂存区
git add file.txt                      # 添加单个文件
git add *.py                          # 添加所有 Python 文件
git add .                             # 添加所有修改

# 3. 提交更改
git commit -m "Add feature"
git commit -am "Quick commit"         # 跳过 add（仅跟踪文件）

# 4. 查看历史
git log --oneline
git log --graph --all --decorate      # 图形化历史
```

## 暂存区（Staging Area）

### 三个区域

```
工作目录 (Working Directory)
    ↓  git add
暂存区 (Staging Area / Index)
    ↓  git commit
仓库 (Repository / .git)
```

**为什么需要暂存区？**

- 精细控制提交内容
- 部分提交修改
- 构建"逻辑提交"

```bash
# 交互式暂存
git add -p                            # 部分暂存
git diff                              # 工作目录 vs 暂存区
git diff --staged                     # 暂存区 vs 仓库
```

## 撤销操作

### 不同阶段的撤销

```bash
# 工作目录修改撤销
git checkout -- file.txt              # 旧语法
git restore file.txt                  # 新语法（推荐）

# 取消暂存
git reset HEAD file.txt               # 旧语法
git restore --staged file.txt         # 新语法（推荐）

# 修改最后一次提交
git commit --amend                    # 修改提交信息或添加文件
git commit --amend --no-edit          # 只添加文件，不改信息
```

## 撤销操作：reset

### 三种模式

```bash
# 软重置：移动 HEAD，保留暂存区和工作目录
git reset --soft HEAD~1

# 混合重置（默认）：移动 HEAD，重置暂存区，保留工作目录
git reset HEAD~1
git reset --mixed HEAD~1

# 硬重置：全部重置（危险！）
git reset --hard HEAD~1
```

**使用场景：**

- `--soft`：合并多个提交
- `--mixed`：取消暂存，重新组织提交
- `--hard`：完全放弃修改

## 分支操作

### 创建和切换分支

```bash
# 查看分支
git branch                            # 本地分支
git branch -a                         # 所有分支（含远程）

# 创建分支
git branch feature-login

# 切换分支（新语法，推荐）
git switch feature-login
git switch -c feature-new             # 创建并切换

# 切换分支（旧语法）
git checkout feature-login
git checkout -b feature-login         # 创建并切换
```

## 分支合并

### Merge vs Rebase

**Merge（合并）**

```bash
git checkout main
git merge feature
# 创建一个新的 merge commit
```

```
    o <-- o (main)
   /       \
  o <------ o (合并后)
 (feature)
```

**Rebase（变基）**

```bash
git checkout feature
git rebase main
# 将 feature 的提交"重放"到 main 之上
```

```
原来：    o -- o (main)
         /
    o -- o (feature)

变基后： o -- o (main) -- o' -- o' (feature)
```

## 分支合并：冲突解决

### 当两个分支修改同一处代码

```bash
# 尝试合并时发生冲突
$ git merge feature
Auto-merging file.txt
CONFLICT (content): Merge conflict in file.txt
```

**冲突标记：**

```
<<<<<<< HEAD
main branch code
=======
feature branch code
>>>>>>> feature
```

**解决步骤：**

1. 编辑文件，保留需要的代码
2. `git add file.txt`
3. `git commit`（或 `git rebase --continue`）

## 远程操作

### 与 GitHub 协作

```bash
# 克隆远程仓库
git clone https://github.com/user/repo.git

# 添加远程仓库
git remote add origin https://github.com/user/repo.git

# 推送到远程
git push origin main
git push -u origin main               # -u 设置上游分支

# 从远程拉取
git fetch origin                      # 只下载，不合并
git pull origin main                  # fetch + merge
git pull --rebase origin main         # fetch + rebase

# 查看远程仓库
git remote -v
```

## 远程分支

### 追踪远程分支

```bash
# 查看远程分支
git branch -r

# 基于远程分支创建本地分支
git checkout -b feature origin/feature
git switch -c feature origin/feature

# 推送本地分支到远程
git push origin feature

# 删除远程分支
git push origin --delete feature
```

**远程追踪分支：**

- 格式：`<remote>/<branch>`
- 例如：`origin/main`

## Git 高级技巧：Stash

### 临时保存修改

```bash
# 保存当前工作
git stash
git stash save "Work in progress"

# 查看 stash 列表
git stash list

# 应用最近的 stash
git stash apply                       # 应用但不删除
git stash pop                         # 应用并删除

# 应用特定 stash
git stash apply stash@{2}

# 删除 stash
git stash drop stash@{0}
git stash clear                       # 清空所有
```

## Git 高级技巧：交互式 Rebase

### 重写提交历史

```bash
# 修改最近 3 个提交
git rebase -i HEAD~3
```

**交互式操作：**

- `pick` - 保留提交
- `reword` - 修改提交信息
- `edit` - 修改提交内容
- `squash` - 合并到前一个提交
- `fixup` - 合并但丢弃提交信息
- `drop` - 删除提交

**注意：不要对已推送的提交 rebase！**

## Git 高级技巧：Blame

### 追踪代码作者

```bash
# 查看每一行的最后修改者
git blame file.py

# 指定行范围
git blame -L 10,20 file.py

# 忽略空白变化
git blame -w file.py

# 查看某个提交之前的状态
git blame <commit>^ -- file.py
```

**用途：**

- 找到引入 bug 的提交
- 了解代码历史
- 联系相关开发者

## Git 高级技巧：Bisect

### 二分查找 bug

```bash
# 开始二分查找
git bisect start

# 标记当前为坏版本
git bisect bad

# 标记某个旧版本为好版本
git bisect good v1.0

# Git 自动切换到中间版本，测试后标记
git bisect bad    # 或 git bisect good

# 找到罪魁祸首后
git bisect reset
```

**自动化 bisect：**

```bash
git bisect start HEAD v1.0
git bisect run ./test.sh
```

## GitHub 工作流

### Fork & Pull Request

**1. Fork 项目到自己账号**

```bash
# 克隆你 fork 的仓库
git clone https://github.com/yourname/repo.git
cd repo

# 添加上游仓库
git remote add upstream https://github.com/original/repo.git
```

**2. 创建 feature 分支**

```bash
git checkout -b fix-typo
# 进行修改和提交
git push origin fix-typo
```

**3. 在 GitHub 上创建 Pull Request**

## GitHub 工作流：保持同步

### 同步上游更改

```bash
# 获取上游更改
git fetch upstream

# 将上游 main 合并到本地 main
git checkout main
git merge upstream/main

# 推送到你的 fork
git push origin main
```

**处理冲突后更新 PR：**

```bash
git checkout fix-typo
git rebase main
git push origin fix-typo --force
```

## GitHub 最佳实践

### Code Review 准则

**提交 PR 前：**

- ✅ 确保代码通过所有测试
- ✅ 遵循项目的代码风格
- ✅ 提供清晰的 PR 描述
- ✅ 保持 PR 专注（一个 PR 做一件事）

**Review 他人代码：**

- 📖 理解上下文和目标
- 💬 提供建设性反馈
- 🔍 关注逻辑、性能、安全
- 🙏 保持礼貌和尊重

## Git 最佳实践

### 提交信息规范

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

**Conventional Commits 格式：**

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**类型：** feat, fix, docs, style, refactor, test, chore

## .gitignore 文件

### 忽略不需要版本控制的文件

```gitignore
# Python
__pycache__/
*.pyc
*.pyo
venv/
.env

# Node.js
node_modules/
npm-debug.log
yarn-error.log

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# 构建产物
dist/
build/
*.o
*.so
```

## Git 配置技巧

### 提升效率的配置

```bash
# 别名
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'

# 美化 log
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"

# 使用：git lg
```

## Git 陷阱与注意事项

### 常见错误避免

**❌ 不要对公共分支 rebase**

```bash
# 危险！不要这样做
git checkout main
git pull origin main
git rebase feature  # 如果 main 已推送，会造成问题
```

**✅ 只在本地分支或未推送的分支上 rebase**

**❌ 不要提交敏感信息**

- 密码、API keys、私钥
- 即使删除提交，历史中仍然存在
- 使用 `.gitignore` 和环境变量

**❌ 不要用 `git push --force` 对公共分支**

## 学习资源

### 推荐资源

**官方文档：**

- Pro Git Book：https://git-scm.com/book/zh/
- Git Reference：https://git-scm.com/docs

**可视化工具：**

- Git Graph（VS Code 插件）
- GitKraken（GUI 客户端）
- Visualizing Git：https://git-school.github.io/visualizing-git/

**练习平台：**

- Learn Git Branching：https://learngitbranching.js.org/
- Git Immersion：http://gitimmersion.com/

---
