import { useUserStore } from '../stores/userStore';
import { usePostStore } from '../stores/postStore';

export function Stats() {
  const { users, isLoading: usersLoading } = useUserStore();
  const { posts, isLoading: postsLoading } = usePostStore();

  const isLoading = usersLoading || postsLoading;
  const userCount = users.length;
  const postCount = posts.length;
  const averagePostsPerUser = userCount > 0 ? postCount / userCount : 0;

  if (isLoading) return <div>Loading statistics...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
      <div style={{
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        textAlign: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>👥 Total Users</h3>
        <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#0070f3' }}>
          {userCount}
        </div>
      </div>

      <div style={{
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        textAlign: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>📝 Total Posts</h3>
        <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#28a745' }}>
          {postCount}
        </div>
      </div>

      <div style={{
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        textAlign: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>📊 Avg Posts/User</h3>
        <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#ffc107' }}>
          {averagePostsPerUser.toFixed(1)}
        </div>
      </div>
    </div>
  );
}
