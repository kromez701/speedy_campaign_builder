/* global FB */

import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import '../ToastifyOverrides.css';
import styles from './Auth.module.css';

const PasswordField = ({ name, placeholder, showPassword, setShowPassword }) => (
  <div className={styles['password-container']}>
    <Field
      type={showPassword ? "text" : "password"}
      name={name}
      placeholder={placeholder}
      className={styles['form-input']}
    />
    <img
      src={showPassword ? "/assets/eye-off.svg" : "/assets/eye.svg"}
      alt="Toggle Password"
      className={styles['password-toggle']}
      onClick={() => setShowPassword(!showPassword)}
    />
    <ErrorMessage name={name} component="div" className={styles.error} />
  </div>
);

const CustomGoogleLogin = ({ isLogin, onSuccess, onError, remember }) => {
  const login = useGoogleLogin({
    onSuccess: async tokenResponse => {
      try {
        const accessToken = tokenResponse.access_token;
        if (!accessToken) {
          throw new Error('No access token found in the response.');
        }
        onSuccess({ accessToken, remember });
      } catch (error) {
        onError(error);
      }
    },
    onError: error => onError(error),
    clientId: '362986823691-u76e3r421e7ts51cphcpcitihpu6ks51.apps.googleusercontent.com'
  });

  return (
    <button className={`${styles['social-button']} ${styles.googleLogin}`} onClick={() => login()}>
      <img src="/assets/google-icon.png" alt="Google icon" className={styles.icon} />
      {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
    </button>
  );
};

const CustomFacebookLogin = ({ isLogin, onSuccess, onError }) => {
  useEffect(() => {
    // Load the Facebook SDK script asynchronously
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  
    // Initialize the Facebook SDK once the script has loaded
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '1153977715716035',
        cookie     : true,
        xfbml      : true,
        version    : 'v20.0'
      });
  
      FB.getLoginStatus(function(response) {
        console.log('FB SDK Initialized', response);
      });
    };
  }, []);
  

  const handleFacebookLogin = () => {
    FB.login(response => {
      if (response.authResponse) {
        const accessToken = response.authResponse.accessToken;
        console.log(response.authResponse);
  
        axios.get(`https://graph.facebook.com/v12.0/me`, {
          params: {
            fields: 'id,name,email',
            access_token: accessToken
          }
        }).then(userInfoResponse => {
          const { id, name, email } = userInfoResponse.data;
          console.log('User Info:', { id, name, email });
  
          // Call onSuccess without making it async within FB.login
          onSuccess({ accessToken, name, email });
        }).catch(error => {
          console.error('Error fetching user info from Facebook:', error);
          onError('Failed to retrieve user info from Facebook.');
        });
  
      } else {
        toast.error('Facebook login failed or was cancelled.');
      }
    }, { scope: 'ads_management,ads_read' });
  };
  

  return (
    <button className={`${styles['social-button']} ${styles.facebookLogin}`} onClick={handleFacebookLogin}>
      <img src="/assets/facebook-icon.png" alt="Facebook icon" className={styles.icon} />
      {isLogin ? 'Sign in with Facebook' : 'Sign up with Facebook'}
    </button>
  );
};

const Auth = ({ mode, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [remember, setRemember] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false); // For email verification
  const [isPasswordResetSent, setIsPasswordResetSent] = useState(false); // For password reset confirmation
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLogin(mode === 'login');
    setErrorMessage('');
  }, [mode]);

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    remember: false,
  };

  const validationSchema = Yup.object({
    name: !isLogin && !isForgotPassword ? Yup.string().required('Required') : Yup.string(),
    email: Yup.string().email('Invalid email format').required('Required'),
    password: !isForgotPassword ? Yup.string().min(6, 'Password must be at least 6 characters').required('Required') : Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
    confirmPassword: (!isLogin && !isForgotPassword) || isForgotPassword
      ? Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Required')
      : Yup.string(),
  });

  const onSubmit = async (values, { resetForm }) => {
    let url = '';
    if (isForgotPassword) {  // Forgot Password case
      url = `https://backend.quickcampaigns.io/auth/forgot_password`;
      try {
        const response = await axios.post(url, {
          email: values.email,
          newPassword: values.password,
          confirmPassword: values.confirmPassword
        });
        if (response.status === 200) {
          setIsPasswordResetSent(true); // Trigger password reset confirmation screen
          toast.success('Password reset link sent to your email.');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
      }
    } else if (location.pathname.startsWith('/reset_password')) {
      const token = location.pathname.split('/').pop(); // Extract token from URL
      url = `https://backend.quickcampaigns.io/auth/reset_password/${token}`;
      try {
        const response = await axios.post(url, { password: values.password });
        if (response.status === 200) {
          toast.success('Password reset successfully! You can now log in.');
          navigate('/login');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
      }
    } else if (isLogin) {  // Login case
      url = 'https://backend.quickcampaigns.io/auth/login';
      try {
        const response = await axios.post(url, values, { withCredentials: true });
        if (response.status === 200 || response.status === 201) {
          onAuthSuccess();
          resetForm();
          toast.success('Logged in successfully!');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
      }
    } else {  // Registration case
      url = 'https://backend.quickcampaigns.io/auth/register';
      try {
        const response = await axios.post(url, values, { withCredentials: true });
        if (response.status === 200 || response.status === 201) {
          setIsEmailSent(true); // Trigger email verification screen
          toast.success('Registration successful! Please check your email for verification.');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
      }
    }
  };

  const responseGoogle = async ({ accessToken, remember }) => {
    try {
      await axios.post('https://backend.quickcampaigns.io/auth/google', { token: accessToken, remember }, { withCredentials: true });
      onAuthSuccess();
      toast.success('Logged in with Google successfully!');
    } catch (error) {
      toast.error('Failed to authenticate with Google.');
    }
  };

  const responseGoogleError = (error) => {
    toast.error('Failed to authenticate with Google.');
  };

  const responseFacebook = async ({ accessToken, name, email }) => {
    try {
      await axios.post('https://backend.quickcampaigns.io/auth/facebook', { accessToken, name, email }, { withCredentials: true });
      onAuthSuccess();
      toast.success('Logged in with Facebook successfully!');
    } catch (error) {
      toast.error('Failed to authenticate with Facebook.');
    }
  };

  return (
    <GoogleOAuthProvider clientId='362986823691-u76e3r421e7ts51cphcpcitihpu6ks51.apps.googleusercontent.com'>
      <div className={styles['page-container']}>
        <Link to="/">
          <img src="/assets/logo-header.png" alt="Logo" className={styles['logo-header']} />
        </Link>
        <div className={styles.container}>
          {isEmailSent ? ( // Email verification screen
            <>
              <h1>Email Sent</h1>
              <p>An email has been sent to verify your account. Please check your inbox and click the verification link. Once verified, come back to login.</p>
              <span
                className={styles.linkText}
                onClick={() => {
                  setIsEmailSent(false);
                  navigate('/login');
                }}
              >
                Back to Login
              </span>
            </>
          ) : isPasswordResetSent ? ( // Password reset confirmation screen
            <>
              <h1>Password Reset</h1>
              <p>Password reset link sent to your email address.</p>
              <span
                className={styles.linkText}
                onClick={() => {
                  setIsPasswordResetSent(false);
                  navigate('/login');
                }}
              >
                Back to Login
              </span>
            </>
          ) : ( // Original Forms: Login, Register, Reset Password
            <>
              <h1>{isForgotPassword ? 'Reset Password' : isLogin ? 'Login' : 'Register'}</h1>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                enableReinitialize={true}
              >
                {() => (
                  <Form className={styles['form-container']}>
                    {errorMessage && <div className={styles.error}>{errorMessage}</div>}
                    {!isLogin && !isForgotPassword && (
                      <>
                        <Field
                          type="text"
                          name="name"
                          placeholder="Name"
                          className={styles['form-input']}
                        />
                        <ErrorMessage name="name" component="div" className={styles.error} />
                      </>
                    )}
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email"
                      className={styles['form-input']}
                    />
                    <ErrorMessage name="email" component="div" className={styles.error} />
                    {(!isForgotPassword || !isLogin) && (
                      <PasswordField
                        name="password"
                        placeholder="Password"
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                      />
                    )}
                    {!isLogin && !isForgotPassword && (
                      <PasswordField
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        showPassword={showConfirmPassword}
                        setShowPassword={setShowConfirmPassword}
                      />
                    )}
                    {isForgotPassword && (
                      <>
                        <PasswordField
                          name="password"
                          placeholder="New Password"
                          showPassword={showPassword}
                          setShowPassword={setShowPassword}
                        />
                        <PasswordField
                          name="confirmPassword"
                          placeholder="Confirm New Password"
                          showPassword={showConfirmPassword}
                          setShowPassword={setShowConfirmPassword}
                        />
                      </>
                    )}
                    {isLogin && !isForgotPassword && (
                      <div className={styles['remember-me']}>
                        <Field type="checkbox" name="remember" checked={remember} onChange={() => setRemember(!remember)} />
                        <label className={styles['remember-me-text']} htmlFor="remember">Remember me</label>
                      </div>
                    )}
                    <button type="submit" className={styles['option-button']}>
                      {isForgotPassword ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Create account'}
                    </button>
                  </Form>
                )}
              </Formik>
              {!isForgotPassword && (
                <div className={styles.socialLogin}>
                  <CustomGoogleLogin isLogin={isLogin} onSuccess={responseGoogle} onError={responseGoogleError} remember={remember} />
                  <CustomFacebookLogin isLogin={isLogin} onSuccess={responseFacebook} onError={responseGoogleError} />
                </div>
              )}
              {!isForgotPassword && (
                <div className={styles.switchLink} onClick={() => setIsLogin(!isLogin)}>
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  <span className={styles.linkText}>
                    {isLogin ? 'Register' : 'Sign in'}
                  </span>
                </div>
              )}
              {isLogin && !isForgotPassword && (
                <div className={styles.switchLink} onClick={() => setIsForgotPassword(true)}>
                  <span className={styles.linkText}>Forgot your password?</span>
                </div>
              )}
              {isForgotPassword && (
                <div className={styles.switchLink} onClick={() => setIsForgotPassword(false)}>
                  <span className={styles.linkText}>Back to Login</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Auth;
