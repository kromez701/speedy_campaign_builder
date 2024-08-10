import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './components/Landing/Landing';
import Auth from './components/Authorization/Auth';
import Main from './components/Main/Main';
import Navbar from './components/Nav/NavBar';
import StickySide from './components/StickySide/StickySide';
import ProfileManagement from './components/ProfileManagement/ProfileManagement';
import PricingSection from './components/PricingSection/PricingSection';
import PaymentSuccess from './components/PaymentSuccess/PaymentSuccess';
import axios from 'axios';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toastify

const App = () => {
  const [authMode, setAuthMode] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redirectToMain, setRedirectToMain] = useState(false);
  const [activeAccount, setActiveAccount] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

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
        setRedirectToMain(true);
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
        setRedirectToMain(false);
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handlePlanUpgrade = () => {
    setRefreshTrigger(prev => !prev); // Toggle refresh trigger
  };

  useEffect(() => {
    if (redirectToMain) {
      setRedirectToMain(false);
    }
  }, [redirectToMain]);

  if (loading) {
    return null;
  }

  return (
    <Router>
      <div className="app">
      <ToastContainer />
        {user ? (
          <>
            {redirectToMain && <Navigate to="/" replace />}
            <Navbar />
            <div className="layout">
              <StickySide setActiveAccount={setActiveAccount} activeAccount={activeAccount} refreshTrigger={refreshTrigger} />
              <div className="content">
                <Routes>
                  <Route path="/" element={activeAccount ? <Main activeAccount={activeAccount} /> : <p>Loading...</p>} />
                  <Route path="/profile-management" element={<ProfileManagement onLogout={handleLogout} activeAccount={activeAccount} setActiveAccount={setActiveAccount} />} />
                  <Route path="/pricing-section" element={<PricingSection onPlanUpgrade={handlePlanUpgrade} />} />
                  <Route path="/success" element={<PaymentSuccess />} /> {/* New route */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </div>
          </>
        ) : (
          <>
            <Routes>
              <Route path="/" element={<Landing setAuthMode={setAuthMode} />} />
              <Route path="/login" element={<Auth mode="login" onAuthSuccess={handleAuthSuccess} />} />
              <Route path="/register" element={<Auth mode="register" onAuthSuccess={handleAuthSuccess} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
