# 演示文稿构建脚本优化说明

## 优化日期
2025年10月6日

## 主要修复的问题

### 1. ✅ H2 标题左边距不一致
**问题描述：** 
- H1+H2 合并页面的 H2 左边距：80px（容器 padding）
- 独立 H2 页面的标题左边距：20px（margin-left）+ 80px（容器 padding）= 100px
- 导致视觉不统一

**解决方案：**
```css
/* 统一所有 H2 的样式 */
.reveal h2 {
  font-size: 1.6em;
  padding-left: 0;  /* 移除额外的左边距 */
}
```

### 2. ✅ 有序列表间距过大
**问题描述：**
- 列表项 `li` 的 `margin: 0.3em 0` 导致间距过大

**解决方案：**
```css
.reveal li {
  margin: 0.2em 0;  /* 从 0.3em 减少到 0.2em */
}

.reveal ul,
.reveal ol {
  line-height: 1.5;  /* 从 1.6 减少到 1.5 */
}
```

### 3. ✅ 页码显示问题
**问题描述：**
- 之前显示：当前幻灯片 / 总幻灯片数（包括所有 H2 子页面）
- 期望显示：当前主题（H1）编号 / 总主题数

**解决方案：**
添加 JavaScript 动态更新页码：
```javascript
function updateSlideNumber() {
  // 获取所有顶层 section（H1 级别）
  const allH1Sections = document.querySelectorAll('.reveal .slides > section');
  const totalH1 = allH1Sections.length;
  
  // 查找当前幻灯片属于哪个 H1
  // ... 逻辑代码 ...
  
  slideNumber.textContent = currentH1Index + ' / ' + totalH1;
}
```

## 代码结构优化

### 优化前（851 行）
- CSS 散布在构建函数中（200+ 行内联 CSS）
- 重复的样式规则
- 难以维护和调试

### 优化后（624 行）
**减少了 227 行代码（-26.7%）**

#### 1. CSS 提取为独立函数
```javascript
function generateCustomCSS(customHeader, customFooter, showPageNumber) {
  return `<style>...</style><script>...</script>`;
}
```

**优点：**
- 易于阅读和维护
- CSS 规则集中管理
- 方便调试样式

#### 2. 消除重复的 CSS 规则

**优化前：**
```css
/* H2 样式分散在多个地方 */
.reveal .slides section.title-slide .first-subsection h2 { ... }
.reveal .slides > section > section:not(.title-slide) h2 { ... }
/* 两处几乎相同的规则 */
```

**优化后：**
```css
/* 统一的 H2 样式 */
.reveal h2 {
  font-size: 1.6em;
  margin-bottom: 0.6em;
  /* ... */
}
```

#### 3. 简化选择器

**优化前：**
```css
.reveal .slides > section > section:not(.title-slide):not(#title-slide) > p { }
.reveal .slides > section > section:not(.title-slide):not(#title-slide) > ul { }
.reveal .slides > section > section:not(.title-slide):not(#title-slide) > ol { }
/* 每个元素都要重复一遍 */
```

**优化后：**
```css
/* 全局样式，特殊情况再覆盖 */
.reveal p { }
.reveal ul, .reveal ol { }
.reveal li { }
```

## 功能保持不变

✅ H1+H2 合并显示功能
✅ 自定义页眉页脚
✅ 页码显示控制
✅ 嵌套幻灯片结构
✅ 代码高亮样式
✅ 工具类（text-left, columns, highlight-box 等）
✅ Pandoc 集成

## 性能提升

- **代码行数：** 851 → 624 行（-26.7%）
- **可读性：** ⭐⭐⭐ → ⭐⭐⭐⭐⭐
- **可维护性：** ⭐⭐⭐ → ⭐⭐⭐⭐⭐
- **CSS 规则数：** 约减少 30%（消除重复）

## 使用方式不变

```bash
npm run build:presentations
```

## 备份说明

旧版本已备份到：`scripts/build-presentations.backup.js`

如需回滚：
```bash
mv scripts/build-presentations.backup.js scripts/build-presentations.js
```
