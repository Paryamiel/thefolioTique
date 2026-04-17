import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Import Auth Context

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 2. Grab the user state and logout function
  const { user, logout } = useAuth(); 
  
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark-mode') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode; 
      
      if (newMode) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.removeItem('theme');
      }
      
      return newMode;
    });
  };

  // 3. Helper function for logging out cleanly
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
        <div className="container">
            <div className="logo">Riot Blog</div>
            <nav>
                <ul className="nav-list">
                    <li>
                      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
                    </li>
                    <li>
                      <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
                    </li>
                    <li>
                      <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
                    </li>

                    {/* 4. DYNAMIC LINKS: Change based on login status! */}
                    {user ? (
                      <>
                        <li>
                          <Link to="/create-post" className={location.pathname === '/create-post' ? 'active' : ''}>Create Post</Link>
                        </li>
                        <li>
                          <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>My Profile</Link>
                        </li>
                        {/* Optional: Show Admin Dashboard link if user is an admin */}
                        {user.role === 'admin' && (
                           <li>
                              <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''} style={{color: '#FF4655'}}>Admin</Link>
                           </li>
                        )}
                        <li>
                          <button onClick={handleLogout} className="btn-logout" style={{ background: 'transparent', border: '1px solid #FF4655', color: '#FF4655', cursor: 'pointer', padding: '5px 10px', borderRadius: '4px', marginLeft: '10px' }}>
                            Logout
                          </button>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link>
                        </li>
                        <li>
                          <Link to="/register" className={location.pathname === '/register' ? 'active' : ''}>Register</Link>
                        </li>
                      </>
                    )}

                    <li>
                      <button onClick={toggleTheme} className="theme-switch" style={{ marginLeft: '10px' }}>
                        {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                      </button>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
  );
}

export default Header;