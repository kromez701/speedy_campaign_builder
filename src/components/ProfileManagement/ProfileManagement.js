// src/components/ProfileManagement/ProfileManagement.js
import React from 'react';
import './ProfileManagement.css';

const ProfileManagement = ({ onClose, onLogout }) => {
  return (
    <div className="profile-modal-background">
      <div className="profile-container">
        <button onClick={onClose} className="profile-button">Go Back</button>
        <button onClick={onLogout} className="profile-button logout-button">Logout</button>
      </div>
    </div>
  );
};

export default ProfileManagement;
