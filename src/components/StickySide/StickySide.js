import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';  // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css';  // Import CSS for toastify
import styles from './StickySide.module.css';
import '../ToastifyOverrides.css';

const StickySide = ({ setActiveAccount, activeAccount, refreshTrigger }) => {
  const [adAccounts, setAdAccounts] = useState([]);
  const [adAccountDetails, setAdAccountDetails] = useState({});
  const [userSubscriptionPlan, setUserSubscriptionPlan] = useState('');
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const sidebarRef = useRef(null);
  const activeAccountRef = useRef(null);
  const navigate = useNavigate();

  const fetchAdAccountDetails = async (id) => {
    try {
      const response = await axios.get(`https://backend.quickcampaigns.io/auth/ad_account/${id}`, { withCredentials: true });
      setAdAccountDetails(response.data);
    } catch (error) {
      toast.error('Error fetching ad account details');  // Notify user of the error
      console.error('Error fetching ad account details', error);
    }
  };

  useEffect(() => {
    const fetchAdAccountsAndPlan = async () => {
      try {
        const userPlanResponse = await axios.get('https://backend.quickcampaigns.io/payment/user-subscription-status', { withCredentials: true });
        setUserSubscriptionPlan(userPlanResponse.data.plan);

        const adAccountsResponse = await axios.get('https://backend.quickcampaigns.io/auth/ad_accounts', { withCredentials: true });

        if (adAccountsResponse.data.ad_accounts.length > 0) {
          const activeAccount = adAccountsResponse.data.ad_accounts[0];
          setActiveAccount(activeAccount);
          fetchAdAccountDetails(activeAccount.id);
        }

        setAdAccounts(adAccountsResponse.data.ad_accounts);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
        toast.error('Error fetching ad accounts or user plan');  // Notify user of the error
        console.error('Error fetching ad accounts or user plan', error);
      }
    };

    fetchAdAccountsAndPlan();
  }, [setActiveAccount, refreshTrigger]);

  useEffect(() => {
    if (activeAccountRef.current) {
      activeAccountRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeAccount]);

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
    navigate('/pricing-section');
  };

  const handleAddAdAccountClick = async () => {
    try {
      const response = await axios.post('https://backend.quickcampaigns.io/payment/add_ad_account', {}, { withCredentials: true });
      if (response.status === 200) {
        const newAdAccounts = await axios.get('https://backend.quickcampaigns.io/auth/ad_accounts', { withCredentials: true });
        setAdAccounts(newAdAccounts.data.ad_accounts);

        const latestAdAccount = newAdAccounts.data.ad_accounts[newAdAccounts.data.ad_accounts.length - 1];
        setActiveAccount(latestAdAccount);
        fetchAdAccountDetails(latestAdAccount.id);

        const sessionId = response.data.sessionId;
        if (sessionId) {
          const stripe = window.Stripe('pk_live_51Ld9QOJd93BCcOTa5xS2wKbsPgFyhhgNJsYFQckPbd1YzeHiWdiB4seDmZmDOQvp8WE3FjCkDuSwhfes0wgUcxDA00SYWlIP2K');
          stripe.redirectToCheckout({ sessionId });
        } else {
          console.error('No session ID returned from backend');
        }
        toast.success('Ad account added successfully');  // Notify user of the success
      }
    } catch (error) {
      toast.error('Error adding ad account');  // Notify user of the error
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
            <Link to="/">
              <img src="./assets/logo-footer.png" alt="Logo" className={styles.logoImage} />
            </Link>
          </div>
          <hr className={styles.horizontalRule} />
          <div className={styles.accountsContainer}>
            {adAccounts.length > 0 ? (
              adAccounts.map((account, index) => (
                <button
                  key={index}
                  ref={activeAccount === account ? activeAccountRef : null}
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
          {userSubscriptionPlan === 'Enterprise' && (
            <button
              className={styles.accountButton2}
              onClick={handleAddAdAccountClick}
              aria-label="Create New Ad Account"
            >
             Add New Ad Account
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
                {/* <div className={styles.dropdownRow}>
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
                </div> */}
              </div>
            )}
          </div>
        </div>
        <div>
          <button className={styles.upgradeButton} onClick={handleUpgradeClick}>Upgrade Plan</button>
          <div className={styles.footer}>
            {adAccounts.length === 1 
              ? `1 Ad account on ${userSubscriptionPlan.toLowerCase() === 'no active plan' ? userSubscriptionPlan.toLowerCase() : `${userSubscriptionPlan.toLowerCase()} plan`}`
              : `${adAccounts.length} Ad accounts on ${userSubscriptionPlan.toLowerCase() === 'no active plan' ? userSubscriptionPlan.toLowerCase() : `${userSubscriptionPlan.toLowerCase()} plan`}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickySide;
