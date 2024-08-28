
/* global FB */

import React, { useState, useEffect } from 'react';
import styles from './SetupAdAccountPopup.module.css';

const SetupAdAccountPopup = ({ onClose, onSubmit, accessToken }) => {
  const [step, setStep] = useState(1);
  const [adAccounts, setAdAccounts] = useState([]);
  const [pages, setPages] = useState([]);
  const [pixels, setPixels] = useState([]);
  const [selectedAdAccount, setSelectedAdAccount] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);
  const [selectedPixel, setSelectedPixel] = useState(null);

  useEffect(() => {
    if (step === 1) {
      fetchAdAccounts();
    } else if (step === 2) {
      fetchPages();
    } else if (step === 3) {
      fetchPixels();
    }
  }, [step]);

  const fetchAdAccounts = () => {
    FB.api('/me/adaccounts', 'GET', { access_token: accessToken }, (response) => {
      if (response && !response.error) {
        setAdAccounts(response.data);
      } else {
        console.error('Error fetching ad accounts:', response.error);
      }
    });
  };

  const fetchPages = () => {
    FB.api('/me/accounts', 'GET', { access_token: accessToken }, (response) => {
      if (response && !response.error) {
        setPages(response.data);
      } else {
        console.error('Error fetching pages:', response.error);
      }
    });
  };

  const fetchPixels = () => {
    // Assuming adAccount ID is required to fetch pixels
    if (selectedAdAccount) {
      FB.api(`/${selectedAdAccount}/adspixels`, 'GET', { access_token: accessToken }, (response) => {
        if (response && !response.error) {
          setPixels(response.data);
        } else {
          console.error('Error fetching pixels:', response.error);
        }
      });
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onSubmit(selectedAdAccount, selectedPage, selectedPixel);
      onClose();
    }
  };

  return (
    <div className={styles.popupContainer}>
      <div className={styles.popupContent}>
        {step === 1 && (
          <div>
            <h3>Select Ad Account</h3>
            {adAccounts.map((account) => (
              <button key={account.id} onClick={() => setSelectedAdAccount(account.id)}>
                {account.name}
              </button>
            ))}
          </div>
        )}
        {step === 2 && (
          <div>
            <h3>Select Page</h3>
            {pages.map((page) => (
              <button key={page.id} onClick={() => setSelectedPage(page.id)}>
                {page.name}
              </button>
            ))}
          </div>
        )}
        {step === 3 && (
          <div>
            <h3>Select Pixel</h3>
            {pixels.map((pixel) => (
              <button key={pixel.id} onClick={() => setSelectedPixel(pixel.id)}>
                {pixel.name}
              </button>
            ))}
          </div>
        )}
        <button onClick={handleNext}>
          {step < 3 ? 'Next' : 'Submit'}
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SetupAdAccountPopup;
