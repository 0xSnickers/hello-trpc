import { useState, useEffect } from 'react';
import { trpc } from '../utils/trpc';
import { usePostStore } from '../stores/postStore';

export function PostList() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const { posts, isLoading, updatePost, deletePost: removePost, setPosts, setLoading } = usePostStore();
  
  // 使用 tRPC hook 获取数据，保持类型安全
  const { data: tRPCPosts, isLoading: tRPCLoading } = trpc.post.list.useQuery();

  // 同步 tRPC 数据到 Zustand store
  useEffect(() => {
    if (tRPCPosts) {
      setPosts(tRPCPosts);
    }
    setLoading(tRPCLoading);
  }, [tRPCPosts, tRPCLoading, setPosts, setLoading]);

  const handleEdit = (post: { id: number; title: string; content: string; userId: number; user?: { id: number; name: string; email: string } }) => {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const updatePostMutation = trpc.post.update.useMutation({
    onSuccess: (updatedPost) => {
      console.log('✅ [PostList] 文章更新成功，直接更新 Zustand store:', updatedPost);
      
      // 直接更新 Zustand store 中的文章信息
      updatePost(updatedPost);
      console.log('📝 [PostList] Zustand store 已更新');
      
      setEditingId(null);
      setEditTitle('');
      setEditContent('');
    },
  });

  const deletePostMutation = trpc.post.delete.useMutation({
    onSuccess: (deletedPost) => {
      console.log('✅ [PostList] 文章删除成功，直接更新 Zustand store:', deletedPost);
      
      // 直接从 Zustand store 中移除删除的文章
      removePost(deletedPost.id);
      console.log('📝 [PostList] Zustand store 已更新');
    },
  });

  const handleUpdate = async (id: number) => {
    if (!editTitle || !editContent) return;
    
    try {
      await updatePostMutation.mutateAsync({ id, title: editTitle, content: editContent });
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePostMutation.mutateAsync({ id });
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  if (isLoading) return <div>Loading posts...</div>;

  return (
    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
      {posts?.map((post) => (
        <div
          key={post.id}
          style={{
            padding: '15px',
            border: '1px solid #eee',
            borderRadius: '4px',
            marginBottom: '10px',
            backgroundColor: '#fafafa'
          }}
        >
          {editingId === post.id ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleUpdate(post.id)}
                  style={{
                    padding: '8px 16px',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditTitle('');
                    setEditContent('');
                  }}
                  style={{
                    padding: '8px 16px',
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>{post.title}</h4>
                  <p style={{ margin: '0 0 8px 0', color: '#666', lineHeight: '1.4' }}>{post.content}</p>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    By: {post.user?.name} ({post.user?.email})
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '5px', marginLeft: '10px' }}>
                  <button
                    onClick={() => handleEdit(post)}
                    style={{
                      padding: '4px 8px',
                      background: '#0070f3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    style={{
                      padding: '4px 8px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
