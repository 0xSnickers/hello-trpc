import { create } from 'zustand';
import { trpc } from '../utils/trpc';

interface User {
  id: number;
  name: string;
  email: string;
}

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
    set({ isLoading: true });
    try {
      // 使用 fetch 方式调用 tRPC
      const response = await fetch('http://localhost:13001/trpc/user.list');
      const data = await response.json();
      const users = data.result?.data || [];
      set({ users, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch users:', error);
      set({ isLoading: false });
    }
  }
}));
