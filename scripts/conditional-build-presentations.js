import { spawn } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';

// 检查是否在 Vercel 或其他 CI 环境中
const isCI = process.env.CI === 'true' || 
             process.env.VERCEL === '1' || 
             process.env.NODE_ENV === 'production';

// 检查是否存在 pandoc
function checkPandoc() {
  return new Promise((resolve) => {
    const pandoc = spawn('pandoc', ['--version'], { stdio: 'ignore' });
    pandoc.on('close', (code) => {
      resolve(code === 0);
    });
    pandoc.on('error', () => {
      resolve(false);
    });
  });
}

// 检查演示文稿目录是否存在
function checkPresentationsExist() {
  const presentationsDir = path.join(process.cwd(), 'public', 'presentations');
  return existsSync(presentationsDir);
}

async function main() {
  console.log('🔍 检查演示文稿构建环境...');
  
  const hasPandoc = await checkPandoc();
  const hasExistingPresentations = checkPresentationsExist();
  
  if (isCI) {
    console.log('📦 检测到 CI/生产环境');
    
    if (hasExistingPresentations) {
      console.log('✅ 发现已构建的演示文稿，跳过构建步骤');
      process.exit(0);
    } else if (!hasPandoc) {
      console.log('⚠️  CI 环境中未安装 Pandoc，但未发现预构建的演示文稿');
      console.log('💡 提示: 请在本地运行 "npm run build:presentations" 并提交生成的文件');
      console.log('🚀 继续构建其他部分...');
      process.exit(0);
    }
  }
  
  if (!hasPandoc) {
    console.log('❌ 未找到 Pandoc');
    console.log('💡 请先安装 Pandoc:');
    console.log('   Ubuntu/Debian: sudo apt install pandoc');
    console.log('   macOS: brew install pandoc');
    console.log('   Windows: winget install JohnMacFarlane.Pandoc');
    
    if (isCI) {
      console.log('🚀 CI 环境中跳过演示文稿构建，继续其他构建步骤...');
      process.exit(0);
    } else {
      process.exit(1);
    }
  }
  
  console.log('✅ Pandoc 已安装，开始构建演示文稿...');
  
  // 执行实际的演示文稿构建
  const buildProcess = spawn('node', ['scripts/build-presentations.js'], {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  buildProcess.on('close', (code) => {
    if (code === 0) {
      console.log('✅ 演示文稿构建完成');
    } else {
      console.log('❌ 演示文稿构建失败');
    }
    process.exit(code);
  });
  
  buildProcess.on('error', (error) => {
    console.error('❌ 构建过程出错:', error);
    process.exit(1);
  });
}

main().catch((error) => {
  console.error('❌ 脚本执行出错:', error);
  process.exit(1);
});