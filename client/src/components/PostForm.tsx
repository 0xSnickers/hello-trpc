import { useState } from 'react';
import { trpc } from '../utils/trpc';
import { usePostStore } from '../stores/postStore';
import { useUserStore } from '../stores/userStore';

export function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { users } = useUserStore();
  const { addPost } = usePostStore();
  const createPost = trpc.post.create.useMutation({
    onSuccess: (newPost) => {
      console.log('✅ [PostForm] 文章创建成功，直接更新 Zustand store:', newPost);
      
      // 直接更新 Zustand store，立即生效
      addPost(newPost);
      console.log('📝 [PostForm] Zustand store 已更新');
      
      // 清理表单
      setTitle('');
      setContent('');
      setUserId('');
      console.log('🎉 [PostForm] 文章创建完成，列表已立即更新');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !userId) return;

    setIsSubmitting(true);
    try {
      await createPost.mutateAsync({ title, content, userId: Number(userId) });
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <input
        type="text"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        required
      />
      <textarea
        placeholder="Post Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
        required
      />
      <select
        value={userId}
        onChange={(e) => setUserId(e.target.value as number | '')}
        style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        required
      >
        <option value="">Select a user</option>
        {users?.map((user: any) => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.email})
          </option>
        ))}
      </select>
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
        {isSubmitting ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}
