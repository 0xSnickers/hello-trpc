import { create } from 'zustand';
import { trpc } from '../utils/trpc';

interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

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
    set({ isLoading: true });
    try {
      // 使用 fetch 方式调用 tRPC
      const response = await fetch('http://localhost:13001/trpc/post.list');
      const data = await response.json();
      const posts = data.result?.data || [];
      set({ posts, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      set({ isLoading: false });
    }
  }
}));
