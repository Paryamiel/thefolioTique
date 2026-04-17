import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    try {
      const user = await login(email, password);
      
      // Redirect based on role. (Fixed the '/home' path to just '/')
      navigate(user.role === 'admin' ? '/admin' : '/');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <>
      <section className="page-title">
        <div className="container">
          <h1>Welcome Back</h1>
        </div>
      </section>

      <section className="section">
        {/* Added inline styles here just to keep the login box centered and tidy */}
        <div className="container" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="form-container">
            <h2 style={{ marginBottom: '20px' }}>Login to Your Account</h2>
            
            {/* Display backend errors (like "Invalid password" or "Account inactive") */}
            {error && (
              <div className="error-message" style={{ 
                color: '#FF4655', 
                marginBottom: '20px', 
                padding: '10px', 
                backgroundColor: 'rgba(255, 70, 85, 0.1)', 
                borderLeft: '4px solid #FF4655' 
              }}>
                {error}
              </div>
            )}

            <form className="form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input 
                  type="email" 
                  id="email"
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input 
                  type="password" 
                  id="password"
                  placeholder="Enter your password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
              </div>

              <button type="submit" className="btn" style={{ width: '100%', marginTop: '10px' }}>
                Login
              </button>
              
              <p style={{ marginTop: '20px', textAlign: 'center' }}>
                Don't have an account? <Link to="/register" style={{ color: '#FF4655' }}>Register here</Link>.
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default LoginPage;