import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ConfigForm from './ConfigForm';
import ScopedGlobalStyle from './CampaignFormStyles';
import axios from 'axios';

const CampaignForm = ({ formId, onSubmit, initialConfig = {}, isNewCampaign, onGoBack, activeAccount }) => {
  const [campaignName, setCampaignName] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [savedConfig, setSavedConfig] = useState(initialConfig);
  const [isActiveSubscription, setIsActiveSubscription] = useState(false);
  const [activeAdAccountsCount, setActiveAdAccountsCount] = useState(0);
  const [userPlan, setUserPlan] = useState(''); // Added state for user plan

  useEffect(() => {
    // Fetch subscription status for the active ad account
    const fetchSubscriptionStatus = async () => {
      if (activeAccount) {
        try {
          const response = await axios.get(`http://91.108.112.100:8080/payment/subscription-status/${activeAccount.id}`, { withCredentials: true });
          setIsActiveSubscription(response.data.is_active);
        } catch (error) {
          console.error('Error fetching subscription status:', error);
          setIsActiveSubscription(false);
        }
      }
    };

    fetchSubscriptionStatus();
  }, [activeAccount]);

  useEffect(() => {
    // Fetch user's subscription plan
    const fetchUserPlan = async () => {
      try {
        const response = await axios.get('http://91.108.112.100:8080/payment/user-subscription-status', { withCredentials: true });
        setUserPlan(response.data.plan);
      } catch (error) {
        console.error('Error fetching user plan:', error);
      }
    };

    fetchUserPlan();
  }, []);

  useEffect(() => {
    if (isActiveSubscription) {
      // Fetch the count of active ad accounts for the current user
      const fetchActiveAdAccountsCount = async () => {
        try {
          const response = await axios.get('http://91.108.112.100:8080/payment/active-ad-accounts', { withCredentials: true });
          setActiveAdAccountsCount(response.data.count);
        } catch (error) {
          console.error('Error fetching active ad accounts count:', error);
        }
      };

      fetchActiveAdAccountsCount();
    }
  }, [isActiveSubscription]);

  const handleSaveConfig = (config) => {
    setSavedConfig(config);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if user's plan is Enterprise and if there is an active subscription
    if ( !isActiveSubscription) {
      alert('Please choose a subscription plan for the selected ad account before creating an ad.');
      return;
    }

    if (userPlan === 'Enterprise' && activeAdAccountsCount < 2) {
      alert('Please purchase a second ad account to activate and enjoy the Enterprise plan.');
      return;
    }

    const formData = new FormData(event.target);

    if (formId === 'newCampaign') {
      formData.append('campaign_name', campaignName);
    } else {
      formData.append('campaign_id', campaignId);
    }

    for (const [key, value] of Object.entries(savedConfig)) {
      formData.append(key, value);
    }

    onSubmit(formData, formId === 'newCampaign');
  };

  return (
    <div className="form-container2">
      <ScopedGlobalStyle />
      <div className="header">
        <img
          src="/assets/Vector4.png"
          alt="Go Back"
          className="go-back-icon"
          onClick={onGoBack}
        />
        <h2>{formId === 'newCampaign' ? 'Create New Campaign' : 'Use Existing Campaign'}</h2>
      </div>
      <form id={formId} onSubmit={handleSubmit} encType="multipart/form-data">
        {formId === 'newCampaign' ? (
          <>
            <label htmlFor="campaignName">Campaign Name:</label>
            <input
              type="text"
              id="campaignName"
              name="campaignName"
              placeholder='Enter Name'
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              required
            />
          </>
        ) : (
          <>
            <label htmlFor="campaignId">Campaign ID:</label>
            <input
              type="text"
              id="campaignId"
              name="campaignId"
              placeholder='Enter Id'
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              required
            />
          </>
        )}

        <label htmlFor="uploadFolders">Upload Folders:</label>
        <input type="file" id="uploadFolders" name="uploadFolders" webkitdirectory="true" directory="true" multiple required />

        <ConfigForm initialConfig={initialConfig} isNewCampaign={isNewCampaign} onSaveConfig={handleSaveConfig} />

        <div className='button-container2'>
          <button type="submit" className="create-ad-button">Create Ad</button>
          <button type="button" className="go-back-button" onClick={onGoBack}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

CampaignForm.propTypes = {
  formId: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialConfig: PropTypes.object,
  isNewCampaign: PropTypes.bool.isRequired,
  onGoBack: PropTypes.func.isRequired,
  activeAccount: PropTypes.object.isRequired, // Prop for activeAccount
};

export default CampaignForm;
