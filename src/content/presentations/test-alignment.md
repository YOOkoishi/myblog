---
title: 文本对齐测试
author: YOO_koishi
---

# 文本对齐功能测试

## 默认对齐（左对齐）

这是默认的左对齐文本段落，不需要任何特殊设置。

- 默认列表项
- 另一个列表项

## 居中对齐示例

::: {.text-center}
这段文本应该居中显示，如果你看到它在中间位置就说明成功了。

这里是另一个居中的段落，测试多段落的居中效果。

- 居中的列表项
- 另一个居中的列表项
:::

## 右对齐示例

::: {.text-right}
这段文本应该右对齐显示，内容会靠右显示。

这是另一个右对齐的段落。

- 右对齐的列表项
- 另一个右对齐的列表项
:::

## HTML 方式测试

<div class="text-center">
这是用 HTML div 包裹的居中文本。
</div>

<div class="text-right">
这是用 HTML div 包裹的右对齐文本。
</div>

## 内联样式测试

<p style="text-align: center;">使用内联样式的居中段落</p>

<p style="text-align: right;">使用内联样式的右对齐段落</p>