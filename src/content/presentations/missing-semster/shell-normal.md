# Shell 的工作原理

## 命令执行流程

```bash
$ echo hello
hello
```

**Shell 做了什么？**

1. 读取命令：`echo hello`
2. 分割参数：程序 `echo`，参数 `hello`
3. 查找程序：在 `$PATH` 中搜索
4. 执行程序：运行并显示输出

```bash
$ echo $PATH
/usr/local/bin:/usr/bin:/bin
```


# 文件查找：find 进阶

## 对查找结果执行操作

```bash
# 删除所有 .tmp 文件
find . -name '*.tmp' -exec rm {} \;

# 查找并压缩
find . -name '*.log' -exec gzip {} \;

# 使用 xargs（更高效）
find . -name '*.txt' | xargs grep "keyword"
```

## fd 工具（现代替代）

```bash
fd pattern               # 更简洁的语法
fd -e py                # 查找所有 Python 文件
```

# 内容搜索：grep 进阶

## 高级用法

```bash
# 显示上下文
grep -C 5 "error" log.txt      # 前后5行
grep -A 3 "ERROR" log.txt      # 后3行
grep -B 2 "ERROR" log.txt      # 前2行

# 只显示匹配的文件名
grep -l "TODO" *.py

# 统计匹配次数
grep -c "error" log.txt
```

## 现代替代工具：ripgrep (rg)

```bash
rg -t py 'import'              # 只搜索 Python 文件
rg --stats 'PATTERN'           # 显示统计信息
```



# Shell 脚本入门

## 第一个脚本

```bash
#!/bin/bash
# hello.sh - 这是注释

echo "Hello, World!"
echo "当前用户: $USER"
echo "当前目录: $PWD"

# 变量赋值（注意：=两边不能有空格）
NAME="张三"
echo "你好, $NAME"

# 命令替换
CURRENT_DATE=$(date)
echo "当前时间: $CURRENT_DATE"
```

**运行脚本：**

```bash
chmod +x hello.sh
./hello.sh
```

# Shell 脚本：变量和参数

## 特殊变量

```bash
#!/bin/bash
# script.sh

echo "脚本名称: $0"
echo "第一个参数: $1"
echo "第二个参数: $2"
echo "所有参数: $@"
echo "参数个数: $#"
echo "上个命令退出码: $?"
echo "当前进程ID: $$"
```

**运行示例：**

```bash
$ ./script.sh hello world
脚本名称: ./script.sh
第一个参数: hello
第二个参数: world
```

# Shell 脚本：控制流

## 条件判断

```bash
#!/bin/bash

# 文件判断
if [ -f "file.txt" ]; then
    echo "文件存在"
fi

# 字符串比较（推荐使用 [[]]）
if [[ $USER == "root" ]]; then
    echo "Root 用户"
fi

# 数字比较
if [ $# -eq 0 ]; then
    echo "没有参数"
    exit 1
fi
```

# Shell 脚本：循环

## for 循环

```bash
# 遍历文件
for file in *.txt; do
    echo "处理: $file"
done

# 遍历数字
for i in {1..5}; do
    echo "数字: $i"
done

# 遍历参数
for arg in "$@"; do
    echo "参数: $arg"
done
```

# Shell 脚本：函数

## 定义和使用函数

```bash
#!/bin/bash

# 定义函数
mcd() {
    mkdir -p "$1"
    cd "$1"
}

# 使用函数
mcd test_directory
pwd
```

**函数的优势：**

- 代码复用
- 清晰的结构
- 易于维护

# 命令历史：history

## 使用命令历史

```bash
# 查看历史
history
history | tail -20                # 最近20条

# 搜索历史（Ctrl+R）
# 输入关键字，按 Ctrl+R 继续搜索

# 执行历史命令
!100                              # 执行第100条命令
!!                                # 执行上一条命令
!git                              # 执行最近的 git 命令
```

## 配置历史

```bash
# .bashrc 中配置
HISTSIZE=10000                    # 内存中保存的命令数
HISTFILESIZE=20000                # 文件中保存的命令数
HISTCONTROL=ignorespace           # 空格开头的命令不记录
```

# 目录导航技巧

## 快速跳转工具

**使用 z / autojump**

```bash
# 安装后，自动记录访问的目录
cd /home/user/projects/webapp
cd /home/user/documents

# 快速跳转（只需部分路径）
z webapp                          # 跳转到 projects/webapp
j doc                             # 跳转到 documents
```

**使用别名**

```bash
# 在 .bashrc 中添加
alias proj="cd ~/projects"
alias docs="cd ~/documents"
```

# Shell 快捷键

## 必须掌握的快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + C` | 终止当前命令 |
| `Ctrl + D` | 退出 Shell / EOF |
| `Ctrl + L` | 清屏（等同 clear） |
| `Ctrl + R` | 反向搜索历史 |
| `Ctrl + A` | 移到行首 |
| `Ctrl + E` | 移到行尾 |

# Shell 快捷键

## 编辑快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + U` | 删除到行首 |
| `Ctrl + K` | 删除到行尾 |
| `Ctrl + W` | 删除前一个单词 |
| `Alt + D` | 删除后一个单词 |
| `Ctrl + Y` | 粘贴删除的内容 |
| `Tab` | 自动补全 |


# Shell 最佳实践

## 编写可维护的脚本

```bash
#!/bin/bash
# 脚本说明：备份重要文件
# 作者：Your Name
# 日期：2025-01-01

# 严格模式
set -e                            # 遇到错误立即退出
set -u                            # 使用未定义变量时报错
set -o pipefail                   # 管道中任一命令失败则失败

# 使用有意义的变量名
BACKUP_DIR="/backup"
SOURCE_DIR="/data"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# 函数化
backup_files() {
    tar -czf "${BACKUP_DIR}/backup_${TIMESTAMP}.tar.gz" "$SOURCE_DIR"
}
```

# 调试 Shell 脚本

## 调试技巧

```bash
# 显示执行的命令
bash -x script.sh

# 在脚本中启用调试
#!/bin/bash
set -x                            # 开启调试输出

# 或者部分调试
set -x
# 需要调试的代码
set +x

# 使用 shellcheck 检查错误
shellcheck script.sh
```

# 实用工具推荐

## 现代化命令行工具

- **fd** - 更好的 find
- **ripgrep (rg)** - 更快的 grep
- **bat** - 更好的 cat（带语法高亮）
- **exa** - 更好的 ls
- **tldr** - 简化的 man 页面
- **fzf** - 模糊查找工具

```bash
# 安装示例（Ubuntu）
sudo apt install fd-find ripgrep bat
```