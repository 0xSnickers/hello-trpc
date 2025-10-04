# 🚀 tRPC Demo - Next.js + Node.js

## - tRPC（TypeScript RPC）-

 一种基于 TypeScript 的全栈类型安全 RPC 框架
 它让你可以在前端直接调用后端函数，并且自动推断类型
 tRPC是一层类型安全的 RPC 协议 + HTTP 客户端包装器（本质上还是标准的 HTTP 请求）

📦 特点：
  - 完全基于 TypeScript
  - 不需要定义 .proto 文件
  - 自动类型共享（前后端同一套类型）
  - 开发体验极佳

🎯 优势总结
  - 🚀 无需写 RESTful API 接口
  - 🔒 类型安全（前后端自动同步）
  - 💬 简洁（像调用本地函数）
  - ⚙️ 性能不错（基于 HTTP）

 tRPC 在性能上和 RESTful API 几乎一致，真正的提升在于开发效率、类型安全和维护速度
 当后端改动输入/输出类型时，前端立即能发现问题。
 对中小型团队而言，它极大地降低了沟通成本和文档负担。
 但对于大型微服务架构，RESTful API/GraphQL 仍更合适。


## 📁 项目结构

```
hello-trpc/
├── server/              # Node.js + tRPC 后端
└── client/              # Next.js + tRPC 前端
```

## 🛠️ 技术栈

### 后端 (apps/server)
- **Node.js** - JavaScript 运行时
- **Express** - Web 框架
- **tRPC** - 类型安全的 RPC 框架
- **Zod** - 数据验证
- **TypeScript** - 类型安全

### 前端 (apps/client)
- **Next.js** - React 框架
- **React** - UI 库
- **tRPC** - 类型安全的客户端
- **React Query** - 数据获取和缓存
- **zustand** - 状态管理
- **TypeScript** - 类型安全

## 🚀 快速开始

### 1. 安装依赖

```bash
cd ./client && npm install
cd ./server && npm install
```

### 2. 启动开发服务器

```bash
cd ./client && npm run dev
cd ./server && npm run dev
```

### 3. 访问应用

- 前端应用: http://localhost:13000
- 后端 API: http://localhost:13001/trpc

## 📋 功能特性

### 用户管理
- ✅ 创建用户
- ✅ 查看用户列表
- ✅ 编辑用户信息
- ✅ 删除用户

### 文章管理
- ✅ 创建文章
- ✅ 查看文章列表
- ✅ 编辑文章内容
- ✅ 删除文章
- ✅ 文章与用户关联

### 统计信息
- ✅ 用户总数
- ✅ 文章总数
- ✅ 平均每用户文章数

## 🔧 API 接口

### 用户接口
- `user.list` - 获取所有用户
- `user.getById` - 根据ID获取用户
- `user.create` - 创建新用户
- `user.update` - 更新用户信息
- `user.delete` - 删除用户

### 文章接口
- `post.list` - 获取所有文章（包含用户信息）
- `post.getById` - 根据ID获取文章
- `post.create` - 创建新文章
- `post.update` - 更新文章内容
- `post.delete` - 删除文章

### 统计接口
- `stats` - 获取系统统计信息

## 🎯 学习要点

1. **类型安全**: 前后端共享类型定义，确保 API 调用的类型安全
2. **自动补全**: IDE 提供完整的类型提示和自动补全
3. **错误处理**: 统一的错误处理和验证
4. **实时更新**: 使用 React Query 实现数据缓存和实时更新
5. **开发体验**: 热重载和类型检查提升开发效率

## 📝 开发说明

### 添加新的 API 接口

1. 在 `apps/server/src/router.ts` 中添加新的路由
2. 使用 Zod 定义输入验证模式
3. 前端会自动获得类型提示
