import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../ToastifyOverrides.css';
import './NavBar.css';
import config from '../../config';

const apiUrl = config.apiUrl;

const Navbar = ({ activeAccount, setActiveAccount, onLogout, refreshTrigger }) => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState('./assets/no-profile-picture-15257.svg');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [adAccounts, setAdAccounts] = useState([]);
  const [activeAdAccountsCount, setActiveAdAccountsCount] = useState(0); // ✅ Store only active accounts count

  // Fetch Ad Accounts when refreshTrigger changes
  useEffect(() => {
    const fetchAdAccountsAndStatus = async () => {
      try {
        const adAccountsResponse = await axios.get(`${apiUrl}/auth/ad_accounts`, { withCredentials: true });
        const fetchedAdAccounts = adAccountsResponse.data.ad_accounts;
        setAdAccounts(fetchedAdAccounts);

        // ✅ Fetch subscription status for each ad account
        let activeCount = 0;
        await Promise.all(
          fetchedAdAccounts.map(async (account) => {
            try {
              const subResponse = await axios.get(
                `${apiUrl}/payment/subscription-status/${account.id}`,
                { withCredentials: true }
              );
              if (subResponse.data.is_active_manual) {
                activeCount++;
              }
            } catch (error) {
              console.error(`Error fetching subscription for account ${account.id}:`, error);
            }
          })
        );

        // ✅ Update active ad accounts count
        setActiveAdAccountsCount(activeCount);
      } catch (error) {
        console.error('Error fetching ad accounts', error);
      }
    };

    fetchAdAccountsAndStatus();
  }, [refreshTrigger]); // 🚀 Re-fetch on refreshTrigger update

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/profile`, { withCredentials: true });
        if (response.status === 200) {
          setProfilePic(response.data.user.profile_picture || './assets/no-profile-picture-15257.svg');
        }
      } catch (error) {
        toast.error('Error fetching profile');
        console.error('Error fetching profile', error);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileClick = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOptionClick = (path) => {
    setDropdownVisible(false);
    navigate(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-right">
        <img
          src={profilePic}
          alt="Profile"
          className="navbar-profile"
          onClick={handleProfileClick}
        />
        {dropdownVisible && (
          <div className="dropdown-menu">
            <div className="dropdown-item1">
              Active Ad Accounts: {activeAdAccountsCount || 0} {/* ✅ Only shows ACTIVE accounts */}
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
