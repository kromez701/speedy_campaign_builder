import React, { useState, useEffect, useRef } from 'react';
import styles from './SetupAdAccountPopup.module.css';

const SetupAdAccountPopup = ({ onClose, onSubmit, accessToken, businessManagerId }) => {
  const [adAccounts, setAdAccounts] = useState([]);
  const [selectedAdAccount, setSelectedAdAccount] = useState('');
  const [selectedAdAccountName, setSelectedAdAccountName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
          `https://graph.facebook.com/v10.0/${bmId}/client_ad_accounts?fields=account_id&access_token=${accessToken}`
        );
        const data = await response.json();

        console.log(`Fetched Ad Accounts for BM ${bmId}:`, data);

        if (data.data) {
          allAdAccounts = [...allAdAccounts, ...data.data]; // Append all fetched ad accounts
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
    onSubmit(selectedAdAccount, selectedAdAccountName);
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
    setDropdownOpen(!dropdownOpen);
  };

  const handleSelect = (id, name) => {
    setSelectedAdAccount(id);
    setSelectedAdAccountName(name);
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
                <div className={styles.dropdownHeader} onClick={toggleDropdown}>
                  {selectedAdAccountName ? selectedAdAccountName : 'Select an ad account'}
                </div>
                {dropdownOpen && (
                  <div className={styles.dropdownList}>
                    {adAccounts.map((account) => (
                      <div
                        key={account.account_id}
                        className={styles.dropdownItem}
                        onClick={() => handleSelect(account.account_id, account.name)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedAdAccount === account.account_id}
                          onChange={() => handleSelect(account.account_id, account.name)}
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
            <button onClick={handleSubmit} className={styles.primaryButton} disabled={!selectedAdAccount}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupAdAccountPopup;
