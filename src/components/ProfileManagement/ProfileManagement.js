import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProfileManagement.module.css';

const ProfileManagement = ({ onLogout }) => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5242880) { // 5MB limit
      setProfilePic(URL.createObjectURL(file));
    } else {
      alert('File size should be less than 5MB');
    }
  };

  const handleSaveChanges = () => {
    // Add logic to save changes
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
          <h3>Profile Information</h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            className={styles.profileInput}
          />
          {profilePic && <img src={profilePic} alt="Profile" className={styles.profilePic} />}
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
          <input type="text" placeholder="Ad Account ID" className={styles.profileInput} />
          <input type="text" placeholder="Pixel ID" className={styles.profileInput} />
          <input type="text" placeholder="Facebook Page ID" className={styles.profileInput} />
          <input type="text" placeholder="App ID" className={styles.profileInput} />
          <input type="text" placeholder="App Secret" className={styles.profileInput} />
          <input type="text" placeholder="Access Token" className={styles.profileInput} />
        </div>
      </div>
      <div className={styles.footer}>
        <button
          onClick={handleSaveChanges}
          className={`${styles.button} ${styles.primaryButton}`}
        >
          Save Changes
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
