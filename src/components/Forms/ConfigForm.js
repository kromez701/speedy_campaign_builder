import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import "react-toastify/dist/ReactToastify.css";
import styles from "./ConfigForm.module.css";
import Slider from "@mui/material/Slider";
import axios from 'axios';
import Select from 'react-select'; // Import for multi-select dropdown

const objectiveEventMapping = {
  OUTCOME_SALES: ["PURCHASE", "ADD_TO_CART", "INITIATED_CHECKOUT", "ADD_PAYMENT_INFO", "ADD_TO_WISHLIST", "COMPLETE_REGISTRATION", "DONATE", "SEARCH", "START_TRIAL", "SUBSCRIBE", "VIEW_CONTENT", "OTHER"],
  OUTCOME_LEADS: [
    "LEAD",
    "COMPLETE_REGISTRATION",
    "CONTACT",
    "FIND_LOCATION",
    "LEAD",
    "SCHEDULE",
    "START_TRIAL",
    "SUBMIT_APPLICATION",
    "SUBSCRIBE", "OTHER"
  ],  
  OUTCOME_TRAFFIC: ["LEAD", "CONTENT_VIEW", "AD_IMPRESSION", "SEARCH", "OTHER"],
};


const attributionSettings = [
  { label: "1-day click", value: "1d_click" },
  { label: "7-day click", value: "7d_click" },
  { label: "1-day view", value: "1d_view" },
  { label: "7-day view", value: "7d_view" }
];

// Function to capitalize and format the goal for UI display
const formatGoalForUI = (goal) => {
  return goal.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
};

const getDefaultStartTime = () => {
  const startTime = new Date();
  startTime.setUTCDate(startTime.getUTCDate() + 1);
  startTime.setUTCHours(4, 0, 0, 0);
  return startTime.toISOString().slice(0, 19);
};

const getDefaultEndTime = () => {
  const endTime = new Date();
  endTime.setUTCDate(endTime.getUTCDate() + 2);
  endTime.setUTCHours(4, 0, 0, 0);
  return endTime.toISOString().slice(0, 19);
};

const ConfigForm = ({
  onSaveConfig,
  initialConfig,
  isNewCampaign,
  activeAccount,
  campaignName,
  setCampaignName,
  campaignId,
  objective, // Pass objective as a prop
}) => {
  const [isCBO, setIsCBO] = useState(false);
  const [isABOEnabled, setIsABOEnabled] = useState(false); // New variable for ABO
  const [countries, setCountries] = useState([]); // State to store countries
  const [selectedCountries, setSelectedCountries] = useState([]); // Multi-select state for selected countries
  const [customAudiences, setCustomAudiences] = useState([]); // State to store custom audiences
  const [interests, setInterests] = useState([]); // State to store fetched interests
  const [selectedInterests, setSelectedInterests] = useState([]); // State to store selected interests
  const [filteredEventTypes, setFilteredEventTypes] = useState([]);


  const [expandedSections, setExpandedSections] = useState({
    budgetSchedule: true,
    assets: true,
    placements: true,
    targetingDelivery: true,
    campaignTracking: true,
  });

  const [config, setConfig] = useState({
    app_events: getDefaultStartTime(),
    ad_creative_primary_text: "",
    ad_creative_headline: "",
    ad_creative_description: "",
    call_to_action: "SHOP_NOW",
    link: "",
    url_parameters: "",
    display_link: initialConfig.display_link || "",
    destination_url: initialConfig.destination_url || "",
    campaign_budget_optimization: isNewCampaign
      ? initialConfig.campaign_budget_optimization || "DAILY_BUDGET"
      : "DAILY_BUDGET",
    ad_set_budget_optimization:
      initialConfig.ad_set_budget_optimization || "DAILY_BUDGET",
    ad_set_budget_value:
      initialConfig.ad_set_budget_value ||
      initialConfig.budget_value ||
      "50.00",
    ad_set_bid_strategy:
      initialConfig.ad_set_bid_strategy || "LOWEST_COST_WITHOUT_CAP",
    campaign_budget_value: initialConfig.campaign_budget_value || "50.00",
    campaign_bid_strategy:
      initialConfig.campaign_bid_strategy || "LOWEST_COST_WITHOUT_CAP",
    bid_amount: initialConfig.bid_amount || "",
    ad_format: initialConfig.ad_format || "Single image or video",
    ad_set_end_time: initialConfig.ad_set_end_time || getDefaultEndTime(),
    prediction_id: initialConfig.prediction_id || "",
    placement_type: initialConfig.placement_type || "advantage_plus",
    platforms: {
      facebook: true,
      instagram: true,
      audience_network: true,
      messenger: true,
    },
    placements: {
      // Facebook Placements
      feeds: true,
      profile_feed: true,
      marketplace: true,
      video_feeds: true,
      right_column: true,
      stories: true,
      reels: true,
      in_stream: true,
      search: true,
      facebook_reels: true,
    
      // Instagram Placements
      instagram_feeds: true,
      instagram_profile_feed: true,
      explore: true,
      explore_home: true,
      instagram_stories: true,
      instagram_reels: true,
      instagram_search: true,
    
      // Audience Network Placements
      native_banner_interstitial: true,
      rewarded_videos: true,

      // Messages Placements
      messenger_inbox: true,
      messenger_stories: true,
      messenger_sponsored: true,
    },    
    buying_type: initialConfig.buying_type || "AUCTION",
    targeting_type: "Advantage",
    location: [],
    age_range: [18, 65],
    gender: "All",
    event_type: initialConfig.event_type || "PURCHASE", // Default event type
    pixel_id: initialConfig.pixel_id || "", // New pixel field
    facebook_page_id: initialConfig.facebook_page_id || "", // New Facebook Page field
    instagram_account: initialConfig.instagram_account || "", // New Instagram account field
    isCBO: initialConfig.isCBO || false, // Adding isCBO to config
    custom_audiences: initialConfig.custom_audiences || [], // Add custom audiences to config
    interests: initialConfig.interests || [], // Add interests to config
    attribution_setting: initialConfig.attribution_setting || "7d_click", // Default attribution setting
  });

  const [showAppStoreUrl, setShowAppStoreUrl] = useState(
    initialConfig.objective === "OUTCOME_APP_PROMOTION"
  );
  const [showBidAmount, setShowBidAmount] = useState(
    ["COST_CAP", "LOWEST_COST_WITH_BID_CAP"].includes(
      config.campaign_bid_strategy
    ) ||
      ["COST_CAP", "LOWEST_COST_WITH_BID_CAP"].includes(
        config.ad_set_bid_strategy
      )
  );

  const [showEndDate, setShowEndDate] = useState(
    config.ad_set_budget_optimization === "LIFETIME_BUDGET" ||
      config.campaign_budget_optimization === "LIFETIME_BUDGET"
  );

  const [showPredictionId, setShowPredictionId] = useState(
    config.buying_type === "RESERVED"
  );

  const [pages, setPages] = useState([]);
  const [pixels, setPixels] = useState([]);
  const [instagramAccounts, setInstagramAccounts] = useState([]);

  const fetchPages = async () => {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v10.0/me/accounts?access_token=${activeAccount.access_token}`
      );
      const data = await response.json();
      setPages(data.data || []); // Set the fetched pages into state
    } catch (error) {
      toast.error("Error fetching Facebook pages");
    }
  };

  const fetchInstagramAccountsForBM = async (businessManagerId, userAccessToken) => {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v15.0/${businessManagerId}/owned_instagram_accounts?fields=username,id&access_token=${userAccessToken}`
      );
      const data = await response.json();
      
      // If the API returns data with Instagram accounts
      if (data && data.data) {
        const instagramAccounts = data.data.map(account => ({
          label: account.username,  // Use the username as the label
          value: account.id,        // Store the account ID as the value
        }));
        return instagramAccounts;
      } else {
        console.log("No Instagram accounts found.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching Instagram accounts:", error);
      return [];
    }
  };  
  
  // Function to fetch Instagram accounts based on the ad account's BM
const handleAdAccountSelect = async () => {
  const businessManagerId = activeAccount.business_manager_id; // Use BM ID from activeAccount

  if (!businessManagerId) {
    console.error("Business Manager ID not found.");
    return;
  }

  // Fetch Instagram accounts for the existing BM ID
  const instagramAccounts = await fetchInstagramAccountsForBM(businessManagerId, activeAccount.access_token);

  // Now set the Instagram accounts in the dropdown, correctly displaying the username
  setInstagramAccounts(instagramAccounts.map(account => ({
    label: account.label, // Use the username as the label
    value: account.value, // Use the account ID as the value
  })));
};


  useEffect(() => {
    if (activeAccount && activeAccount.is_bound) {
      handleAdAccountSelect(); // Use the existing BM ID from activeAccount
    }
  }, [activeAccount]);

  const handleInstagramAccountChange = (selectedAccountId) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      instagram_account: selectedAccountId, // Update the config with the selected Instagram account
    }));
  };  

  useEffect(() => {
  if (objective && objectiveEventMapping[objective]) {
    setFilteredEventTypes(objectiveEventMapping[objective]);
  } else {
    setFilteredEventTypes([]); // Default to an empty array if no mapping is found
  }
}, [objective]);


  useEffect(() => {
    // Only call the API for existing campaigns
    if (!isNewCampaign && campaignId) {
      const fetchCampaignOptimization = async () => {
        try {
          const response = await axios.post('https://fbbackend.quickcampaigns.io/get_campaign_budget_optimization', {
            campaign_id: campaignId,
            ad_account_id: activeAccount.id,
            app_id: activeAccount.app_id,
            app_secret: activeAccount.app_secret,
            access_token: activeAccount.access_token
          });

          console.log("Response:")
          console.log(response.data.campaign_budget_optimization)

          if (response.data.campaign_budget_optimization === true) {
            setIsCBO(true);
            setIsABOEnabled(false);

          } else {
            setIsCBO(false);
            setIsABOEnabled(true);
          }
        } catch (error) {
          console.error('Error fetching campaign budget optimization:', error);
        }
      };
      console.log("Is set ABO Enaabled")
      console.log(isABOEnabled);
      console.log(isCBO);


      fetchCampaignOptimization();
    }
  }, [campaignId, activeAccount.id, isNewCampaign]);
  
  const fetchPixels = async () => {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v10.0/${activeAccount.ad_account_id}/adspixels?fields=name,id&access_token=${activeAccount.access_token}`
      );
      const data = await response.json();
      setPixels(data.data || []); // Set the fetched pixels into state
    } catch (error) {
      toast.error("Error fetching Pixels");
    }
  };
  
  useEffect(() => {
    if (activeAccount) {
      fetchPages();
      fetchPixels();
    }
  }, [activeAccount]);
  
  const fetchCountries = async () => {
    if (!activeAccount) return;
  
    const requestBody = {
      ad_account_id: activeAccount.ad_account_id,
      app_id: activeAccount.app_id,
      app_secret: activeAccount.app_secret,
      access_token: activeAccount.access_token,
      query: {
        q: "", // Add query here if needed
        limit: 1000,
      },
    };
  
    try {
      const response = await axios.post(
        "https://backend.quickcampaigns.io/targeting/get_countries", 
        requestBody, 
        { withCredentials: true } // Sends credentials with the request
      );
  
      if (response.status === 200) {
        const formattedCountries = response.data.map(country => ({
          label: country.name,  // This will be displayed in the dropdown
          value: country.country_code,  // This will be the value passed to your state
        }));
        setCountries(formattedCountries); // Update countries state with the formatted data

        const gbOption = formattedCountries.find(country => country.value === "GB");
        if (gbOption) {
          setSelectedCountries([gbOption]); // Select GB by default
          setConfig((prevConfig) => ({
            ...prevConfig,
            location: ["GB"], // Set GB as the default in the config state
          }));

       }
    } else {
        toast.error('Error fetching countries');
      }      
    } catch (error) {
      toast.error('Error fetching countries');
      console.error('Error fetching countries', error);
    }
  };
  
  // Fetch countries when activeAccount is available
  useEffect(() => {
    if (activeAccount && activeAccount.is_bound) {
      fetchCountries();
    }
  }, [activeAccount]);

  const fetchCustomAudiences = async () => {
    if (!activeAccount) return;

    const requestBody = {
      app_id: activeAccount.app_id,
      app_secret: activeAccount.app_secret,
      access_token: activeAccount.access_token,
      ad_account_id: activeAccount.ad_account_id,
    };

    try {
      const response = await axios.post(
        "https://backend.quickcampaigns.io/targeting/custom_audiences", 
        requestBody, 
        { withCredentials: true }
      );

      if (response.status === 200) {
        setCustomAudiences(response.data);
      } else {
        toast.error('Error fetching custom audiences');
      }
    } catch (error) {
      toast.error('Error fetching custom audiences');
      console.error('Error fetching custom audiences', error);
    }
  };

  useEffect(() => {
    if (activeAccount && activeAccount.is_bound) {
      fetchPages();
      fetchPixels();
      fetchCountries();
      fetchCustomAudiences();
    }
  }, [activeAccount]);


  const handleCustomAudienceChange = (selectedOptions) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      custom_audiences: selectedOptions || [], // Store selected audiences
    }));
  };  

  // Debounce logic for search query
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 100); // 500ms debounce delay
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const fetchInterests = async () => {
    if (!activeAccount || debouncedSearchQuery.trim() === "") return;

    const requestBody = {
      app_id: activeAccount.app_id,
      app_secret: activeAccount.app_secret,
      access_token: activeAccount.access_token,
      ad_account_id: activeAccount.ad_account_id,
      query: { q: debouncedSearchQuery, limit: 10 },
    };

    try {
      const response = await axios.post("https://backend.quickcampaigns.io/targeting/interests", requestBody, { withCredentials: true });
      if (response.status === 200) {
        const formattedInterests = response.data.map(interest => ({
          label: interest.name,
          value: interest.id,
        }));
        setInterests(formattedInterests); // Set fetched interests into state
      } else {
        toast.error('Error fetching interests');
      }
    } catch (error) {
      toast.error('Error fetching interests');
    }
  };

  useEffect(() => {
    fetchInterests();
  }, [debouncedSearchQuery]); // Trigger API call when search query changes

  const handleInterestSearchChange = (inputValue) => {
    setSearchQuery(inputValue);
  };

  const handleInterestChange = (selectedOptions) => {
    setSelectedInterests(selectedOptions || []); // Update selected interests
    setConfig((prevConfig) => ({
      ...prevConfig,
      interests: selectedOptions || [], // Store selected interests in config
    }));
  };

  useEffect(() => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      campaign_budget_optimization: isNewCampaign
        ? prevConfig.campaign_budget_optimization
        : "AD_SET_BUDGET_OPTIMIZATION",
    }));
  }, [isNewCampaign]);

  useEffect(() => {
    setShowBidAmount(
      ["COST_CAP", "LOWEST_COST_WITH_BID_CAP"].includes(
        config.campaign_bid_strategy
      ) ||
        ["COST_CAP", "LOWEST_COST_WITH_BID_CAP"].includes(
          config.ad_set_bid_strategy
        )
    );

    setShowEndDate(
      config.ad_set_budget_optimization === "LIFETIME_BUDGET" ||
        config.campaign_budget_optimization === "LIFETIME_BUDGET"
    );

    setShowPredictionId(config.buying_type === "RESERVED");
  }, [
    config.campaign_bid_strategy,
    config.ad_set_bid_strategy,
    config.ad_set_budget_optimization,
    config.campaign_budget_optimization,
    config.buying_type,
  ]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig((prevConfig) => {
      const newConfig = {
        ...prevConfig,
        [name]: value,
      };
      
      if (name === "buying_type" && value === "RESERVED") {
        newConfig.campaign_budget_optimization = "AD_SET_BUDGET_OPTIMIZATION";
        newConfig.ad_set_bid_strategy = "";
        setIsCBO(false);
      }

      if (
        name === "campaign_budget_optimization" &&
        value !== "AD_SET_BUDGET_OPTIMIZATION"
      ) {
        newConfig.buying_type = "AUCTION";
      }

      if (
        name === "campaign_budget_optimization" ||
        name === "ad_set_budget_optimization"
      ) {
        const shouldShowEndDate =
          (newConfig.campaign_budget_optimization === "LIFETIME_BUDGET" &&
            isCBO) ||
          (newConfig.ad_set_budget_optimization === "LIFETIME_BUDGET" &&
            !isCBO);
        setShowEndDate(shouldShowEndDate);
      }

      return newConfig;
    });

    if (name === "ad_set_bid_strategy" || name === "campaign_bid_strategy") {
      setShowBidAmount(
        ["COST_CAP", "LOWEST_COST_WITH_BID_CAP"].includes(value)
      );
    }
    if (name === "buying_type") {
      setShowPredictionId(value === "RESERVED");
    }
  };

  useEffect(() => {
    setShowEndDate(
      (isCBO && config.campaign_budget_optimization === "LIFETIME_BUDGET") ||
        (!isCBO && config.ad_set_budget_optimization === "LIFETIME_BUDGET")
    );
  }, [
    isCBO,
    config.campaign_budget_optimization,
    config.ad_set_budget_optimization,
  ]);

  const handlePlatformChange = (e) => {
    const { name, checked } = e.target;
  
    setConfig((prevConfig) => {
      const newConfig = {
        ...prevConfig,
        platforms: {
          ...prevConfig.platforms,
          [name]: checked,
        },
      };
  
      // Disable all related placements when a platform is unchecked
      if (checked) {
        if (name === 'facebook') {
          newConfig.placements = {
            ...newConfig.placements,
            feeds: true,
            profile_feed: true,
            marketplace: true,
            video_feeds: true,
            right_column: true,
            stories: true,
            reels: true,
            in_stream: true,
            search: true,
            facebook_reels: true,
          };
        } else if (name === 'instagram') {
          newConfig.placements = {
            ...newConfig.placements,
            instagram_feeds: true,
            instagram_profile_feed: true,
            explore: true,
            explore_home: true,
            instagram_stories: true,
            instagram_reels: true,
            instagram_search: true,
          };
        } else if (name === 'audience_network') {
          newConfig.placements = {
            ...newConfig.placements,
            native_banner_interstitial: true,
            rewarded_videos: true,
          };
        }else if (name ==='messenger'){
          newConfig.placements= {
            ...newConfig.placements,
            messenger_stories: true,
            messenger_inbox: true,
            messenger_sponsored: true,
          }
        }
      } else {
        // Uncheck all related placements when the platform is unchecked
        if (name === 'facebook') {
          newConfig.placements = {
            ...newConfig.placements,
            feeds: false,
            profile_feed: false,
            marketplace: false,
            video_feeds: false,
            right_column: false,
            stories: false,
            reels: false,
            in_stream: false,
            search: false,
            facebook_reels: false,
          };
        } else if (name === 'instagram') {
          newConfig.placements = {
            ...newConfig.placements,
            instagram_feeds: false,
            instagram_profile_feed: false,
            explore: false,
            explore_home: false,
            instagram_stories: false,
            instagram_reels: false,
            instagram_search: false,
          };
        } else if (name === 'audience_network') {
          newConfig.placements = {
            ...newConfig.placements,
            native_banner_interstitial: false,
            rewarded_videos: false,
          };
        }
        else if (name ==='messenger'){
          newConfig.placements= {
            ...newConfig.placements,
            messenger_stories: false,
            messenger_inbox: false,
            messenger_sponsored: false,
          }
        }
      }
  
      return newConfig;
    });
  };  

  const handleSliderChange = (event, newValue) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      age_range: newValue,
    }));
  };

  const blurClass = config.targeting_type === "Manual" ? styles.blurredField : "";

  const handleTargetingTypeChange = (e) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      targeting_type: e.target.value,
    }));
  };

  const toggleSection = (section) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const handlePlacementChange = (e) => {
    const { name, checked } = e.target;
    setConfig((prevConfig) => ({
      ...prevConfig,
      placements: {
        ...prevConfig.placements,
        [name]: checked,
      },
    }));
  };

  const handleCountryChange = (selectedOptions) => {
    setSelectedCountries(selectedOptions || []); // Update selected countries
    const selectedCountryCodes = selectedOptions.map(option => option.value);
    setConfig((prevConfig) => ({
      ...prevConfig,
      location: selectedCountryCodes, // Store selected countries' codes in the config
    }));
  };

  const handleAttributionChange = (e) => {
    const { value } = e.target;
    setConfig((prevConfig) => ({
      ...prevConfig,
      attribution_setting: value,
    }));
  };
  
  const handlePlacementTypeChange = (e) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      placement_type: e.target.value,
    }));
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(
          `https://backend.quickcampaigns.io/config/ad_account/${activeAccount.id}/config`,
          {
            credentials: "include",
          }
        );
        const result = await response.json();

        if (response.ok) {
          setConfig({
            ...config,
            ...result,
          });
        } else {
          // toast.error(result.message || "Failed to load configuration.");
        }
      } catch (error) {
        // toast.error("Failed to load configuration.");
      }
    };

    fetchConfig();
  }, [activeAccount.id]);

  useEffect(() => {
    onSaveConfig(config);
  }, [config, onSaveConfig]);

  return (
    <div className={styles.formContainer}>
      <div className={styles.sectionBox}>
        <div
          className={styles.sectionHeader}
          onClick={() => toggleSection("budgetSchedule")}
        >
          <h3>Budget & Schedule</h3>
          <img
            src="/assets/Vectorw.svg"
            alt="Toggle Section"
            className={`${styles.toggleIcon} ${
              expandedSections["budgetSchedule"] ? styles.expanded : ""
            }`}
          />
        </div>
        {expandedSections["budgetSchedule"] && (
          <div className={styles.sectionContent}>
  <div className={styles.budgetOptimizationToggle}>
    <button
      type="button"
      className={`${styles.toggleButton} ${!isCBO ? styles.active : ""} ${!isNewCampaign && !isABOEnabled ? styles.disabledButton : ""}`}
      onClick={() => {
        setIsCBO(false);
        setConfig((prevConfig) => ({
          ...prevConfig,
          isCBO: false, // Update config when switching to ABO
        }));
      }}
      disabled={!isNewCampaign && !isABOEnabled}
    >
      ABO
    </button>
    <button
      type="button"
      className={`${styles.toggleButton} ${styles.lastButton} ${isCBO ? styles.active : ""}  ${!isNewCampaign && isABOEnabled ? styles.disabledButton : ""}`}
      onClick={() => {
        setIsCBO(true);
        setConfig((prevConfig) => ({
          ...prevConfig,
          isCBO: true, // Update config when switching to CBO
        }));
      }}
      disabled={!isNewCampaign && isABOEnabled}
    >
      CBO
    </button>
    <span className={styles.optimizationLabel}>BUDGET OPTIMIZATION</span>
  </div>

            {isCBO ? (
              <>
                {/* Only show campaign budget and schedule fields for existing campaigns */}
    {isNewCampaign ? (
      <>
      <div className={styles.column}>
                  <label
                    className={styles.labelText}
                    htmlFor="campaign_budget_optimization"
                  >
                    Campaign Budget Optimization:
                  </label>
                  <select
                    id="campaign_budget_optimization"
                    name="campaign_budget_optimization"
                    value={config.campaign_budget_optimization}
                    onChange={handleChange}
                    className={styles.selectField}
                  >
                    <option value="DAILY_BUDGET">Daily Budget</option>
                    <option value="LIFETIME_BUDGET">Lifetime Budget</option>
                  </select>
                </div>
                <div className={styles.column}>
                  <label
                    className={styles.labelText}
                    htmlFor="campaign_budget_value"
                  >
                    Campaign Budget Value:
                  </label>
                  <input
                    type="number"
                    id="campaign_budget_value"
                    name="campaign_budget_value"
                    value={config.campaign_budget_value}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                </div>
                <div className={styles.column}>
                  <label className={styles.labelText} htmlFor="buying_type">
                    Buying Type:
                  </label>
                  <select
                    id="buying_type"
                    name="buying_type"
                    value={config.buying_type}
                    onChange={handleChange}
                    className={styles.selectField}
                  >
                    <option value="AUCTION">Auction</option>
                    <option value="RESERVED">Reserved</option>
                  </select>
                </div>

                <div className={styles.column}>
                  <label
                    className={styles.labelText}
                    htmlFor="campaign_bid_strategy"
                  >
                    Campaign Bid Strategy:
                  </label>
                  <select
                    id="campaign_bid_strategy"
                    name="campaign_bid_strategy"
                    value={config.campaign_bid_strategy}
                    onChange={handleChange}
                    className={styles.selectField}
                  >
                    <option value="LOWEST_COST_WITHOUT_CAP">Lowest Cost</option>
                    <option value="COST_CAP">Cost Cap</option>
                    <option value="LOWEST_COST_WITH_BID_CAP">Bid Cap</option>
                  </select>
                </div>
                
      </>
    ) : (
      <>
      </>
    )}
              </>
            ) : (
              <>
                <div className={styles.column}>
                  <label
                    className={styles.labelText}
                    htmlFor="ad_set_budget_optimization"
                  >
                    Ad Set Budget Optimization:
                  </label>
                  <select
                    id="ad_set_budget_optimization"
                    name="ad_set_budget_optimization"
                    value={config.ad_set_budget_optimization}
                    onChange={handleChange}
                    className={styles.selectField}
                  >
                    <option value="DAILY_BUDGET">Daily Budget</option>
                    <option value="LIFETIME_BUDGET">Lifetime Budget</option>
                  </select>
                </div>

                <div className={styles.column}>
                  <label
                    className={styles.labelText}
                    htmlFor="ad_set_budget_value"
                  >
                    Ad Set Budget Value:
                  </label>
                  <input
                    type="number"
                    id="ad_set_budget_value"
                    name="ad_set_budget_value"
                    value={config.ad_set_budget_value}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                </div>

                <div className={styles.column}>
                  <label className={styles.labelText} htmlFor="buying_type">
                    Buying Type:
                  </label>
                  <select
                    id="buying_type"
                    name="buying_type"
                    value={config.buying_type}
                    onChange={handleChange}
                    className={styles.selectField}
                  >
                    <option value="AUCTION">Auction</option>
                    <option value="RESERVED">Reserved</option>
                  </select>
                </div>

                {showPredictionId && (
                  <div className={styles.column}>
                    <label className={styles.labelText} htmlFor="prediction_id">
                      Prediction ID:
                    </label>
                    <input
                      type="text"
                      id="prediction_id"
                      name="prediction_id"
                      value={config.prediction_id}
                      onChange={handleChange}
                      className={styles.inputField}
                    />
                  </div>
                )}

                {config.buying_type !== "RESERVED" && (
                  <div className={styles.column}>
                    <label
                      className={styles.labelText}
                      htmlFor="ad_set_bid_strategy"
                    >
                      Ad Set Bid Strategy:
                    </label>
                    <select
                      id="ad_set_bid_strategy"
                      name="ad_set_bid_strategy"
                      value={config.ad_set_bid_strategy}
                      onChange={handleChange}
                      className={styles.selectField}
                    >
                      <option value="LOWEST_COST_WITHOUT_CAP">
                        Lowest Cost
                      </option>
                      <option value="COST_CAP">Cost Cap</option>
                      <option value="LOWEST_COST_WITH_BID_CAP">Bid Cap</option>
                    </select>
                  </div>
                )}
              </>
            )}

            {showEndDate && (
              <div className={styles.column}>
                <label className={styles.labelText} htmlFor="ad_set_end_time">
                  Ad Set End Time:
                </label>
                <input
                  type="datetime-local"
                  id="ad_set_end_time"
                  name="ad_set_end_time"
                  value={config.ad_set_end_time}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </div>
            )}

            {showBidAmount && (
              <div className={styles.column}>
                <label className={styles.labelText} htmlFor="bid_amount">
                  Bid Amount:
                </label>
                <input
                  type="number"
                  id="bid_amount"
                  name="bid_amount"
                  value={config.bid_amount}
                  onChange={handleChange}
                  className={styles.inputField}
                />
              </div>
            )}

            <div className={styles.column}>
              <label className={styles.labelText} htmlFor="app_events">
                Schedule:
              </label>
              <input
                type="datetime-local"
                id="app_events"
                name="app_events"
                value={config.app_events}
                onChange={handleChange}
                className={styles.inputField}
              />
            </div>
          </div>
        )}
        <hr className={styles.sectionDivider} />
      </div>

      {/* Assets Section */}
      <div className={styles.sectionBox}>
        <div
          className={styles.sectionHeader}
          onClick={() => toggleSection("assets")}
        >
          <h3>Assets</h3>
          <img
            src="/assets/Vectorw.svg"
            alt="Toggle Section"
            className={`${styles.toggleIcon} ${
              expandedSections["assets"] ? styles.expanded : ""
            }`}
          />
        </div>
        {expandedSections["assets"] && (
          <div className={styles.sectionContent}>
          <div className={styles.column}>
            <label htmlFor="event_type" className={styles.labelText}>
              Event Type:
            </label>
            <select
              id="event_type"
              name="event_type"
              value={config.event_type}
              onChange={handleChange}
              className={styles.selectField}
            >
              {filteredEventTypes.map((event) => (
                <option key={event} value={event}>
                  {formatGoalForUI(event)}
                </option>
              ))}
            </select>
          </div>
            <div className={styles.column}>
              <label htmlFor="pixel_id" className={styles.labelText}>
                Pixel ID:
              </label>
              <select
                id="pixel_id"
                name="pixel_id"
                value={config.pixel_id}
                onChange={handleChange}
                className={styles.selectField}
                required
              >
                <option value="">Select Pixel</option>
                {pixels.map((pixel) => (
                  <option key={pixel.id} value={pixel.id}>
                    {pixel.name || pixel.id}
                  </option>
                ))}
              </select>
            </div>


            <div className={styles.column}>
              <label htmlFor="facebook_page_id" className={styles.labelText}>
                Facebook Page:
              </label>
              <select
                id="facebook_page_id"
                name="facebook_page_id"
                value={config.facebook_page_id}
                onChange={handleChange}
                className={styles.selectField}
                required
              >
                <option value="">Select Facebook Page</option>
                {pages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.name || page.id}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.column}>
  <label htmlFor="instagram_account" className={styles.labelText}>
    Instagram Account:
  </label>
  <select
    id="instagram_account"
    name="instagram_account"
    value={config.instagram_account || ""}  // Set the value correctly
    onChange={(e) => handleInstagramAccountChange(e.target.value)} // Pass the selected account id
    className={styles.selectField}
  >
    <option value="">Select Instagram Account</option>
    {instagramAccounts.map((account) => (
      <option key={account.value} value={account.value}>
        {account.label} {/* Display the username */}
      </option>
    ))}
  </select>
</div>


          </div>
        )}
        <hr className={styles.sectionDivider} />
      </div>

{/* Placements Section */}
<div className={styles.sectionBox}>
  <div className={styles.sectionHeader} onClick={() => toggleSection("placements")}>
    <h3>Placements</h3>
    <img
      src="/assets/Vectorw.svg"
      alt="Toggle Section"
      className={`${styles.toggleIcon} ${expandedSections["placements"] ? styles.expanded : ""}`}
    />
  </div>
  {expandedSections["placements"] && (
    <div className={styles.sectionContent}>
      <div className={styles.placementToggle}>
        <button
          type="button"
          className={`${styles.toggleButton} ${config.placement_type === "advantage_plus" ? styles.active : ""}`}
          onClick={() => handlePlacementTypeChange({ target: { value: "advantage_plus" } })}
        >
          On
        </button>
        <button
          type="button"
          className={`${styles.toggleButton} ${styles.lastButton} ${config.placement_type === "Manual" ? styles.active : ""}`}
          onClick={() => handlePlacementTypeChange({ target: { value: "Manual" } })}
        >
          Off
        </button>
        <span className={styles.optimizationLabel}>
          ADVANTAGE+ PLACEMENTS
        </span>
      </div>
      <div className={`${styles.platformContainer} ${config.placement_type === "advantage_plus" ? styles.disabled : ""}`}>
      <FormControlLabel
    control={
      <Checkbox
        checked={config.platforms.facebook}
        onChange={handlePlatformChange}
        name="facebook"
        sx={{
          '&.Mui-checked': {
            '& .MuiSvgIcon-root': {
              color: '#5356FF',
            },
          },
        }}
      />
    }
    label="Facebook"
    sx={{
      '& .MuiFormControlLabel-label': {
        color: '#1E1E1E',
      },
    }}
  />
  <FormControlLabel
    control={
      <Checkbox
        checked={config.platforms.instagram}
        onChange={handlePlatformChange}
        name="instagram"
        sx={{
          '&.Mui-checked': {
            '& .MuiSvgIcon-root': {
              color: '#5356FF',
            },
          },
        }}
      />
    }
    label="Instagram"
    sx={{
      '& .MuiFormControlLabel-label': {
        color: '#1E1E1E',
      },
    }}
  />
  <FormControlLabel
    control={
      <Checkbox
        checked={config.platforms.audience_network}
        onChange={handlePlatformChange}
        name="audience_network"
        sx={{
          '&.Mui-checked': {
            '& .MuiSvgIcon-root': {
              color: '#5356FF',
            },
          },
        }}
      />
    }
    label="Audience Network"
    sx={{
      '& .MuiFormControlLabel-label': {
        color: '#1E1E1E',
      },
    }}
  />
  {/* <FormControlLabel
          control={
            <Checkbox
              checked={config.platforms.messenger}
              onChange={handlePlatformChange}
              name="messenger"
              sx={{
                '&.Mui-checked': {
                  '& .MuiSvgIcon-root': {
                    color: '#5356FF',
                  },
                },
              }}
            />
          }
          label="Messenger"
          sx={{
            '& .MuiFormControlLabel-label': {
              color: '#1E1E1E', // Set the label color here
            },
          }}
        /> */}
</div>


      {/* Horizontal Rule */}

<hr className={styles.sectionDivider2} />

      {/* Placements Column */}
      <div className={`${styles.manualOptions} ${config.placement_type === "advantage_plus" ? styles.disabled : ""}`}>
      <FormControlLabel
    control={
      <Checkbox
        checked={config.placements.feeds}
        onChange={handlePlacementChange}
        name="feeds"
        sx={{
          '&.Mui-checked': {
            '& .MuiSvgIcon-root': {
              color: '#5356FF',
            },
          },
        }}
      />
    }
    label="Facebook Feed"
    sx={{
      '& .MuiFormControlLabel-label': {
        color: '#1E1E1E',
      },
    }}
  />
  <FormControlLabel
    control={
      <Checkbox
        checked={config.placements.profile_feed}
        onChange={handlePlacementChange}
        name="profile_feed"
        sx={{
          '&.Mui-checked': {
            '& .MuiSvgIcon-root': {
              color: '#5356FF',
            },
          },
        }}
      />
    }
    label="Facebook Profile Feed"
    sx={{
      '& .MuiFormControlLabel-label': {
        color: '#1E1E1E',
      },
    }}
  />
  <FormControlLabel
    control={
      <Checkbox
        checked={config.placements.marketplace}
        onChange={handlePlacementChange}
        name="marketplace"
        sx={{
          '&.Mui-checked': {
            '& .MuiSvgIcon-root': {
              color: '#5356FF',
            },
          },
        }}
      />
    }
    label="Facebook Marketplace"
    sx={{
      '& .MuiFormControlLabel-label': {
        color: '#1E1E1E',
      },
    }}
  />
  <FormControlLabel
    control={
      <Checkbox
        checked={config.placements.video_feeds}
        onChange={handlePlacementChange}
        name="video_feeds"
        sx={{
          '&.Mui-checked': {
            '& .MuiSvgIcon-root': {
              color: '#5356FF',
            },
          },
        }}
      />
    }
    label="Facebook Video Feeds"
    sx={{
      '& .MuiFormControlLabel-label': {
        color: '#1E1E1E',
      },
    }}
  />
  <FormControlLabel
    control={
      <Checkbox
        checked={config.placements.right_column}
        onChange={handlePlacementChange}
        name="right_column"
        sx={{
          '&.Mui-checked': {
            '& .MuiSvgIcon-root': {
              color: '#5356FF',
            },
          },
        }}
      />
    }
    label="Facebook Right Column"
    sx={{
      '& .MuiFormControlLabel-label': {
        color: '#1E1E1E',
      },
    }}
  />
  <FormControlLabel
    control={
      <Checkbox
        checked={config.placements.in_stream}
        onChange={handlePlacementChange}
        name="in_stream"
        sx={{
          '&.Mui-checked': {
            '& .MuiSvgIcon-root': {
              color: '#5356FF',
            },
          },
        }}
      />
    }
    label="Facebook In-stream Videos"
    sx={{
      '& .MuiFormControlLabel-label': {
        color: '#1E1E1E',
      },
    }}
  />
  <FormControlLabel
    control={
      <Checkbox
        checked={config.placements.search}
        onChange={handlePlacementChange}
        name="search"
        sx={{
          '&.Mui-checked': {
            '& .MuiSvgIcon-root': {
              color: '#5356FF',
            },
          },
        }}
      />
    }
    label="Facebook Search Results"
    sx={{
      '& .MuiFormControlLabel-label': {
        color: '#1E1E1E',
      },
    }}
  />

  <FormControlLabel
    control={
      <Checkbox
        checked={config.placements.stories}
        onChange={handlePlacementChange}
        name="stories"
        sx={{
          '&.Mui-checked': {
            '& .MuiSvgIcon-root': {
              color: '#5356FF',
            },
          },
        }}
      />
    }
    label="Facebook Stories"
    sx={{
      '& .MuiFormControlLabel-label': {
        color: '#1E1E1E',
      },
    }}
  />
  <FormControlLabel
    control={
      <Checkbox
        checked={config.placements.reels}
        onChange={handlePlacementChange}
        name="reels"
        sx={{
          '&.Mui-checked': {
            '& .MuiSvgIcon-root': {
              color: '#5356FF',
            },
          },
        }}
      />
    }
    label="Facebook Reels"
    sx={{
      '& .MuiFormControlLabel-label': {
        color: '#1E1E1E',
      },
    }}
  />

<FormControlLabel
    control={
      <Checkbox
        checked={config.placements.facebook_reels}
        onChange={handlePlacementChange}
        name="facebook_reels"
        sx={{
          '&.Mui-checked': {
            '& .MuiSvgIcon-root': {
              color: '#5356FF',
            },
          },
        }}
      />
    }
    label="Ads on Facebook reels"
    sx={{
      '& .MuiFormControlLabel-label': {
        color: '#1E1E1E',
      },
    }}
  />
  
</div>

<hr className={styles.sectionDivider2} />

{/* Instagram Placements */}
<div className={`${styles.manualOptions} ${config.placement_type === "advantage_plus" ? styles.disabled : ""}`}>
  <FormControlLabel
    control={
      <Checkbox
        checked={config.placements.instagram_profile_feed}
        onChange={handlePlacementChange}
        name="instagram_profile_feed"
        sx={{
          '&.Mui-checked': {
            '& .MuiSvgIcon-root': {
              color: '#5356FF',
            },
          },
        }}
      />
    }
    label="Instagram Feed"
    sx={{
      '& .MuiFormControlLabel-label': {
        color: '#1E1E1E',
      },
    }}
  />
  <FormControlLabel
    control={
      <Checkbox
        checked={config.placements.instagram_profile_feed}
        onChange={handlePlacementChange}
        name="instagram_profile_feed"
        sx={{
          '&.Mui-checked': {
            '& .MuiSvgIcon-root': {
              color: '#5356FF',
            },
          },
        }}
      />
    }
    label="Instagram Profile Feed"
    sx={{
      '& .MuiFormControlLabel-label': {
        color: '#1E1E1E',
      },
    }}
  />
  <FormControlLabel
    control={
      <Checkbox
        checked={config.placements.explore}
        onChange={handlePlacementChange}
        name="explore"
        sx={{
          '&.Mui-checked': {
            '& .MuiSvgIcon-root': {
              color: '#5356FF',
            },
          },
        }}
      />
    }
    label="Instagram Explore"
    sx={{
      '& .MuiFormControlLabel-label': {
        color: '#1E1E1E',
      },
    }}
  />
  <FormControlLabel
    control={
      <Checkbox
        checked={config.placements.explore_home}
        onChange={handlePlacementChange}
        name="explore_home"
        sx={{
          '&.Mui-checked': {
            '& .MuiSvgIcon-root': {
              color: '#5356FF',
            },
          },
        }}
      />
    }
    label="Instagram Explore Home"
    sx={{
      '& .MuiFormControlLabel-label': {
        color: '#1E1E1E',
      },
    }}
  />
  <FormControlLabel
    control={
      <Checkbox
        checked={config.placements.instagram_stories}
        onChange={handlePlacementChange}
        name="instagram_stories"
        sx={{
          '&.Mui-checked': {
            '& .MuiSvgIcon-root': {
              color: '#5356FF',
            },
          },
        }}
      />
    }
    label="Instagram Stories"
    sx={{
      '& .MuiFormControlLabel-label': {
        color: '#1E1E1E',
      },
    }}
  />
  <FormControlLabel
    control={
      <Checkbox
        checked={config.placements.instagram_reels}
        onChange={handlePlacementChange}
        name="instagram_reels"
        sx={{
          '&.Mui-checked': {
            '& .MuiSvgIcon-root': {
              color: '#5356FF',
            },
          },
        }}
      />
    }
    label="Instagram Reels"
    sx={{
      '& .MuiFormControlLabel-label': {
        color: '#1E1E1E',
      },
    }}
  />
  <FormControlLabel
    control={
      <Checkbox
        checked={config.placements.instagram_search}
        onChange={handlePlacementChange}
        name="instagram_search"
        sx={{
          '&.Mui-checked': {
            '& .MuiSvgIcon-root': {
              color: '#5356FF',
            },
          },
        }}
      />
    }
    label="Instagram Search Results"
    sx={{
      '& .MuiFormControlLabel-label': {
        color: '#1E1E1E',
      },
    }}
  />
</div>

<hr className={styles.sectionDivider2} />

{/* Audience Network Placements */}
<div className={`${styles.manualOptions} ${config.placement_type === "advantage_plus" ? styles.disabled : ""}`}>
  <FormControlLabel
    control={
      <Checkbox
        checked={config.placements.native_banner_interstitial}
        onChange={handlePlacementChange}
        name="native_banner_interstitial"
        sx={{
          '&.Mui-checked': {
            '& .MuiSvgIcon-root': {
              color: '#5356FF',
            },
          },
        }}
      />
    }
    label="Audience Network Native, Banner and Interstitial"
    sx={{
      '& .MuiFormControlLabel-label': {
        color: '#1E1E1E',
      },
    }}
  />
  <FormControlLabel
    control={
      <Checkbox
        checked={config.placements.rewarded_videos}
        onChange={handlePlacementChange}
        name="rewarded_videos"
        sx={{
          '&.Mui-checked': {
            '& .MuiSvgIcon-root': {
              color: '#5356FF',
            },
          },
        }}
      />
    }
    label="Audience Network Rewarded Videos"
    sx={{
      '& .MuiFormControlLabel-label': {
        color: '#1E1E1E',
      },
    }}
  />
</div>
{/* <hr className={styles.sectionDivider2} /> */}

{/* Messenger Placements */}
{/* <div className={`${styles.manualOptions} ${!config.platforms.messenger ? styles.disabled : ""} ${config.placement_type === "advantage_plus" ? styles.disabled : ""}`}>
<FormControlLabel
    control={
      <Checkbox
        checked={config.placements.messenger_stories}
        onChange={handlePlacementChange}
        name="messenger_stories"
        sx={{
          '&.Mui-checked': {
            '& .MuiSvgIcon-root': {
              color: '#5356FF',
            },
          },
        }}
      />
    }
    label="Messenger Stories"
    sx={{
      '& .MuiFormControlLabel-label': {
        color: '#1E1E1E',
      },
    }}
  />
  <FormControlLabel
    control={
      <Checkbox
        checked={config.placements.messenger_inbox}
        onChange={handlePlacementChange}
        name="messenger_inbox"
        sx={{
          '&.Mui-checked': {
            '& .MuiSvgIcon-root': {
              color: '#5356FF',
            },
          },
        }}
      />
    }
    label="Messenger Inbox"
    sx={{
      '& .MuiFormControlLabel-label': {
        color: '#1E1E1E',
      },
    }}
  />
  <FormControlLabel
    control={
      <Checkbox
        checked={config.placements.messenger_sponsored}
        onChange={handlePlacementChange}
        name="messenger_sponsored"
        sx={{
          '&.Mui-checked': {
            '& .MuiSvgIcon-root': {
              color: '#5356FF',
            },
          },
        }}
      />
    }
    label="Messenger Sponsored Messages"
    sx={{
      '& .MuiFormControlLabel-label': {
        color: '#1E1E1E',
      },
    }}
  />
</div> */}
</div>
  )}

  
  <hr className={styles.sectionDivider} />
</div>

      {/* Targeting & Delivery Section */}
      <div className={styles.sectionBox}>
        <div
          className={styles.sectionHeader}
          onClick={() => toggleSection("targetingDelivery")}
        >
          <h3>Targeting & Delivery</h3>
          <img
            src="/assets/Vectorw.svg"
            alt="Toggle Section"
            className={`${styles.toggleIcon} ${
              expandedSections["targetingDelivery"] ? styles.expanded : ""
            }`}
          />
        </div>
        {expandedSections["targetingDelivery"] && (
          <div className={styles.sectionContent}>
            <div className={styles.budgetOptimizationToggle}>
              <button
                type="button"
                className={`${styles.toggleButton} ${
                  config.targeting_type === "Advantage" ? styles.active : ""
                }`}
                onClick={() =>
                  setConfig((prevConfig) => ({
                    ...prevConfig,
                    targeting_type: "Advantage",
                  }))
                }
              >
                On
              </button>
              <button
                type="button"
                className={`${styles.toggleButton} ${styles.lastButton} ${
                  config.targeting_type === "Manual" ? styles.active : ""
                }`}
                onClick={() =>
                  setConfig((prevConfig) => ({
                    ...prevConfig,
                    targeting_type: "Manual",
                  }))
                }
              >
                Off
              </button>
              <span className={styles.optimizationLabel}>
                ADVANTAGE+ AUDIENCE
              </span>
            </div>

            <div className={`${styles.column} ${config.targeting_type === "Advantage" ? styles.blurredField : ""}`}>
            <label htmlFor="custom_audiences" className={styles.labelText}>
          Custom Audiences:
        </label>
        <Select
  id="custom_audiences"
  isMulti
  options={customAudiences.map(audience => ({ label: audience.name, value: audience.id }))} // Format the custom audience options for select
  value={config.custom_audiences}
  onChange={handleCustomAudienceChange}
  placeholder="Select custom audiences"
  className={`${styles.selectField} ${styles.customAudienceSelect}`} // Custom class for styling
  classNamePrefix="custom-select" // Prefix for easy styling
  styles={{
    control: (provided) => ({
      ...provided,
      minHeight: '36px',
      fontSize: '14px',
      borderColor: '#aaa',
      boxShadow: 'none',
      color: '#333',
      '&:hover': {
        borderColor: '#aaa',
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#f0f0f0',
      fontSize: '12px',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#333',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: '14px',
      color: '#888',
    }),
  }}
/>
            </div>

            <div className={`${styles.column} ${config.targeting_type === "Advantage" ? styles.blurredField : ""}`}>

            <label htmlFor="targeting_interests" className={styles.labelText}>
          Targeting Interests:
        </label>
        <Select
          id="targeting_interests"
          isMulti
          onInputChange={handleInterestSearchChange} // Update search query when typing
          options={interests} // Filtered interests based on query
          value={selectedInterests}
          onChange={handleInterestChange}
          placeholder="Search interests..."
          className={`${styles.selectField} ${styles.interestsSelect}`} // Custom class
          classNamePrefix="custom-select" // Prefix for easy styling
          styles={{
            control: (provided) => ({
              ...provided,
              minHeight: "36px",
              fontSize: "14px",
              borderColor: "#aaa",
              boxShadow: "none",
              color: "#333",
              "&:hover": {
                borderColor: "#aaa",
              },
            }),
            multiValue: (provided) => ({
              ...provided,
              backgroundColor: "#f0f0f0",
              fontSize: "12px",
            }),
            multiValueLabel: (provided) => ({
              ...provided,
              color: "#333",
            }),
            menu: (provided) => ({
              ...provided,
              zIndex: 9999,
            }),
            placeholder: (provided) => ({
              ...provided,
              fontSize: "14px",
              color: "#888",
            }),
          }}
        />
            </div>

            <div className={styles.column}>
              <label htmlFor="location" className={styles.labelText}>
                Locations:
              </label>
              <Select
  id="location"
  isMulti
  options={countries}
  value={selectedCountries}
  onChange={handleCountryChange}
  placeholder="Select countries"
  className={`${styles.selectField} ${styles.countrySelect}`} // Custom class
  classNamePrefix="custom-select" // Prefix for easy styling
  styles={{
    control: (provided) => ({
      ...provided,
      minHeight: '36px', // Reduced height
      fontSize: '14px', // Smaller font size
      borderColor: '#aaa',
      boxShadow: 'none',
      padding: '0px', // Adjust padding to reduce height
      color: '#333', // Font color
      '&:hover': {
        borderColor: '#aaa',
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#f0f0f0',
      fontSize: '12px', // Smaller font size for selected values
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#333', // Font color for selected values
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: '14px', // Adjusted font size for placeholder
      color: '#888', // Placeholder color
    }),
  }}
/>

            </div>

            <div className={`${styles.column} ${config.targeting_type === "Advantage" ? styles.blurredField : ""}`}>
              <label htmlFor="gender" className={styles.labelText}>
                Gender:
              </label>
              <select
                id="gender"
                name="gender"
                value={config.gender}
                onChange={handleChange}
                className={styles.selectField}
              >
                <option value="All">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className={`${styles.column} ${config.targeting_type === "Advantage" ? styles.blurredField : ""}`}>
              <label htmlFor="age_range" className={styles.labelText}>
                Age Range ({config.age_range[0]} - {config.age_range[1]} Years)
              </label>
              <Slider
                value={config.age_range}
                onChange={handleSliderChange}
                min={18}
                max={65}
                sx={{
                  color: "#6A00FF",
                  height: 8,
                  "& .MuiSlider-thumb": {
                    height: 22,
                    width: 22,
                    "&:focus, &:hover, &.Mui-active": {
                      boxShadow: "inherit",
                    },
                  },
                  "& .MuiSlider-track": {
                    height: 8,
                    borderRadius: 4,
                  },
                  "& .MuiSlider-rail": {
                    height: 8,
                    borderRadius: 4,
                  },
                }}
              />
            </div>

            <div className={`${styles.column} ${config.targeting_type === "Advantage" ? styles.blurredField : ""}`}>
            <label htmlFor="attribution_setting" className={styles.labelText}>
              Attribution Setting:
            </label>
            <select
              id="attribution_setting"
              name="attribution_setting"
              value={config.attribution_setting}
              onChange={handleAttributionChange}
              className={styles.selectField}
            >
              {attributionSettings.map((setting) => (
                <option key={setting.value} value={setting.value}>
                  {setting.label}
                </option>
              ))}
            </select>
            </div>
          </div>
        )}
        <hr className={styles.sectionDivider} />
      </div>

      {/* Campaign & Tracking Section */}
      <div className={styles.sectionBox}>
        <div
          className={styles.sectionHeader}
          onClick={() => toggleSection("campaignTracking")}
        >
          <h3>Campaign & Tracking</h3>
          <img
            src="/assets/Vectorw.svg"
            alt="Toggle Section"
            className={`${styles.toggleIcon} ${
              expandedSections["campaignTracking"] ? styles.expanded : ""
            }`}
          />
        </div>
        {expandedSections["campaignTracking"] && (
          <div className={styles.sectionContent}>
            <div className={styles.column}>
              <label className={styles.labelText} htmlFor="ad_format">
                Ad Format:
              </label>
              <select
                id="ad_format"
                name="ad_format"
                value={config.ad_format}
                onChange={handleChange}
                className={styles.selectField}
              >
                <option value="Single image or video">
                  Single image or video
                </option>
                <option value="Carousel">Carousel</option>
              </select>
            </div>

            <div className={styles.column}>
              <label
                className={styles.labelText}
                htmlFor="ad_creative_primary_text"
              >
                Primary Text:
              </label>
              <textarea
                id="ad_creative_primary_text"
                name="ad_creative_primary_text"
                value={config.ad_creative_primary_text}
                onChange={handleChange}
                rows="4"
                className={styles.textareaField}
              />
            </div>

            <div className={styles.column}>
              <label
                className={styles.labelText}
                htmlFor="ad_creative_headline"
              >
                Headline:
              </label>
              <textarea
                id="ad_creative_headline"
                name="ad_creative_headline"
                value={config.ad_creative_headline}
                onChange={handleChange}
                rows="4"
                className={styles.textareaField}
              />
            </div>

            <div className={styles.column}>
              <label
                className={styles.labelText}
                htmlFor="ad_creative_description"
              >
                Description:
              </label>
              <textarea
                id="ad_creative_description"
                name="ad_creative_description"
                value={config.ad_creative_description}
                onChange={handleChange}
                rows="4"
                className={styles.textareaField}
              />
            </div>

            <div className={styles.column}>
              <label className={styles.labelText} htmlFor="call_to_action">
                Call to Action:
              </label>
              <select
                id="call_to_action"
                name="call_to_action"
                value={config.call_to_action}
                onChange={handleChange}
                className={styles.selectField}
              >
                <option value="SHOP_NOW">Shop Now</option>
                <option value="LEARN_MORE">Learn More</option>
                <option value="SIGN_UP">Sign Up</option>
                <option value="SUBSCRIBE">Subscribe</option>
                <option value="CONTACT_US">Contact Us</option>
                <option value="GET_OFFER">Get Offer</option>
                <option value="GET_QUOTE">Get Quote</option>
                <option value="DOWNLOAD">Download</option>
                <option value="ORDER_NOW">Order Now</option>
                <option value="BOOK_NOW">Book Now</option>
                <option value="WATCH_MORE">Watch More</option>
                <option value="APPLY_NOW">Apply Now</option>
                <option value="BUY_TICKETS">Buy Tickets</option>
                <option value="GET_SHOWTIMES">Get Showtimes</option>
                <option value="LISTEN_NOW">Listen Now</option>
                <option value="PLAY_GAME">Play Game</option>
                <option value="REQUEST_TIME">Request Time</option>
                <option value="SEE_MENU">See Menu</option>
              </select>
            </div>

            <div className={styles.column}>
              <label className={styles.labelText} htmlFor="destination_url">
                Destination URL:
              </label>
              <input
                type="text"
                id="destination_url"
                name="destination_url"
                value={config.destination_url}
                onChange={handleChange}
                className={styles.inputField}
                required
              />
            </div>

            <div className={styles.column}>
              <label className={styles.labelText} htmlFor="url_parameters">
                UTM Parameters:
              </label>
              <input
                type="text"
                id="url_parameters"
                name="url_parameters"
                value={config.url_parameters}
                onChange={handleChange}
                className={styles.inputField}
              />
            </div>

            {isNewCampaign && (
              <div className={styles.column}>
                <label className={styles.labelText} htmlFor="campaignName">
                  Campaign Name:
                </label>
                <input
                  type="text"
                  id="campaignName"
                  name="campaignName"
                  placeholder="Enter Name"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  required
                  className={styles.inputField}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

ConfigForm.propTypes = {
  onSaveConfig: PropTypes.func.isRequired,
  initialConfig: PropTypes.object.isRequired,
  isNewCampaign: PropTypes.bool.isRequired,
  activeAccount: PropTypes.object.isRequired,
  campaignName: PropTypes.string.isRequired,
  setCampaignName: PropTypes.func.isRequired,
  objective: PropTypes.string.isRequired, // Make objective required
};

export default ConfigForm;
