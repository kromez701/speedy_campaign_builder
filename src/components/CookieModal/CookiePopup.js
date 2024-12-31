import React, { useState, useEffect } from 'react';
import styles from './CookiePopup.module.css';
import { useNavigate, useLocation } from 'react-router-dom';

const CookiePopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setShowPopup(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowPopup(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShowPopup(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShowPopup(false);
  };

  const handleSettings = () => {
    navigate('/cookie-settings');
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div className={styles.cookiePopup}>
      <button className={styles.closeButton} onClick={handleClose}>
        &times;
      </button>
      <p className={styles.message}>
        We use cookies to enhance your browsing experience, analyze site traffic, and serve personalized content. 
        By clicking <strong>'Accept All'</strong>, you consent to our use of cookies. You can manage your preferences by clicking{' '}
        <a href="/cookie-settings" className={styles.settingsLink}>Settings</a> or reject non-essential cookies.
      </p>
      <div className={styles.buttonGroup}>
        <button className={styles.settingsButton} onClick={handleSettings}>
          Settings
        </button>
        <button className={styles.rejectButton} onClick={handleRejectAll}>
          Reject All
        </button>
        <button className={styles.acceptButton} onClick={handleAcceptAll}>
          Accept All
        </button>
      </div>
    </div>
  );
};

export default CookiePopup;
