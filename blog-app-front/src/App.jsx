// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import PostsPage from './components/PostsPage';
import MyPostsPage from './components/MyPostsPage';
import LoginPopup from './components/LoginPopup';

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleLoginSuccess = (userData) => {
    console.log('Login successful', userData);
    setUser(userData);
    setShowLoginPopup(false);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <BrowserRouter>
      {/* Navbar is always visible */}
      <Navbar 
        user={user} 
        onLoginClick={() => setShowLoginPopup(true)} 
        onLogout={handleLogout} 
      />

      {/* Define Routes */}
      <Routes>
        <Route path="/posts" element={<PostsPage user={user} />} />
        <Route path="/my-posts" element={<MyPostsPage user={user} />} />
        {/* Fallback to posts for any unknown route */}
        <Route path="*" element={<Navigate to="/posts" replace />} />
      </Routes>

      {showLoginPopup && (
        <LoginPopup
          onClose={() => setShowLoginPopup(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </BrowserRouter>
  );
}

export default App;
