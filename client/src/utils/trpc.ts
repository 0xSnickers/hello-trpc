import { createTRPCNext } from '@trpc/next';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../server/src/router';

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          url: 'http://localhost:13001/trpc',
        }),
      ],
      queryClientConfig: {
        defaultOptions: {
          queries: {
            staleTime: 0, // 数据立即过期，确保总是获取最新数据
            cacheTime: 0, // 不缓存数据
            refetchOnWindowFocus: false, // 窗口聚焦时不重新获取
          },
        },
      },
    };
  },
  ssr: false,
});
