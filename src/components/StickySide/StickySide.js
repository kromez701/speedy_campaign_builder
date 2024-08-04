import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './StickySide.module.css';

const StickySide = ({ setActiveAccount, activeAccount }) => { 
  const [adAccounts, setAdAccounts] = useState([]);
  const [adAccountDetails, setAdAccountDetails] = useState({});
  const [subscriptionPlan, setSubscriptionPlan] = useState(''); // State for current plan
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const sidebarRef = useRef(null);
  const activeAccountRef = useRef(null); // Ref for active account button
  const navigate = useNavigate();

  const fetchAdAccountDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/auth/ad_account/${id}`, { withCredentials: true });
      setAdAccountDetails(response.data);
    } catch (error) {
      console.error('Error fetching ad account details', error);
    }
  };

  useEffect(() => {
    const fetchAdAccountsAndPlan = async () => {
      try {
        const [adAccountsResponse, subscriptionResponse] = await Promise.all([
          axios.get('http://localhost:5000/auth/ad_accounts', { withCredentials: true }),
          axios.get('http://localhost:5000/payment/subscription-status', { withCredentials: true }) // Fetch current plan
        ]);
        
        setAdAccounts(adAccountsResponse.data.ad_accounts);
        setSubscriptionPlan(subscriptionResponse.data.plan); // Set the current plan
        setIsLoading(false);

        if (adAccountsResponse.data.ad_accounts.length > 0) {
          setActiveAccount(adAccountsResponse.data.ad_accounts[0]);
          fetchAdAccountDetails(adAccountsResponse.data.ad_accounts[0].id);
        }
      } catch (error) {
        setError(error);
        setIsLoading(false);
        console.error('Error fetching ad accounts or subscription plan', error);
      }
    };

    fetchAdAccountsAndPlan();
  }, [setActiveAccount]);

  useEffect(() => {
    if (activeAccountRef.current) {
      activeAccountRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeAccount]); // Scroll to active account when it changes

  const handleAccountClick = (index) => {
    const selectedAccount = adAccounts[index];
    setActiveAccount(selectedAccount);
    fetchAdAccountDetails(selectedAccount.id);
  };

  const handleDropdownToggle = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleOverlayClick = () => {
    setSidebarOpen(false);
  };

  const handleUpgradeClick = () => {
    navigate('/pricing-section'); // Navigate to PricingSection on click
  };

  const handleAddAdAccountClick = async () => {
    try {
      // Call your backend endpoint to add a new ad account
      const response = await axios.post('http://localhost:5000/auth/add_ad_account', {}, { withCredentials: true });
      if (response.status === 200) {
        // Refresh the ad accounts list
        const newAdAccounts = await axios.get('http://localhost:5000/auth/ad_accounts', { withCredentials: true });
        setAdAccounts(newAdAccounts.data.ad_accounts);
  
        // Set the newly created ad account as the active account
        const latestAdAccount = newAdAccounts.data.ad_accounts[newAdAccounts.data.ad_accounts.length - 1];
        setActiveAccount(latestAdAccount);
        fetchAdAccountDetails(latestAdAccount.id);
      }
    } catch (error) {
      console.error('Error adding ad account', error);
    }
  };  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading ad accounts</div>;
  }

  return (
    <div>
      <div className={styles.hamburgerIcon} onClick={toggleSidebar}>
        <img src={isSidebarOpen ? "./assets/x.svg" : "./assets/Vector2.png"} alt="Menu" />
      </div>
      {isSidebarOpen && <div className={styles.overlay} onClick={handleOverlayClick}></div>}
      <div ref={sidebarRef} className={`${styles.sidebarContainer} ${isSidebarOpen ? styles.open : ''}`}>
        <div>
          <div className={styles.logo}>
            <img src="./assets/logo-footer.png" alt="Logo" className={styles.logoImage} />
          </div>
          <hr className={styles.horizontalRule} />
          <div className={styles.accountsContainer}>
            {adAccounts.length > 0 ? (
              adAccounts.map((account, index) => (
                <button
                  key={index}
                  ref={activeAccount === account ? activeAccountRef : null} // Set ref to active account
                  className={`${styles.accountButton} ${activeAccount === account ? styles.active : ''}`}
                  onClick={() => handleAccountClick(index)}
                  aria-label={`Switch to Ad Account ${index + 1}`}
                >
                  <img src="./assets/user-round.png" alt="User Icon" className={styles.icon} /> {`Ad Account ${index + 1}`}
                </button>
              ))
            ) : (
              <p>No ad accounts available</p>
            )}
          </div>
          <hr className={styles.horizontalRule} />
          {subscriptionPlan === 'Enterprise Plan' && (
            <button
              className={styles.accountButton2}
              onClick={handleAddAdAccountClick}
              aria-label="Create New Ad Account"
            >
             Create New Ad Account
            </button>
          )}
          <div className={styles.dropdownSection}>
            <div className={styles.sectionHeader} onClick={handleDropdownToggle}>
              <div className={styles.sectionTitle}>Facebook Setting</div>
              <img 
                src="./assets/Vector.png" 
                alt="Dropdown Icon" 
                className={`${styles.dropdownIcon} ${isDropdownVisible ? styles.rotated : ''}`}
              />
            </div>
            {isDropdownVisible && activeAccount && (
              <div className={styles.dropdownContent}>
                <div className={styles.dropdownRow}>
                  <input className={`${styles.input} ${styles.input1}`} placeholder="Ad Account ID" value={adAccountDetails.ad_account_id || ''} readOnly />
                  <hr className={styles.horizontalRule1} />
                </div>
                <div className={styles.dropdownRow}>
                  <input className={styles.input} placeholder="Pixel ID" value={adAccountDetails.pixel_id || ''} readOnly />
                  <hr className={styles.horizontalRule1} />
                </div>
                <div className={styles.dropdownRow}>
                  <input className={styles.input} placeholder="Facebook Page ID" value={adAccountDetails.facebook_page_id || ''} readOnly />
                  <hr className={styles.horizontalRule1} />
                </div>
                <div className={styles.dropdownRow}>
                  <input className={styles.input} placeholder="App ID" value={adAccountDetails.app_id || ''} readOnly />
                  <hr className={styles.horizontalRule1} />
                </div>
                <div className={styles.dropdownRow}>
                  <input className={styles.input} placeholder="App Secret" value={adAccountDetails.app_secret || ''} readOnly />
                  <hr className={styles.horizontalRule1} />
                </div>
                <div className={styles.dropdownRow}>
                  <input className={styles.input} placeholder="Access Token" value={adAccountDetails.access_token || ''} readOnly />
                  <hr className={styles.horizontalRule1} />
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <button className={styles.upgradeButton} onClick={handleUpgradeClick}>Upgrade Plan</button>
          <div className={styles.footer}>
            0 Ad account left on professional plan
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickySide;
