import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import ConfigForm from "./ConfigForm";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../Forms/CampaignForm.module.css";

const CampaignForm = ({
  formId,
  onSubmit,
  initialConfig = {},
  isNewCampaign,
  onGoBack,
  activeAccount,
  campaignId: initialCampaignId,
  objective,
}) => {
  const [campaignName, setCampaignName] = useState("");
  const [campaignId, setCampaignId] = useState(initialCampaignId || "");
  const [savedConfig, setSavedConfig] = useState(initialConfig);
  const [isActiveSubscription, setIsActiveSubscription] = useState(false);
  const [activeAdAccountsCount, setActiveAdAccountsCount] = useState(0);
  const [userPlan, setUserPlan] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    creativeUploading: true,
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Ref for file input
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isNewCampaign && initialCampaignId) {
      setCampaignId(initialCampaignId);
    }
  }, [initialCampaignId, isNewCampaign]);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (activeAccount) {
        try {
          const response = await axios.get(
            `https://backend.quickcampaigns.io/payment/subscription-status/${activeAccount.id}`,
            { withCredentials: true }
          );
          setIsActiveSubscription(response.data.is_active);
        } catch (error) {
          console.error("Error fetching subscription status:", error);
          setIsActiveSubscription(false);
          toast.error("Error fetching subscription status.");
        }
      }
    };

    fetchSubscriptionStatus();
  }, [activeAccount]);

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const response = await axios.get(
          "https://backend.quickcampaigns.io/payment/user-subscription-status",
          { withCredentials: true }
        );
        setUserPlan(response.data.plan);
      } catch (error) {
        console.error("Error fetching user plan:", error);
        toast.error("Error fetching user plan.");
      }
    };

    fetchUserPlan();
  }, []);

  useEffect(() => {
    if (isActiveSubscription) {
      const fetchActiveAdAccountsCount = async () => {
        try {
          const response = await axios.get(
            "https://backend.quickcampaigns.io/payment/active-ad-accounts",
            { withCredentials: true }
          );
          setActiveAdAccountsCount(response.data.count);
        } catch (error) {
          console.error("Error fetching active ad accounts count:", error);
          toast.error("Error fetching active ad accounts count.");
        }
      };

      fetchActiveAdAccountsCount();
    }
  }, [isActiveSubscription]);

  const toggleSection = (section) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const handleSaveConfig = async () => {
    try {
      const response = await fetch(
        `https://backend.quickcampaigns.io/config/ad_account/${activeAccount.id}/config`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include credentials (cookies) in the request
          body: JSON.stringify(savedConfig),
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to save configuration.");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isActiveSubscription) {
      toast.error(
        "Please choose a subscription plan for the selected ad account before creating an ad."
      );
      return;
    }

    if (userPlan === "Enterprise" && activeAdAccountsCount < 2) {
      toast.error(
        "Please purchase a second ad account to activate and enjoy the Enterprise plan."
      );
      return;
    }

    // Ensure file input exists before scrolling into view
    if (uploadedFiles.length === 0) {
      toast.error("Please upload at least one file.");
      
      // Check if the fileInputRef is defined and not null
      if (fileInputRef.current) {
        fileInputRef.current.scrollIntoView({ behavior: "smooth" });
      }
      
      toggleSection("creativeUploading");
      return;
    }

    const formData = new FormData(event.target);

    if (isNewCampaign) {
      formData.append("campaign_name", campaignName);
    } else {
      formData.append("campaign_id", campaignId); // No need for user input, it's set from Main
    }

    formData.append("objective", objective); // Append the objective

    for (const [key, value] of Object.entries(savedConfig)) {
      if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    }

    onSubmit(formData, isNewCampaign);
  };

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input click
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(files);
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <img
          src="/assets/Vector4.png"
          alt="Go Back"
          className={styles.goBackIcon}
          onClick={onGoBack}
        />
      </div>
      <h2 className={styles.title}>Choose Your Launch Setting</h2>
      <p className={styles.subtitle}>
        Fill In The Required Fields To Generate And Launch Your Meta Ads
      </p>

      <div className={styles.tutorialVideo}>
        <p>Tutorial video here</p>
      </div>

      <form id={formId} onSubmit={handleSubmit} encType="multipart/form-data">
        <div className={styles.formSectionsContainer}>
          {/* Creative Uploading Section */}
          <div className={styles.sectionBox}>
            <div
              className={styles.sectionHeader}
              onClick={() => toggleSection("creativeUploading")}
            >
              <h3>
                Creative Uploading{" "}
                {uploadedFiles.length > 0 &&
                  `(${uploadedFiles.length} files uploaded)`}
              </h3>
              <img
                src="/assets/Vectorw.svg"
                alt="Toggle Section"
                className={`${styles.toggleIcon} ${
                  expandedSections["creativeUploading"] ? styles.expanded : ""
                }`}
              />
            </div>
            {expandedSections["creativeUploading"] && (
              <div className={styles.sectionContent}>
                <div
                  className={styles.uploadBox}
                  onClick={handleFileUploadClick}
                >
                  <img
                    src="/assets/Vector6.png"
                    alt="Upload Icon"
                    className={styles.uploadIcon}
                  />
                  <p>Click to upload or drag and drop</p>
                </div>
                <input
                  type="file"
                  id="uploadFolders"
                  name="uploadFolders"
                  webkitdirectory="true"
                  directory="true"
                  multiple
                  required
                  className={styles.hiddenFileInput}
                  ref={fileInputRef} // Attach ref here
                  onChange={handleFileChange} // Handle file changes
                />
              </div>
            )}
          </div>
          <hr className={styles.sectionDivider} />

          <ConfigForm
            initialConfig={initialConfig}
            isNewCampaign={isNewCampaign}
            onSaveConfig={setSavedConfig}
            activeAccount={activeAccount}
            campaignName={campaignName} // Pass campaignName down
            setCampaignName={setCampaignName} // Pass setCampaignName down
            objective={objective}  // Pass the objective here
            campaignId={campaignId}
          />
        </div>

        {/* Button container outside the formSectionsContainer */}
        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.createAdButton}>
              Create Campaign
          </button>
          <button
            type="button"
            className={styles.goBackButton}
            onClick={onGoBack}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveConfig}
            className={styles.createAdButton}
          >
            Save Current Settings
          </button>
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
  activeAccount: PropTypes.object.isRequired,
  campaignId: PropTypes.string,
  objective: PropTypes.string.isRequired, // Include objective as a required prop
};

export default CampaignForm;
