import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';  // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css';  // Import CSS for toastify
import '../ToastifyOverrides.css';
import './NavBar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState('./assets/no-profile-picture-15257.svg');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/auth/profile', { withCredentials: true });
        if (response.status === 200) {
          const { profile_picture } = response.data.user;
          if (profile_picture) {
            const profilePicUrl = profile_picture;
            setProfilePic(profilePicUrl);
            toast.success('Profile picture loaded successfully');  // Notify user of successful profile picture load
          }
        }
      } catch (error) {
        toast.error('Error fetching profile');  // Notify user of the error
        console.error('Error fetching profile', error);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileClick = () => {
    navigate('/profile-management');
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
