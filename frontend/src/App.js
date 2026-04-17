import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // Notice no Router here!

// Layout & Security Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Page Components
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostPage from './pages/PostPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import AdminPage from './pages/AdminPage';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // 1. Trigger the fade-out animation after 3 seconds
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 3000);

    // 2. Completely remove the splash screen from the DOM after 3.5 seconds
    const removeTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <>
      {/* Show the splash screen as long as isLoading is true */}
      {isLoading && <SplashPage isFading={isFading} />}

      {/* The main app content renders underneath */}
      <div className="App">
        <Header />
        <Routes>
          {/* Public Routes — Anyone can visit these */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/post/:id" element={<PostPage />} />

          {/* Protected routes — Must be logged in as a Member or Admin */}
          <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path='/create-post' element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
          <Route path='/edit-post/:id' element={<ProtectedRoute><EditPostPage /></ProtectedRoute>} />
          
          {/* Admin only — Redirects standard Members or Guests back to home */}
          <Route path='/admin' element={<ProtectedRoute role='admin'><AdminPage /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;