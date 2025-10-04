import { create } from 'zustand';
import type { AppRouter } from '../../../server/src/router';
import { inferRouterOutputs } from '@trpc/server';

// 从 tRPC 路由推断类型，确保类型安全
type RouterOutput = inferRouterOutputs<AppRouter>;
type User = RouterOutput['user']['list'][0];

interface UserStore {
  users: User[];
  isLoading: boolean;
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: number) => void;
  setLoading: (loading: boolean) => void;
  fetchUsers: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  isLoading: false,
  
  setUsers: (users) => set({ users }),
  
  addUser: (user) => set((state) => ({
    users: [...state.users, user]
  })),
  
  updateUser: (updatedUser) => set((state) => ({
    users: state.users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    )
  })),
  
  deleteUser: (userId) => set((state) => ({
    users: state.users.filter(user => user.id !== userId)
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  fetchUsers: async () => {
    // 这个方法现在由组件中的 tRPC hooks 调用
    // store 只负责状态管理，不直接调用 API
    console.log('fetchUsers called - 应该由组件中的 tRPC hooks 处理');
  }
}));
