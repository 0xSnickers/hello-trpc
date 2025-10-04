// 统一导出所有 stores
export { useUserStore } from './userStore';
export { usePostStore } from './postStore';

// 初始化所有数据
export const initializeStores = async () => {
  const { useUserStore } = await import('./userStore');
  const { usePostStore } = await import('./postStore');
  
  // 获取 store 实例
  const userStore = useUserStore.getState();
  const postStore = usePostStore.getState();
  
  // 并行获取数据
  await Promise.all([
    userStore.fetchUsers(),
    postStore.fetchPosts()
  ]);
  
  console.log('🎉 [Stores] 所有数据已初始化完成');
};
