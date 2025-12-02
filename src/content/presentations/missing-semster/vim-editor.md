---
title: "编辑器之神 Vim"
author: "索思科技协会"
header: "📝 Vim 编辑器入门"
footer: "索思科技协会 | Linux 技术分享会"
showPageNumber: true
---

# 编辑器之神 Vim

## 为什么学习 Vim?

- **高效**: 双手不离键盘
- **通用**: 几乎所有 Linux 系统都预装
- **强大**: 极其丰富的插件生态
- **哲学**: 模态编辑 (Modal Editing)

---

# Vim 的模式

- **正常模式 (Normal Mode)**: 移动光标，删除文本 (默认模式)
- **插入模式 (Insert Mode)**: 输入文本 (`i`, `a`, `o`)
- **可视模式 (Visual Mode)**: 选择文本 (`v`, `V`, `Ctrl+v`)

> **Tip**: 迷失方向时，狂按 `Esc` 确保回到正常模式！

---

# 基本操作

- `i`: 进入插入模式
- `Esc`: 回到正常模式
- `:w`: 保存
- `:q`: 退出
- **`:wq`: 保存并退出**
- `dd`: 删除当前行
- `u`: 撤销

---

# 移动光标 (正常模式)

- `h`: 左
- `j`: 下
- `k`: 上
- `l`: 右
- `w`: 下一个单词开头
- `b`: 上一个单词开头
- `0`: 行首
- `$`: 行尾

---

# 进阶操作

- `ciw`: 修改当前单词 (Change Inner Word)
- `dt"`: 删除直到双引号
- `yy`: 复制当前行
- `p`: 粘贴
- `:%s/old/new/g`: 全局替换

---

# 实战演示：FizzBuzz

## 任务目标

编写一个 Python 函数，打印 1 到 100：
- 3 的倍数打印 "Fizz"
- 5 的倍数打印 "Buzz"
- 既是 3 又是 5 打印 "FizzBuzz"

## 演示重点

- `i` / `a` / `o` 快速插入
- `Esc` 切换模式
- `yyp` 复制粘贴行
- `cw` 修改单词
- `%s` 批量替换变量名
- **宏录制 (Macro)**: 自动化重复操作

---

# 配置 Vim

- 配置文件: `~/.vimrc`
- 常用设置:
  ```vim
  set number        " 显示行号
  set syntax=on     " 语法高亮
  set autoindent    " 自动缩进
  set mouse=a       " 启用鼠标
  ```

---

# Neovim: Vim 的现代化重生

## 什么是 Neovim?

- Vim 的重构版本，完全兼容 Vim
- **更快的核心**: 异步 I/O 支持
- **Lua 脚本**: 使用 Lua 替代 VimScript 进行配置
- **内置 LSP**: 原生支持语言服务器协议 (代码补全、跳转)
- **Treesitter**: 更强大的语法高亮和代码分析

---

# 现代化 Vim 展示

## 插件生态

- **插件管理器**: `vim-plug`, `packer.nvim`, `lazy.nvim`
- **文件树**: `NERDTree`, `nvim-tree`
- **模糊搜索**: `fzf.vim`, `telescope.nvim`
- **状态栏**: `vim-airline`, `lualine.nvim`

## 像 IDE 一样强大

- 自动补全 (CoC, nvim-cmp)
- 语法检查 (ALE, null-ls)
- Git 集成 (vim-fugitive, gitsigns)
- **极速启动**: 比 VS Code 快得多的启动速度

## 开箱即用的配置

不想从零折腾？尝试预配置发行版：
- **LazyVim**: 现代、快速、功能全 (推荐)
- **LunarVim**: 专注于 IDE 体验
- **NvChad**: 极速、美观

---

# 学习资源

- `vimtutor`: 终端自带教程
- [Vim Adventures](https://vim-adventures.com/)
- [Missing Semester](https://missing.csail.mit.edu/2020/editors/)
