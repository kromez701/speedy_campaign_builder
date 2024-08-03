import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ConfigForm from './ConfigForm';
import ScopedGlobalStyle from './CampaignFormStyles';
import axios from 'axios'; // Import axios for making API requests

const CampaignForm = ({ formId, onSubmit, initialConfig = {}, isNewCampaign, onGoBack }) => {
  const [campaignName, setCampaignName] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [savedConfig, setSavedConfig] = useState(initialConfig);
  const [isActiveSubscription, setIsActiveSubscription] = useState(false); // New state for subscription status

  useEffect(() => {
    // Fetch subscription status from the backend
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/payment/subscription-status', { withCredentials: true });
        setIsActiveSubscription(response.data.is_active); // Set subscription status
      } catch (error) {
        console.error('Error fetching subscription status:', error);
        setIsActiveSubscription(false); // Default to false if there's an error
      }
    };

    fetchSubscriptionStatus();
  }, []);

  const handleSaveConfig = (config) => {
    setSavedConfig(config);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isActiveSubscription) {
      alert('Kindly subscribe to a plan to enjoy this feature');
      return; // Prevent form submission if no active subscription
    }

    const formData = new FormData(event.target);

    if (formId === 'newCampaign') {
      formData.append('campaign_name', campaignName);
    } else {
      formData.append('campaign_id', campaignId);
    }

    // Append saved config to formData or use it as needed
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
};

export default CampaignForm;