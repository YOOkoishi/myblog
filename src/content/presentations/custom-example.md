---
title: "自定义页眉页脚示例"
author: "YOO_koishi"
date: "2025-01-16"
header: "🚀 自定义演示文稿"
footer: "技术分享会"
showPageNumber: false
---

# 自定义页眉页脚

## 如何个性化你的演示文稿

本教程将教你如何自定义演示文稿的页眉和页脚

# Frontmatter 配置

## 可用字段

- `header`: 自定义页眉文本
- `footer`: 自定义页脚文本  
- `showPageNumber`: 是否显示页码
- `title`: 演示文稿标题
- `author`: 作者信息

# 页眉配置

## 基本语法

```yaml
---
header: "🚀 自定义演示文稿"
---
```

支持 emoji 和特殊字符

# 页脚配置

## 基本语法

```yaml
---
footer: "技术分享会"
showPageNumber: false
---
```

可以控制页码显示与隐藏

# 页码控制

## 显示页码

```yaml
showPageNumber: true
```

结果：`© 2025 YOO_koishi | 第 1 / 5 页`

## 隐藏页码

```yaml
showPageNumber: false
```

结果：只显示自定义页脚文本

# 默认行为

## 未设置时的默认值

- **页眉**: 使用 `title` 字段
- **页脚**: `© 年份 作者` 格式
- **页码**: 默认显示

# 高级配置

## 组合使用示例

```yaml
---
title: "深度学习入门"
author: "AI研究员"
header: "🧠 人工智能系列讲座"
footer: "AI Lab | 内部培训"
showPageNumber: true
---
```

# 样式特性

## 响应式设计

- 移动设备自动调整字体
- 小屏幕优化布局
- 保持良好阅读体验

## 主题适配

- 自动适配深色/浅色主题
- 统一的颜色和边框样式

# 完成

## 你学会了

- ✅ 自定义页眉页脚
- ✅ 控制页码显示
- ✅ 理解默认行为
- ✅ 高级组合配置

现在可以创建独特的演示文稿了！

# 配置模板

## 完整示例

```yaml
---
title: "你的演示文稿标题"
author: "你的名字"
header: "🎯 自定义页眉"
footer: "自定义页脚 | 会议名称"
showPageNumber: true
---
```

复制这个模板开始创建吧！
