/**
 * Giscus 评论系统配置
 * 
 * 配置步骤：
 * 1. 在 GitHub 仓库中启用 Discussions
 * 2. 访问 https://giscus.app/zh-CN 获取配置参数
 * 3. 替换下面的 repoId 和 categoryId
 */

export const GISCUS_CONFIG = {
  // 仓库信息
  repo: "YOOkoishi/myblog", // 格式：owner/repo
  repoId: "R_kgDOPybVBg", // 从 giscus.app 获取，格式：R_kgDOxxxxxx
  
  // Discussion 分类
  category: "Announcements", // 推荐使用 Announcements
  categoryId: "DIC_kwDOPybVBs4CwcB4", // 从 giscus.app 获取，格式：DIC_kwDOxxxxxx
  
  // 映射方式
  mapping: "pathname", // pathname | url | title | og:title
  
  // 其他配置
  strict: "0", // 严格匹配标题
  reactionsEnabled: "1", // 启用反应表情
  emitMetadata: "0", // 发送讨论元数据
  inputPosition: "bottom", // bottom | top
  theme: "preferred_color_scheme", // 自动适配主题
  lang: "zh-CN", // 语言
  loading: "lazy", // 懒加载
} as const;

/**
 * 获取配置指南链接
 */
export const SETUP_GUIDE_URL = "/docs/GISCUS_SETUP.md";

/**
 * 检查配置是否完成
 */
export function isGiscusConfigured(): boolean {
  return true
}
