import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';  // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css';  // Import CSS for toastify
import '../ToastifyOverrides.css';
import './NavBar.css';
import config from '../../config';

const apiUrl = config.apiUrl;

const Navbar = ({ activeAccount, setActiveAccount, onLogout }) => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState('./assets/no-profile-picture-15257.svg');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [redirectToMain, setRedirectToMain] = useState(false)
  const [adAccounts, setAdAccounts] = useState([]);
  useEffect(() => {
    const getAdAccounts = async () => {
      try {
        // Fetch all ad accounts from backend
        const adAccountsResponse = await axios.get(`${apiUrl}/auth/ad_accounts`, { withCredentials: true });
        const fetchedAccounts = adAccountsResponse.data.ad_accounts;
        setAdAccounts(fetchedAccounts);
      } catch (error) {
        console.error('Error fetching ad accounts', error);
      }
    }
    getAdAccounts()
  }, [])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/profile`, { withCredentials: true });
        if (response.status === 200) {
          const { profile_picture } = response.data.user;
          if (profile_picture) {
            const profilePicUrl = profile_picture;
            setProfilePic(profilePicUrl);
          }
        }
      } catch (error) {
        toast.error('Error fetching profile');  // Notify user of the error
        console.error('Error fetching profile', error);
      }
    };
    fetchProfile();
  }, []);

  // const handleProfileClick = () => {
  //   navigate('/profile-management');
  // };

  const handleProfileClick = () => {
    setDropdownVisible(!dropdownVisible); // Toggle dropdown visibility
  };

  const handleOptionClick = (path) => {
    setDropdownVisible(false); // Hide the dropdown
    navigate(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-right">
        {/* <img src="./assets/Vector3.png" alt="Notifications" className="navbar-icon" /> */}
        <img
          src={profilePic}
          alt="Profile"
          className="navbar-profile"
          onClick={handleProfileClick}
        />
        {dropdownVisible && (
          <div className="dropdown-menu">
            <div className="dropdown-item1">
              Active Ad Accounts: {adAccounts.length || 0}
            </div>
            <div className="dropdown-item" onClick={() => handleOptionClick('/profile-management')}>
              Manage Subscription
            </div>
            <div className="dropdown-item" onClick={onLogout}>
              Log Out
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
