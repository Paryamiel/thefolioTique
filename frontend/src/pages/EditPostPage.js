import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch the existing post data when the page loads
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${id}`);
        setTitle(data.title);
        setContent(data.body); // The backend uses "body", so we map it to our "content" state
      } catch (err) {
        setError('Failed to load post data.');
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError('');
    setIsSubmitting(true);

    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', content); // Send it back to the server as "body" [cite: 371]
    if (image) fd.append('image', image);

    try {
      await API.put(`/posts/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate(`/post/${id}`); // Send them back to the updated post!
    } catch (err) { 
      setError(err.response?.data?.message || 'Failed to update post.'); 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="page-title">
        <div className="container">
          <h1>Update Transmission</h1>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="form-container">
            <h2 style={{ marginBottom: '20px' }}>Edit Your Post</h2>
            
            {error && (
              <div className="error-message" style={{ color: '#FF4655', marginBottom: '20px', padding: '10px', backgroundColor: 'rgba(255, 70, 85, 0.1)', borderLeft: '4px solid #FF4655' }}>
                {error}
              </div>
            )}

            <form className="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Post Title *</label>
                <input 
                  type="text" 
                  id="title"
                  value={title} 
                  onChange={e => setTitle(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">Post Content *</label>
                <textarea 
                  id="content"
                  value={content} 
                  onChange={e => setContent(e.target.value)}
                  rows={12} 
                  required 
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
                />
              </div>

              {/* Admins can update the image  */}
              {user?.role === 'admin' && (
                <div className="form-group" style={{ padding: '15px', backgroundColor: 'rgba(255, 70, 85, 0.05)', borderRadius: '4px', border: '1px dashed rgba(255, 70, 85, 0.5)' }}>
                  <label htmlFor="image" style={{ color: '#FF4655' }}>👑 Update Cover Image (Admin Only):</label>
                  <input 
                    type="file" 
                    id="image"
                    accept="image/*" 
                    onChange={e => setImage(e.target.files[0])} 
                    style={{ marginTop: '10px' }}
                  />
                  <p style={{ fontSize: '0.8rem', color: 'gray', marginTop: '5px' }}>Leave blank to keep the current image.</p>
                </div>
              )}

              <button type="submit" className="btn" disabled={isSubmitting} style={{ width: '100%', marginTop: '20px', opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? 'Updating...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default EditPostPage;