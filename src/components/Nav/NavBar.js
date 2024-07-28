// src/components/Navbar.js
import React from 'react';
import './NavBar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-right">
        <img src="./assets/Vector3.png" alt="Notifications" className="navbar-icon" />
        <img src="./assets/no-profile-picture-15257.svg" alt="Profile" className="navbar-profile" />
      </div>
    </nav>
  );
};

export default Navbar;
