import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        // Fetch the specific post and its comments simultaneously
        const [postRes, commentsRes] = await Promise.all([
          API.get(`/posts/${id}`),
          API.get(`/comments/${id}`)
        ]);
        setPost(postRes.data);
        setComments(commentsRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load the post. It may have been removed.');
        setLoading(false);
      }
    };
    fetchPostAndComments();
  }, [id]);

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await API.delete(`/posts/${id}`);
      navigate('/'); // Send them back home after deleting
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const { data } = await API.post(`/comments/${id}`, { body: newComment });
      setComments([...comments, data]); // Add new comment to the UI
      setNewComment(''); // Clear the input
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await API.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId)); // Remove from UI
    } catch (err) {
      alert('Failed to delete comment');
    }
  };

  if (loading) return <div className="container" style={{ marginTop: '50px' }}>Loading transmission...</div>;
  if (error) return <div className="container" style={{ marginTop: '50px', color: '#FF4655' }}>{error}</div>;

  // Check if the current user is the author OR an admin 
  const isOwnerOrAdmin = user && (user.role === 'admin' || user._id === post.author?._id);

  return (
    <>
      <section className="page-title">
        <div className="container">
          <h1>{post.title}</h1>
          <p>By {post.author?.name || 'Unknown Author'} | {new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          {/* Post Content */}
          <div className="post-content" style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '30px', borderRadius: '8px' }}>
            {post.image && (
              <img 
                src={`http://localhost:5000/uploads/${post.image}`} 
                alt={post.title} 
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '4px', marginBottom: '20px' }} 
              />
            )}
            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{post.body}</p>
            
            {/* Show Edit/Delete only to owner or admin */}
            {isOwnerOrAdmin && (
              <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Link to={`/edit-post/${post._id}`} className="btn" style={{ marginRight: '10px', backgroundColor: '#333' }}>Edit Post</Link>
                <button onClick={handleDeletePost} className="btn" style={{ backgroundColor: 'transparent', border: '1px solid #FF4655', color: '#FF4655' }}>Delete Post</button>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="comments-section" style={{ marginTop: '50px' }}>
            <h3>Comms Channel ({comments.length})</h3>
            
            {user ? (
              <form onSubmit={handleAddComment} style={{ marginTop: '20px', marginBottom: '30px' }}>
                <textarea 
                  value={newComment} 
                  onChange={(e) => setNewComment(e.target.value)} 
                  placeholder="Transmit your thoughts..." 
                  rows="3"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px' }}
                  required
                />
                <button type="submit" className="btn" style={{ marginTop: '10px' }}>Send Reply</button>
              </form>
            ) : (
              <p style={{ marginTop: '20px', marginBottom: '30px', color: 'gray' }}>You must be logged in to transmit a reply.</p>
            )}

            {/* List Comments */}
            <div className="comments-list">
              {comments.map(comment => (
                <div key={comment._id} style={{ padding: '15px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <strong style={{ color: '#FF4655' }}>{comment.author?.name}</strong>
                    
                    {/* Allow comment owner or admin to delete the comment */}
                    {(user?.role === 'admin' || user?._id === comment.author?._id) && (
                      <button onClick={() => handleDeleteComment(comment._id)} style={{ background: 'none', border: 'none', color: 'gray', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                    )}
                  </div>
                  <p>{comment.body}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

export default PostPage;