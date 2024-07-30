import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './components/Landing/Landing';
import Auth from './components/Authorization/Auth';
import Main from './components/Main/Main';
import Navbar from './components/Nav/NavBar';
import StickySide from './components/StickySide/StickySide';
import ProfileManagement from './components/ProfileManagement/ProfileManagement';
import axios from 'axios';
import './App.css';

const App = () => {
  const [authMode, setAuthMode] = useState(null); // null, 'login', 'register'
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleCloseAuth = () => setAuthMode(null);

  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/auth/current_user', { withCredentials: true });
        if (response.status === 200) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Error checking current user', error);
      } finally {
        setLoading(false);
      }
    };
    checkCurrentUser();
  }, []);

  const handleAuthSuccess = async () => {
    try {
      const response = await axios.get('http://localhost:5000/auth/current_user', { withCredentials: true });
      if (response.status === 200) {
        setUser(response.data.user);
        setAuthMode(null);
      }
    } catch (error) {
      console.error('Error checking current user', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
      if (response.status === 200) {
        setUser(null);
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <Router>
      <div className="app">
        {user ? (
          <div>
            <Navbar />
            <div className="layout">
              <StickySide />
              <div className="content">
                <Routes>
                  <Route path="/" element={<Main />} />
                  <Route path="/profile-management" element={<ProfileManagement onLogout={handleLogout} />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                {user && window.location.pathname !== '/' && <Navigate to="/" />}
              </div>
            </div>
          </div>
        ) : (
          <>
            <Landing setAuthMode={setAuthMode} />
            {authMode && <Auth mode={authMode} onClose={handleCloseAuth} onAuthSuccess={handleAuthSuccess} />}
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
