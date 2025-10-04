import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './router';

const app = express();
const PORT = process.env.PORT || 13001;

// 中间件
app.use(cors({
  origin: 'http://localhost:13000', // Next.js 默认端口
  credentials: true
}));

app.use(express.json());

// tRPC 中间件
app.use('/trpc', createExpressMiddleware({
  router: appRouter,
  createContext: () => ({}),
}));

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'tRPC server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 tRPC server running on http://localhost:${PORT}`);
  console.log(`📡 tRPC endpoint: http://localhost:${PORT}/trpc`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});
