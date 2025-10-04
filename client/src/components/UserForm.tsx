import { useState } from 'react';
import { trpc } from '../utils/trpc';
import { useUserStore } from '../stores/userStore';

export function UserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addUser } = useUserStore();
  const createUser = trpc.user.create.useMutation({
    onSuccess: (newUser) => {
      console.log('✅ [UserForm] 用户创建成功，直接更新 Zustand store:', newUser);
      
      // 直接更新 Zustand store，立即生效
      addUser(newUser);
      console.log('📝 [UserForm] Zustand store 已更新');
      
      // 清理表单
      setName('');
      setEmail('');
      console.log('🎉 [UserForm] 用户创建完成，列表已立即更新');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const startTime = Date.now();
    console.log('🚀 [UserForm] 开始创建用户:', { name, email, timestamp: new Date().toISOString() });

    setIsSubmitting(true);
    try {
      // 记录接口请求开始时间
      const requestStartTime = Date.now();
      console.log('📡 [UserForm] 发送创建用户请求...');
      
      await createUser.mutateAsync({ name, email });
      
      // 记录接口响应时间
      const requestEndTime = Date.now();
      const requestDuration = requestEndTime - requestStartTime;
      console.log(`✅ [UserForm] 创建用户接口响应完成，耗时: ${requestDuration}ms`);
      
    } catch (error) {
      const errorTime = Date.now();
      const errorDuration = errorTime - startTime;
      console.error(`❌ [UserForm] 创建用户失败，总耗时: ${errorDuration}ms`, error);
    } finally {
      const endTime = Date.now();
      const totalDuration = endTime - startTime;
      console.log(`🏁 [UserForm] 创建用户流程完成，总耗时: ${totalDuration}ms`);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        required
      />
      <button
        type="submit"
        disabled={isSubmitting}
        style={{
          padding: '10px',
          background: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          opacity: isSubmitting ? 0.6 : 1
        }}
      >
        {isSubmitting ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
