import { useState, useEffect } from 'react';
import { trpc } from '../utils/trpc';
import { useUserStore } from '../stores/userStore';

export function UserList() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const { users, isLoading, updateUser, deleteUser: removeUser, setUsers, setLoading } = useUserStore();
  
  // 使用 tRPC hook 获取数据，保持类型安全
  const { data: tRPCUsers, isLoading: tRPCLoading } = trpc.user.list.useQuery();

  // 同步 tRPC 数据到 Zustand store
  useEffect(() => {
    if (tRPCUsers) {
      setUsers(tRPCUsers);
    }
    setLoading(tRPCLoading);
  }, [tRPCUsers, tRPCLoading, setUsers, setLoading]);

  const deleteUserMutation = trpc.user.delete.useMutation({
    onSuccess: (deletedUser) => {
      console.log('✅ [UserList] 用户删除成功，直接更新 Zustand store:', deletedUser);
      
      // 直接从 Zustand store 中移除删除的用户
      removeUser(deletedUser.id);
      console.log('📝 [UserList] Zustand store 已更新');
      
      setEditingId(null);
      setEditName('');
      setEditEmail('');
    },
  });
  
  const updateUserMutation = trpc.user.update.useMutation({
    onSuccess: (updatedUser) => {
      console.log('✅ [UserList] 用户更新成功，直接更新 Zustand store:', updatedUser);
      
      // 直接更新 Zustand store 中的用户信息
      updateUser(updatedUser);
      console.log('📝 [UserList] Zustand store 已更新');
      
      setEditingId(null);
      setEditName('');
      setEditEmail('');
    },
  });

  const handleEdit = (user: { id: number; name: string; email: string }) => {
    setEditingId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  const handleUpdate = async (id: number) => {
    if (!editName || !editEmail) return;
    
    try {
      await updateUserMutation.mutateAsync({ id, name: editName, email: editEmail });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUserMutation.mutateAsync({ id });
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (isLoading) return <div>Loading users...</div>;

  return (
    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
      {users?.map((user) => (
        <div
          key={user.id}
          style={{
            padding: '10px',
            border: '1px solid #eee',
            borderRadius: '4px',
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {editingId === user.id ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={{ padding: '4px', border: '1px solid #ddd', borderRadius: '2px' }}
              />
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                style={{ padding: '4px', border: '1px solid #ddd', borderRadius: '2px' }}
              />
              <div style={{ display: 'flex', gap: '5px' }}>
                <button
                  onClick={() => handleUpdate(user.id)}
                  style={{
                    padding: '4px 8px',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setEditName('');
                    setEditEmail('');
                  }}
                  style={{
                    padding: '4px 8px',
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>{user.email}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>{user.age}</div>
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button
                  onClick={() => handleEdit(user)}
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
                  onClick={() => handleDelete(user.id)}
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
            </>
          )}
        </div>
      ))}
    </div>
  );
}
