/* global FB */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../ToastifyOverrides.css';
import styles from './ProfileManagement.module.css';
import SetupAdAccountPopup from '../SetUpPopUp/SetupAdAccountPopup';

const ProfileManagement = ({ onLogout, activeAccount, setActiveAccount }) => {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [adAccountDetails, setAdAccountDetails] = useState({});
  const [isBound, setIsBound] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState('');  
  const [subscriptionStartDate, setSubscriptionStartDate] = useState('-- -- --');
  const [subscriptionEndDate, setSubscriptionEndDate] = useState('-- -- --');
  const [isActive, setIsActive] = useState(false);  
  const [runningPlan, setRunningPlan] = useState('No active plan');
  const [showPopup, setShowPopup] = useState(false);  // State to control the visibility of the popup
  const [accessToken, setAccessToken] = useState('');  // State to store the access token from Facebook login
  const [businessManagerId, setBusinessManagerId] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('https://backend.quickcampaigns.io/auth/profile', { withCredentials: true });
        if (response.status === 200) {
          const { username, email, profile_picture } = response.data.user;
          setFullName(username);
          setEmail(email);
          setProfilePic(profile_picture ? profile_picture : null);
        }
      } catch (error) {
        toast.error('Error fetching profile');
        console.error('Error fetching profile', error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchUserSubscriptionStatus = async () => {
      try {
        const response = await axios.get('https://backend.quickcampaigns.io/payment/user-subscription-status', { withCredentials: true });
        if (response.status === 200) {
          const { plan, start_date, end_date, is_active } = response.data;
          setSubscriptionPlan(plan);
          setSubscriptionStartDate(start_date);
          setSubscriptionEndDate(end_date);
          setIsActive(is_active);
        }
      } catch (error) {
        toast.error('Error fetching user subscription status');
        console.error('Error fetching user subscription status', error);
      }
    };
    
    fetchUserSubscriptionStatus();
  }, []);

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      try {
        const response = await axios.get(
          `https://backend.quickcampaigns.io/payment/subscription-status/${activeAccount.id}`, 
          { withCredentials: true }
        );
  
        if (response.status === 200) {
          const { plan, start_date, end_date, is_active } = response.data;
          setRunningPlan(plan);
          setSubscriptionStartDate(start_date);
          setSubscriptionEndDate(end_date);
          setIsActive(is_active);
        }
      } catch (error) {
        toast.error('Error fetching subscription details');
        console.error('Error fetching subscription details', error);
      }
    };
  
    if (activeAccount) {
      fetchSubscriptionDetails();
      setIsBound(activeAccount.is_bound);
      fetchAdAccountDetails(activeAccount.id);
    }
  }, [activeAccount]);

  const fetchAdAccountDetails = async (adAccountId) => {
    try {
      const response = await axios.get(`https://backend.quickcampaigns.io/auth/ad_account/${adAccountId}`, { withCredentials: true });
      const adAccountData = response.data;
      setAdAccountDetails(adAccountData);

      if (adAccountData.is_bound) {
        // Name is now stored in the backend, so directly use it
        setAdAccountDetails({
          ...adAccountData,
          ad_account_name: adAccountData.name,  // Use the stored name
        });
      }
    } catch (error) {
      toast.error('Error fetching ad account details');
      console.error('Error fetching ad account details', error);
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5242880) {
      setProfilePic(URL.createObjectURL(file));
    } else {
      toast.error('File size should be less than 5MB');
    }
  };

  const verifyField = async (url, fieldData) => {
    try {
      const response = await axios.post(url, fieldData, { withCredentials: true });
      return response.data.valid;
    } catch (error) {
      console.error('Verification error:', error);
      return false;
    }
  };

  const handleAdAccountChange = (e) => {
    const { name, value } = e.target;
    setAdAccountDetails({ ...adAccountDetails, [name]: value });
  };

  const handleAdAccountSave = async () => {
    if (isBound) {
      toast.error('Ad account settings can only be changed once.');
      return;
    }
  
    FB.login(response => {
      if (response.authResponse) {
        const accessToken = response.authResponse.accessToken;
        setAccessToken(accessToken);  // Save the access token to state
  
        // Fetch the Business Manager ID (BM ID)
        FB.api('/me/businesses', 'GET', { access_token: accessToken }, (response) => {
          if (response && !response.error) {
            if (response.data && response.data.length > 0) {
              const businessManagerId = response.data[0].id;  // Take the first BM ID
              setBusinessManagerId(businessManagerId);  // Save the BM ID to state
              console.log('Business Manager ID:', businessManagerId);
            } else {
              console.log('No Business Manager found');
            }
          } else {
            console.error('Error fetching BM ID:', response.error);
          }
        });
  
        setShowPopup(true);  // Show the popup when login is successful
      } else {
        toast.error('Facebook login failed or was cancelled.');
      }
    }, { scope: 'ads_management,ads_read,pages_show_list,business_management,pages_read_engagement,email,public_profile' });
  };

  const handlePopupSubmit = (adAccount, page, pixel) => {
    setShowPopup(false); // Close the popup after submission
    verifyAndSaveAdAccount(accessToken, adAccount, page, pixel); // Adjust to use selected values
  };


  const verifyAndSaveAdAccount = async (accessToken, adAccount, page, pixel) => {
    const { ad_account_id, pixel_id, facebook_page_id } = adAccountDetails;
  
    try {
        const isAdAccountValid = await verifyField('https://backend.quickcampaigns.io/auth/verify_ad_account', { ad_account_id: adAccount, access_token: accessToken });
        // const isPixelValid = await verifyField('https://backend.quickcampaigns.io/auth/verify_pixel_id', { pixel_id: pixel, access_token: accessToken });
        // const isPageValid = await verifyField('https://backend.quickcampaigns.io/auth/verify_facebook_page_id', { facebook_page_id: page, access_token: accessToken });

        if (isAdAccountValid) {
            try {
                const exchangeResponse = await axios.post(
                    `https://backend.quickcampaigns.io/config/ad_account/${activeAccount.id}/exchange-token`,
                    { access_token: accessToken },
                    { withCredentials: true }
                );

                if (exchangeResponse.status === 200 && exchangeResponse.data.long_lived_token) {
                    const updatedAdAccountDetails = {
                        ...adAccountDetails,
                        ad_account_id: adAccount,
                        facebook_page_id: '',
                        pixel_id: '',
                        access_token: exchangeResponse.data.long_lived_token,
                        app_id: '1153977715716035',  // Add the app ID
                        app_secret: '30d73e973e26535fc1e445f2e0b16cb7',  // Add the app secret
                        business_manager_id: businessManagerId
                    };

                    console.log(exchangeResponse)

                    const saveResponse = await axios.post(
                        'https://backend.quickcampaigns.io/auth/ad_account',
                        { id: activeAccount.id, ...updatedAdAccountDetails },
                        { withCredentials: true }
                    );

                    if (saveResponse.status === 200) {
                        toast.success('Ad account updated successfully');
                        setIsBound(true);
                        setTimeout(() => {
                          window.location.reload();  // Refresh the page after the toast
                      }, 700); 
                    }
                } else {
                    toast.error('Failed to exchange token.');
                }
            } catch (error) {
                toast.error('Error saving ad account');
                console.error('Error saving ad account', error);
            }
        } else {
            toast.error('Invalid ad account details for one or more fields.');
        }
    } catch (error) {
        console.error('Error verifying ad account details:', error);
        toast.error('Error verifying ad account details.');
    }
};

  const handleSaveChanges = async () => {
    const formData = new FormData();
    formData.append('username', fullName);
    formData.append('profile_picture', document.querySelector('input[type="file"]').files[0]);

    try {
      const response = await axios.post('https://backend.quickcampaigns.io/auth/profile', formData, { withCredentials: true });
      if (response.status === 200) {
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error('Error saving profile');
      console.error('Error saving profile', error);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await axios.get('https://backend.quickcampaigns.io/payment/active-ad-accounts', { withCredentials: true });
      const activeAdAccountsCount = response.data.count;

      const confirmCancel = window.confirm(
        runningPlan === 'Enterprise' && isActive && activeAdAccountsCount < 3
          ? `There are only 2 active ad accounts with running plans. Canceling the subscription for this account will cancel all subscriptions. Are you sure you want to proceed?`
          : `Are you sure you want to cancel the subscription for ad account ?`
      );

      if (confirmCancel) {
        const cancelResponse = await axios.post('https://backend.quickcampaigns.io/payment/cancel-subscription', { ad_account_id: activeAccount.id }, { withCredentials: true });

        if (cancelResponse.status === 200) {
          toast.success(cancelResponse.data.message);
          setIsActive(false);
          setSubscriptionStartDate('-- -- --');
          setSubscriptionEndDate('-- -- --');
          setRunningPlan('No active plan');
        }
      }
    } catch (error) {
      toast.error('Error fetching active ad accounts or canceling subscription');
      console.error('Error fetching active ad accounts or canceling subscription:', error);
    }
  };

  const handleRenewSubscription = async () => {
    try {
      const response = await axios.post('https://backend.quickcampaigns.io/payment/renew-subscription', 
        { ad_account_id: activeAccount.id, plan: subscriptionPlan },
        { withCredentials: true }
      );

      if (response.data.sessionId) {
        const stripe = window.Stripe('pk_test_51PiyL901UFm1325d6TwRCbSil7dWz63iOlmtqEZV6uLOQhXZSPwqhZPZ1taioo9s6g1IAbFjsD4OV6q4zWcv1ycV00fISOFZLY');
        stripe.redirectToCheckout({ sessionId: response.data.sessionId });
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (error) {
      toast.error('Error renewing subscription');
      console.error('Error renewing subscription:', error);
    }
  };

  useEffect(() => {
    // Load the Facebook SDK script asynchronously
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    // Initialize the Facebook SDK once the script has loaded
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '1153977715716035',
        cookie     : true,
        xfbml      : true,
        version    : 'v20.0'
      });

      FB.getLoginStatus(function(response) {
        console.log('FB SDK Initialized', response);
      });
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img
          src="/assets/Vector4.png"
          alt="Go Back"
          className={styles.goBackIcon}
          onClick={() => navigate('/')}
        />
        <h2>Profile Management</h2>
      </div>
      <div className={styles.profileContent}>
        <div className={styles.section}>
          {profilePic && <img src={profilePic} alt="Profile" className={styles.profilePic} />}
          <h3>Profile Information</h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePicChange}
            className={styles.profileInput}
          />
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={styles.profileInput}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            disabled
            className={styles.profileInput}
          />
          <button
          onClick={handleSaveChanges}
          className={`${styles.button} ${styles.primaryButton}`}
        >
          Save Profile
        </button>
        </div>
        <div className={styles.section}>
          <h3>Ad Account Settings</h3>
          <p className={styles.infoText}>
            Ad account cannot be changed later.
          </p>
          <input
            type="text"
            name="ad_account_id"
            placeholder="Ad Account"
            value={adAccountDetails.ad_account_name || adAccountDetails.ad_account_id || ''}
            onChange={handleAdAccountChange}
            className={styles.profileInput}
            required
            disabled
          />
          {/* <input
            type="text"
            name="pixel_id"
            placeholder="Pixel ID"
            value={adAccountDetails.pixel_id || ''}
            className={styles.profileInput}
            disabled
          />
          <input
            type="text"
            name="facebook_page_id"
            placeholder="Facebook Page ID"
            value={adAccountDetails.facebook_page_id || ''}
            className={styles.profileInput}
            disabled
          /> */}
          <button
            onClick={handleAdAccountSave}
            className={`${styles.button} ${styles.primaryButton} ${styles.saveAdaccount}`}
            disabled={isBound}
          >
            Set up ad account
          </button>
        </div>
        <div className={styles.section}>
          <h3>Subscription Details</h3>
          <p><strong>Plan:</strong> {subscriptionPlan}</p>
          <p><strong>Running Plan:</strong> {runningPlan}</p>
          <p><strong>Start Date:</strong> {subscriptionStartDate}</p>
          {subscriptionEndDate && (
            <p><strong>End Date:</strong> {subscriptionEndDate}</p>
          )}
          {isActive ? (
            <p><strong>Status:</strong> Active</p>
          ) : (
            <p><strong>Status:</strong> Inactive</p>
          )}
        </div>
      </div>
      <div className={styles.footer}>
        <button onClick={() => navigate('/pricing-section')} className={`${styles.button} ${styles.primaryButton}`}>
            Change Plan
        </button>
        {runningPlan !== 'No active plan' && (
          <button onClick={handleCancelSubscription} className={`${styles.button} ${styles.secondaryButton}`}>
            Cancel Subscription
          </button>
        )}
        {(subscriptionPlan === 'Professional' || subscriptionPlan === 'Enterprise') && runningPlan === 'No active plan' && (
          <button onClick={handleRenewSubscription} className={`${styles.button} ${styles.renewButton}`}>
            Renew Subscription
          </button>
        )}
        <button onClick={onLogout} className={`${styles.button} ${styles.secondaryButton}`}>
          Logout
        </button>
      </div>

      {/* Render the SetupAdAccountPopup when showPopup is true */}
      {showPopup && (
        <SetupAdAccountPopup
          onClose={() => setShowPopup(false)}
          onSubmit={handlePopupSubmit}
          accessToken={accessToken}
        />
      )}
    </div>
  );
};

export default ProfileManagement;