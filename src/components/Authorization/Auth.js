import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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

const Auth = ({ mode, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [remember, setRemember] = useState(false);
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
    if (isForgotPassword) {
        url = `http://localhost:5000/auth/forgot_password`;
        try {
            const response = await axios.post(url, {
                email: values.email,
                newPassword: values.password,  // Send the new password along with the email
                confirmPassword: values.confirmPassword  // Optionally send confirmation password too
            });
            if (response.status === 200) {
                setErrorMessage('Password reset link sent! Check your email.');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again.');
        }
    } else if (location.pathname.startsWith('/reset_password')) {
        const token = location.pathname.split('/').pop(); // Extract token from URL
        url = `http://localhost:5000/auth/reset_password/${token}`;
        try {
            const response = await axios.post(url, { password: values.password });
            if (response.status === 200) {
                setErrorMessage('Password reset successfully! You can now log in.');
                navigate('/login'); // Use navigate instead of history.push
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again.');
        }
    } else if (isLogin) {
        url = 'http://localhost:5000/auth/login';
        try {
            const response = await axios.post(url, values, { withCredentials: true });
            if (response.status === 200 || response.status === 201) {
                onAuthSuccess();
                resetForm();
                setErrorMessage('');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again.');
        }
    } else {
        url = 'http://localhost:5000/auth/register';
        try {
            const response = await axios.post(url, values, { withCredentials: true });
            if (response.status === 200 || response.status === 201) {
                onAuthSuccess();
                resetForm();
                setErrorMessage('');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again.');
        }
    }
};

  const responseGoogle = async ({ accessToken, remember }) => {
    try {
      await axios.post('http://localhost:5000/auth/google', { token: accessToken, remember }, { withCredentials: true });
      onAuthSuccess();
    } catch (error) {
      setErrorMessage('Failed to authenticate with Google.');
    }
  };

  const responseGoogleError = (error) => {
    setErrorMessage('Failed to authenticate with Google.');
  };

  return (
    <GoogleOAuthProvider clientId='362986823691-u76e3r421e7ts51cphcpcitihpu6ks51.apps.googleusercontent.com'>
      <div className={styles['page-container']}>
        <Link to="/">
          <img src="/assets/logo-header.png" alt="Logo" className={styles['logo-header']} />
        </Link>
        <div className={styles.container}>
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
                {isLogin && (
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
            </div>
          )}
          <div className={styles.switchLink} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span className={styles.linkText}>
              {isLogin ? 'Register' : 'Sign in'}
            </span>
          </div>
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
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Auth;
