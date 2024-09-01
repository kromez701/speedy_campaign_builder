import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import "react-toastify/dist/ReactToastify.css";
import styles from "./ConfigForm.module.css";
import Slider from "@mui/material/Slider";

// Performance goals array
const optimizationGoals = [
  "APP_INSTALLS",
  "BRAND_AWARENESS",
  "CLICKS",
  "ENGAGED_USERS",
  "EVENT_RESPONSES",
  "IMPRESSIONS",
  "LEAD_GENERATION",
  "LINK_CLICKS",
  "NONE",
  "OFFER_CLAIMS",
  "OFFSITE_CONVERSIONS",
  "PAGE_ENGAGEMENT",
  "PAGE_LIKES",
  "POST_ENGAGEMENT",
  "QUALITY_LEAD",
  "REACH",
  "REPLIES",
  "SOCIAL_IMPRESSIONS",
  "THRUPLAY",
  "TWO_SECOND_CONTINUOUS_VIDEO_VIEWS",
  "VALUE",
  "VISIT_INSTAGRAM_PROFILE",
  "VISIT_INSTAGRAM_SHOP"
];

const eventTypes = [
  "AD_IMPRESSION", "RATE", "TUTORIAL_COMPLETION", "CONTACT",
  "CUSTOMIZE_PRODUCT", "DONATE", "FIND_LOCATION", "SCHEDULE",
  "START_TRIAL", "SUBMIT_APPLICATION", "SUBSCRIBE", "ADD_TO_CART",
  "ADD_TO_WISHLIST", "INITIATED_CHECKOUT", "ADD_PAYMENT_INFO", "PURCHASE",
  "LEAD", "COMPLETE_REGISTRATION", "CONTENT_VIEW", "SEARCH",
  "SERVICE_BOOKING_REQUEST", "MESSAGING_CONVERSATION_STARTED_7D",
  "LEVEL_ACHIEVED", "ACHIEVEMENT_UNLOCKED", "SPENT_CREDITS",
  "LISTING_INTERACTION", "D2_RETENTION", "D7_RETENTION", "OTHER"
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
}) => {
  const [isCBO, setIsCBO] = useState(false);
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
    performance_goal: initialConfig.performance_goal || "OFFSITE_CONVERSIONS", // Set default performance goal
    placement_type: initialConfig.placement_type || "advantage_plus",
    platforms: {
      facebook: true,
      instagram: true,
      audience_network: true,
      messenger: true,
    },
    placements: {
      feeds: true,
      stories: true,
      in_stream: true,
      search: true,
      messages: true,
      apps_sites: true,
    },
    buying_type: initialConfig.buying_type || "AUCTION",
    targeting_type: "Advantage",
    location: "GB",
    age_range: [18, 65],
    gender: "All",
    event_type: initialConfig.event_type || "PURCHASE", // Default event type
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
    setConfig((prevConfig) => ({
      ...prevConfig,
      platforms: {
        ...prevConfig.platforms,
        [name]: checked,
      },
    }));
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
          `http://localhost:5000/config/ad_account/${activeAccount.id}/config`,
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
          toast.error(result.message || "Failed to load configuration.");
        }
      } catch (error) {
        toast.error("Failed to load configuration.");
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
                className={`${styles.toggleButton} ${
                  !isCBO ? styles.active : ""
                }`}
                onClick={() => setIsCBO(false)}
              >
                ABO
              </button>
              <button
                type="button"
                className={`${styles.toggleButton} ${styles.lastButton} ${
                  isCBO ? styles.active : ""
                }`}
                onClick={() => setIsCBO(true)}
              >
                CBO
              </button>
              <span className={styles.optimizationLabel}>
                BUDGET OPTIMIZATION
              </span>
            </div>

            {isCBO ? (
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
              <label htmlFor="performance_goal" className={styles.labelText}>
                Performance Goal:
              </label>
              <select
                id="performance_goal"
                name="performance_goal"
                value={config.performance_goal}
                onChange={handleChange}
                className={styles.selectField}
              >
                {optimizationGoals.map((goal) => (
                  <option key={goal} value={goal}>
                    {formatGoalForUI(goal)}
                  </option>
                ))}
              </select>
            </div>

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
                {eventTypes.map((event) => (
                  <option key={event} value={event}>
                    {formatGoalForUI(event)}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.column}>
              <label htmlFor="facebook_page" className={styles.labelText}>
                Facebook Page:
              </label>
              <select
                id="facebook_page"
                name="facebook_page"
                value={config.facebook_page}
                onChange={handleChange}
                className={styles.selectField}
              >
                <option value="">Select</option>
                {/* Add your options here */}
              </select>
            </div>

            <div className={styles.column}>
              <label htmlFor="instagram_account" className={styles.labelText}>
                Instagram Account (Optional):
              </label>
              <select
                id="instagram_account"
                name="instagram_account"
                value={config.instagram_account}
                onChange={handleChange}
                className={styles.selectField}
              >
                <option value="">Select</option>
                {/* Add your options here */}
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
              disabled={config.placement_type === "advantage_plus"}
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
              color: '#1E1E1E', // Set the label color here
            },
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={config.platforms.instagram}
              onChange={handlePlatformChange}
              name="instagram"
              disabled={config.placement_type === "advantage_plus"}
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
              color: '#1E1E1E', // Set the label color here
            },
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={config.platforms.audience_network}
              onChange={handlePlatformChange}
              name="audience_network"
              disabled={config.placement_type === "advantage_plus"}
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
              color: '#1E1E1E', // Set the label color here
            },
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={config.platforms.messenger}
              onChange={handlePlatformChange}
              name="messenger"
              disabled={config.placement_type === "advantage_plus"}
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
        />
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
              disabled={config.placement_type === "advantage_plus"}
              sx={{
                '&.Mui-checked': {
                  '& .MuiSvgIcon-root': {
                    color: '#5356FF',
                  },
                },
              }}
            />
          }
          label="Feeds"
          sx={{
            '& .MuiFormControlLabel-label': {
              color: '#1E1E1E', // Set the label color here
            },
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={config.placements.stories}
              onChange={handlePlacementChange}
              name="stories"
              disabled={config.placement_type === "advantage_plus"}
              sx={{
                '&.Mui-checked': {
                  '& .MuiSvgIcon-root': {
                    color: '#5356FF',
                  },
                },
              }}
            />
          }
          label="Stories"
          sx={{
            '& .MuiFormControlLabel-label': {
              color: '#1E1E1E', // Set the label color here
            },
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={config.placements.in_stream}
              onChange={handlePlacementChange}
              name="in_stream"
              disabled={config.placement_type === "advantage_plus"}
              sx={{
                '&.Mui-checked': {
                  '& .MuiSvgIcon-root': {
                    color: '#5356FF',
                  },
                },
              }}
            />
          }
          label="In-stream ads for videos and reels"
          sx={{
            '& .MuiFormControlLabel-label': {
              color: '#1E1E1E', // Set the label color here
            },
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={config.placements.search}
              onChange={handlePlacementChange}
              name="search"
              disabled={config.placement_type === "advantage_plus"}
              sx={{
                '&.Mui-checked': {
                  '& .MuiSvgIcon-root': {
                    color: '#5356FF',
                  },
                },
              }}
            />
          }
          label="Search results"
          sx={{
            '& .MuiFormControlLabel-label': {
              color: '#1E1E1E', // Set the label color here
            },
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={config.placements.messages}
              onChange={handlePlacementChange}
              name="messages"
              disabled={config.placement_type === "advantage_plus"}
              sx={{
                '&.Mui-checked': {
                  '& .MuiSvgIcon-root': {
                    color: '#5356FF',
                  },
                },
              }}
            />
          }
          label="Messages"
          sx={{
            '& .MuiFormControlLabel-label': {
              color: '#1E1E1E', // Set the label color here
            },
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={config.placements.apps_sites}
              onChange={handlePlacementChange}
              name="apps_sites"
              disabled={config.placement_type === "advantage_plus"}
              sx={{
                '&.Mui-checked': {
                  '& .MuiSvgIcon-root': {
                    color: '#5356FF',
                  },
                },
              }}
            />
          }
          label="Apps and sites"
          sx={{
            '& .MuiFormControlLabel-label': {
              color: '#1E1E1E', // Set the label color here
            },
          }}
        />
      </div>
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
                Custom Audiences (Optional):
              </label>
              <select
                id="custom_audiences"
                name="custom_audiences"
                value={config.custom_audiences}
                onChange={handleChange}
                className={styles.selectField}
              >
                <option value="">Select</option>
                {/* Add custom audience options here */}
              </select>
            </div>

            <div className={`${styles.column} ${config.targeting_type === "Advantage" ? styles.blurredField : ""}`}>

              <label htmlFor="targeting_interests" className={styles.labelText}>
                Targeting Interests (Optional):
              </label>
              <select
                id="targeting_interests"
                name="targeting_interests"
                value={config.targeting_interests}
                onChange={handleChange}
                className={styles.selectField}
              >
                <option value="">Select</option>
                {/* Add targeting interests options here */}
              </select>
            </div>
            <div className={`${styles.column} `}>
              <label htmlFor="location" className={styles.labelText}>
                Locations:
              </label>
              <select
                id="location"
                name="location"
                value={config.location}
                onChange={handleChange}
                className={styles.selectField}
              >
                <option value="AF">Afghanistan</option>
                <option value="AL">Albania</option>
                <option value="DZ">Algeria</option>
                <option value="AD">Andorra</option>
                <option value="AO">Angola</option>
                <option value="AG">Antigua and Barbuda</option>
                <option value="AR">Argentina</option>
                <option value="AM">Armenia</option>
                <option value="AU">Australia</option>
                <option value="AT">Austria</option>
                <option value="AZ">Azerbaijan</option>
                <option value="BS">Bahamas</option>
                <option value="BH">Bahrain</option>
                <option value="BD">Bangladesh</option>
                <option value="BB">Barbados</option>
                <option value="BY">Belarus</option>
                <option value="BE">Belgium</option>
                <option value="BZ">Belize</option>
                <option value="BJ">Benin</option>
                <option value="BT">Bhutan</option>
                <option value="BO">Bolivia</option>
                <option value="BA">Bosnia and Herzegovina</option>
                <option value="BW">Botswana</option>
                <option value="BR">Brazil</option>
                <option value="BN">Brunei</option>
                <option value="BG">Bulgaria</option>
                <option value="BF">Burkina Faso</option>
                <option value="BI">Burundi</option>
                <option value="CV">Cabo Verde</option>
                <option value="KH">Cambodia</option>
                <option value="CM">Cameroon</option>
                <option value="CA">Canada</option>
                <option value="CF">Central African Republic</option>
                <option value="TD">Chad</option>
                <option value="CL">Chile</option>
                <option value="CN">China</option>
                <option value="CO">Colombia</option>
                <option value="KM">Comoros</option>
                <option value="CD">Congo (Democratic Republic)</option>
                <option value="CG">Congo (Republic)</option>
                <option value="CR">Costa Rica</option>
                <option value="HR">Croatia</option>
                <option value="CU">Cuba</option>
                <option value="CY">Cyprus</option>
                <option value="CZ">Czechia</option>
                <option value="DK">Denmark</option>
                <option value="DJ">Djibouti</option>
                <option value="DM">Dominica</option>
                <option value="DO">Dominican Republic</option>
                <option value="EC">Ecuador</option>
                <option value="EG">Egypt</option>
                <option value="SV">El Salvador</option>
                <option value="GQ">Equatorial Guinea</option>
                <option value="ER">Eritrea</option>
                <option value="EE">Estonia</option>
                <option value="SZ">Eswatini</option>
                <option value="ET">Ethiopia</option>
                <option value="FJ">Fiji</option>
                <option value="FI">Finland</option>
                <option value="FR">France</option>
                <option value="GA">Gabon</option>
                <option value="GM">Gambia</option>
                <option value="GE">Georgia</option>
                <option value="DE">Germany</option>
                <option value="GH">Ghana</option>
                <option value="GR">Greece</option>
                <option value="GD">Grenada</option>
                <option value="GT">Guatemala</option>
                <option value="GN">Guinea</option>
                <option value="GW">Guinea-Bissau</option>
                <option value="GY">Guyana</option>
                <option value="HT">Haiti</option>
                <option value="HN">Honduras</option>
                <option value="HU">Hungary</option>
                <option value="IS">Iceland</option>
                <option value="IN">India</option>
                <option value="ID">Indonesia</option>
                <option value="IR">Iran</option>
                <option value="IQ">Iraq</option>
                <option value="IE">Ireland</option>
                <option value="IL">Israel</option>
                <option value="IT">Italy</option>
                <option value="JM">Jamaica</option>
                <option value="JP">Japan</option>
                <option value="JO">Jordan</option>
                <option value="KZ">Kazakhstan</option>
                <option value="KE">Kenya</option>
                <option value="KI">Kiribati</option>
                <option value="KP">Korea (North)</option>
                <option value="KR">Korea (South)</option>
                <option value="KW">Kuwait</option>
                <option value="KG">Kyrgyzstan</option>
                <option value="LA">Laos</option>
                <option value="LV">Latvia</option>
                <option value="LB">Lebanon</option>
                <option value="LS">Lesotho</option>
                <option value="LR">Liberia</option>
                <option value="LY">Libya</option>
                <option value="LI">Liechtenstein</option>
                <option value="LT">Lithuania</option>
                <option value="LU">Luxembourg</option>
                <option value="MG">Madagascar</option>
                <option value="MW">Malawi</option>
                <option value="MY">Malaysia</option>
                <option value="MV">Maldives</option>
                <option value="ML">Mali</option>
                <option value="MT">Malta</option>
                <option value="MH">Marshall Islands</option>
                <option value="MR">Mauritania</option>
                <option value="MU">Mauritius</option>
                <option value="MX">Mexico</option>
                <option value="FM">Micronesia</option>
                <option value="MD">Moldova</option>
                <option value="MC">Monaco</option>
                <option value="MN">Mongolia</option>
                <option value="ME">Montenegro</option>
                <option value="MA">Morocco</option>
                <option value="MZ">Mozambique</option>
                <option value="MM">Myanmar</option>
                <option value="NA">Namibia</option>
                <option value="NR">Nauru</option>
                <option value="NP">Nepal</option>
                <option value="NL">Netherlands</option>
                <option value="NZ">New Zealand</option>
                <option value="NI">Nicaragua</option>
                <option value="NE">Niger</option>
                <option value="NG">Nigeria</option>
                <option value="MK">North Macedonia</option>
                <option value="NO">Norway</option>
                <option value="OM">Oman</option>
                <option value="PK">Pakistan</option>
                <option value="PW">Palau</option>
                <option value="PA">Panama</option>
                <option value="PG">Papua New Guinea</option>
                <option value="PY">Paraguay</option>
                <option value="PE">Peru</option>
                <option value="PH">Philippines</option>
                <option value="PL">Poland</option>
                <option value="PT">Portugal</option>
                <option value="QA">Qatar</option>
                <option value="RO">Romania</option>
                <option value="RU">Russia</option>
                <option value="RW">Rwanda</option>
                <option value="KN">Saint Kitts and Nevis</option>
                <option value="LC">Saint Lucia</option>
                <option value="VC">Saint Vincent and the Grenadines</option>
                <option value="WS">Samoa</option>
                <option value="SM">San Marino</option>
                <option value="ST">Sao Tome and Principe</option>
                <option value="SA">Saudi Arabia</option>
                <option value="SN">Senegal</option>
                <option value="RS">Serbia</option>
                <option value="SC">Seychelles</option>
                <option value="SL">Sierra Leone</option>
                <option value="SG">Singapore</option>
                <option value="SK">Slovakia</option>
                <option value="SI">Slovenia</option>
                <option value="SB">Solomon Islands</option>
                <option value="SO">Somalia</option>
                <option value="ZA">South Africa</option>
                <option value="SS">South Sudan</option>
                <option value="ES">Spain</option>
                <option value="LK">Sri Lanka</option>
                <option value="SD">Sudan</option>
                <option value="SR">Suriname</option>
                <option value="SE">Sweden</option>
                <option value="CH">Switzerland</option>
                <option value="SY">Syria</option>
                <option value="TW">Taiwan</option>
                <option value="TJ">Tajikistan</option>
                <option value="TZ">Tanzania</option>
                <option value="TH">Thailand</option>
                <option value="TL">Timor-Leste</option>
                <option value="TG">Togo</option>
                <option value="TO">Tonga</option>
                <option value="TT">Trinidad and Tobago</option>
                <option value="TN">Tunisia</option>
                <option value="TR">Turkey</option>
                <option value="TM">Turkmenistan</option>
                <option value="TV">Tuvalu</option>
                <option value="UG">Uganda</option>
                <option value="UA">Ukraine</option>
                <option value="AE">United Arab Emirates</option>
                <option value="GB">United Kingdom</option>
                <option value="US">United States</option>
                <option value="UY">Uruguay</option>
                <option value="UZ">Uzbekistan</option>
                <option value="VU">Vanuatu</option>
                <option value="VA">Vatican City</option>
                <option value="VE">Venezuela</option>
                <option value="VN">Vietnam</option>
                <option value="YE">Yemen</option>
                <option value="ZM">Zambia</option>
                <option value="ZW">Zimbabwe</option>
                <option value="PS">Palestine</option>
                {/* Add location options here */}
              </select>
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
                onChange={handleChange}
                className={styles.selectField}
              >
                <option value="">Select</option>
                {/* Add attribution settings options here */}
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
};

export default ConfigForm;
