import React, { useEffect, useState } from 'react';
import Landing from './components/Landing/Landing';
import Auth from './components/Authorization/Auth';
import Main from './components/Main/Main';
import Navbar from './components/Nav/NavBar';
import StickySide from './components/StickySide/StickySide';
import axios from 'axios';
import './App.css';

const App = () => {
  const [authMode, setAuthMode] = useState(null); // null, 'login', 'register'
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

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
        setLoading(false); // Set loading to false once the request is complete
      }
    };
    checkCurrentUser();
  }, []);

  const handleAuthSuccess = () => {
    const checkCurrentUser = async () => {
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
    checkCurrentUser();
  };

  // Render nothing until the user state is determined
  if (loading) {
    return null;
  }

  return (
    <div className="app">
      {user ? (
        <div>
          <Navbar />
          <div className="layout">
            <StickySide />
            <div className="content">
              <Main />
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
  );
};

export default App;
