import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios'; // Import our Axios bridge!

import indexImg from '../assets/index_img.jpg'; 

function HomePage() {
  // 1. Set up state to hold the posts, loading status, and any errors
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 2. Fetch the posts from the backend as soon as the page loads
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Ping the backend to get all posts
        const response = await API.get('/posts'); 
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load posts. Please try again later.');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      {/* Hero Section (Unchanged!) */}
      <section className="hero">
        <div className="container">
          <h1>Welcome to My Gaming Journey</h1>
          <p>Exploring the competitive universes of Valorant and League of Legends - two games that define modern esports and bring millions of players together worldwide.</p>
          <img src={indexImg} alt="gaming setup" style={{ marginTop: '20px', borderRadius: '8px', maxWidth: '100%', height: 'auto' }} />
        </div>
      </section>

      {/* Dynamic Recent Posts Section */}
      <section className="section alt-bg">
        <div className="container">
          <h2>Recent Posts</h2>
          
          {/* Show loading text while fetching from database */}
          {loading && <p>Loading posts...</p>}
          
          {/* Show error if the backend connection fails */}
          {error && <p className="error" style={{ color: '#FF4655' }}>{error}</p>}

          {/* Show a message if the database is completely empty */}
          {!loading && !error && posts.length === 0 && (
            <p>No posts available yet. Check back soon!</p>
          )}

          {/* Map through the posts array and generate a card for each one */}
          <div className="card-grid">
            {posts.map((post) => (
              <div className="card" key={post._id}>
                {/* If you add image uploads later, you can display them here! */}
                <h3>{post.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'gray', marginBottom: '10px' }}>
                  By {post.author?.name || post.author?.fullname || 'Unknown Author'}
                </p>
                
                {/* THE FIX: Use 'body' instead of 'content', and add a fallback in case it's empty! */}
                <p>{(post.body || 'No content available.').substring(0, 100)}...</p>
                
                {/* Link to the individual PostPage */}
                <Link to={`/post/${post._id}`} className="btn">Read More</Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Key Highlights Section (Unchanged!) */}
      <section className="section">
        <div className="container">
          <h2>Key Highlights</h2>
          <ul className="highlight-list">
            <li>Over 450 hours combined gameplay in both Valorant and League of Legends</li>
            <li>Experience with multiple agents in Valorant and champions in LoL</li>
            <li>Understanding of team coordination and strategic gameplay</li>
            <li>Active follower of professional esports scenes for both games</li>
            <li>Passionate about improving skills and helping newer players</li>
          </ul>
        </div>
      </section>

      
    </>
  );
}

export default HomePage;