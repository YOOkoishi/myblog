import { execSync } from 'child_process';
import { readdirSync, statSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

const PRESENTATIONS_DIR = './src/content/presentations';
const OUTPUT_DIR = './public/presentations';

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

// 构建单个演示文稿
function buildPresentation(mdFile, outputPath) {
  // 读取并解析Markdown文件
  const markdownContent = readFileSync(mdFile, 'utf8');
  const { frontmatter } = parseFrontmatter(markdownContent);
  
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
    `-V center=false ` +
    `-V navigationMode=default ` +
    `-V width=1600 ` +
    `-V height=900 ` +
    `--highlight-style=pygments ` +
    `-o "${outputPath}"`;

  try {
    console.log(`正在构建: ${mdFile} -> ${outputPath}`);
    execSync(pandocCommand, { stdio: 'inherit' });
    
    // 读取生成的HTML文件
    let htmlContent = readFileSync(outputPath, 'utf8');
    
    // 重新设计的CSS - 参考jyywiki样式，一级标题在顶部带背景色
    const customCSS = `
/* 给整个演示文稿区域添加浅色背景，调整边距以适应博客显示 */
.reveal {
  background: #f8f9fa !important;
  position: fixed !important;
  top: 10px !important;
  bottom: 45px !important;
  left: 10px !important;
  right: 10px !important;
  width: calc(100% - 20px) !important;
  height: calc(100vh - 55px) !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important;
}

/* 自定义页脚 */
.reveal::after {
  content: "${customFooter.replace(/"/g, '\\"')}";
  position: fixed;
  bottom: 10px;
  left: 10px;
  right: 10px;
  height: 35px;
  background: linear-gradient(to top, #ffffff 0%, #f8f9fa 100%);
  border-top: 2px solid #e2e8f0;
  border-radius: 0 0 8px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #718096;
  z-index: 1001;
  box-shadow: 0 -2px 4px rgba(0,0,0,0.05);
}

/* 首页标题页 - 深色背景配白色文字 */
.reveal .slides > section#title-slide {
  text-align: center !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  align-items: center !important;
  height: 100% !important;
  padding: 60px !important;
  margin: 0 !important;
  background: #ffffff !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.reveal .slides > section#title-slide h1,
.reveal .slides > section#title-slide .title {
  font-size: 3em !important;
  margin-bottom: 0.5em !important;
  margin-top: 0 !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  padding: 30px 60px !important;
  background: #06b6d4 !important;
  border-radius: 12px !important;
  border: 2px solid #0891b2 !important;
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.25) !important;
}

.reveal .slides > section#title-slide .author {
  font-size: 1.5em !important;
  margin-top: 1em !important;
  color: #4a5568 !important;
  font-weight: 500 !important;
  padding: 15px 40px !important;
  background: #f8fafc !important;
  border-radius: 8px !important;
}

.reveal .slides > section#title-slide .date {
  font-size: 1.2em !important;
  margin-top: 0.5em !important;
  color: #718096 !important;
}

/* ===== 扁平结构：只有H1，没有H2子页面 ===== */
/* 这些section直接在slides下，有class="title-slide slide level1" */

.reveal .slides > section.title-slide.slide.level1 {
  text-align: left !important;
  display: block !important;
  padding: 0 !important;
  margin: 0 !important;
  height: 100% !important;
  background: #ffffff !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden !important;
}

/* 扁平结构的一级标题 - 青色背景 */
.reveal .slides > section.title-slide.slide.level1 > h1 {
  margin: 0 !important;
  padding: 20px 80px !important;
  background: #06b6d4 !important;
  color: #ffffff !important;
  font-size: 1.8em !important;
  font-weight: 600 !important;
  line-height: 1.3 !important;
  border-bottom: 4px solid #0891b2 !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
}

/* 扁平结构的内容 */
.reveal .slides > section.title-slide.slide.level1 > *:not(h1) {
  padding-left: 80px !important;
  padding-right: 80px !important;
}

.reveal .slides > section.title-slide.slide.level1 > p:first-of-type,
.reveal .slides > section.title-slide.slide.level1 > ul:first-of-type,
.reveal .slides > section.title-slide.slide.level1 > ol:first-of-type,
.reveal .slides > section.title-slide.slide.level1 > pre:first-of-type,
.reveal .slides > section.title-slide.slide.level1 > div:first-of-type {
  margin-top: 70px !important;
}

/* ===== 嵌套结构：H1下有H2子页面 ===== */
/* 外层section包含内层sections */

.reveal .slides > section > section {
  text-align: left !important;
  display: block !important;
  padding: 0 !important;
  margin: 0 !important;
  height: 100% !important;
  background: #ffffff !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden !important;
}

/* 嵌套结构的一级标题section（父标题页）*/
.reveal .slides > section > section.title-slide.slide.level1 > h1 {
  margin: 0 !important;
  padding: 20px 80px !important;
  background: #06b6d4 !important;
  color: #ffffff !important;
  font-size: 1.8em !important;
  font-weight: 600 !important;
  line-height: 1.3 !important;
  border-bottom: 4px solid #0891b2 !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
}

/* 嵌套结构父标题页的内容 */
.reveal .slides > section > section.title-slide.slide.level1 > *:not(h1) {
  padding-left: 80px !important;
  padding-right: 80px !important;
}

/* 嵌套结构的子页面（H2级别）*/
.reveal .slides > section > section:not(.title-slide):not(#title-slide) {
  text-align: left !important;
  display: block !important;
  padding: 0 !important;
  margin: 0 !important;
  height: 100% !important;
  background: #ffffff !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden !important;
}

/* 嵌套结构的内容区域包装器 */
.reveal .slides > section > section:not(.title-slide):not(#title-slide) > *:not(h2) {
  padding-left: 80px !important;
  padding-right: 80px !important;
}

/* 嵌套结构中，为每个子页面的顶部添加父H1标题 */
.reveal .slides > section > section:not(.title-slide):not(#title-slide)::before {
  content: attr(data-parent-title) !important;
  display: block !important;
  margin: 0 !important;
  padding: 20px 80px !important;
  background: #06b6d4 !important;
  color: #ffffff !important;
  font-size: 1.8em !important;
  font-weight: 600 !important;
  line-height: 1.3 !important;
  border-bottom: 4px solid #0891b2 !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
}

/* 为嵌套结构的内容添加顶部间距 */
.reveal .slides > section > section:not(.title-slide):not(#title-slide) > h2:first-of-type,
.reveal .slides > section > section:not(.title-slide):not(#title-slide) > p:first-of-type,
.reveal .slides > section > section:not(.title-slide):not(#title-slide) > ul:first-of-type,
.reveal .slides > section > section:not(.title-slide):not(#title-slide) > ol:first-of-type,
.reveal .slides > section > section:not(.title-slide):not(#title-slide) > pre:first-of-type {
  margin-top: 70px !important;
}

/* 二级标题样式 - 缩小字体，增加左边距 */
.reveal .slides > section > section:not(.title-slide):not(#title-slide) h2 {
  font-size: 1.6em !important;
  margin-bottom: 0.6em !important;
  margin-top: 30px !important;
  margin-left: 20px !important;
  line-height: 1.3 !important;
  font-weight: 600 !important;
  color: #1e293b !important;
}

/* 三级标题 - 缩小字体 */
.reveal .slides > section > section:not(.title-slide):not(#title-slide) h3 {
  font-size: 1.3em !important;
  margin-bottom: 0.5em !important;
  margin-top: 1em !important;
  line-height: 1.3 !important;
  font-weight: 600 !important;
  color: #334155 !important;
}

/* 四级标题 */
.reveal .slides > section > section:not(.title-slide):not(#title-slide) h4 {
  font-size: 1.3em !important;
  margin-bottom: 0.4em !important;
  margin-top: 0.8em !important;
  line-height: 1.3 !important;
  font-weight: 600 !important;
  color: #475569 !important;
}

/* 段落基础样式 */
.reveal .slides > section:not(#title-slide) p {
  margin: 0 0 0.5em 0 !important;
  font-size: 1.15em !important;
  line-height: 1.6 !important;
  text-align: left !important;
  color: #334155 !important;
}

/* 列表基础样式 */
.reveal .slides > section:not(#title-slide) ul,
.reveal .slides > section:not(#title-slide) ol {
  margin: 0 0 0.5em 0 !important;
  font-size: 1.05em !important;
  line-height: 1.6 !important;
}

.reveal .slides > section:not(#title-slide) li {
  margin: 0.3em 0 !important;
  color: #334155 !important;
}

/* 代码块样式 - 提高可读性 */
.reveal .slides > section:not(#title-slide) pre {
  margin: 0.6em 0 !important;
  border-radius: 8px !important;
  background: #f8fafc !important;
  border: 2px solid #e2e8f0 !important;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08) !important;
  overflow: auto !important;
  max-width: 100% !important;
}

.reveal .slides > section:not(#title-slide) code {
  padding: 0.8em 1em !important;
  font-size: 0.85em !important;
  line-height: 1.5 !important;
  color: #1e293b !important;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
}

/* 行内代码 */
.reveal .slides > section:not(#title-slide) p code,
.reveal .slides > section:not(#title-slide) li code {
  background: #e0f2fe !important;
  color: #0369a1 !important;
  padding: 0.2em 0.4em !important;
  border-radius: 4px !important;
  font-size: 0.9em !important;
}

/* 确保内容不会超出边界 */
.reveal .slides > section > section:not(#title-slide) > *,
.reveal .slides > section > section.title-slide.slide.level1 > * {
  max-width: 100% !important;
  box-sizing: border-box !important;
}

/* 全屏模式 - 深色主题 */
.reveal:-webkit-full-screen {
  background: #0f172a !important;
}

.reveal:-webkit-full-screen::after {
  background: #1e293b !important;
  border-top-color: #475569 !important;
  color: #cbd5e0 !important;
}

.reveal:-webkit-full-screen .slides > section:not(#title-slide),
.reveal:-webkit-full-screen .slides > section > section:not(.title-slide):not(#title-slide) {
  background: #1e293b !important;
}

.reveal:-webkit-full-screen .slides > section.title-slide.slide.level1,
.reveal:-webkit-full-screen .slides > section > section.title-slide.slide.level1 {
  background: #1e293b !important;
}

.reveal:-webkit-full-screen .slides > section.title-slide.slide.level1 > h1,
.reveal:-webkit-full-screen .slides > section > section.title-slide.slide.level1 > h1,
.reveal:-webkit-full-screen .slides > section > section:not(.title-slide):not(#title-slide)::before {
  background: #4c1d95 !important;
  border-bottom-color: #f59e0b !important;
}

.reveal:-webkit-full-screen .slides > section:not(#title-slide) h2,
.reveal:-webkit-full-screen .slides > section:not(#title-slide) h3,
.reveal:-webkit-full-screen .slides > section:not(#title-slide) h4,
.reveal:-webkit-full-screen .slides > section > section:not(.title-slide):not(#title-slide) h2,
.reveal:-webkit-full-screen .slides > section > section:not(.title-slide):not(#title-slide) h3,
.reveal:-webkit-full-screen .slides > section > section:not(.title-slide):not(#title-slide) h4 {
  color: #e2e8f0 !important;
}

.reveal:-webkit-full-screen .slides > section:not(#title-slide) p,
.reveal:-webkit-full-screen .slides > section:not(#title-slide) li,
.reveal:-webkit-full-screen .slides > section > section:not(.title-slide):not(#title-slide) p,
.reveal:-webkit-full-screen .slides > section > section:not(.title-slide):not(#title-slide) li {
  color: #cbd5e0 !important;
}

.reveal:-moz-full-screen {
  background: #0f172a !important;
}

.reveal:-moz-full-screen::after {
  background: #1e293b !important;
  border-top-color: #475569 !important;
  color: #cbd5e0 !important;
}

.reveal:-moz-full-screen .slides > section:not(#title-slide),
.reveal:-moz-full-screen .slides > section > section:not(.title-slide):not(#title-slide) {
  background: #1e293b !important;
}

.reveal:-moz-full-screen .slides > section.title-slide.slide.level1,
.reveal:-moz-full-screen .slides > section > section.title-slide.slide.level1 {
  background: #1e293b !important;
}

.reveal:-moz-full-screen .slides > section.title-slide.slide.level1 > h1,
.reveal:-moz-full-screen .slides > section > section.title-slide.slide.level1 > h1,
.reveal:-moz-full-screen .slides > section > section:not(.title-slide):not(#title-slide)::before {
  background: #4c1d95 !important;
  border-bottom-color: #f59e0b !important;
}

.reveal:-moz-full-screen .slides > section:not(#title-slide) h2,
.reveal:-moz-full-screen .slides > section:not(#title-slide) h3,
.reveal:-moz-full-screen .slides > section:not(#title-slide) h4,
.reveal:-moz-full-screen .slides > section > section:not(.title-slide):not(#title-slide) h2,
.reveal:-moz-full-screen .slides > section > section:not(.title-slide):not(#title-slide) h3,
.reveal:-moz-full-screen .slides > section > section:not(.title-slide):not(#title-slide) h4 {
  color: #e2e8f0 !important;
}

.reveal:-moz-full-screen .slides > section:not(#title-slide) p,
.reveal:-moz-full-screen .slides > section:not(#title-slide) li,
.reveal:-moz-full-screen .slides > section > section:not(.title-slide):not(#title-slide) p,
.reveal:-moz-full-screen .slides > section > section:not(.title-slide):not(#title-slide) li {
  color: #cbd5e0 !important;
}

.reveal:fullscreen {
  background: #0f172a !important;
}

.reveal:fullscreen::after {
  background: #1e293b !important;
  border-top-color: #475569 !important;
  color: #cbd5e0 !important;
}

.reveal:fullscreen .slides > section:not(#title-slide),
.reveal:fullscreen .slides > section > section:not(.title-slide):not(#title-slide) {
  background: #1e293b !important;
}

.reveal:fullscreen .slides > section.title-slide.slide.level1,
.reveal:fullscreen .slides > section > section.title-slide.slide.level1 {
  background: #1e293b !important;
}

.reveal:fullscreen .slides > section.title-slide.slide.level1 > h1,
.reveal:fullscreen .slides > section > section.title-slide.slide.level1 > h1,
.reveal:fullscreen .slides > section > section:not(.title-slide):not(#title-slide)::before {
  background: #4c1d95 !important;
  border-bottom-color: #f59e0b !important;
}

.reveal:fullscreen .slides > section:not(#title-slide) h2,
.reveal:fullscreen .slides > section:not(#title-slide) h3,
.reveal:fullscreen .slides > section:not(#title-slide) h4,
.reveal:fullscreen .slides > section > section:not(.title-slide):not(#title-slide) h2,
.reveal:fullscreen .slides > section > section:not(.title-slide):not(#title-slide) h3,
.reveal:fullscreen .slides > section > section:not(.title-slide):not(#title-slide) h4 {
  color: #e2e8f0 !important;
}

.reveal:fullscreen .slides > section:not(#title-slide) p,
.reveal:fullscreen .slides > section:not(#title-slide) li,
.reveal:fullscreen .slides > section > section:not(.title-slide):not(#title-slide) p,
.reveal:fullscreen .slides > section > section:not(.title-slide):not(#title-slide) li {
  color: #cbd5e0 !important;
}

/* 确保导航按钮在可视区域内 */
.reveal .controls { 
  position: fixed !important;
  bottom: 50px !important;
  right: 12px !important;
  z-index: 1000 !important;
}

/* 确保进度条在可视区域内 */
.reveal .progress { 
  position: fixed !important;
  bottom: 35px !important;
  left: 0 !important;
  right: 0 !important;
  height: 3px !important;
  z-index: 1000 !important;
}
`;
    
    htmlContent = htmlContent.replace('</head>', `<style>${customCSS}</style>\n</head>`);
    
    // 页码和嵌套标题脚本
    const script = `
<script>
document.addEventListener('DOMContentLoaded', function() {
  // 提取嵌套结构的父H1标题，设置到子页面
  function setupNestedTitles() {
    const parentSections = document.querySelectorAll('.reveal .slides > section');
    
    parentSections.forEach(parentSection => {
      // 找到这个父section下的所有子sections
      const childSections = parentSection.querySelectorAll(':scope > section');
      
      if (childSections.length === 0) return; // 扁平结构，跳过
      
      // 找到父H1标题
      let parentTitle = '';
      const titleSection = parentSection.querySelector(':scope > section.title-slide.slide.level1');
      if (titleSection) {
        const h1 = titleSection.querySelector('h1');
        if (h1) {
          parentTitle = h1.textContent.trim();
        }
      }
      
      // 为每个子section设置data-parent-title（除了标题页本身）
      if (parentTitle) {
        childSections.forEach(childSection => {
          if (!childSection.classList.contains('title-slide') && 
              childSection.id !== 'title-slide') {
            childSection.setAttribute('data-parent-title', parentTitle);
            // 强制触发CSS重绘
            childSection.style.display = 'none';
            childSection.offsetHeight; // 触发reflow
            childSection.style.display = '';
          }
        });
      }
    });
  }
  
  // 立即执行一次
  setTimeout(setupNestedTitles, 100);
  
  // 等待Reveal.js ready后再执行一次
  if (window.Reveal) {
    window.Reveal.on('ready', function() {
      setupNestedTitles();
    });
  }
  
  // 页码功能
  if (window.Reveal && ${showPageNumber}) {
    const customFooter = "${customFooter.replace(/"/g, '\\"')}";
    
    function updatePageNumber() {
      const indices = window.Reveal.getIndices();
      const slides = window.Reveal.getSlides();
      const currentSlide = indices.h + 1;
      const totalSlides = slides.length;
      
      const style = document.createElement('style');
      style.textContent = \`.reveal::after { content: "\${customFooter} | \${currentSlide} / \${totalSlides}" !important; }\`;
      
      const oldStyle = document.querySelector('#page-style');
      if (oldStyle) oldStyle.remove();
      
      style.id = 'page-style';
      document.head.appendChild(style);
    }
    
    window.Reveal.on('ready', updatePageNumber);
    window.Reveal.on('slidechanged', updatePageNumber);
  }
});
</script>
</body>`;
    
    htmlContent = htmlContent.replace('</body>', script);
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
  
  scanPresentations(PRESENTATIONS_DIR);
  console.log('✨ 所有演示文稿构建完成!');
}

main();