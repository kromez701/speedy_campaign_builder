import React, { useState, useEffect, useRef } from 'react';
import styles from './StickySide.module.css';

const StickySide = () => {
  const [activeAccount, setActiveAccount] = useState(null);
  const [adAccounts, setAdAccounts] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    // Fetch accounts from backend (example data for now)
    const fetchedAccounts = ["Ad Account 1", "Ad Account 2"];
    setAdAccounts(fetchedAccounts);
  }, []);

  const handleAccountClick = (index) => {
    setActiveAccount(index);
  };

  const handleDropdownToggle = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleOverlayClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div>
      <div className={styles.hamburgerIcon} onClick={toggleSidebar}>
        <img src={isSidebarOpen ? "./assets/x.svg" : "./assets/Vector2.png"} alt="Menu" />
      </div>
      {isSidebarOpen && <div className={styles.overlay} onClick={handleOverlayClick}></div>}
      <div ref={sidebarRef} className={`${styles.sidebarContainer} ${isSidebarOpen ? styles.open : ''}`}>
        <div>
          <div className={styles.logo}>
            <img src="./assets/logo-footer.png" alt="Logo" className={styles.logoImage} />
          </div>
          <hr className={styles.horizontalRule} />
          <div className={styles.accountsContainer}>
            {adAccounts.map((account, index) => (
              <button
                key={index}
                className={`${styles.accountButton} ${activeAccount === index ? styles.active : ''}`}
                onClick={() => handleAccountClick(index)}
              >
                <img src="./assets/user-round.png" alt="User Icon" className={styles.icon} /> {account}
              </button>
            ))}
          </div>
          <hr className={styles.horizontalRule} />
          <div className={styles.dropdownSection}>
            <div className={styles.sectionHeader} onClick={handleDropdownToggle}>
              <div className={styles.sectionTitle}>Facebook Setting</div>
              <img 
                src="./assets/Vector.png" 
                alt="Dropdown Icon" 
                className={`${styles.dropdownIcon} ${isDropdownVisible ? styles.rotated : ''}`}
              />
            </div>
            {isDropdownVisible && (
              <div className={styles.dropdownContent}>
                <div className={styles.dropdownRow}>
                  <input className={`${styles.input} ${styles.input1}`} placeholder="Ad Account ID" />
                  <hr className={styles.horizontalRule1} />
                </div>
                <div className={styles.dropdownRow}>
                  <input className={styles.input} placeholder="Pixel ID" />
                  <hr className={styles.horizontalRule1} />
                </div>
                <div className={styles.dropdownRow}>
                  <input className={styles.input} placeholder="Facebook Page ID" />
                  <hr className={styles.horizontalRule1} />
                </div>
                <div className={styles.dropdownRow}>
                  <input className={styles.input} placeholder="App ID" />
                  <hr className={styles.horizontalRule1} />
                </div>
                <div className={styles.dropdownRow}>
                  <input className={styles.input} placeholder="App Secret" />
                  <hr className={styles.horizontalRule1} />
                </div>
                <div className={styles.dropdownRow}>
                  <input className={styles.input} placeholder="Access Token" />
                  <hr className={styles.horizontalRule1} />
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <button className={styles.upgradeButton}>Upgrade Plan</button>
          <div className={styles.footer}>
            0 Ad account left on professional plan
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickySide;
