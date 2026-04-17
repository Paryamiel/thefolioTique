import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Import your auth context

function Nav({ isDarkMode, toggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 2. Grab the logged-in user and the logout function from memory
  const { user, logout } = useAuth();

  // Don't show Nav on Splash Screen
  if (location.pathname === '/splash') return null;

  // 3. Create a helper function for logging out
  const handleLogout = () => {
    logout();
    navigate('/login'); // Send them back to login after they log out
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">Riot Blog</div>
        <nav>
          <ul className="nav-list">
            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
            <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link></li>
            <li><Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link></li>

            {/* 4. MAGIC HAPPENS HERE: Conditional Rendering */}
            {user ? (
              // If the user IS logged in, show these links:
              <>
                <li><Link to="/create-post" className={location.pathname === '/create-post' ? 'active' : ''}>Create Post</Link></li>
                <li><Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>My Profile</Link></li>
                <li>
                  <button onClick={handleLogout} className="btn-logout" style={{ background: 'transparent', border: '1px solid #FF4655', color: '#FF4655', cursor: 'pointer', padding: '5px 10px', borderRadius: '4px' }}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              // If the user is NOT logged in, show these links:
              <>
                <li><Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link></li>
                <li><Link to="/register" className={location.pathname === '/register' ? 'active' : ''}>Register</Link></li>
              </>
            )}

            <li>
              <button onClick={toggleTheme} className="theme-switch">
                {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Nav;