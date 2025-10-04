import { useState, useEffect } from 'react';
import { UserForm } from '../components/UserForm';
import { PostForm } from '../components/PostForm';
import { UserList } from '../components/UserList';
import { PostList } from '../components/PostList';
import { Stats } from '../components/Stats';
import { initializeStores } from '../stores';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'stats'>('users');

  // 初始化所有 stores
  useEffect(() => {
    initializeStores();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        🚀 tRPC Demo - Next.js + Node.js
      </h1>
      
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #eee' }}>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            border: 'none',
            background: activeTab === 'users' ? '#0070f3' : '#f0f0f0',
            color: activeTab === 'users' ? 'white' : '#333',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          👥 Users
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            border: 'none',
            background: activeTab === 'posts' ? '#0070f3' : '#f0f0f0',
            color: activeTab === 'posts' ? 'white' : '#333',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          📝 Posts
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          style={{
            padding: '10px 20px',
            border: 'none',
            background: activeTab === 'stats' ? '#0070f3' : '#f0f0f0',
            color: activeTab === 'stats' ? 'white' : '#333',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          📊 Stats
        </button>
      </div>

      {activeTab === 'users' && (
        <div>
          <h2>User Management</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h3>Add New User</h3>
              <UserForm />
            </div>
            <div>
              <h3>Users List</h3>
              <UserList />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'posts' && (
        <div>
          <h2>Post Management</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h3>Add New Post</h3>
              <PostForm />
            </div>
            <div>
              <h3>Posts List</h3>
              <PostList />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div>
          <h2>Statistics</h2>
          <Stats />
        </div>
      )}
    </div>
  );
}
