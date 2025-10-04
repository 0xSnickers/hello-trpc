import { create } from 'zustand';
import type { AppRouter } from '../../../server/src/router';
import { inferRouterOutputs } from '@trpc/server';

// 从 tRPC 路由推断类型，确保类型安全
type RouterOutput = inferRouterOutputs<AppRouter>;
type Post = RouterOutput['post']['list'][0];

interface PostStore {
  posts: Post[];
  isLoading: boolean;
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  updatePost: (post: Post) => void;
  deletePost: (postId: number) => void;
  setLoading: (loading: boolean) => void;
  fetchPosts: () => Promise<void>;
}

export const usePostStore = create<PostStore>((set, get) => ({
  posts: [],
  isLoading: false,
  
  setPosts: (posts) => set({ posts }),
  
  addPost: (post) => set((state) => ({
    posts: [...state.posts, post]
  })),
  
  updatePost: (updatedPost) => set((state) => ({
    posts: state.posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    )
  })),
  
  deletePost: (postId) => set((state) => ({
    posts: state.posts.filter(post => post.id !== postId)
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  fetchPosts: async () => {
    // 这个方法现在由组件中的 tRPC hooks 调用
    // store 只负责状态管理，不直接调用 API
    console.log('fetchPosts called - 应该由组件中的 tRPC hooks 处理');
  }
}));
