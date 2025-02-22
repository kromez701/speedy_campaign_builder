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
  const [activeAdAccountsCount, setActiveAdAccountsCount] = useState(0);
  const [userSubscriptionPlan, setUserSubscriptionPlan] = useState('');
  const [isDropdownVisible, setDropdownVisible] = useState(true);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const sidebarRef = useRef(null);
  const activeAccountRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const abortControllersRef = useRef(new Set());

  // Function to create and track a new AbortController
  const getAbortController = () => {
    const controller = new AbortController();
    abortControllersRef.current.add(controller);
    return controller;
  };

  // Cleanup function to cancel all ongoing requests
  useEffect(() => {
    return () => {
      abortControllersRef.current.forEach(controller => controller.abort());
      abortControllersRef.current.clear();
    };
  }, []);

  // Scroll to the active account when it changes
  useEffect(() => {
    if (activeAccountRef.current) {
      activeAccountRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeAccount]); // Runs every time the activeAccount updates

  // Fetch ad account details
  const fetchAdAccountDetails = async (id) => {
    const controller = getAbortController();
    try {
      const response = await axios.get(`${apiUrl}/auth/ad_account/${id}`, {
        withCredentials: true,
        signal: controller.signal,
      });
      setAdAccountDetails(response.data);
    } catch (error) {
      if (!axios.isCancel(error)) {
        toast.error('Error fetching ad account details');
        console.error('Error fetching ad account details', error);
      }
    } finally {
      abortControllersRef.current.delete(controller);
    }
  };

  // Fetch active ad account from backend
  const fetchActiveAdAccount = async () => {
    const controller = getAbortController();
    try {
      const response = await axios.get(`${apiUrl}/auth/get_active_ad_account`, {
        withCredentials: true,
        signal: controller.signal,
      });
      if (response.data) {
        setActiveAccount(response.data);
        fetchAdAccountDetails(response.data.id);
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error('Error fetching active ad account', error);
      }
    } finally {
      abortControllersRef.current.delete(controller);
    }
  };

  // Set active ad account in backend
  const updateActiveAdAccount = async (selectedAccount) => {
    const controller = getAbortController();
    try {
      await axios.post(`${apiUrl}/auth/set_active_ad_account`, selectedAccount, {
        withCredentials: true,
        signal: controller.signal,
      });
      setActiveAccount(selectedAccount);
      fetchAdAccountDetails(selectedAccount.id);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error('Error setting active ad account', error);
        toast.error('Failed to update active ad account');
      }
    } finally {
      abortControllersRef.current.delete(controller);
    }
  };

  useEffect(() => {
    const fetchAdAccountsAndPlan = async () => {
      try {
        const userPlanResponse = await axios.get(`${apiUrl}/payment/user-subscription-status`, { withCredentials: true });
        setUserSubscriptionPlan(userPlanResponse.data.plan);

        const adAccountsResponse = await axios.get(`${apiUrl}/auth/ad_accounts`, { withCredentials: true });
        const fetchedAccounts = adAccountsResponse.data.ad_accounts;
        setAdAccounts(fetchedAccounts);

        setActiveAdAccountsCount(0);

        const countActiveAccounts = async () => {
          let activeCount = 0;
          await Promise.all(
            fetchedAccounts.map(async (account) => {
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
          setActiveAdAccountsCount(activeCount);
        };

        countActiveAccounts();

        // Fetch active ad account from backend
        fetchActiveAdAccount();

        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
        toast.error('Error fetching ad accounts or user plan');
      }
    };

    fetchAdAccountsAndPlan();
  }, [setActiveAccount, refreshTrigger, location.pathname]);

  useEffect(() => {
    if (activeAccount?.id) {
      fetchAdAccountDetails(activeAccount.id);
    }
  }, [activeAccount]);

  const handleAccountClick = (index) => {
    const selectedAccount = adAccounts[index];
    updateActiveAdAccount(selectedAccount);

    if (location.pathname === "/pricing-section") {
      navigate("/");
    }
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
                  ref={activeAccount?.id === account.id ? activeAccountRef : null}
                  className={`${styles.accountButton} ${activeAccount?.id === account.id ? styles.active : ''}`}
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
            {userSubscriptionPlan.toLowerCase() === "professional"
              ? `${activeAdAccountsCount > 0 ? "1" : "0"} Ad account on ${userSubscriptionPlan.toLowerCase()} plan`
              : `${activeAdAccountsCount} Ad accounts on ${userSubscriptionPlan.toLowerCase()} plan`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickySide;
