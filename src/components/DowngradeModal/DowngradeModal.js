import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./DowngradeModal.module.css";
import config from "../../config";

const apiUrl = config.apiUrl;

const DowngradeModal = ({ onCancel, onConfirm }) => {
  const [adAccounts, setAdAccounts] = useState([]);
  const [selectedAdAccount, setSelectedAdAccount] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdAccounts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/ad_accounts`, {
          withCredentials: true,
        });

        const fetchedAccounts = response.data.ad_accounts;

        if (fetchedAccounts.length === 0) {
          toast.error("No ad accounts available.");
          setIsLoading(false);
          return;
        }

        // Fetch details for each account
        const accountDetailsPromises = fetchedAccounts.map(async (account, index) => {
          try {
            const detailsResponse = await axios.get(
              `${apiUrl}/auth/ad_account/${account.id}`, 
              { withCredentials: true }
            );
            return {
              id: account.id,
              name: detailsResponse.data.name || `Ad Account ${index + 1}` // Ensure we get the correct name
            };
          } catch (error) {
            console.error(`Error fetching details for account ${account.id}:`, error);
            return { id: account.id, name: `Ad Account ${index + 1}` }; // Fallback name
          }
        });

        const detailedAccounts = await Promise.all(accountDetailsPromises);

        setAdAccounts(detailedAccounts);
        setSelectedAdAccount(detailedAccounts[0].id); // Default to the first account
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching ad accounts:", error);
        toast.error("Error fetching ad accounts.");
        setIsLoading(false);
      }
    };

    fetchAdAccounts();
  }, []);

  const handleConfirm = () => {
    if (!selectedAdAccount) {
      toast.warning("Please select an ad account.");
      return;
    }

    onConfirm(selectedAdAccount);
  };

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>Choose an Ad Account to Retain</h3>
        
        {isLoading ? (
          <p>Loading ad accounts...</p>
        ) : (
          <select
            className={styles.dropdown}
            value={selectedAdAccount}
            onChange={(e) => setSelectedAdAccount(e.target.value)}
          >
            {adAccounts.map((account, index) => (
              <option key={account.id} value={account.id}>
                {`${index + 1} - ${account.name}`} {/* Correctly formatted */}
              </option>
            ))}
          </select>
        )}

        <div className={styles.buttonContainer}>
          <button className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.confirmButton} onClick={handleConfirm} disabled={!selectedAdAccount}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DowngradeModal;
