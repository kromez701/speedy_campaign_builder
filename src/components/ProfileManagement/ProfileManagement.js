/* global FB */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../ToastifyOverrides.css';
import styles from './ProfileManagement.module.css';
import SetupAdAccountPopup from '../SetUpPopUp/SetupAdAccountPopup';
import DowngradeModal from '../DowngradeModal/DowngradeModal';
import config from '../../config';

const apiUrl = config.apiUrl;
const stripePublishableKey = config.stripePublishableKey;
const APP_ID = config.appId
const APP_SECRET = config.appSecret

const ProfileManagement = ({ onLogout, activeAccount, setActiveAccount, onPlanUpgrade }) => {
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
  const [isAdAccountActive, setIsAdAccountActive] = useState(false);
  const [isActiveManual, setIsActiveManual] = useState(false);
  const [nextBillingDate, setNextBillingDate] = useState('-- -- --');
  const [runningPlan, setRunningPlan] = useState('No active plan');
  const [showPopup, setShowPopup] = useState(false);  // State to control the visibility of the popup
  const [accessToken, setAccessToken] = useState('');  // State to store the access token from Facebook login
  const [businessManagerId, setBusinessManagerId] = useState('');
  const [currentPlan, setCurrentPlan] = useState(null);
  const [hasUsedFreeTrial, setHasUsedFreeTrial] = useState(false);
  const [adAccounts, setAdAccounts] = useState([]);
  const [selectedAdAccountId, setSelectedAdAccountId] = useState(null);
  const [showDowngradeModal, setShowDowngradeModal] = useState(false);
  const [availableAdAccounts, setAvailableAdAccounts] = useState([]);
  const [pendingDowngradePlan, setPendingDowngradePlan] = useState("");
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);

  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/profile`, { withCredentials: true });
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
        const response = await axios.get(`${apiUrl}/payment/user-subscription-status`, { withCredentials: true });
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
          `${apiUrl}/payment/subscription-status/${activeAccount.id}`,
          { withCredentials: true }
        );
  
        if (response.status === 200) {
          const { plan, start_date, end_date, is_active, is_active_manual, next_billing_date } = response.data;
          setRunningPlan(plan);
          setSubscriptionStartDate(start_date);
          setSubscriptionEndDate(end_date);
          setIsAdAccountActive(is_active);
          setIsActiveManual(is_active_manual);
          setNextBillingDate(is_active_manual ? next_billing_date : "-- -- --");
        }
  
        const cancelStatusResponse = await axios.get(
          `${apiUrl}/payment/check-ad-account-cancel-status/${activeAccount.id}`,
          { withCredentials: true }
        );
  
        if (cancelStatusResponse.status === 200) {
          setCancelAtPeriodEnd(cancelStatusResponse.data.cancel_at_period_end);
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
      const response = await axios.get(`${apiUrl}/auth/ad_account/${adAccountId}`, { withCredentials: true });
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
      const isAdAccountValid = await verifyField(`${apiUrl}/auth/verify_ad_account`, { ad_account_id: adAccount, access_token: accessToken });
      // const isPixelValid = await verifyField(`${apiUrl}/auth/verify_pixel_id`, { pixel_id: pixel, access_token: accessToken });
      // const isPageValid = await verifyField(`${apiUrl}/auth/verify_facebook_page_id`, { facebook_page_id: page, access_token: accessToken });

      if (isAdAccountValid) {
        try {
          const exchangeResponse = await axios.post(
            `${apiUrl}/config/ad_account/${activeAccount.id}/exchange-token`,
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
              app_id: APP_ID,  // Add the app ID
              app_secret: APP_SECRET,  // Add the app secret
              business_manager_id: businessManagerId
            };

            console.log(exchangeResponse)

            const saveResponse = await axios.post(
              `${apiUrl}/auth/ad_account`,
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
      const response = await axios.post(`${apiUrl}/auth/profile`, formData, { withCredentials: true });
      if (response.status === 200) {
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error('Error saving profile');
      console.error('Error saving profile', error);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (confirmDelete) {
      try {
        const response = await axios.delete(`${apiUrl}/user_management/delete_user`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          toast.success('Your account has been deleted.');
          onLogout(); // Clears session and redirects to login
          window.location.reload(); // Refreshes the page
        } else {
          toast.error('Failed to delete your account. Please try again.');
        }
      } catch (error) {
        toast.error('An error occurred while trying to delete your account.');
        console.error('Error deleting account:', error);
      }
    }
  };


  const handleCancelSubscription = async () => {
    try {
      // Fetch active ad account count (but no specific condition on count)
      const response = await axios.get(`${apiUrl}/payment/active-ad-accounts`, { withCredentials: true });
      const activeAdAccountsCount = response.data.count;
  
      // General confirmation message
      const confirmCancel = window.confirm(`Are you sure you want to cancel the subscription for this ad account?`);
  
      if (confirmCancel) {
        const cancelResponse = await axios.post(
          `${apiUrl}/payment/cancel-subscription`,
          { ad_account_id: activeAccount.id },
          { withCredentials: true }
        );
  
        if (cancelResponse.status === 200) {
          toast.success(cancelResponse.data.message);
  
          // Update state to reflect subscription cancellation
          setIsActive(false);
          setSubscriptionStartDate('-- -- --');
          setSubscriptionEndDate('-- -- --');
          setRunningPlan('No active plan');
  
          // Reload the page to ensure UI updates correctly
          setTimeout(() => {
            window.location.reload();
          });
        }
      }
    } catch (error) {
      toast.error('Error canceling subscription');
      console.error('Error fetching active ad accounts or canceling subscription:', error);
    }
  };
  
  const handleRenewSubscription = async () => {
    try {
      const response = await axios.post(`${apiUrl}/payment/renew-subscription`,
        { ad_account_id: activeAccount.id, plan: subscriptionPlan },
        { withCredentials: true }
      );

      if (response.data.sessionId) {
        const stripe = window.Stripe(stripePublishableKey);
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
    const fetchSubscriptionDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/payment/user-subscription-status`, { withCredentials: true });
        setCurrentPlan(response.data.plan);
        setHasUsedFreeTrial(response.data.has_used_free_trial);

        const adAccountsResponse = await axios.get(`${apiUrl}/auth/ad_accounts`, { withCredentials: true });
        setAdAccounts(adAccountsResponse.data.ad_accounts);

        if (adAccountsResponse.data.ad_accounts.length > 0) {
          setSelectedAdAccountId(adAccountsResponse.data.ad_accounts[0].id);
        }
      } catch (error) {
        console.error('Error fetching subscription details', error);
      }
    };
    fetchSubscriptionDetails();
  }, []);

  const handleSubscribe = async (plan) => {
    if (!selectedAdAccountId) {
      toast.warn("Please select an ad account before subscribing.");
      return;
    }
  
    if (plan === "Free Trial" && hasUsedFreeTrial) {
      toast.info("You have already used the Free Trial. Please choose a different plan.");
      return;
    }
  
    try {
      const adAccountResponse = await axios.get(
        `${apiUrl}/payment/subscription-status/${selectedAdAccountId}`,
        { withCredentials: true }
      );
      const { plan: adAccountPlan, is_active: adAccountIsActive } = adAccountResponse.data;
  
      if (plan === adAccountPlan && adAccountIsActive) {
        toast.info(`You are already subscribed to the ${plan} plan.`);
        return;
      }
  
      // ✅ If downgrading from Enterprise, open modal to select an account
      if (currentPlan === "Enterprise" && plan === "Professional") {
        const adAccountsResponse = await axios.get(`${apiUrl}/auth/ad_accounts`, { withCredentials: true });
        setAvailableAdAccounts(adAccountsResponse.data.ad_accounts);
        setPendingDowngradePlan(plan);
        setShowDowngradeModal(true);
        return;
      }
  
      proceedWithSubscription(plan, selectedAdAccountId);
    } catch (error) {
      console.error("Error subscribing", error);
      toast.error("Error subscribing: " + error.message);
    }
  };

  const handleManageBilling = async () => {
    try {
      const response = await axios.post(`${apiUrl}/payment/create-billing-portal-session`, {}, { withCredentials: true });
  
      if (response.data.url) {
        window.location.href = response.data.url; // Redirect to Stripe billing portal
      }
    } catch (error) {
      if (error.response && error.response.data.error === 'no_subscription') {
        toast.info('You do not have a subscription to manage.');
      } else {
        toast.error('Error opening billing portal. Please try again.');
      }
    }
  };  
  
  const proceedWithSubscription = async (plan, adAccountToRetain) => {
    try {
      const response = await axios.post(
        `${apiUrl}/payment/create-checkout-session`,
        {
          plan,
          ad_account_id: adAccountToRetain,
          ...(currentPlan === "Enterprise" && plan === "Professional" && {
            chosen_ad_account_id: adAccountToRetain, // ✅ Send chosen ad account for retention
          }),
        },
        { withCredentials: true }
      );
  
      if (response.data.sessionId) {
        const stripe = window.Stripe(stripePublishableKey);
        await stripe.redirectToCheckout({ sessionId: response.data.sessionId });
      } else if (response.data.message) {
        toast.success("Subscription successful! Thank you for subscribing.");
        setCurrentPlan(plan);
        if (onPlanUpgrade) {
          onPlanUpgrade();
        }
  
        if (response.data.redirect_to_main) {
          navigate("/");
        }
      } else {
        toast.error("Failed to create checkout session.");
      }
    } catch (error) {
      console.error("Error subscribing", error);
      toast.error("Error subscribing: " + error.message);
    }
  };  

  useEffect(() => {
    // Load the Facebook SDK script asynchronously
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    // Initialize the Facebook SDK once the script has loaded
    window.fbAsyncInit = function () {
      FB.init({
        appId: APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v20.0'
      });

      FB.getLoginStatus(function (response) {
        console.log('FB SDK Initialized', response);
      });
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img
          src="./assets/arrow-left.png"
          alt="Go Back"
          className={styles.goBackIcon}
          onClick={() => navigate('/')}
        />
        <h2>Profile Management</h2>
      </div>
      <div className={styles.profileContent}>

        <div className={styles.profileContent}>
          <div className={styles.section}>
            <h3>Profile Information</h3>
            <div className={`${styles.formSection}`}>

              {/* Profile Picture Upload Section */}
              {/* <div className={styles.profilePicSection}>
                <div className={styles.profilePicWrapper}>
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className={styles.profilePic} />
                  ) : (
                    <div className={styles.placeholder}>
                      <img
                        src="./assets/profileImage.png"
                        alt="Placeholder"
                        className={styles.placeholderIcon}
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className={styles.hiddenFileInput}
                  />
                </div>
                <div>
                  <p className={styles.uploadText}><img src='./assets/upload.png' alt="Uplaod" /> Upload Image</p>
                  <p className={styles.fileHint}>JPG, PNG, or GIF, Max 2MB</p>
                </div>
              </div> */}

              {/* Full Name Input */}
              <label htmlFor="fullName" className={styles.label}>
                Full Name:
              </label>
              <input
                type="text"
                placeholder="Change Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={styles.profileInput}
              />

              {/* Email Input */}
              <label htmlFor="email" className={styles.label}>
                Email:
              </label>
              <input
                type="email"
                placeholder="Change Email"
                value={email}
                disabled
                className={styles.profileInput}
              />

              {/* Action Buttons */}
              <div className={styles.buttonContainer}>
                <button
                  onClick={handleDeleteAccount}
                  className={`${styles.button} ${styles.dangerButton}`}
                >
                  Delete Account <img src='./assets/trash.png' alt='trash' width={20} height={20} />
                </button>
                <button
                  onClick={handleSaveChanges}
                  className={`${styles.button} ${styles.primaryButton}`}
                >
                  Save Profile <img src='./assets/save.png' alt='trash' width={20} height={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.subscriptionDetails}`}>
        <div className={`${styles.subscriptionHeader}`}>
          <h2>Subscription Details</h2>
          <button className={`${styles.manageBillingBtn}`} onClick={handleManageBilling}>
            Manage Billing Info
          </button>
        </div>

        <div className={`${styles.subscriptionContent}`}>
          <div className={`${styles.detailItem}`}>
            <span>Current Plan:</span>
            <span className={`${styles.tag} ${styles.professional}`}>{currentPlan}</span>
          </div>

          <div className={styles.detailItem}>
            <span>Subscription Status:</span>
            <span className={`${styles.tag} ${isActiveManual ? styles.active : styles.inactive}`}>
              {isActiveManual ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* ✅ Move "Next Billing Date" out of the "Subscription Status" div */}
          <div className={styles.detailItem}>
            <span>Next Billing Date:</span>
            <span className={styles.tag}>{nextBillingDate}</span>
          </div>
        </div>
        

            {/* Footer section with the Cancel Subscription Button aligned to the right */}
            <div className={styles.subscriptionFooter}>
              {isAdAccountActive ? (
                cancelAtPeriodEnd ? (
                  <button className={`${styles.button} ${styles.renewSubscriptionButton}`} onClick={handleRenewSubscription}>
                    Renew Subscription
                  </button>
                ) : (
                  <button className={`${styles.button} ${styles.cancelSubscriptionButton}`} onClick={handleCancelSubscription}>
                    Cancel Subscription
                  </button>
                )
              ) : (
                <button className={`${styles.button} ${styles.renewSubscriptionButton}`} onClick={handleRenewSubscription}>
                  Renew Subscription
                </button>
              )}
            </div>

          </div>
        </div>
        <div className={`${styles.infoContainer}`}>
          <div className={`${styles.infoBox}`}>
            <h2><img src="./assets/circle-alert.png" alt='info' width={24} height={24} /> How to Change Your Connected Ad Account</h2>
            <div className={`${styles.infoContent}`}>
              <p>
                Currently, the only way to change the ad account linked to your
                subscription is by contacting our support team. Follow these simple
                steps:
              </p>
              <ol>
                <li>
                  <p className={`${styles.listHeading}`}>Contact Support</p>
                  <p>
                    Email us at  support@quickcampaigns.io with
                    the subject line: <br />
                    <em>“Request To Change Connected Ad Account.”</em>
                  </p>
                </li>
                <li>
                  <p className={`${styles.listHeading}`}>Provide Necessary Information</p>
                  <ul className={`${styles.innerList}`}>
                    <li>Your Full Name And Email Address Associated With Your Subscription.</li>
                    <li>The Name Or ID Of The Currently Connected Ad Account.</li>
                    <li>A Request To Disconnect The Current Account And Connect A New One.</li>
                  </ul>
                </li>
                <li>
                  <p className={`${styles.listHeading}`}>Wait For Confirmation</p>
                  <p>
                    Our support team will verify your request and disconnect your current ad
                    account. You will receive an email notification once this process is
                    complete.
                  </p>
                </li>
                <li>
                  <p className={`${styles.listHeading}`}>Connect A New Ad Account</p>
                  <p>
                    Once confirmed, log in to your QuickCampaigns Dashboard and follow the
                    standard authorization process to connect your new ad account.
                  </p>
                </li>
              </ol>
              <div className={`${styles.noteBox}`}>
                <p>Note:</p>
                <ul>
                  <li>Please allow up to 24–48 hours for our support team to process your request.</li>
                  <li>
                    For security reasons, we can only process account change requests from the
                    subscription owner.
                  </li>
                </ul>
              </div>
              <p>
                If you have any questions or need further assistance, feel free to reach out
                to us at  support@quickcampaigns.io
              </p>
            </div>
          </div>
        </div>

        {/* <div className={styles.section}>
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
          /> */}
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
        {/* <button
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
        </div >*/}

      <div id="pricing-section" className={`${styles.pricingSection}`}>
        <p className={`${styles.priceHeading}`}>
          Plans That Scale With Business
        </p>
        <div className={`${styles.priceCardContainer}`}>
          {/* card 1 */}
          <div className={`${styles.priceCard} ${styles.popularPlan}`}>

            <div class={`${styles.priceCardDescriptionContainer}`}>
              <p className={`${styles.priceCardPrice}`}>$129.5/month</p>
              <p className={`${styles.priceCardAccounts}`}>1 Ad Account</p>
              <p className={`${styles.priceCardPlan}`}>Professional Plan</p>
              <p className={`${styles.priceCardPlanDesc}`}>
                Perfect for Individual Advertisers and Small Teams
              </p>
            </div>
            <div className={`${styles.priceCardFeatureContainer}`}>
              <div className={`${styles.priceCardFeature}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="12" fill="#378CE7" fillOpacity="0.7" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M17.0964 7.39016L9.93638 14.3002L8.03638 12.2702C7.68638 11.9402 7.13638 11.9202 6.73638 12.2002C6.34638 12.4902 6.23638 13.0002 6.47638 13.4102L8.72638 17.0702C8.94638 17.4102 9.32638 17.6202 9.75638 17.6202C10.1664 17.6202 10.5564 17.4102 10.7764 17.0702C11.1364 16.6002 18.0064 8.41016 18.0064 8.41016C18.9064 7.49016 17.8164 6.68016 17.0964 7.38016V7.39016Z" fill="#EEEEEE" />
                </svg>
                Upload unlimited ads to 1 ad account.
              </div>
              <div className={`${styles.priceCardFeature}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="12" fill="#378CE7" fillOpacity="0.7" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M17.0964 7.39016L9.93638 14.3002L8.03638 12.2702C7.68638 11.9402 7.13638 11.9202 6.73638 12.2002C6.34638 12.4902 6.23638 13.0002 6.47638 13.4102L8.72638 17.0702C8.94638 17.4102 9.32638 17.6202 9.75638 17.6202C10.1664 17.6202 10.5564 17.4102 10.7764 17.0702C11.1364 16.6002 18.0064 8.41016 18.0064 8.41016C18.9064 7.49016 17.8164 6.68016 17.0964 7.38016V7.39016Z" fill="#EEEEEE" />
                </svg>
                Perfect for solo marketers and small teams.
              </div>
              <div className={`${styles.priceCardFeature}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="12" fill="#378CE7" fillOpacity="0.7" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M17.0964 7.39016L9.93638 14.3002L8.03638 12.2702C7.68638 11.9402 7.13638 11.9202 6.73638 12.2002C6.34638 12.4902 6.23638 13.0002 6.47638 13.4102L8.72638 17.0702C8.94638 17.4102 9.32638 17.6202 9.75638 17.6202C10.1664 17.6202 10.5564 17.4102 10.7764 17.0702C11.1364 16.6002 18.0064 8.41016 18.0064 8.41016C18.9064 7.49016 17.8164 6.68016 17.0964 7.38016V7.39016Z" fill="#EEEEEE" />
                </svg>
                Access all features and customization tools.
              </div>
              <div className={`${styles.priceCardFeature}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="12" fill="#378CE7" fillOpacity="0.7" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M17.0964 7.39016L9.93638 14.3002L8.03638 12.2702C7.68638 11.9402 7.13638 11.9202 6.73638 12.2002C6.34638 12.4902 6.23638 13.0002 6.47638 13.4102L8.72638 17.0702C8.94638 17.4102 9.32638 17.6202 9.75638 17.6202C10.1664 17.6202 10.5564 17.4102 10.7764 17.0702C11.1364 16.6002 18.0064 8.41016 18.0064 8.41016C18.9064 7.49016 17.8164 6.68016 17.0964 7.38016V7.39016Z" fill="#EEEEEE" />
                </svg>
                Receive dedicated support for ad management.
              </div>
            </div>
            <button 
                onClick={() => handleSubscribe('Professional')} 
                className={`${styles.priceStartBtn} ${currentPlan === "Professional" ? styles.currentPlanBtn : ""} 
                  ${currentPlan === "Enterprise" ? styles.downgradeBtn : ""}`}
              >
                {currentPlan === "Professional" 
                  ? "Current Plan" 
                  : currentPlan === "Enterprise" 
                    ? "Downgrade" 
                    : "Upgrade"}
              </button>
          </div>
          {/* card 2 */}
          <div className={`${styles.priceCard} ${styles.popularPlan}`}>
            <div class={`${styles.priceCardDescriptionContainer}`}>
              <p className={`${styles.priceCardPrice}`}>$99.5/month</p>
              <p className={`${styles.priceCardAccounts} ${styles.enterprise_title}`}>For 2 or more ad accounts, with pricing per account.</p>
              <p className={`${styles.priceCardPlan}`}>Enterprise plan</p>
              <p className={`${styles.priceCardPlanDesc}`}>
                Ideal for Agencies and Businesses
              </p>
            </div>
            <div className={`${styles.priceCardFeatureContainer}`}>
              <div className={`${styles.priceCardFeature} ${styles.firstFeature}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="12" fill="#378CE7" fillOpacity="0.7" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M17.0964 7.39016L9.93638 14.3002L8.03638 12.2702C7.68638 11.9402 7.13638 11.9202 6.73638 12.2002C6.34638 12.4902 6.23638 13.0002 6.47638 13.4102L8.72638 17.0702C8.94638 17.4102 9.32638 17.6202 9.75638 17.6202C10.1664 17.6202 10.5564 17.4102 10.7764 17.0702C11.1364 16.6002 18.0064 8.41016 18.0064 8.41016C18.9064 7.49016 17.8164 6.68016 17.0964 7.38016V7.39016Z" fill="#EEEEEE" />
                </svg>
                Upload unlimited ads to multiple ad accounts.
              </div>
              <div className={`${styles.priceCardFeature}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="12" fill="#378CE7" fillOpacity="0.7" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M17.0964 7.39016L9.93638 14.3002L8.03638 12.2702C7.68638 11.9402 7.13638 11.9202 6.73638 12.2002C6.34638 12.4902 6.23638 13.0002 6.47638 13.4102L8.72638 17.0702C8.94638 17.4102 9.32638 17.6202 9.75638 17.6202C10.1664 17.6202 10.5564 17.4102 10.7764 17.0702C11.1364 16.6002 18.0064 8.41016 18.0064 8.41016C18.9064 7.49016 17.8164 6.68016 17.0964 7.38016V7.39016Z" fill="#EEEEEE" />
                </svg>
                Perfect for agencies and businesses.
              </div>
              <div className={`${styles.priceCardFeature}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="12" fill="#378CE7" fillOpacity="0.7" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M17.0964 7.39016L9.93638 14.3002L8.03638 12.2702C7.68638 11.9402 7.13638 11.9202 6.73638 12.2002C6.34638 12.4902 6.23638 13.0002 6.47638 13.4102L8.72638 17.0702C8.94638 17.4102 9.32638 17.6202 9.75638 17.6202C10.1664 17.6202 10.5564 17.4102 10.7764 17.0702C11.1364 16.6002 18.0064 8.41016 18.0064 8.41016C18.9064 7.49016 17.8164 6.68016 17.0964 7.38016V7.39016Z" fill="#EEEEEE" />
                </svg>
                Access all features and customization tools.
              </div>
              <div className={`${styles.priceCardFeature}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="12" fill="#378CE7" fillOpacity="0.7" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M17.0964 7.39016L9.93638 14.3002L8.03638 12.2702C7.68638 11.9402 7.13638 11.9202 6.73638 12.2002C6.34638 12.4902 6.23638 13.0002 6.47638 13.4102L8.72638 17.0702C8.94638 17.4102 9.32638 17.6202 9.75638 17.6202C10.1664 17.6202 10.5564 17.4102 10.7764 17.0702C11.1364 16.6002 18.0064 8.41016 18.0064 8.41016C18.9064 7.49016 17.8164 6.68016 17.0964 7.38016V7.39016Z" fill="#EEEEEE" />
                </svg>
                Receive dedicated support for ad management.
              </div>
            </div>
            <button 
              onClick={() => handleSubscribe('Enterprise')} 
              className={`${styles.priceStartBtn} ${currentPlan === "Enterprise" ? styles.currentPlanBtn : ""}`}
            >
              {currentPlan === "Enterprise" ? "Current Plan" : "Upgrade"}
            </button>
          </div>
        </div>
      </div>

      {showDowngradeModal && (
        <DowngradeModal
          adAccounts={availableAdAccounts}
          onConfirm={(selectedAccount) => {
            setShowDowngradeModal(false);
            proceedWithSubscription(pendingDowngradePlan, selectedAccount);
          }}
          onCancel={() => setShowDowngradeModal(false)}
        />
      )}

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