/* global FB */

import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SetupAdAccountModal.module.css';
import SetupAdAccountPopup from '../SetUpPopUp/SetupAdAccountPopup';
import { toast } from 'react-toastify';
import axios from 'axios';
import config from '../../config';

const apiUrl = config.apiUrl;
const APP_ID = config.appId;
const APP_SECRET = config.appSecret;

const SetupAdAccountModal = ({ onClose, activeAccount, setActiveAccount }) => {
  const modalRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const navigate = useNavigate();
  const [businessManagerId, setBusinessManagerId] = useState([]);

  useEffect(() => {
    if (activeAccount && activeAccount.is_bound) {
      onClose();
    }
  }, [activeAccount, onClose]);  

  useEffect(() => {

    // Dynamically set the overlay height
    const overlay = document.querySelector(`.${styles.interactionBlockingOverlay}`);
    if (overlay) {
      overlay.style.height = `${document.body.scrollHeight}px`;
    }
    
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
        appId: APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v20.0'
      });
    };
  }, []);

  const handleSetupAccount = () => {
    if (typeof FB === 'undefined') {
      toast.error('Facebook SDK is not loaded yet.');
      return;
    }
  
    FB.login((response) => {
      if (response.authResponse) {
        const accessToken = response.authResponse.accessToken;
        setAccessToken(accessToken);
  
        // Fetch ALL Business Manager IDs the user selects
        FB.api('/me/businesses', 'GET', { access_token: accessToken }, (response) => {
          if (response && !response.error) {
            if (response.data && response.data.length > 0) {
              const businessManagerIds = response.data.map(bm => bm.id);
              setBusinessManagerId(businessManagerIds);
              console.log('Selected Business Managers:', businessManagerIds);
        
              // Open the popup ONLY after setting the business managers
              setShowPopup(true);
            } else {
              console.log('No Business Manager found');
              toast.error('You must be associated with a Business Manager to proceed.');
            }
          } else {
            console.error('Error fetching BMs:', response.error);
            toast.error('Failed to retrieve Business Manager data.');
          }
        });        
  
        setShowPopup(true); // Open the ad account selection modal
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
      const isAdAccountValid = await verifyField(`${apiUrl}/auth/verify_ad_account`, {
        ad_account_id: adAccount,
        access_token: accessToken,
      });
  
      if (isAdAccountValid) {
        const exchangeResponse = await axios.post(
          `${apiUrl}/config/ad_account/${activeAccount.id}/exchange-token`,
          { access_token: accessToken },
          { withCredentials: true }
        );
  
        if (exchangeResponse.status === 200 && exchangeResponse.data.long_lived_token) {
          const updatedAdAccountDetails = {
            ad_account_id: adAccount,
            facebook_page_id: page || '',
            pixel_id: pixel || '',
            access_token: exchangeResponse.data.long_lived_token,
            app_id: APP_ID,
            app_secret: APP_SECRET,
            business_manager_id: businessManagerId
          };
  
          const saveResponse = await axios.post(
            `${apiUrl}/auth/ad_account`,
            { id: activeAccount.id, ...updatedAdAccountDetails },
            { withCredentials: true }
          );
  
          if (saveResponse.status === 200) {
            toast.success('Ad account updated successfully');

            const updatedAccountResponse = await axios.get(`${apiUrl}/auth/ad_account/${activeAccount.id}`, { withCredentials: true });
            setActiveAccount(updatedAccountResponse.data);
            onClose();
            localStorage.setItem('activeAccount', JSON.stringify(updatedAccountResponse.data));
  
            setTimeout(() => {
              window.location.reload(); // Refresh the UI with new data
            }, 700);
          }
        } else {
          toast.error('Failed to exchange token.');
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

  return (
    <div>
      {!showPopup && (
        <div className={styles.modalContainer}>
          <div className={styles.interactionBlockingOverlay}></div>
          <div ref={modalRef} className={styles.modal}>
            {/* <button className={styles.closeIcon} onClick={onClose}>
              &times;
            </button> */}
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
            businessManagerId={businessManagerId}
          />
        </div>
      )}
    </div>
  );
};

export default SetupAdAccountModal;
