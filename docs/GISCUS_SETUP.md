# Giscus 评论系统配置指南

本项目已集成 Giscus 评论系统，基于 GitHub Discussions。以下是配置步骤：

## 1. 启用 GitHub Discussions

1. 进入你的 GitHub 仓库（`YOOkoishi/myblog`）
2. 点击 **Settings**（设置）
3. 向下滚动找到 **Features**（功能）部分
4. 勾选 **Discussions**（讨论）
5. 点击 **Set up discussions**（设置讨论）

## 2. 获取 Giscus 配置参数

1. 访问 [https://giscus.app/zh-CN](https://giscus.app/zh-CN)
2. 在 "仓库" 部分输入：`YOOkoishi/myblog`
3. 在 "页面 ↔️ discussion 映射关系" 中选择：`pathname`
4. 在 "Discussion 分类" 中选择：`Announcements`（推荐）或其他你创建的分类
5. 向下滚动到 "启用 giscus" 部分，复制生成的参数

你会看到类似这样的代码：

```html
<script src="https://giscus.app/client.js"
        data-repo="YOOkoishi/myblog"
        data-repo-id="R_kgDOxxxxxx"
        data-category="Announcements"
        data-category-id="DIC_kwDOxxxxxx"
        ...>
</script>
```

## 3. 配置组件

打开 `src/components/widgets/Comments.astro` 文件，找到 `GISCUS_CONFIG` 对象，替换以下参数：

```typescript
const GISCUS_CONFIG = {
  repo: "YOOkoishi/myblog", // 已经是正确的
  repoId: "YOUR_REPO_ID", // 👈 替换为你的 data-repo-id
  category: "Announcements", // 👈 替换为你选择的分类名称
  categoryId: "YOUR_CATEGORY_ID", // 👈 替换为你的 data-category-id
  // ... 其他配置保持不变
};
```

### 示例：

如果 giscus.app 生成的代码是：

```html
data-repo-id="R_kgDOL1234567"
data-category-id="DIC_kwDOL1234567"
```

则修改为：

```typescript
const GISCUS_CONFIG = {
  repo: "YOOkoishi/myblog",
  repoId: "R_kgDOL1234567", // ✅ 替换这里
  category: "Announcements",
  categoryId: "DIC_kwDOL1234567", // ✅ 替换这里
  // ...
};
```

## 4. 测试评论功能

1. 重新构建项目：
   ```bash
   npm run build
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

3. 打开任意博客文章页面，滚动到底部
4. 你应该能看到 Giscus 评论区
5. 使用 GitHub 账号登录并测试发表评论

## 5. 主题适配

Giscus 会自动适配你网站的亮色/暗色主题：
- 亮色模式：使用 `light` 主题
- 暗色模式：使用 `dark` 主题

当用户切换网站主题时，评论区主题会自动同步。

## 6. 自定义配置（可选）

如果你想修改其他配置，可以在 `GISCUS_CONFIG` 中调整：

- `mapping`: 页面与 discussion 的映射方式
  - `pathname`: 使用页面路径（推荐）
  - `url`: 使用完整 URL
  - `title`: 使用页面标题
  
- `inputPosition`: 评论框位置
  - `bottom`: 在评论列表下方（默认）
  - `top`: 在评论列表上方

- `lang`: 语言
  - `zh-CN`: 简体中文
  - `en`: 英语
  - 等等

## 7. 禁用评论（可选）

如果你想在某些页面禁用评论，可以：

1. 在 `src/pages/blog/[...slug].astro` 中添加条件判断：

```astro
<!-- Comments Section -->
{!blog.data.hideComments && <Comments class="mt-12" />}
```

2. 在文章 frontmatter 中添加：

```yaml
---
title: "文章标题"
hideComments: true  # 禁用此文章的评论
---
```

## 8. 常见问题

### Q: 评论区显示 "Discussion not found"？
**A**: 这是正常的！第一次有人在该页面发表评论时，Giscus 会自动在 GitHub Discussions 中创建相应的讨论主题。

### Q: 评论区没有显示？
**A**: 检查：
1. 仓库是否启用了 Discussions
2. `repoId` 和 `categoryId` 是否正确
3. 浏览器控制台是否有错误信息

### Q: 主题切换后评论区主题没有更新？
**A**: 这可能是因为 iframe 还没有加载完成。刷新页面即可。

## 9. 进一步阅读

- [Giscus 官方文档](https://giscus.app/zh-CN)
- [GitHub Discussions 文档](https://docs.github.com/zh/discussions)

---

配置完成后，记得删除 `Comments.astro` 中的注释，并测试评论功能！
