import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './StickySide.module.css';
import '../ToastifyOverrides.css';
import config from '../../config';

const apiUrl = config.apiUrl;
const stripePublishableKey = config.stripePublishableKey;

const StickySide = ({ setActiveAccount, activeAccount, refreshTrigger }) => {
  const [adAccounts, setAdAccounts] = useState([]);
  const [adAccountDetails, setAdAccountDetails] = useState({});
  const [userSubscriptionPlan, setUserSubscriptionPlan] = useState('');
  const [isDropdownVisible, setDropdownVisible] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const sidebarRef = useRef(null);
  const activeAccountRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();


  const fetchAdAccountDetails = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}/auth/ad_account/${id}`, { withCredentials: true });
      const accountDetails = response.data;
      setAdAccountDetails(accountDetails);
    } catch (error) {
      toast.error('Error fetching ad account details');
      console.error('Error fetching ad account details', error);
    }
  };

  useEffect(() => {
    const fetchAdAccountsAndPlan = async () => {
      try {
        // Fetch the user subscription plan
        const userPlanResponse = await axios.get(`${apiUrl}/payment/user-subscription-status`, { withCredentials: true });
        setUserSubscriptionPlan(userPlanResponse.data.plan);
  
        // Fetch all ad accounts from backend
        const adAccountsResponse = await axios.get(`${apiUrl}/auth/ad_accounts`, { withCredentials: true });
        const fetchedAccounts = adAccountsResponse.data.ad_accounts;
        setAdAccounts(fetchedAccounts);
  
        // Get saved ad account and count from local storage
        const savedAccount = localStorage.getItem('activeAccount');
        const savedAccountParsed = savedAccount ? JSON.parse(savedAccount) : null;
  
        const storedAccountCount = localStorage.getItem('adAccountCount');
        const currentAccountCount = fetchedAccounts.length;
  
        if (storedAccountCount && parseInt(storedAccountCount) < currentAccountCount) {
          // If new ad account was added, set the last account as active
          const newActiveAccount = fetchedAccounts[fetchedAccounts.length - 1];
          setActiveAccount(newActiveAccount);
          fetchAdAccountDetails(newActiveAccount.id);
        } else if (savedAccountParsed && fetchedAccounts.some(acc => acc.id === savedAccountParsed.id)) {
          // Use the saved account if it exists in the list of accounts
          setActiveAccount(savedAccountParsed);
          fetchAdAccountDetails(savedAccountParsed.id);
        } else if (fetchedAccounts.length > 0) {
          // Fallback to the first account if the saved one isn't found
          const activeAccount = fetchedAccounts[0];
          setActiveAccount(activeAccount);
          fetchAdAccountDetails(activeAccount.id);
        }
  
        // Update local storage with the new count of ad accounts
        localStorage.setItem('adAccountCount', fetchedAccounts.length.toString());
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
        toast.error('Error fetching ad accounts or user plan');
      }
    };
  
    fetchAdAccountsAndPlan();
  }, [setActiveAccount, refreshTrigger, location.pathname]); // <- Added location.pathname dependency  
  
  useEffect(() => {
    if (activeAccount) {
      // Save the active account to localStorage whenever it changes
      localStorage.setItem('activeAccount', JSON.stringify(activeAccount));
    }
  }, [activeAccount]);

  useEffect(() => {
    if (activeAccountRef.current) {
      activeAccountRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeAccount]);

  const handleAccountClick = (index) => {
    const selectedAccount = adAccounts[index];
    setActiveAccount(selectedAccount);
    fetchAdAccountDetails(selectedAccount.id);
    localStorage.setItem('activeAccount', JSON.stringify(selectedAccount));
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
      const response = await axios.post(`${apiUrl}/payment/add_ad_account`, {}, { withCredentials: true });
      if (response.status === 200) {
        const sessionId = response.data.sessionId;
        if (sessionId) {
          const stripe = window.Stripe(stripePublishableKey);
          stripe.redirectToCheckout({ sessionId });
        } else {
          console.error('No session ID returned from backend');
        }
      }
    } catch (error) {
      toast.error('Error adding ad account');
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
                  ref={activeAccount?.id === account.id ? activeAccountRef : null} // Compare IDs
                  className={`${styles.accountButton} ${activeAccount?.id === account.id ? styles.active : ''}`} // Compare IDs
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
                  <div className={styles.inlineContainer}>
                    <span className={`${styles.input} ${styles.input1} ${styles.lab}`}>Ad Account - </span>
                    <input className={`${styles.input} ${styles.input1}`} placeholder="Ad Account ID" value={adAccountDetails.name || ''} readOnly />
                  </div>
                  <hr className={styles.horizontalRule1} />
                </div>
                {/* <div className={styles.dropdownRow}>
                  <input className={styles.input} placeholder="Pixel ID" value={adAccountDetails.pixel_id || ''} readOnly />
                  <hr className={styles.horizontalRule1} />
                </div>
                <div className={styles.dropdownRow}>
                  <input className={styles.input} placeholder="Facebook Page ID" value={adAccountDetails.facebook_page_id || ''} readOnly />
                  <hr className={styles.horizontalRule1} />
                </div> */}
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
