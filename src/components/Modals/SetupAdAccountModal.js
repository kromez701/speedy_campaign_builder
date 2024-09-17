/* global FB */

import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SetupAdAccountModal.module.css';
import SetupAdAccountPopup from '../SetUpPopUp/SetupAdAccountPopup';
import { toast } from 'react-toastify';
import axios from 'axios';

const SetupAdAccountModal = ({ onClose, activeAccount }) => {  // Ensure activeAccount is passed in
  const modalRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Load the Facebook SDK script asynchronously
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    window.fbAsyncInit = function () {
      FB.init({
        appId: '1153977715716035',
        cookie: true,
        xfbml: true,
        version: 'v20.0'
      });
    };
  }, []);

  const [businessManagerId, setBusinessManagerId] = useState('');

  const handleSetupAccount = () => {
    if (typeof FB === 'undefined') {
      toast.error('Facebook SDK is not loaded yet.');
      return;
    }
  
    FB.login((response) => {
      if (response.authResponse) {
        const accessToken = response.authResponse.accessToken;
        setAccessToken(accessToken);
  
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
    setShowPopup(false); 
    verifyAndSaveAdAccount(accessToken, adAccount, page, pixel);
  };

  const verifyAndSaveAdAccount = async (accessToken, adAccount, page, pixel) => {
    try {
      const isAdAccountValid = await verifyField('https://backend.quickcampaigns.io/auth/verify_ad_account', {
        ad_account_id: adAccount,
        access_token: accessToken,
      });

      if (isAdAccountValid) {
        try {
          // Here, the endpoint matches exactly like ProfileManagement
          console.log(activeAccount)
          const exchangeResponse = await axios.post(
            `https://backend.quickcampaigns.io/config/ad_account/${activeAccount.id}/exchange-token`,
            { access_token: accessToken },
            { withCredentials: true } 
          );

          if (exchangeResponse.status === 200 && exchangeResponse.data.long_lived_token) {
            const updatedAdAccountDetails = {
              ad_account_id: adAccount,
              facebook_page_id: page || '',
              pixel_id: pixel || '',
              access_token: exchangeResponse.data.long_lived_token,
              app_id: '1153977715716035', 
              app_secret: '30d73e973e26535fc1e445f2e0b16cb7', 
              business_manager_id: businessManagerId
            };

            const saveResponse = await axios.post(
              'https://backend.quickcampaigns.io/auth/ad_account',
              { id: activeAccount.id, ...updatedAdAccountDetails },
              { withCredentials: true }
            );

            if (saveResponse.status === 200) {
              toast.success('Ad account updated successfully');
              setTimeout(() => {
                window.location.reload();
              }, 700);
            }
          } else {
            toast.error('Failed to exchange token.');
          }
        } catch (error) {
          toast.error('Error saving ad account.');
          console.error('Error saving ad account:', error);
        }
      } else {
        toast.error('Invalid ad account details.');
      }
    } catch (error) {
      toast.error('Error verifying ad account.');
      console.error('Error verifying ad account:', error);
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

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (modalRef.current && !modalRef.current.contains(event.target) && !showPopup) {
  //       onClose();
  //     }
  //   };
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [onClose, showPopup]);

  return (
    <div>
      {!showPopup && (
        <div className={styles.modalContainer}>
          <div ref={modalRef} className={styles.modal}>
            <button className={styles.closeIcon} onClick={onClose}>
              &times;
            </button>
            <div className={styles.setupForm}>
              <h3 className={styles.modalHeading}>Set Up Ad Account</h3>
              <p className={styles.modalMessage}>
                To start uploading campaigns, you need to set up an ad account.
              </p>
              <div className={styles.buttonContainer}>
                <button className={styles.setupButton} onClick={handleSetupAccount}>
                  Set Up Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPopup && (
        <div className={styles.popupOverlay}>
          <SetupAdAccountPopup
            onClose={() => setShowPopup(false)}
            onSubmit={handlePopupSubmit}
            accessToken={accessToken}
          />
        </div>
      )}
    </div>
  );
};

export default SetupAdAccountModal;
