import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ConfigForm from './ConfigForm';
import './CampaignForm.css';

const CampaignForm = ({ formId, onSubmit, initialConfig = {}, isNewCampaign, onSaveConfig, onGoBack }) => {
  const [campaignName, setCampaignName] = useState('');
  const [campaignId, setCampaignId] = useState('');
  console.log("isNewCampaign: \n", isNewCampaign);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    if (formId === 'newCampaign') {
      formData.append('campaign_name', campaignName);
    } else {
      formData.append('campaign_id', campaignId);
    }

    onSubmit(formData, formId === 'newCampaign');
  };

  return (
    <div className="form-container2">
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

        <ConfigForm initialConfig={initialConfig} isNewCampaign={isNewCampaign} onSaveConfig={onSaveConfig} />

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
  onSaveConfig: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired,
};

export default CampaignForm;
