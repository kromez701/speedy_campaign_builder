import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NavBar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState('./assets/no-profile-picture-15257.svg');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://91.108.112.100:8080/auth/profile', { withCredentials: true });
        if (response.status === 200) {
          const { profile_picture } = response.data.user;
          if (profile_picture) {
            const profilePicUrl = profile_picture;
            setProfilePic(profilePicUrl);
            console.log(`Profile picture URL set in navbar: ${profilePicUrl}`);  // Log the URL being requested
          }
        }
      } catch (error) {
        console.error('Error fetching profile', error);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileClick = () => {
    navigate('/profile-management');
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://91.108.112.100:8080/auth/logout', {}, { withCredentials: true });
      if (response.status === 200) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        window.location.reload(); // Refresh the page to apply logout
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-right">
        <img src="./assets/Vector3.png" alt="Notifications" className="navbar-icon" />
        <img
          src={profilePic}
          alt="Profile"
          className="navbar-profile"
          onClick={handleProfileClick}
        />
      </div>
    </nav>
  );
};

export default Navbar;
