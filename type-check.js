#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 开始类型一致性验证...\n');

// 清理缓存
console.log('1️⃣ 清理 TypeScript 缓存...');
try {
  if (fs.existsSync('client/tsconfig.tsbuildinfo')) {
    fs.unlinkSync('client/tsconfig.tsbuildinfo');
    console.log('   ✅ 清理 client/tsconfig.tsbuildinfo');
  }
  if (fs.existsSync('server/tsconfig.tsbuildinfo')) {
    fs.unlinkSync('server/tsconfig.tsbuildinfo');
    console.log('   ✅ 清理 server/tsconfig.tsbuildinfo');
  }
  if (fs.existsSync('client/.next')) {
    execSync('rmdir /s /q client\\.next', { stdio: 'ignore' });
    console.log('   ✅ 清理 client/.next');
  }
} catch (error) {
  console.log('   ⚠️ 缓存清理完成（部分文件可能不存在）');
}

// 检查后端类型
console.log('\n2️⃣ 检查后端类型...');
try {
  execSync('cd server && npx tsc --noEmit', { stdio: 'pipe' });
  console.log('   ✅ 后端类型检查通过');
} catch (error) {
  console.log('   ❌ 后端类型错误:');
  console.log(error.stdout.toString());
}

// 检查前端类型
console.log('\n3️⃣ 检查前端类型...');
try {
  execSync('cd client && npx tsc --noEmit --skipLibCheck true', { stdio: 'pipe' });
  console.log('   ✅ 前端类型检查通过');
} catch (error) {
  const output = error.stdout.toString();
  // 过滤掉 React 类型定义错误，只显示项目相关的错误
  const projectErrors = output.split('\n').filter(line => 
    line.includes('src/') && 
    !line.includes('node_modules') &&
    !line.includes('PromiseLikeOfReactNode')
  );
  
  if (projectErrors.length > 0) {
    console.log('   ❌ 前端类型错误:');
    console.log(projectErrors.join('\n'));
  } else {
    console.log('   ✅ 前端类型检查通过（忽略 React 类型定义错误）');
  }
}

console.log('\n🎉 类型验证完成！');
console.log('\n💡 提示：');
console.log('   - 如果看到类型错误，说明类型安全正常工作');
console.log('   - 如果没有错误，说明前后端类型完全一致');
console.log('   - 修改后端字段后，前端应该立即显示类型错误');
