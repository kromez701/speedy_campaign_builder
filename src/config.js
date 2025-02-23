const config = {
    apiUrl: process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:5000',
    facebookAdsApiUrl: process.env.REACT_APP_FACEBOOK_ADS_API_URL || 'http://localhost:5001',
    stripePublishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51PiyL901UFm1325d6TwRCbSil7dWz63iOlmtqEZV6uLOQhXZSPwqhZPZ1taioo9s6g1IAbFjsD4OV6q4zWcv1ycV00fISOFZLY',
    appId: process.env.REACT_APP_APP_ID || '1153977715716035',
    appSecret: process.env.REACT_APP_APP_SECRET || '30d73e973e26535fc1e445f2e0b16cb7',
  };
  
  export default config;
  