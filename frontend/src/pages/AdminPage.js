import React, { useState, useEffect } from 'react';
import API from '../api/axios';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]); // NEW: State for comments
  const [contacts, setContacts] = useState([]); // NEW: State for contact messages
  const [tab, setTab] = useState('users');

  useEffect(() => {
    // Fetch all admin data
    API.get('/admin/users').then(r => setUsers(r.data)).catch(err => console.error(err));
    API.get('/admin/posts').then(r => setPosts(r.data)).catch(err => console.error(err));
    API.get('/admin/comments').then(r => setComments(r.data)).catch(err => console.error(err)); // Fetch comments
    API.get('/admin/contacts').then(r => setContacts(r.data)).catch(err => console.error(err)); // Fetch messages
  }, []);

  const toggleStatus = async (id) => {
    try {
      const { data } = await API.put(`/admin/users/${id}/status`);
      setUsers(users.map(u => u._id === id ? data.user : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle user status');
    }
  };

  const removePost = async (id) => {
    if (!window.confirm('Are you sure you want to remove this post?')) return;
    try {
      await API.put(`/admin/posts/${id}/remove`);
      setPosts(posts.map(p => p._id === id ? { ...p, status: 'removed' } : p));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove post');
    }
  };

  // NEW: Handler to delete a comment globally
  const removeComment = async (id) => {
    if (!window.confirm('Permanently delete this comment?')) return;
    try {
      await API.delete(`/comments/${id}`); // Uses standard comment route (admin permitted)
      setComments(comments.filter(c => c._id !== id));
    } catch (err) {
      alert('Failed to delete comment');
    }
  };

  return (
    <>
      <section className="page-title">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <p>System Overview & Moderation Control</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* Tab Navigation */}
          <div className="admin-tabs" style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', overflowX: 'auto' }}>
            <button 
              onClick={() => setTab('users')} 
              className="btn"
              style={{ opacity: tab === 'users' ? 1 : 0.4, transition: '0.3s' }}
            >
              Members ({users.length})
            </button>
            <button 
              onClick={() => setTab('posts')} 
              className="btn"
              style={{ opacity: tab === 'posts' ? 1 : 0.4, transition: '0.3s' }}
            >
              All Posts ({posts.length})
            </button>
            {/* NEW TABS */}
            <button 
              onClick={() => setTab('comments')} 
              className="btn"
              style={{ opacity: tab === 'comments' ? 1 : 0.4, transition: '0.3s' }}
            >
              Comments ({comments.length})
            </button>
            <button 
              onClick={() => setTab('contacts')} 
              className="btn"
              style={{ opacity: tab === 'contacts' ? 1 : 0.4, transition: '0.3s' }}
            >
              Inbox ({contacts.length})
            </button>
          </div>

          {/* Users Table (Unchanged) */}
          {tab === 'users' && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                    <th style={{ padding: '15px' }}>Name</th>
                    <th style={{ padding: '15px' }}>Email</th>
                    <th style={{ padding: '15px' }}>Status</th>
                    <th style={{ padding: '15px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '15px' }}>{u.fullname || u.name}</td>
                      <td style={{ padding: '15px' }}>{u.email}</td>
                      <td style={{ padding: '15px' }}>
                        <span style={{ 
                          padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold',
                          backgroundColor: u.status === 'active' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 70, 85, 0.2)',
                          color: u.status === 'active' ? '#4CAF50' : '#FF4655'
                        }}>
                          {(u.status || 'active').toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <button 
                          onClick={() => toggleStatus(u._id)}
                          style={{
                            padding: '8px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold',
                            backgroundColor: u.status === 'active' ? 'rgba(255, 70, 85, 0.2)' : 'rgba(76, 175, 80, 0.2)',
                            color: u.status === 'active' ? '#FF4655' : '#4CAF50'
                          }}
                        >
                          {u.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>No members found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Posts Table (Unchanged) */}
          {tab === 'posts' && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                    <th style={{ padding: '15px' }}>Title</th>
                    <th style={{ padding: '15px' }}>Author</th>
                    <th style={{ padding: '15px' }}>Status</th>
                    <th style={{ padding: '15px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(p => (
                    <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', opacity: p.status === 'removed' ? 0.5 : 1 }}>
                      <td style={{ padding: '15px' }}>{p.title}</td>
                      <td style={{ padding: '15px' }}>{p.author?.fullname || p.author?.name || 'Unknown'}</td>
                      <td style={{ padding: '15px' }}>
                        <span style={{ 
                          padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold',
                          backgroundColor: p.status !== 'removed' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 70, 85, 0.2)',
                          color: p.status !== 'removed' ? '#4CAF50' : '#FF4655'
                        }}>
                          {(p.status || 'published').toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>
                        {p.status !== 'removed' ? (
                          <button 
                            onClick={() => removePost(p._id)}
                            style={{ padding: '8px 12px', border: '1px solid #FF4655', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'transparent', color: '#FF4655', fontWeight: 'bold' }}
                          >
                            Remove
                          </button>
                        ) : (
                          <span style={{ color: 'gray', fontSize: '0.9rem' }}>Removed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {posts.length === 0 && (
                    <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>No posts found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* NEW: Comments Table */}
          {tab === 'comments' && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                    <th style={{ padding: '15px' }}>Author</th>
                    <th style={{ padding: '15px' }}>Post</th>
                    <th style={{ padding: '15px' }}>Comment snippet</th>
                    <th style={{ padding: '15px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map(c => (
                    <tr key={c._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '15px' }}>{c.author?.name || c.author?.fullname || 'Unknown'}</td>
                      <td style={{ padding: '15px' }}>{c.post?.title || 'Deleted Post'}</td>
                      <td style={{ padding: '15px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.body}
                      </td>
                      <td style={{ padding: '15px' }}>
                        <button 
                          onClick={() => removeComment(c._id)}
                          style={{ padding: '8px 12px', border: '1px solid #FF4655', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'transparent', color: '#FF4655', fontWeight: 'bold' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {comments.length === 0 && (
                    <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>No comments found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* NEW: Contacts / Inbox Table */}
          {tab === 'contacts' && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                    <th style={{ padding: '15px' }}>Date</th>
                    <th style={{ padding: '15px' }}>Name</th>
                    <th style={{ padding: '15px' }}>Email</th>
                    <th style={{ padding: '15px' }}>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map(msg => (
                    <tr key={msg._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '15px', whiteSpace: 'nowrap' }}>{new Date(msg.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '15px' }}>{msg.name}</td>
                      <td style={{ padding: '15px' }}>{msg.email}</td>
                      <td style={{ padding: '15px', maxWidth: '300px' }}>
                        {/* We use pre-wrap so any line breaks they typed show up correctly! */}
                        <div style={{ whiteSpace: 'pre-wrap', maxHeight: '100px', overflowY: 'auto' }}>
                          {msg.message}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {contacts.length === 0 && (
                    <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center' }}>No messages received yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </section>
    </>
  );
}

export default AdminPage;