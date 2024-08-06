import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import CampaignForm from '../Forms/CampaignForm';
import ConfigForm from '../Forms/ConfigForm';
import ProgressBar from '../ProgressBar/ProgressBar';
import SuccessScreen from '../SuccessScreen';
import ScopedGlobalStyle from './MainStyles';

const socket = io('http://91.108.112.100/5001');

const getDefaultStartTime = () => {
  const startTime = new Date();
  startTime.setUTCDate(startTime.getUTCDate() + 1);
  startTime.setUTCHours(4, 0, 0, 0);
  return startTime.toISOString().slice(0, 16);
};

const getDefaultEndTime = () => {
  const endTime = new Date();
  endTime.setUTCDate(endTime.getUTCDate() + 2);
  endTime.setUTCHours(4, 0, 0, 0);
  return endTime.toISOString().slice(0, 16);
};

const Main = ({ activeAccount }) => {
  const [formId, setFormId] = useState('mainForm');
  const [previousForm, setPreviousForm] = useState('mainForm');
  const [progress, setProgress] = useState(0);
  const [stepVisible, setStepVisible] = useState(false);
  const [step, setStep] = useState('');
  const [config, setConfig] = useState({
    objective: 'OUTCOME_SALES',
    campaign_budget_optimization: 'AD_SET_BUDGET_OPTIMIZATION',
    budget_value: '50.73',
    campaign_bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    buying_type: 'AUCTION',
    object_store_url: '',
    location: 'GB',
    age_range_min: '30',
    age_range_max: '65',
    gender: 'All',
    app_events: getDefaultStartTime(),
    ad_creative_primary_text: '',
    ad_creative_headline: '',
    ad_creative_description: '',
    call_to_action: 'SHOP_NOW',
    destination_url: '',
    url_parameters: '',
    ad_set_budget_value: '50.73',
    ad_format: 'Single image or video',
    bid_amount: '5.0',
    end_time: getDefaultEndTime(),
    ad_set_bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
    prediction_id: '',
  });
  const [taskId, setTaskId] = useState(null);
  const [uploadController, setUploadController] = useState(null);
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    let progressData = null;
    let logInterval = null;

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    socket.on('progress', (data) => {
      if (data.task_id === taskId) {
        progressData = data;
        setProgress(data.progress);
        setStep(data.step);
        setStepVisible(true);
        console.log('Received progress:', data);
      }
    });

    socket.on('task_complete', (data) => {
      if (data.task_id === taskId) {
        clearInterval(logInterval);
        setFormId('successScreen');
      }
    });

    socket.on('error', (data) => {
      if (data.task_id === taskId) {
        clearInterval(logInterval);
        alert(`Error: ${data.message}`);
        setFormId('mainForm');
      }
    });

    logInterval = setInterval(() => {
      if (progressData) {
        console.log('Progress:', progressData.progress, 'Step:', progressData.step);
      }
    }, 500);

    return () => {
      clearInterval(logInterval);
      socket.off('connect');
      socket.off('disconnect');
      socket.off('progress');
      socket.off('task_complete');
      socket.off('error');
    };
  }, [taskId]);

  const handleShowForm = (formId) => {
    setPreviousForm(formId === 'configForm' ? previousForm : formId);
    setFormId(formId);
    if (formId !== 'mainForm') setShowHeader(false);
    else setShowHeader(true);
  };

  const handleEditConfig = () => {
    setPreviousForm(formId);
    setFormId('configForm');
  };

  const handleSaveConfig = (newConfig) => {
    setConfig(newConfig);
    setFormId(previousForm);
  };

  const handleCancelConfig = () => {
    setFormId(previousForm);
  };

  const handleCancel = () => {
    if (uploadController) {
      uploadController.abort();
      setUploadController(null);
    }

    if (taskId) {
      fetch('http://91.108.112.100/5001/cancel_task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
          setFormId('mainForm');
        })
        .catch((error) => {
          alert('An error occurred while canceling the upload');
          setFormId('mainForm');
        });
    }
  };

  const handleSubmit = (formData, isNewCampaign) => {
    const taskId = `task-${Math.random().toString(36).substr(2, 9)}`;
    setTaskId(taskId);
    formData.append('task_id', taskId);

    console.log('activeAccount:', activeAccount);

    if (!activeAccount || !activeAccount.ad_account_id) {
      alert('Ad account details are missing.');
      return;
    }

    // Use activeAccount's Facebook settings
    const adAccountConfig = {
      ad_account_id: activeAccount.ad_account_id,
      pixel_id: activeAccount.pixel_id,
      facebook_page_id: activeAccount.facebook_page_id,
      app_id: activeAccount.app_id,
      app_secret: activeAccount.app_secret,
      access_token: activeAccount.access_token,
    };

    // Merge activeAccount's config with the current config
    const finalConfig = { ...config, ...adAccountConfig };

    // Append all config values to formData
    Object.keys(finalConfig).forEach((key) => {
      formData.append(key, finalConfig[key]);
    });

    if (finalConfig.buying_type === 'RESERVED' && finalConfig.prediction_id) {
      formData.append('prediction_id', finalConfig.prediction_id);
    }

    const controller = new AbortController();
    setUploadController(controller);

    setProgress(0);
    setStepVisible(false);

    fetch('http://91.108.112.100/5001/create_campaign', {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
          setFormId('mainForm');
        }
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('Upload canceled by user');
        } else {
          alert('An error occurred while creating the campaign');
        }
        setFormId('mainForm');
      });

    handleShowForm('progress');
  };

  return (
    <div className="container">
      <ScopedGlobalStyle />
      {showHeader && <h1>Facebook Ads Manager</h1>}
      {formId === 'mainForm' && (
        <div className="form-container">
          <button className="option-button" onClick={() => handleShowForm('newCampaignForm')}>Create New Campaign</button>
          <button className="option-button" onClick={() => handleShowForm('existingCampaignForm')}>Use Existing Campaign</button>
        </div>
      )}
      {formId === 'newCampaignForm' && (
        <CampaignForm
          formId="newCampaign"
          onSubmit={handleSubmit}
          onEditConfig={handleEditConfig}
          onGoBack={() => handleShowForm('mainForm')}
          isNewCampaign={true}
          activeAccount={activeAccount}  // Pass activeAccount here
        />
      )}
      {formId === 'existingCampaignForm' && (
        <CampaignForm
          formId="existingCampaign"
          onSubmit={handleSubmit}
          onEditConfig={handleEditConfig}
          onGoBack={() => handleShowForm('mainForm')}
          isNewCampaign={false}
          activeAccount={activeAccount}  // Pass activeAccount here
        />
      )}

      {formId === 'configForm' && (
        <ConfigForm
          initialConfig={config}
          onSaveConfig={handleSaveConfig}
          onCancel={handleCancelConfig}
          isNewCampaign={previousForm === 'newCampaignForm'}
        />
      )}
      {formId === 'progress' && (
        <div className="progress-container">
          <ProgressBar progress={progress} step={step} stepVisible={stepVisible} />
          <button className="cancel-button" onClick={handleCancel}>Cancel</button>
        </div>
      )}
      {formId === 'successScreen' && (
        <SuccessScreen onGoBack={() => handleShowForm('mainForm')} />
      )}
    </div>
  );
};

export default Main;
