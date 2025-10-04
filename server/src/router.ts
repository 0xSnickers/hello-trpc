import { z } from 'zod';
import { router, publicProcedure } from './trpc';

// 模拟数据存储
let users:{ id: number; name: string; email: string; age?: number }[] = [
  // { id: 1, name: 'Alice', email: 'alice@example.com' },
  // { id: 2, name: 'Bob', email: 'bob@example.com' },
  // { id: 3, name: 'Charlie', email: 'charlie@example.com' }
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 25 },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 30 },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 28 }

];

let posts = [
  { id: 1, title: 'Hello World', content: 'This is my first post', userId: 1 },
  { id: 2, title: 'tRPC is awesome', content: 'Type-safe APIs are the future', userId: 2 },
  { id: 3, title: 'Next.js + tRPC', content: 'Perfect combination for full-stack TypeScript', userId: 1 }
];

export const appRouter = router({
  // 用户相关接口
  user: router({
    list: publicProcedure.query(() => {
      return users;
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => {
        const user = users.find(u => u.id === input.id);
        if (!user) {
          throw new Error('User not found');
        }
        return user;
      }),
    
    create: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
      }))
      .mutation(({ input }) => {
        const newUser = {
          id: Math.max(...users.map(u => u.id)) + 1,
          name: input.name,
          email: input.email,
        };
        users.push(newUser);
        return newUser;
      }),
    
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional()
      }))
      .mutation(({ input }) => {
        const userIndex = users.findIndex(u => u.id === input.id);
        if (userIndex === -1) {
          throw new Error('User not found');
        }
        
        if (input.name) users[userIndex].name = input.name;
        if (input.email) users[userIndex].email = input.email;
        
        return users[userIndex];
      }),
    
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => {
        const userIndex = users.findIndex(u => u.id === input.id);
        if (userIndex === -1) {
          throw new Error('User not found');
        }
        
        const deletedUser = users.splice(userIndex, 1)[0];
        // 同时删除该用户的文章
        posts = posts.filter(p => p.userId !== input.id);
        return deletedUser;
      })
  }),
  
  // 文章相关接口
  post: router({
    list: publicProcedure.query(() => {
      return posts.map(post => ({
        ...post,
        user: users.find(u => u.id === post.userId)
      }));
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => {
        const post = posts.find(p => p.id === input.id);
        if (!post) {
          throw new Error('Post not found');
        }
        return {
          ...post,
          user: users.find(u => u.id === post.userId)
        };
      }),
    
    create: publicProcedure
      .input(z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        userId: z.number()
      }))
      .mutation(({ input }) => {
        // 验证用户是否存在
        const user = users.find(u => u.id === input.userId);
        if (!user) {
          throw new Error('User not found');
        }
        
        const newPost = {
          id: Math.max(...posts.map(p => p.id)) + 1,
          title: input.title,
          content: input.content,
          userId: input.userId
        };
        posts.push(newPost);
        return {
          ...newPost,
          user
        };
      }),
    
    update: publicProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        content: z.string().min(1).optional()
      }))
      .mutation(({ input }) => {
        const postIndex = posts.findIndex(p => p.id === input.id);
        if (postIndex === -1) {
          throw new Error('Post not found');
        }
        
        if (input.title) posts[postIndex].title = input.title;
        if (input.content) posts[postIndex].content = input.content;
        
        return {
          ...posts[postIndex],
          user: users.find(u => u.id === posts[postIndex].userId)
        };
      }),
    
    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => {
        const postIndex = posts.findIndex(p => p.id === input.id);
        if (postIndex === -1) {
          throw new Error('Post not found');
        }
        
        const deletedPost = posts.splice(postIndex, 1)[0];
        return {
          ...deletedPost,
          user: users.find(u => u.id === deletedPost.userId)
        };
      })
  }),
  
});

export type AppRouter = typeof appRouter;
