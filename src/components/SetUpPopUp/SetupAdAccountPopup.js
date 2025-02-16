import React, { useState, useEffect, useRef } from 'react';
import styles from './SetupAdAccountPopup.module.css';

const SetupAdAccountPopup = ({ onClose, onSubmit, accessToken, businessManagerId }) => {
  const [adAccounts, setAdAccounts] = useState([]);
  const [selectedAdAccount, setSelectedAdAccount] = useState('');
  const [selectedAdAccountName, setSelectedAdAccountName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedBMId, setSelectedBMId] = useState('');
  const popupRef = useRef(null);

  useEffect(() => {
    if (accessToken && businessManagerId.length > 0) {
      fetchAdAccounts();
    }
  }, [accessToken, businessManagerId]);

  const fetchAdAccounts = async () => {
    if (!businessManagerId || businessManagerId.length === 0) return;
  
    try {
      let allAdAccounts = [];
  
      for (const bmId of businessManagerId) {
        const response = await fetch(
          `https://graph.facebook.com/v19.0/248897937257515/client_ad_accounts?fields=name,account_id,id&access_token=EAAXhzWxOOIwBO0G8o4ITBE9yzI4ZB0mTGM5N4oKji0wQdrIZAl5GibzgiJZAO2B7rYjNnwnzn93NsZBhCYugzME7FAUjMZC4QpdN44UAOcyllZB74nyu79Lw1Batr0eRwDSrg62HUTZC85HuOZBXLxYkgWUHrHPjVJRa7XwTzp3rywf3gGkEBQ0m2EhY`
        );
        const data = await response.json();
  
        // console.log(`Fetched Ad Accounts for BM ${bmId}:`, data);
  
        if (data.data) {
          const adAccountsWithBM = data.data.map(account => ({
            ...account,
            business_manager_id: bmId // Associate BM ID with each account
          }));
          allAdAccounts = [...allAdAccounts, ...adAccountsWithBM];
        }
      }
  
      const uniqueAdAccounts = Array.from(
        new Map(allAdAccounts.map((account) => [account.account_id, account])).values()
      );
  
      setAdAccounts(uniqueAdAccounts);
    } catch (error) {
      console.error("Error fetching ad accounts:", error);
    }
  };  

  const handleSubmit = () => {
    onSubmit(selectedAdAccount, selectedAdAccountName, selectedBMId);
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

  const toggleDropdown = () => {
    if (adAccounts.length > 0) {
      setDropdownOpen(!dropdownOpen);
    }
  };

  const handleSelect = (id, name, bmId) => {
    setSelectedAdAccount(id);
    setSelectedAdAccountName(name);
    setSelectedBMId(bmId);  // Store the BM ID
    setDropdownOpen(false);
  };  

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent} ref={popupRef}>
        <div className={styles.leftSide}>
          <h3>“QuickCampaigns Makes It Incredibly Easy To Create Multiple Campaigns With Just One Click, Saving You Countless Hours Of Work.”</h3>
        </div>
        <div className={styles.rightSide}>
          <div className={`${styles.stepContent} ${styles.active}`}>
            <h3>Which Ad Account Will You Be Using?</h3>
            <p>You'll be able to create and manage campaigns with this ad account.</p>
            <div className={styles.dropdownContainer}>
              <div className={styles.customDropdown}>
                <div 
                  className={`${styles.dropdownHeader} ${adAccounts.length === 0 ? styles.disabledDropdown : ''}`}
                  onClick={toggleDropdown}
                >
                  {adAccounts.length === 0 
                    ? "BM has access to no ad account"
                    : selectedAdAccountName || "Select an ad account"}
                </div>
                {dropdownOpen && adAccounts.length > 0 && (
                  <div className={styles.dropdownList}>
                  {adAccounts.map((account) => (
                    <div
                      key={account.account_id}
                      className={styles.dropdownItem}
                      onClick={() => handleSelect(account.account_id, account.name, account.business_manager_id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAdAccount === account.account_id}
                        onChange={() => handleSelect(account.account_id, account.name, account.business_manager_id)}
                      />
                      <span>{account.name}</span>
                    </div>
                  ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.TheButtons}>
            <button 
              onClick={onClose} 
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit} 
              className={styles.primaryButton} 
              disabled={!selectedAdAccount}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupAdAccountPopup;
