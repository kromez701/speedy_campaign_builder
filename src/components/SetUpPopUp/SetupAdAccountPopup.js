import React, { useState, useEffect, useRef } from 'react';
import styles from './SetupAdAccountPopup.module.css';

const SetupAdAccountPopup = ({ onClose, onSubmit, accessToken }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [adAccounts, setAdAccounts] = useState([]);
  const [pages, setPages] = useState([]);
  const [pixels, setPixels] = useState([]);
  const [selectedAdAccount, setSelectedAdAccount] = useState('');
  const [selectedAdAccountName, setSelectedAdAccountName] = useState('');
  const [selectedPage, setSelectedPage] = useState('');
  const [selectedPageName, setSelectedPageName] = useState('');
  const [selectedPixel, setSelectedPixel] = useState('');
  const [selectedPixelName, setSelectedPixelName] = useState('');

  // State for managing dropdown visibility
  const [dropdownOpen, setDropdownOpen] = useState({
    adAccount: false,
    page: false,
    pixel: false,
  });

  const popupRef = useRef(null);

  useEffect(() => {
    if (accessToken) {
      fetchAdAccounts();
      fetchPages();
    }
  }, [accessToken]);

  useEffect(() => {
    if (currentStep === 3 && selectedAdAccount) {
      fetchPixels();
    }
  }, [currentStep, selectedAdAccount]);

  const fetchAdAccounts = async () => {
    try {
      const response = await fetch(`https://graph.facebook.com/v10.0/me/adaccounts?access_token=${accessToken}`);
      const data = await response.json();
      setAdAccounts(data.data || []);
    } catch (error) {
      console.error('Error fetching ad accounts:', error);
    }
  };

  const fetchPages = async () => {
    try {
      const response = await fetch(`https://graph.facebook.com/v10.0/me/accounts?access_token=${accessToken}`);
      const data = await response.json();
      setPages(data.data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  };

  const fetchPixels = async () => {
    try {
      const response = await fetch(`https://graph.facebook.com/v10.0/${selectedAdAccount}/adspixels?access_token=${accessToken}`);
      const data = await response.json();
      setPixels(data.data || []);
    } catch (error) {
      console.error('Error fetching pixels:', error);
    }
  };

  const handleNext = () => {
    if ((currentStep === 1 && selectedAdAccount) || 
        (currentStep === 2 && selectedPage) || 
        currentStep === 3) {
      setCurrentStep((prevStep) => Math.min(prevStep + 1, 3));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const handleSubmit = () => {
    onSubmit(selectedAdAccount, selectedPage, selectedPixel);
  };

  const handleClickOutside = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (field) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSelect = (field, id, name) => {
    if (field === 'adAccount') {
      setSelectedAdAccount(id);
      setSelectedAdAccountName(name);
    }
    if (field === 'page') {
      setSelectedPage(id);
      setSelectedPageName(name);
    }
    if (field === 'pixel') {
      setSelectedPixel(id);
      setSelectedPixelName(name);
    }

    setDropdownOpen((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent} ref={popupRef}>
        <div className={styles.leftSide}>
          <h3>“QuickCampaigns makes it super easy to create and manage ad campaigns. It's efficient, fast, and gets the job done without hassle.”</h3>
        </div>
        <div className={styles.rightSide}>
          <div className={styles.stepIndicator}>
            <div
              className={`${currentStep === 1 ? styles.active : ''}`}
              onClick={() => setCurrentStep(1)}
            ></div>
            <div
              className={`${currentStep === 2 ? styles.active : ''}`}
              onClick={() => setCurrentStep(2)}
            ></div>
            <div
              className={`${currentStep === 3 ? styles.active : ''}`}
              onClick={() => setCurrentStep(3)}
            ></div>
          </div>

          {currentStep === 1 && (
            <div className={`${styles.stepContent} ${styles.active}`}>
              <h3>Which ad account will you be using?</h3>
              <p>You'll be able to create and manage campaigns with this ad account.</p>
              <div className={styles.dropdownContainer}>
                <div className={styles.customDropdown}>
                  <div
                    className={styles.dropdownHeader}
                    onClick={() => toggleDropdown('adAccount')}
                  >
                    {selectedAdAccountName ? selectedAdAccountName : 'Select an ad account'}
                  </div>
                  {dropdownOpen.adAccount && (
                    <div className={styles.dropdownList}>
                      {adAccounts.map((account) => (
                        <div
                          key={account.id}
                          className={styles.dropdownItem}
                          onClick={() => handleSelect('adAccount', account.id, account.name)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedAdAccount === account.id}
                            onChange={() => handleSelect('adAccount', account.id, account.name)}
                          />
                          <span>{account.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className={`${styles.stepContent} ${styles.active}`}>
              <h3>Select your Facebook Page</h3>
              <p>Select the Facebook page that you want to link to this ad account. This will be used to create your ads.</p>
              <div className={styles.dropdownContainer}>
                <div className={styles.customDropdown}>
                  <div
                    className={styles.dropdownHeader}
                    onClick={() => toggleDropdown('page')}
                  >
                    {selectedPageName ? selectedPageName : 'Select a page'}
                  </div>
                  {dropdownOpen.page && (
                    <div className={styles.dropdownList}>
                      {pages.map((page) => (
                        <div
                          key={page.id}
                          className={styles.dropdownItem}
                          onClick={() => handleSelect('page', page.id, page.name)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedPage === page.id}
                            onChange={() => handleSelect('page', page.id, page.name)}
                          />
                          <span>{page.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className={`${styles.stepContent} ${styles.active}`}>
              <h3>Select your Pixel</h3>
              <p>Choose the Pixel that will be used to track the performance of your ad campaigns.</p>
              <div className={styles.dropdownContainer}>
                <div className={styles.customDropdown} onClick={() => toggleDropdown('pixel')}>
                  <div className={styles.dropdownHeader}>
                    {selectedPixelName ? selectedPixelName : 'Select a pixel'}
                  </div>
                  {dropdownOpen.pixel && (
                    <div className={styles.dropdownList}>
                      {pixels.map((pixel) => (
                        <div
                          key={pixel.id}
                          className={styles.dropdownItem}
                          onClick={() => handleSelect('pixel', pixel.id, pixel.name)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedPixel === pixel.id}
                            onChange={() => handleSelect('pixel', pixel.id, pixel.name)}
                          />
                          <span>{pixel.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className={styles.TheButtons}>
            {currentStep > 1 && <button onClick={handlePrev} className={styles.primaryButton}>Previous</button>}
            {currentStep < 3 && (
              <button
                onClick={handleNext}
                className={styles.primaryButton}
                disabled={
                  (!selectedAdAccount && currentStep === 1) ||
                  (!selectedPage && currentStep === 2)
                }
              >
                Next
              </button>
            )}
            {currentStep === 3 && <button onClick={handleSubmit} className={styles.primaryButton}>Submit</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupAdAccountPopup;
