import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './PricingSection.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../ToastifyOverrides.css';
import config from '../../config';

const apiUrl = config.apiUrl;
const stripePublishableKey = config.stripePublishableKey;

const SubscriptionPlan = ({ onPlanUpgrade }) => {
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [hasUsedFreeTrial, setHasUsedFreeTrial] = useState(false);
  const [adAccounts, setAdAccounts] = useState([]);
  const [selectedAdAccountId, setSelectedAdAccountId] = useState(null);

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/payment/user-subscription-status`, { withCredentials: true });
        setCurrentPlan(response.data.plan);
        setHasUsedFreeTrial(response.data.has_used_free_trial);

        const adAccountsResponse = await axios.get(`${apiUrl}/auth/ad_accounts`, { withCredentials: true });
        setAdAccounts(adAccountsResponse.data.ad_accounts);

        if (adAccountsResponse.data.ad_accounts.length > 0) {
          setSelectedAdAccountId(adAccountsResponse.data.ad_accounts[0].id);
        }
      } catch (error) {
        console.error('Error fetching subscription details', error);
      }
    };
    fetchSubscriptionDetails();
  }, []);

  const handleSubscribe = async (plan) => {
    if (!selectedAdAccountId) {
      toast.warn('Please select an ad account before subscribing.');
      return;
    }

    if (plan === 'Free Trial' && hasUsedFreeTrial) {
      toast.info('You have already used the Free Trial. Please choose a different plan.');
      return;
    }

    try {
      const adAccountResponse = await axios.get(
        `${apiUrl}/payment/subscription-status/${selectedAdAccountId}`,
        { withCredentials: true }
      );
      const { plan: adAccountPlan, is_active: adAccountIsActive } = adAccountResponse.data;

      if (plan === adAccountPlan && adAccountIsActive) {
        toast.info(`You are already subscribed to the ${plan} plan.`);
        return;
      }

      const response = await axios.post(
        `${apiUrl}/payment/create-checkout-session`,
        { plan, ad_account_id: selectedAdAccountId },
        { withCredentials: true }
      );

      if (response.data.sessionId) {
        const stripe = window.Stripe(stripePublishableKey);
        stripe.redirectToCheckout({ sessionId: response.data.sessionId });
      } else if (response.data.message) {
        toast.success('Subscription successful! Thank you for subscribing.');

        // Update the current plan dynamically
        setCurrentPlan(plan);

        if (onPlanUpgrade) {
          onPlanUpgrade();
        }
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error subscribing', error);
      toast.error('Error subscribing: ' + error.message);
    }
  };

  const plans = [
    {
      name: "Professional",
      price: "$129.95/month",
      description: "Perfect for Individual Advertisers and Small Teams",
      features: [
        "Upload unlimited ads to 1 ad account.",
        "Perfect for solo marketers and small teams.",
        "Access all features and customization tools.",
        "Receive dedicated support for ad management.",
      ],
    },
    {
      name: "Enterprise",
      price: "$99.95/month",
      description: "Ideal for Agencies and Businesses",
      features: [
        "Upload unlimited ads to multiple ad accounts.",
        "Perfect for agencies and businesses.",
        "Access all features and customization tools.",
        "Receive dedicated support for ad management.",
      ],
    },
  ];

  return (
    <div className={styles.pricingSection}>
      <div className={styles.header}>
        <img
          src="/assets/Vector4.png"
          alt="Go Back"
          className={styles.goBackIcon}
          onClick={() => navigate('/')}
        />
        <p className={styles.priceHeading}>
          Choose the <span>Perfect Plan</span> for Your Needs
        </p>
      </div>
      <p className={styles.priceDesc}>Flexible Pricing to Suit Every Advertiser</p>
      <div className={styles.priceCardContainer}>
        {plans.map((plan, index) => (
          <div key={index} className={`${styles.priceCard} ${plan.name === "Professional" ? styles.popularPlan : ""}`}>
            <p className={styles.priceCardPrice}>{plan.price}</p>
            <p className={styles.priceCardAccounts}>
              {plan.name === "Enterprise" ? "For 2 or more ad accounts, with pricing per account." : "1 Ad Account"}
            </p>
            <p className={styles.priceCardPlan}>{plan.name} Plan</p>
            <p className={styles.priceCardPlanDesc}>{plan.description}</p>
            <div className={styles.priceCardFeatureContainer}>
              {plan.features.map((feature, i) => (
                <div key={i} className={styles.priceCardFeature}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="24" rx="12" fill="#378CE7" fillOpacity="0.7" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M17.0964 7.39016L9.93638 14.3002L8.03638 12.2702C7.68638 11.9402 7.13638 11.9202 6.73638 12.2002C6.34638 12.4902 6.23638 13.0002 6.47638 13.4102L8.72638 17.0702C8.94638 17.4102 9.32638 17.6202 9.75638 17.6202C10.1664 17.6202 10.5564 17.4102 10.7764 17.0702C11.1364 16.6002 18.0064 8.41016 18.0064 8.41016C18.9064 7.49016 17.8164 6.68016 17.0964 7.38016V7.39016Z" fill="#EEEEEE" />
                  </svg>
                  {feature}
                </div>
              ))}
            </div>
            <button
              onClick={() => handleSubscribe(plan.name)}
              style={{
                backgroundColor: currentPlan === plan.name ? 'white' : '#5356FF',
                color: currentPlan === plan.name ? '#5356FF' : '#fff',
                border: currentPlan === plan.name ? '1px solid #5356FF' : 'none',
              }}
              className={styles.priceStartBtn}
            >
              {currentPlan === plan.name ? 'Current Plan' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/')} className={`${styles.button} ${styles.goBackButton}`}>
        Go Back
      </button>
    </div>
  );
};

export default SubscriptionPlan;
