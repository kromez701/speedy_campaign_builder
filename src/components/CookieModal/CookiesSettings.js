import React, { useState, useEffect } from 'react';
import styles from './CookieSettingsPage.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../ToastifyOverrides.css';
import { useNavigate } from 'react-router-dom';

const CookieSettingsPage = () => {
  const [cookies, setCookies] = useState({
    analytics: false,
    marketing: false,
    functional: false,
  });

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const savedPreferences = JSON.parse(localStorage.getItem('cookiePreferences')) || {};
    setCookies({
      analytics: savedPreferences.analytics || false,
      marketing: savedPreferences.marketing || false,
      functional: savedPreferences.functional || false,
    });
  }, []);

  const handleCheckboxChange = (category) => {
    setCookies((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const savePreferences = () => {
    localStorage.setItem('cookiePreferences', JSON.stringify(cookies));
    toast.success('Your cookie preferences have been saved successfully!', {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div className={styles.container}>
      {/* Go Back Button */}
      <div className={styles.goBack} onClick={() => navigate(-1)}>
        &lt; Go Back
      </div>

      <h1 className={styles.heading}>Cookie Settings</h1>
      <p className={styles.description}>Select your cookie preferences below:</p>

      {/* Essential Cookies */}
      <div className={styles.category}>
        <h2 className={styles.categoryTitle}>Essential Cookies (Always Active)</h2>
        <p className={styles.categoryDescription}>
          These cookies are necessary for core site functions such as security, session management, and form submissions. They cannot be disabled.
        </p>
      </div>

      {/* Analytics Cookies */}
      <div className={styles.category}>
        <h2 className={styles.categoryTitle}>Analytics Cookies</h2>
        <p className={styles.categoryDescription}>
          Track visitor interactions (e.g., page visits, clicks) to improve site performance and optimize user experience (Google Analytics).
        </p>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={cookies.analytics}
            onChange={() => handleCheckboxChange('analytics')}
            className={styles.checkboxInput}
          />
          Enable Analytics Cookies
        </label>
      </div>

      {/* Marketing Cookies */}
      <div className={styles.category}>
        <h2 className={styles.categoryTitle}>Marketing Cookies</h2>
        <p className={styles.categoryDescription}>
          Deliver personalized ads based on your activity across this site and other websites (Facebook Pixel, Google Ads).
        </p>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={cookies.marketing}
            onChange={() => handleCheckboxChange('marketing')}
            className={styles.checkboxInput}
          />
          Enable Marketing Cookies
        </label>
      </div>

      {/* Functional Cookies */}
      <div className={styles.category}>
        <h2 className={styles.categoryTitle}>Functional Cookies</h2>
        <p className={styles.categoryDescription}>
          Remember user preferences and enable features such as live chat or saved layouts (themes, chat tools).
        </p>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={cookies.functional}
            onChange={() => handleCheckboxChange('functional')}
            className={styles.checkboxInput}
          />
          Enable Functional Cookies
        </label>
      </div>

      {/* Save Button */}
      <button className={styles.saveButton} onClick={savePreferences}>
        Save Preferences
      </button>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default CookieSettingsPage;
