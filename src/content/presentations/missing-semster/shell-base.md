---
title: 命令行基础
author:
header: 索思科技协会技术分享会
footer: 2025年10月 | Shell base
showPageNumber: "true"
---

# 什么是 Shell？

## 用户与系统交互的命令行界面

- **Bash** - Bourne Again Shell（最常用）
- **Zsh** - Z Shell（功能强大，macOS 默认）
- **Fish** - Friendly Interactive Shell（用户友好）

## 为什么要学 Shell？

- 自动化重复任务
- 远程服务器管理
- 更高效的文件操作

# 基础命令：文件操作

## 查看和导航

```bash
pwd                    # 显示当前目录
ls -la                 # 列出所有文件（包括隐藏）
cd /path/to/dir        # 切换目录（绝对路径）
cd ~                   # 回到家目录
cd ..                  # 上一级目录
cd -                   # 回到上次的目录
```

## 特殊路径

- `.` - 当前目录
- `..` - 父目录
- `~` - 家目录
- `/` - 根目录

# 基础命令：文件操作

## 创建和删除

```bash
mkdir mydir            # 创建目录
mkdir -p a/b/c         # 递归创建目录
touch file.txt         # 创建空文件
rm file.txt            # 删除文件
rm -rf directory       # 删除目录（危险！）
```

## 复制和移动

```bash
cp source.txt dest.txt      # 复制文件
cp -r dir1 dir2             # 复制目录
mv old.txt new.txt          # 重命名/移动文件
```

# 基础命令：文件查看

## 查看内容

```bash
cat file.txt           # 输出全部内容
less file.txt          # 分页查看（推荐）
head file.txt          # 前10行
head -n 20 file.txt    # 前20行
tail file.txt          # 后10行
tail -f log.txt        # 实时查看日志
```

## 编辑文件

```bash
nano file.txt          # 简单编辑器
vim file.txt           # 高级编辑器
```

# 文件查找：find 命令

## 强大的文件搜索工具

```bash
# 按名称查找
find . -name "*.txt"
find . -name "*.py" -type f

# 按时间查找
find . -mtime -1              # 最近1天修改的
find . -mtime +30             # 30天前修改的

# 按大小查找
find . -size +10M             # 大于10MB
find . -size +500k -size -10M # 500KB到10MB之间
```

# 内容搜索：grep 命令

## 文本搜索利器

```bash
# 基本搜索
grep "keyword" file.txt

# 递归搜索
grep -r "pattern" directory/

# 忽略大小写
grep -i "error" log.txt

# 显示行号
grep -n "function" code.py

# 反向匹配
grep -v "debug" log.txt        # 排除包含 debug 的行
```


# 基础命令：权限管理

## 理解权限

```bash
ls -l file.txt
# -rwxr-xr-x
#  |||  |  |
#  |||  |  +-- 其他人权限 (r-x: 读和执行)
#  |||  +----- 组权限 (r-x: 读和执行)
#  ||+-------- 所有者权限 (rwx: 读写执行)
#  |+--------- 文件类型 (-: 文件, d: 目录)
```

## 权限数字表示

- **r (read) = 4**
- **w (write) = 2**
- **x (execute) = 1**
- `755 = rwxr-xr-x`
- `644 = rw-r--r--`

# 基础命令：权限管理

## 修改权限

```bash
chmod 755 script.sh           # rwxr-xr-x
chmod +x script.sh            # 添加执行权限
chmod u+w file.txt            # 所有者添加写权限
chmod go-r file.txt           # 组和其他人移除读权限        
```

## sudo 命令

```bash
sudo command                  # 以 root 身份执行
sudo !!                       # 以 root 执行上一条命令
```

# 实用技巧：管道和重定向

## 管道 |

```bash
# 将前一个命令输出传给后一个
ls -l | grep ".txt"
cat file.txt | wc -l              # 统计行数
ps aux | grep python              # 查找进程
history | grep git                # 搜索历史命令

# 多个管道连接
cat access.log | grep "ERROR" | wc -l
```

## 进程替换

```bash
# 比较两个目录的文件
diff <(ls dir1) <(ls dir2)
```

# 实用技巧：重定向

## 输入输出重定向

```bash
# 输出重定向
command > output.txt              # 覆盖写入
command >> output.txt             # 追加写入

# 错误重定向
command 2> error.log              # 只重定向错误
command > out.txt 2>&1            # 合并标准输出和错误
command &> all.log                # 简写形式

# 输入重定向
mysql < database.sql
```

## /dev/null - 黑洞

```bash
command > /dev/null 2>&1          # 丢弃所有输出
```


# Shell 通配符和扩展

## Globbing 模式

```bash
# 通配符
ls *.txt                          # 所有 .txt 文件
ls file?.txt                      # file1.txt, file2.txt
ls file[12].txt                   # file1.txt, file2.txt

# 花括号展开
echo {1..10}                      # 1 2 3 ... 10
echo {a..z}                       # a b c ... z

# 多个模式
mv *{.py,.sh} scripts/            # 移动所有 .py 和 .sh 文件
```
