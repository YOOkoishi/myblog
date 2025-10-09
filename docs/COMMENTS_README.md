# 🎉 Giscus 评论系统已集成

你的博客现在已经集成了 Giscus 评论系统！只需要简单配置即可使用。

## 🚀 快速开始（5 分钟完成）

### 1️⃣ 启用 GitHub Discussions

1. 访问你的仓库：https://github.com/YOOkoishi/myblog
2. 点击 **Settings** → 找到 **Features** 部分
3. 勾选 ☑️ **Discussions**
4. 点击 **Set up discussions** 完成设置

### 2️⃣ 获取配置参数

1. 访问：https://giscus.app/zh-CN
2. 输入仓库：`YOOkoishi/myblog`
3. 选择映射方式：**pathname**
4. 选择分类：**Announcements**（推荐）
5. 向下滚动，复制生成的参数

你会看到类似这样的值：
```
data-repo-id="R_kgDOL1234567"
data-category-id="DIC_kwDOL1234567"
```

### 3️⃣ 配置参数

打开 `src/config/giscus.ts`，替换以下两行：

```typescript
repoId: "YOUR_REPO_ID",        // 👈 替换为你的 data-repo-id
categoryId: "YOUR_CATEGORY_ID", // 👈 替换为你的 data-category-id
```

### 4️⃣ 测试

```bash
npm run dev
```

打开任意博客文章，滚动到底部，你应该能看到评论区！

## ✨ 功能特点

- ✅ **自动主题适配**：跟随网站的亮色/暗色主题
- ✅ **支持表情反应**：点赞、爱心等
- ✅ **Markdown 支持**：在评论中使用 Markdown 格式
- ✅ **GitHub 登录**：使用 GitHub 账号即可评论
- ✅ **懒加载**：提高页面性能
- ✅ **完全免费**：基于 GitHub Discussions，无需后端

## 📝 自定义配置

如果需要修改配置，编辑 `src/config/giscus.ts`：

```typescript
export const GISCUS_CONFIG = {
  repo: "YOOkoishi/myblog",
  repoId: "R_kgDOL1234567",      // ✏️ 你的配置
  category: "Announcements",
  categoryId: "DIC_kwDOL1234567", // ✏️ 你的配置
  
  // 可选配置
  mapping: "pathname",            // pathname | url | title
  inputPosition: "bottom",        // bottom | top
  lang: "zh-CN",                  // zh-CN | en | 其他语言
  // ...
};
```

## 🔧 禁用某篇文章的评论

在文章的 frontmatter 中添加：

```yaml
---
title: "文章标题"
hideComments: true
---
```

然后修改 `src/pages/blog/[...slug].astro`：

```astro
{!blog.data.hideComments && <Comments class="mt-12" />}
```

## 📚 详细文档

查看完整配置指南：[docs/GISCUS_SETUP.md](./GISCUS_SETUP.md)

## ❓ 常见问题

**Q: 显示 "Discussion not found"？**  
A: 正常！第一次有人评论时会自动创建讨论主题。

**Q: 评论区不显示？**  
A: 检查：
1. 是否启用了 Discussions
2. `repoId` 和 `categoryId` 是否正确
3. 浏览器控制台是否有错误

**Q: 主题没有自动切换？**  
A: 刷新页面即可，或等待 iframe 加载完成。

---

现在开始享受你的评论系统吧！🎊
