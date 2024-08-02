import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './StickySide.module.css';

const StickySide = ({ setActiveAccount, activeAccount }) => {
  const [adAccounts, setAdAccounts] = useState([]);
  const [adAccountDetails, setAdAccountDetails] = useState({});
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const sidebarRef = useRef(null);
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
    const fetchAdAccounts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/auth/ad_accounts', { withCredentials: true });
        setAdAccounts(response.data.ad_accounts);
        setIsLoading(false);
        if (response.data.ad_accounts.length > 0) {
          setActiveAccount(response.data.ad_accounts[0]);
          fetchAdAccountDetails(response.data.ad_accounts[0].id);
        }
      } catch (error) {
        setError(error);
        setIsLoading(false);
        console.error('Error fetching ad accounts', error);
      }
    };

    fetchAdAccounts();
  }, [setActiveAccount]);

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
