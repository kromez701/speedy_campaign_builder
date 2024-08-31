import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import "react-toastify/dist/ReactToastify.css";
import styles from "./ConfigForm.module.css";

const getDefaultStartTime = () => {
  const startTime = new Date();
  startTime.setUTCDate(startTime.getUTCDate() + 1);
  startTime.setUTCHours(4, 0, 0, 0);
  const isoString = startTime.toISOString();
  return isoString.slice(0, 19);
};

const getDefaultEndTime = () => {
  const endTime = new Date();
  endTime.setUTCDate(endTime.getUTCDate() + 2);
  endTime.setUTCHours(4, 0, 0, 0);
  const isoString = endTime.toISOString();
  return isoString.slice(0, 19);
};

const ConfigForm = ({
  onSaveConfig,
  initialConfig,
  isNewCampaign,
  activeAccount,
  campaignName,  // Add campaignName prop
  setCampaignName  // Add setCampaignName prop
}) => {
  const [isCBO, setIsCBO] = useState(false); // Set to false so that ABO is selected by default
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
      feeds: true,
      stories: true,
      in_stream: true,
      search: true,
      messages: true,
      apps_sites: true,
    },
    buying_type: initialConfig.buying_type || "AUCTION", // Ensure buying_type is always included
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
        setIsCBO(false); // Switch to ABO if buying_type is RESERVED
      }

      if (
        name === "campaign_budget_optimization" &&
        value !== "AD_SET_BUDGET_OPTIMIZATION"
      ) {
        newConfig.buying_type = "AUCTION";
      }

      // Update showEndDate based on the new configuration
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

  // Update showEndDate whenever CBO/ABO is toggled
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
              <label htmlFor="performance_goal">Performance Goal:</label>
              <select
                id="performance_goal"
                name="performance_goal"
                value={config.performance_goal}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Select</option>
                {/* Add your options here */}
              </select>
            </div>

            <div className={styles.column}>
              <label htmlFor="facebook_page">Facebook Page:</label>
              <select
                id="facebook_page"
                name="facebook_page"
                value={config.facebook_page}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Select</option>
                {/* Add your options here */}
              </select>
            </div>

            <div className={styles.column}>
              <label htmlFor="instagram_account">
                Instagram Account (Optional):
              </label>
              <select
                id="instagram_account"
                name="instagram_account"
                value={config.instagram_account}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Select</option>
                {/* Add your options here */}
              </select>
            </div>
          </div>
        )}
        <hr className={styles.sectionDivider} />
      </div>

      <div className={styles.sectionBox}>
  <div className={styles.sectionHeader} onClick={() => toggleSection('placements')}>
    <h3>Placements</h3>
    <img
      src="/assets/Vectorw.svg"
      alt="Toggle Section"
      className={`${styles.toggleIcon} ${expandedSections['placements'] ? styles.expanded : ''}`}
    />
  </div>
  {expandedSections['placements'] && (
    <div className={styles.sectionContent}>
      <div className={styles.placementToggle}>
        <button
          type="button"
          className={`${styles.toggleButton} ${config.placement_type === 'Advantage' ? styles.active : ''}`}
          onClick={() => handlePlacementTypeChange({ target: { value: 'Advantage' } })}
        >
          On
        </button>
        <button
          type="button"
          className={`${styles.toggleButton} ${styles.lastButton} ${config.placement_type === 'Manual' ? styles.active : ''}`}
          onClick={() => handlePlacementTypeChange({ target: { value: 'Manual' } })}
        >
          Off
        </button>
        <span className={styles.optimizationLabel}>ADVANTAGE+ PLACEMENTS</span>
      </div>

      <div className={`${styles.manualOptions} ${config.placement_type === 'Advantage' ? styles.disabled : ''}`}>
        <h4>Platforms</h4>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.platforms.facebook}
              onChange={handlePlatformChange}
              name="facebook"
              disabled={config.placement_type === 'Advantage'}
              classes={{ root: styles.MuiCheckboxRoot }}
            />
          }
          label="Facebook"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={config.platforms.instagram}
              onChange={handlePlatformChange}
              name="instagram"
              disabled={config.placement_type === 'Advantage'}
              classes={{ root: styles.MuiCheckboxRoot }}
            />
          }
          label="Instagram"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={config.platforms.audience_network}
              onChange={handlePlatformChange}
              name="audience_network"
              disabled={config.placement_type === 'Advantage'}
              classes={{ root: styles.MuiCheckboxRoot }}
            />
          }
          label="Audience Network"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={config.platforms.messenger}
              onChange={handlePlatformChange}
              name="messenger"
              disabled={config.placement_type === 'Advantage'}
              classes={{ root: styles.MuiCheckboxRoot }}
            />
          }
          label="Messenger"
        />

        <h4>Placements</h4>
        <FormControlLabel
          control={
            <Checkbox
              checked={config.placements.feeds}
              onChange={handlePlacementChange}
              name="feeds"
              disabled={config.placement_type === 'Advantage'}
              classes={{ root: styles.MuiCheckboxRoot }}
            />
          }
          label="Feeds"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={config.placements.stories}
              onChange={handlePlacementChange}
              name="stories"
              disabled={config.placement_type === 'Advantage'}
              classes={{ root: styles.MuiCheckboxRoot }}
            />
          }
          label="Stories"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={config.placements.in_stream}
              onChange={handlePlacementChange}
              name="in_stream"
              disabled={config.placement_type === 'Advantage'}
              classes={{ root: styles.MuiCheckboxRoot }}
            />
          }
          label="In-stream ads for videos and reels"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={config.placements.search}
              onChange={handlePlacementChange}
              name="search"
              disabled={config.placement_type === 'Advantage'}
              classes={{ root: styles.MuiCheckboxRoot }}
            />
          }
          label="Search results"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={config.placements.messages}
              onChange={handlePlacementChange}
              name="messages"
              disabled={config.placement_type === 'Advantage'}
              classes={{ root: styles.MuiCheckboxRoot }}
            />
          }
          label="Messages"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={config.placements.apps_sites}
              onChange={handlePlacementChange}
              name="apps_sites"
              disabled={config.placement_type === 'Advantage'}
              classes={{ root: styles.MuiCheckboxRoot }}
            />
          }
          label="Apps and sites"
        />
      </div>
    </div>
  )}
  <hr className={styles.sectionDivider} />
</div>

    {/* Targeting & Delivery Section */}
<div className={styles.sectionBox}>
        <div className={styles.sectionHeader} onClick={() => toggleSection('targetingDelivery')}>
            <h3>Targeting & Delivery</h3>
            <img
                src="/assets/Vectorw.svg"
                alt="Toggle Section"
                className={`${styles.toggleIcon} ${expandedSections['targetingDelivery'] ? styles.expanded : ''}`}
            />
        </div>
        {expandedSections['targetingDelivery'] && (
            <div className={styles.sectionContent}>
                <div className={styles.budgetOptimizationToggle}>
                    <button
                        type="button"
                        className={`${styles.toggleButton} ${config.targeting_type === 'Advantage' ? styles.active : ''}`}
                        onClick={() => handleTargetingTypeChange({ target: { value: 'Advantage' } })}
                    >
                        On
                    </button>
                    <button
                        type="button"
                        className={`${styles.toggleButton} ${styles.lastButton} ${config.targeting_type === 'Manual' ? styles.active : ''}`}
                        onClick={() => handleTargetingTypeChange({ target: { value: 'Manual' } })}
                    >
                        Off
                    </button>
                    <span className={styles.optimizationLabel}>ADVANTAGE+ AUDIENCE</span>
                </div>

                {/* Location, Age Range, Gender */}
                <div className={styles.column}>
                    <label htmlFor="location" className={styles.labelText}>Location:</label>
                    <select
                        id="location"
                        name="location"
                        value={config.location}
                        onChange={handleChange}
                        className={styles.selectField}
                    >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        {/* Add more options as needed */}
                    </select>
                </div>

                <div className={styles.column}>
                    <label htmlFor="age_range" className={styles.labelText}>Age Range:</label>
                    <div className={styles.ageRangeContainer}>
                        <select
                            id="age_range_min"
                            name="age_range_min"
                            value={config.age_range_min}
                            onChange={handleChange}
                            className={styles.selectField}
                        >
                            {[...Array(48).keys()].map(age => (
                                <option key={age + 18} value={age + 18}>{age + 18}</option>
                            ))}
                        </select>
                        <span className={styles.ageRangeSeparator}>To</span>
                        <select
                            id="age_range_max"
                            name="age_range_max"
                            value={config.age_range_max}
                            onChange={handleChange}
                            className={styles.selectField}
                        >
                            {[...Array(48).keys()].map(age => (
                                <option key={age + 18} value={age + 18}>{age + 18}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.column}>
                    <label htmlFor="gender" className={styles.labelText}>Gender:</label>
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
            </div>
        )}
        <hr className={styles.sectionDivider} />
    </div>     

      {/* Campaign & Tracking Section */}
      <div className={styles.sectionBox}>
        <div className={styles.sectionHeader} onClick={() => toggleSection('campaignTracking')}>
          <h3>Campaign & Tracking</h3>
          <img
            src="/assets/Vectorw.svg"
            alt="Toggle Section"
            className={`${styles.toggleIcon} ${expandedSections['campaignTracking'] ? styles.expanded : ''}`}
          />
        </div>
        {expandedSections['campaignTracking'] && (
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
                <option value="Single image or video">Single image or video</option>
                <option value="Carousel">Carousel</option>
              </select>
            </div>

            <div className={styles.column}>
              <label className={styles.labelText} htmlFor="ad_creative_primary_text">
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
              <label className={styles.labelText} htmlFor="ad_creative_headline">
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
              <label className={styles.labelText} htmlFor="ad_creative_description">
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
                URL Parameters:
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
                <label className={styles.labelText} htmlFor="campaignName">Campaign Name:</label>
                <input
                  type="text"
                  id="campaignName"
                  name="campaignName"
                  placeholder='Enter Name'
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
};

export default ConfigForm;
