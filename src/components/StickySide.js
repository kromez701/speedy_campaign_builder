// src/components/StickySide.js
import React, { useState, useEffect } from 'react';
import './StickySide.css';

const StickySide = () => {
  const [activeAccount, setActiveAccount] = useState(null);
  const [adAccounts, setAdAccounts] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

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

  return (
    <div>
      <div className="hamburger-icon" onClick={toggleSidebar}>
        <img src={isSidebarOpen ? "./assets/x.svg" : "./assets/Vector2.png"} alt="Menu" />
      </div>
      <div className={`sidebar-container ${isSidebarOpen ? 'open' : ''}`}>
        <div>
          <div className="logo">
            <img src="./assets/logo-footer.png" alt="Logo" className="logo-image" />
          </div>
          <hr className="horizontal-rule" />
          <div className="accounts-container">
            {adAccounts.map((account, index) => (
              <button
                key={index}
                className={`account-button ${activeAccount === index ? 'active' : ''}`}
                onClick={() => handleAccountClick(index)}
              >
                <img src="./assets/user-round.png" alt="User Icon" className="icon" /> {account}
              </button>
            ))}
          </div>
          <hr className="horizontal-rule" />
          <div className="dropdown-section">
            <div className="section-header" onClick={handleDropdownToggle}>
              <div className="section-title">Facebook Setting</div>
              <img 
                src="./assets/Vector.png" 
                alt="Dropdown Icon" 
                className={`dropdown-icon ${isDropdownVisible ? 'rotated' : ''}`}
              />
            </div>
            {isDropdownVisible && (
              <div className="dropdown-content">
                <div className="dropdown-row">
                  <input className="input input1" placeholder="Ad Account ID" />
                  <hr className="horizontal-rule1" />
                </div>
                <div className="dropdown-row">
                  <input className="input" placeholder="Pixel ID" />
                  <hr className="horizontal-rule1" />
                </div>
                <div className="dropdown-row">
                  <input className="input" placeholder="Facebook Page ID" />
                  <hr className="horizontal-rule1" />
                </div>
                <div className="dropdown-row">
                  <input className="input" placeholder="App ID" />
                  <hr className="horizontal-rule1" />
                </div>
                <div className="dropdown-row">
                  <input className="input" placeholder="App Secret" />
                  <hr className="horizontal-rule1" />
                </div>
                <div className="dropdown-row">
                  <input className="input" placeholder="Access Token" />
                  <hr className="horizontal-rule1" />
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <button className="upgrade-button">Upgrade Plan</button>
          <div className="footer">
            0 Ad account left on professional plan
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickySide;
