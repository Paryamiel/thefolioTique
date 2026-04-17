import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(''); // Changed from 'body' to 'content' for consistency
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError('');
    setIsSubmitting(true);

    // Use FormData instead of standard JSON so we can package the image file
    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', content);
    if (image) fd.append('image', image);

    try {
      // Send the data to the backend. We add the multipart header specifically for the image
      const { data } = await API.post('/posts', fd, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Navigate to the newly created post! (Fixed path to be singular '/post/')
      navigate(`/post/${data._id}`);
      
    } catch (err) { 
      setError(err.response?.data?.message || 'Failed to publish post. Please try again.'); 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="page-title">
        <div className="container">
          <h1>Write a New Post</h1>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="form-container">
            <h2 style={{ marginBottom: '20px' }}>Share Your Knowledge</h2>
            
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
                  placeholder="Enter a catchy title" 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">Post Content *</label>
                <textarea 
                  id="content"
                  value={content} 
                  onChange={e => setContent(e.target.value)}
                  placeholder="Write your post here..." 
                  rows={12} 
                  required 
                  style={{ width: '100%', padding: '10px', borderRadius: '4px' }}
                />
              </div>

              {/* Only show the Image Upload field if the logged-in user is an Admin! */}
              {user?.role === 'admin' && (
                <div className="form-group" style={{ padding: '15px', backgroundColor: 'rgba(255, 70, 85, 0.05)', borderRadius: '4px', border: '1px dashed rgba(255, 70, 85, 0.5)' }}>
                  <label htmlFor="image" style={{ color: '#FF4655' }}>👑 Upload Cover Image (Admin Only):</label>
                  <input 
                    type="file" 
                    id="image"
                    accept="image/*" 
                    onChange={e => setImage(e.target.files[0])} 
                    style={{ marginTop: '10px' }}
                  />
                  <p style={{ fontSize: '0.8rem', color: 'gray', marginTop: '5px' }}>Only admins can attach official images to blog posts.</p>
                </div>
              )}

              <button type="submit" className="btn" disabled={isSubmitting} style={{ width: '100%', marginTop: '20px', opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? 'Publishing...' : 'Publish Post'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default CreatePostPage;