import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ProfileManagement.module.css';

const ProfileManagement = ({ onLogout, activeAccount, setActiveAccount }) => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [adAccountDetails, setAdAccountDetails] = useState({});
  const [isBound, setIsBound] = useState(false);

  // Fetch profile information on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/auth/profile', { withCredentials: true });
        if (response.status === 200) {
          const { username, email, profile_picture } = response.data.user;
          setFullName(username);
          setEmail(email);
          setProfilePic(profile_picture ? profile_picture : null);
        }
      } catch (error) {
        console.error('Error fetching profile', error);
      }
    };
    fetchProfile();
  }, []);  // Empty dependency array to ensure this only runs once on mount

  // Update ad account details when activeAccount changes
  useEffect(() => {
    if (activeAccount) {
      console.log('ProfileManagement: activeAccount changed:', activeAccount);
      setIsBound(activeAccount.is_bound);
      fetchAdAccountDetails(activeAccount.id);
    }
  }, [activeAccount]);

  const fetchAdAccountDetails = async (adAccountId) => {
    try {
      const response = await axios.get(`http://localhost:5000/auth/ad_account/${adAccountId}`, { withCredentials: true });
      setAdAccountDetails(response.data);
    } catch (error) {
      console.error('Error fetching ad account details', error);
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5242880) { // 5MB limit
      setProfilePic(URL.createObjectURL(file));
    } else {
      alert('File size should be less than 5MB');
    }
  };

  const handleSaveChanges = async () => {
    const formData = new FormData();
    formData.append('username', fullName);
    formData.append('profile_picture', document.querySelector('input[type="file"]').files[0]);

    try {
      const response = await axios.post('http://localhost:5000/auth/profile', formData, { withCredentials: true });
      if (response.status === 200) {
        alert('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error saving profile', error);
    }
  };

  const handleAdAccountChange = (e) => {
    const { name, value } = e.target;
    setAdAccountDetails({ ...adAccountDetails, [name]: value });
  };

  const handleAdAccountSave = async () => {
    if (isBound) {
      alert('Ad account settings can only be changed once.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/auth/ad_account', { id: activeAccount.id, ...adAccountDetails }, { withCredentials: true });
      if (response.status === 200) {
        alert('Ad account updated successfully');
        setIsBound(true);
      }
    } catch (error) {
      console.error('Error saving ad account', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img
          src="/assets/Vector4.png"
          alt="Go Back"
          className={styles.goBackIcon}
          onClick={() => navigate('/')}
        />
        <h2>Profile Management</h2>
      </div>
      <div className={styles.profileContent}>
        <div className={styles.section}>
          {profilePic && <img src={profilePic} alt="Profile" className={styles.profilePic} />}
          <h3>Profile Information</h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            className={styles.profileInput}
          />
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={styles.profileInput}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            disabled
            className={styles.profileInput}
          />
        </div>
        <div className={styles.section}>
          <h3>Ad Account Settings</h3>
          <p className={styles.infoText}>
            Ad account settings cannot be changed after being saved.
          </p>
          <input
            type="text"
            name="ad_account_id"
            placeholder="Ad Account ID"
            value={adAccountDetails.ad_account_id || ''}
            onChange={handleAdAccountChange}
            className={styles.profileInput}
            disabled={isBound}
          />
          <input
            type="text"
            name="pixel_id"
            placeholder="Pixel ID"
            value={adAccountDetails.pixel_id || ''}
            onChange={handleAdAccountChange}
            className={styles.profileInput}
            disabled={isBound}
          />
          <input
            type="text"
            name="facebook_page_id"
            placeholder="Facebook Page ID"
            value={adAccountDetails.facebook_page_id || ''}
            onChange={handleAdAccountChange}
            className={styles.profileInput}
            disabled={isBound}
          />
          <input
            type="text"
            name="app_id"
            placeholder="App ID"
            value={adAccountDetails.app_id || ''}
            onChange={handleAdAccountChange}
            className={styles.profileInput}
            disabled={isBound}
          />
          <input
            type="text"
            name="app_secret"
            placeholder="App Secret"
            value={adAccountDetails.app_secret || ''}
            onChange={handleAdAccountChange}
            className={styles.profileInput}
            disabled={isBound}
          />
          <input
            type="text"
            name="access_token"
            placeholder="Access Token"
            value={adAccountDetails.access_token || ''}
            onChange={handleAdAccountChange}
            className={styles.profileInput}
            disabled={isBound}
          />
        </div>
      </div>
      <div className={styles.footer}>
        <button
          onClick={handleSaveChanges}
          className={`${styles.button} ${styles.primaryButton}`}
        >
          Save Profile
        </button>
        <button
          onClick={handleAdAccountSave}
          className={`${styles.button} ${styles.primaryButton}`}
          disabled={isBound}
        >
          Save Ad Account
        </button>
        <button onClick={() => navigate('/')} className={`${styles.button} ${styles.goBackButton}`}>
          Go Back
        </button>
        <button onClick={onLogout} className={`${styles.button} ${styles.secondaryButton}`}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileManagement;
