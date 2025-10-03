import { execSync } from 'child_process';
import { readdirSync, statSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

const PRESENTATIONS_DIR = './src/content/presentations';
const OUTPUT_DIR = './public/presentations';
const CUSTOM_CSS_PATH = './src/styles/presentation-custom.css';

// 确保输出目录存在
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 解析Markdown文件的frontmatter
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: {}, content: content };
  }
  
  const frontmatterText = match[1];
  const bodyContent = match[2];
  const frontmatter = {};
  
  // 简单的YAML解析（仅支持键值对）
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
      frontmatter[key] = value;
    }
  });
  
  return { frontmatter, content: bodyContent };
}

// 创建自定义CSS文件（如果不存在）
function createCustomCSS() {
  if (!existsSync(CUSTOM_CSS_PATH)) {
    const customCSS = `
/* 演示文稿自定义样式 */

/* 页眉样式 */
.reveal .slides section::before {
  content: "YOO_koishi's Presentation";
  position: absolute;
  top: -50px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.8em;
  color: #666;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  background: white;
  z-index: 1000;
}

/* 页脚样式 */
.reveal .slides section::after {
  content: "© 2025 YOO_koishi | Page " counter(slide-number);
  position: absolute;
  bottom: -50px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.7em;
  color: #666;
  border-top: 1px solid #eee;
  padding-top: 10px;
  background: white;
  z-index: 1000;
}

/* 为slides容器添加padding，避免内容被页眉页脚遮挡 */
.reveal .slides {
  padding-top: 80px;
  padding-bottom: 80px;
}

/* 计数器初始化 */
.reveal .slides {
  counter-reset: slide-number;
}

.reveal .slides section {
  counter-increment: slide-number;
}

/* 深色主题适配 */
.reveal[data-theme="dark"] .slides section::before,
.reveal[data-theme="dark"] .slides section::after {
  background: #2d3748;
  color: #e2e8f0;
  border-color: #4a5568;
}

/* 自定义主题颜色 */
.reveal .progress {
  color: #3b82f6;
}

.reveal .controls {
  color: #3b82f6;
}

/* 代码块样式优化 */
.reveal pre code {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 1em;
}

/* 标题样式优化 */
.reveal h1, .reveal h2, .reveal h3 {
  color: #1e293b;
  text-shadow: none;
}
`;

    // 确保目录存在
    const cssDir = path.dirname(CUSTOM_CSS_PATH);
    if (!existsSync(cssDir)) {
      mkdirSync(cssDir, { recursive: true });
    }
    
    writeFileSync(CUSTOM_CSS_PATH, customCSS);
    console.log(`✅ 创建自定义CSS文件: ${CUSTOM_CSS_PATH}`);
  }
}

// 构建单个演示文稿
function buildPresentation(mdFile, outputPath) {
  // 读取并解析Markdown文件
  const markdownContent = readFileSync(mdFile, 'utf8');
  const { frontmatter, content } = parseFrontmatter(markdownContent);
  
  // 提取自定义页眉页脚信息
  const customHeader = frontmatter.header || frontmatter.title || "YOO_koishi's Presentation";
  const customFooter = frontmatter.footer || `© ${new Date().getFullYear()} ${frontmatter.author || 'YOO_koishi'}`;
  const showPageNumber = frontmatter.showPageNumber !== 'false';
  
  console.log(`📝 演示文稿信息:`);
  console.log(`   标题: ${frontmatter.title || '未设置'}`);
  console.log(`   作者: ${frontmatter.author || '未设置'}`);
  console.log(`   页眉: ${customHeader}`);
  console.log(`   页脚: ${customFooter}`);
  console.log(`   显示页码: ${showPageNumber ? '是' : '否'}`);

  const pandocCommand = `pandoc "${mdFile}" -t revealjs -s ` +
    `--slide-level=2 ` +
    `-V revealjs-url="https://unpkg.com/reveal.js@4.6.0" ` +
    `-V theme=white ` +
    `-V transition=slide ` +
    `-V hash=true ` +
    `-V controls=true ` +
    `-V progress=true ` +
    `-V center=true ` +
    `-V navigationMode=default ` +
    `--highlight-style=pygments ` +
    `-o "${outputPath}"`;

  try {
    console.log(`正在构建: ${mdFile} -> ${outputPath}`);
    execSync(pandocCommand, { stdio: 'inherit' });
    
    // 读取生成的HTML文件
    let htmlContent = readFileSync(outputPath, 'utf8');
    
    // 生成每个演示文稿独有的CSS，包含自定义页眉页脚内容
    const customCSS = `
/* 演示文稿自定义样式 - 为每个演示文稿单独生成 */

/* 为整个演示文稿添加页眉页脚 */
.reveal {
  position: relative;
}

/* 页眉 - 显示自定义内容 */
.reveal::before {
  content: "${customHeader.replace(/"/g, '\\"')}";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  text-align: center;
  font-size: 13px;
  color: #4a5568;
  background: linear-gradient(135deg, #ffffff 0%, #f7fafc 100%);
  border-bottom: 1px solid #e2e8f0;
  padding: 8px 20px;
  z-index: 1001;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  letter-spacing: 0.025em;
}

/* 页脚 - 显示自定义内容 */
.reveal::after {
  content: "${customFooter.replace(/"/g, '\\"')}";
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  text-align: center;
  font-size: 11px;
  color: #718096;
  background: linear-gradient(135deg, #f7fafc 0%, #ffffff 100%);
  border-top: 1px solid #e2e8f0;
  padding: 6px 20px;
  z-index: 1001;
  box-shadow: 0 -1px 3px rgba(0,0,0,0.06);
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
}

/* 调整演示文稿内容区域，为页眉页脚留出空间 */
.reveal .slides {
  top: 32px;
  bottom: 28px;
  height: calc(100vh - 60px);
  width: 100%;
  position: absolute;
  left: 0;
  margin: 0;
  padding: 0;
}

/* 确保幻灯片内容正确布局 */
.reveal .slides > section {
  height: 100%;
  width: 100%;
  padding: 30px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
}

/* 嵌套的section也需要正确布局 */
.reveal .slides > section > section {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 30px;
  margin: 0;
}

/* 进度条调整 */
.reveal .progress {
  bottom: 28px;
  z-index: 1000;
  height: 2px;
  color: #3182ce;
}

/* 控制按钮调整 */
.reveal .controls {
  bottom: 38px;
  z-index: 1000;
  color: #3182ce;
}

/* 深色主题适配 */
.reveal[data-theme="dark"]::before {
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  color: #e2e8f0;
  border-bottom-color: #4a5568;
}

.reveal[data-theme="dark"]::after {
  background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
  color: #a0aec0;
  border-top-color: #4a5568;
}

/* 标题样式优化 */
.reveal h1 {
  font-size: 1.8em;
  color: #2d3748;
  text-shadow: none;
  font-weight: 700;
  margin: 0 0 0.6em 0;
  line-height: 1.2;
  border-bottom: 2px solid #3182ce;
  padding-bottom: 0.2em;
  width: 100%;
  max-width: 90%;
}

.reveal h2 {
  font-size: 1.4em;
  color: #3182ce;
  text-shadow: none;
  font-weight: 600;
  margin: 0.4em 0;
  line-height: 1.3;
}

.reveal h3 {
  font-size: 1.2em;
  color: #4a5568;
  text-shadow: none;
  font-weight: 600;
  margin: 0.3em 0;
  line-height: 1.3;
}

/* 段落和列表样式 */
.reveal p {
  margin: 0.4em 0;
  line-height: 1.5;
  font-size: 0.9em;
  color: #4a5568;
  width: 100%;
  max-width: 85%;
}

.reveal ul, .reveal ol {
  line-height: 1.5;
  margin: 0.4em 0;
  text-align: left;
  font-size: 0.85em;
  width: 100%;
  max-width: 80%;
  margin-left: auto;
  margin-right: auto;
}

.reveal li {
  margin-bottom: 0.25em;
  color: #4a5568;
}

/* 代码块样式优化 */
.reveal pre {
  width: 100%;
  max-width: 85%;
  margin: 0.6em auto;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  border-radius: 6px;
  overflow: hidden;
}

.reveal pre code {
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.8em;
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  font-size: 0.7em;
  line-height: 1.4;
  max-height: 300px;
  overflow-y: auto;
  color: #2d3748;
  display: block;
  width: 100%;
  box-sizing: border-box;
}

/* 链接样式 */
.reveal a {
  color: #3182ce;
  text-decoration: none;
  border-bottom: 1px dotted #3182ce;
  transition: all 0.2s ease;
}

.reveal a:hover {
  color: #2c5282;
  border-bottom-style: solid;
}

/* 强调文本样式 */
.reveal strong {
  color: #e53e3e;
  font-weight: 600;
}

.reveal em {
  color: #805ad5;
  font-style: italic;
}

/* 引用块样式 */
.reveal blockquote {
  border-left: 3px solid #3182ce;
  padding-left: 1em;
  background: #f7fafc;
  font-style: italic;
  margin: 0.6em auto;
  width: 100%;
  max-width: 80%;
  text-align: left;
  font-size: 0.85em;
}

/* 数学公式样式 */
.reveal .katex {
  font-size: 1em;
  margin: 0.3em 0;
}

/* 表格样式 */
.reveal table {
  border-collapse: collapse;
  width: 100%;
  max-width: 85%;
  margin: 0.6em auto;
  font-size: 0.8em;
}

.reveal th, .reveal td {
  border: 1px solid #e2e8f0;
  padding: 0.4em 0.6em;
  text-align: left;
}

.reveal th {
  background: #f7fafc;
  font-weight: 600;
  color: #2d3748;
}

/* 图片样式 */
.reveal img {
  max-width: 75%;
  max-height: 50vh;
  margin: 0.6em auto;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* 全屏模式样式 */
.reveal:-webkit-full-screen,
.reveal:-moz-full-screen,
.reveal:fullscreen {
  width: 100vw;
  height: 100vh;
}

.reveal:-webkit-full-screen .slides,
.reveal:-moz-full-screen .slides,
.reveal:fullscreen .slides {
  width: 100vw;
  height: calc(100vh - 60px);
  top: 32px;
  bottom: 28px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .reveal::before {
    font-size: 11px;
    height: 28px;
    padding: 6px 15px;
  }
  
  .reveal::after {
    font-size: 9px;
    height: 24px;
    padding: 5px 15px;
  }
  
  .reveal .slides {
    top: 28px;
    bottom: 24px;
    height: calc(100vh - 52px);
  }
  
  .reveal .slides > section {
    padding: 20px;
  }
  
  .reveal h1 {
    font-size: 1.5em;
  }
  
  .reveal h2 {
    font-size: 1.2em;
  }
  
  .reveal h3 {
    font-size: 1em;
  }
  
  .reveal p, .reveal ul, .reveal ol {
    font-size: 0.8em;
  }
  
  .reveal pre code {
    font-size: 0.65em;
    padding: 0.6em;
  }
}

@media (max-width: 480px) {
  .reveal .slides > section {
    padding: 15px;
  }
  
  .reveal h1 {
    font-size: 1.3em;
  }
  
  .reveal h2 {
    font-size: 1.1em;
  }
  
  .reveal h3 {
    font-size: 0.95em;
  }
  
  .reveal p, .reveal ul, .reveal ol {
    font-size: 0.75em;
    max-width: 95%;
  }
  
  .reveal pre code {
    font-size: 0.6em;
    padding: 0.5em;
  }
}
`;
    
    // 在</head>标签前插入为该演示文稿定制的CSS
    const cssLink = `<style>${customCSS}</style>\n</head>`;
    htmlContent = htmlContent.replace('</head>', cssLink);
    
    // 添加增强的JavaScript功能，支持动态页码更新
    const enhancedScript = `
<script>
// 添加滚轮导航支持
window.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'reveal-wheel-navigation') {
    if (window.Reveal) {
      if (event.data.direction === 'right') {
        window.Reveal.next();
      } else if (event.data.direction === 'left') {
        window.Reveal.prev();
      }
    }
  }
});

// 页眉页脚增强功能
document.addEventListener('DOMContentLoaded', function() {
  if (window.Reveal) {
    const showPageNumber = ${showPageNumber};
    const customFooter = "${customFooter.replace(/"/g, '\\"')}";
    
    // 当Reveal.js初始化完成后
    window.Reveal.on('ready', function() {
      console.log('Reveal.js presentation ready');
      if (showPageNumber) {
        updateFooterWithPageNumber();
      }
      
      // 发送准备就绪消息给父窗口
      window.parent.postMessage({
        type: 'reveal-ready'
      }, '*');
    });
    
    // 监听幻灯片变化事件
    window.Reveal.on('slidechanged', function(event) {
      if (showPageNumber) {
        updateFooterWithPageNumber();
      }
    });
    
    // 监听片段变化事件
    if (showPageNumber) {
      window.Reveal.on('fragmentshown', updateFooterWithPageNumber);
      window.Reveal.on('fragmenthidden', updateFooterWithPageNumber);
    }
  }
});

// 更新页脚页码显示
function updateFooterWithPageNumber() {
  if (window.Reveal) {
    const indices = window.Reveal.getIndices();
    const totalSlides = window.Reveal.getTotalSlides();
    const currentSlide = indices.h + 1;
    const customFooter = "${customFooter.replace(/"/g, '\\"')}";
    
    // 动态更新页脚文本
    const style = document.createElement('style');
    style.textContent = \`
      .reveal::after {
        content: "\${customFooter} | 第 \${currentSlide} / \${totalSlides} 页" !important;
      }
    \`;
    
    // 移除旧的样式
    const oldStyle = document.querySelector('#dynamic-footer-style');
    if (oldStyle) {
      oldStyle.remove();
    }
    
    style.id = 'dynamic-footer-style';
    document.head.appendChild(style);
  }
}
</script>
</body>`;
    
    htmlContent = htmlContent.replace('</body>', enhancedScript);
    
    // 写回文件
    writeFileSync(outputPath, htmlContent);
    
    console.log(`✅ 构建成功: ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ 构建失败: ${mdFile}`);
    console.error(error.message);
  }
}

// 递归扫描演示文稿目录
function scanPresentations(dir) {
  if (!existsSync(dir)) {
    console.log(`创建演示文稿目录: ${dir}`);
    mkdirSync(dir, { recursive: true });
    return;
  }

  const items = readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      // 创建对应的输出目录
      const outputSubDir = fullPath.replace(PRESENTATIONS_DIR, OUTPUT_DIR);
      if (!existsSync(outputSubDir)) {
        mkdirSync(outputSubDir, { recursive: true });
      }
      scanPresentations(fullPath);
    } else if (item.endsWith('.md')) {
      // 构建 Markdown 文件
      const relativePath = path.relative(PRESENTATIONS_DIR, fullPath);
      const outputPath = path.join(OUTPUT_DIR, relativePath.replace('.md', '.html'));
      
      // 确保输出目录存在
      const outputDir = path.dirname(outputPath);
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }
      
      buildPresentation(fullPath, outputPath);
    }
  });
}

// 主函数
function main() {
  console.log('🚀 开始构建演示文稿...');
  
  // 检查 Pandoc 是否安装
  try {
    execSync('pandoc --version', { stdio: 'ignore' });
  } catch (error) {
    console.error('❌ 错误: 未找到 Pandoc，请先安装 Pandoc');
    console.error('安装命令: sudo apt install pandoc (Ubuntu/Debian) 或 brew install pandoc (macOS)');
    process.exit(1);
  }
  
  // 创建自定义CSS文件
  createCustomCSS();
  
  scanPresentations(PRESENTATIONS_DIR);
  console.log('✨ 所有演示文稿构建完成!');
}

main();