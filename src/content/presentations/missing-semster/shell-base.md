---
title: 命令行基础
author:
header: 索思科技协会技术分享会
footer: 2025年10月 | Shell base
showPageNumber: "true"
---


# 什么是 Shell？

**用户与系统交互的命令行界面**

- Bash（最常用）
- Zsh（功能强大）
- Fish（用户友好）

# 基础命令：文件操作

## 查看和导航

```bash
pwd                    # 显示当前目录
ls -la                 # 列出所有文件
cd /path/to/dir        # 切换目录
cd ~                   # 回到家目录
cd ..                  # 上一级目录
```

## 创建和删除

```bash
mkdir mydir            # 创建目录
mkdir -p a/b/c         # 递归创建
rm file.txt            # 删除文件
rm -rf directory       # 删除目录（危险！）
```

# 基础命令：文件查看

## 查看内容

```bash
cat file.txt           # 输出全部内容
less file.txt          # 分页查看（推荐）
head file.txt          # 前10行
tail file.txt          # 后10行
tail -f log.txt        # 实时查看日志
```

## 查找搜索

```bash
find . -name "*.txt"   # 查找文件
grep "keyword" file    # 搜索内容
grep -r "text" dir     # 递归搜索
```

# 基础命令：权限管理

## 理解权限

```bash
ls -l file.txt
# -rwxr-xr-x
#  |||  |  |
#  |||  |  +-- 其他人权限 (r-x)
#  |||  +----- 组权限 (r-x)
#  ||+-------- 所有者权限 (rwx)
```

## 修改权限

```bash
chmod 755 script.sh    # rwxr-xr-x
chmod +x script.sh     # 添加执行权限
chown user:group file  # 修改所有者
```

# Shell 脚本入门

## 第一个脚本

```bash
#!/bin/bash
# hello.sh

echo "Hello, World!"
echo "当前用户: $USER"
echo "当前目录: $PWD"

# 变量
NAME="张三"
echo "你好, $NAME"

# 条件判断
if [ -f "file.txt" ]; then
    echo "文件存在"
fi
```

**运行脚本：**
```bash
chmod +x hello.sh
./hello.sh
```

# 实用技巧：管道和重定向

## 管道 |

```bash
# 将前一个命令输出传给后一个
ls -l | grep ".txt"
cat file.txt | wc -l           # 统计行数
ps aux | grep python           # 查找进程
```

## 重定向

```bash
command > output.txt           # 覆盖写入
command >> output.txt          # 追加写入
command 2> error.log           # 错误重定向
command > out.txt 2>&1         # 合并输出
```

# Shell 快捷键

## 必须掌握的快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + C` | 终止命令 |
| `Ctrl + D` | 退出 Shell |
| `Ctrl + L` | 清屏 |
| `Ctrl + R` | 搜索历史 |
| `Tab` | 自动补全 |
| `!!` | 执行上一条命令 |
| `!$` | 上一条命令的最后参数 |

---