import React, { useState, useEffect } from 'react';

function SplashScreen({ isFading }) {
  const [dots, setDots] = useState('');

  // Handle the animated dots
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length >= 3) return '';
        return prevDots + '.';
      });
    }, 500);

    // Cleanup interval when component unmounts
    return () => clearInterval(dotInterval);
  }, []);

  return (
    // Apply the fade-out class if the isFading prop is true
    <div className={`splash-screen-wrapper ${isFading ? 'fade-out' : ''}`}>
      <div className="loader-container">
        <div className="splash-logo">🎮</div>
        <h1 className="splash-title">Riot Blog</h1>
        <div className="splash-subtitle">Put hands on deck...</div>
        
        <div className="spinner"></div>
        
        <div className="loading-text">
          Loading Assets<span className="dots">{dots}</span>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;