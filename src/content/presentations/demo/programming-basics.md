---
title: "编程基础"
author: "YOO_koishi"
date: "2025-01-16"
header: "💻 编程基础入门教程"
footer: "编程学习路径 | YOO_koishi"
showPageNumber: true
---

# 编程基础入门

从零开始的编程之旅

---

## 课程大纲

### 主要内容

1. **变量与数据类型**
2. **控制结构**
3. **函数**
4. **面向对象编程**

---

## 变量与数据类型

### 什么是变量？

变量是存储数据的容器

### 基本数据类型

- **整数**: `42`, `-7`, `0`
- **浮点数**: `3.14`, `-2.5`
- **字符串**: `"Hello"`, `'World'`
- **布尔值**: `True`, `False`

---

## 变量示例

```python
# 基本变量声明
name = "YOO_koishi"
age = 19
height = 175.5
is_student = True

print(f"姓名: {name}, 年龄: {age}")
```

---

## 变量命名规则

### 重要规则

- 以字母或下划线开头
- 只能包含字母、数字、下划线
- 区分大小写
- 不能使用关键字

---

## 条件语句

### if-elif-else 结构

```python
age = 19

if age >= 18:
    print("成年人")
elif age >= 16:
    print("青少年")
else:
    print("未成年人")
```

---

## 循环结构

### for 循环

```python
# 数字循环
for i in range(5):
    print(f"第 {i+1} 次循环")

# 列表循环
fruits = ["苹果", "香蕉", "橙子"]
for fruit in fruits:
    print(f"我喜欢吃{fruit}")
```

---

## while 循环

```python
count = 0
while count < 3:
    print(f"计数: {count}")
    count += 1
```

简洁但功能强大的循环结构

---

## 函数基础

### 什么是函数？

函数是可重复使用的代码块

```python
def greet(name):
    """问候函数"""
    return f"你好, {name}!"

message = greet("世界")
print(message)
```

---

## 函数参数

### 默认参数示例

```python
def introduce(name, age, city="北京"):
    return f"我是{name}，{age}岁，来自{city}"

print(introduce("小明", 20))
print(introduce("小红", 18, "上海"))
```

---

## 面向对象编程

### 类的定义

```python
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def introduce(self):
        return f"我是{self.name}，{self.age}岁"
```

---

## 对象的使用

```python
# 创建对象
student1 = Student("小明", 18)
student2 = Student("小红", 19)

# 调用方法
print(student1.introduce())
print(student2.introduce())
```

---

## 编程最佳实践

### 代码风格

- **命名要有意义**: `user_name` 而不是 `un`
- **保持一致性**: 统一的命名风格
- **添加注释**: 解释复杂的逻辑
- **函数要简洁**: 一个函数只做一件事

---

## 学习建议

### 持续进步的方法

1. **多练习编程**
2. **理解核心概念**
3. **阅读他人代码**
4. **参与开源项目**

---

## 今天的收获

### 学到了什么？

- ✅ 变量和数据类型
- ✅ 条件语句和循环
- ✅ 函数的定义和调用
- ✅ 面向对象编程基础

---

## 下一步学习

### 进阶内容

- 数据结构（列表、字典、集合）
- 文件操作和异常处理
- 模块和包的使用
- 实际项目开发

---

## 谢谢大家！

### 继续编程之旅

- **保持好奇心**
- **不断练习**
- **享受编程的乐趣**

### 推荐资源
- Python官方文档
- LeetCode 算法练习
