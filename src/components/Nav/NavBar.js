import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile-management');
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
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
    <>
      <nav className="navbar">
        <div className="navbar-right">
          <img src="./assets/Vector3.png" alt="Notifications" className="navbar-icon" />
          <img
            src="./assets/no-profile-picture-15257.svg"
            alt="Profile"
            className="navbar-profile"
            onClick={handleProfileClick}
          />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
