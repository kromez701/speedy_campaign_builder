import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
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
        console.log('Google token response:', tokenResponse);
        const accessToken = tokenResponse.access_token;
        if (!accessToken) {
          throw new Error('No access token found in the response.');
        }
        console.log('Access Token:', accessToken);
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

const Auth = ({ mode, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [remember, setRemember] = useState(false);

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
    name: isLogin ? Yup.string() : Yup.string().required('Required'),
    email: Yup.string().email('Invalid email format').required('Required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
    confirmPassword: isLogin
      ? Yup.string()
      : Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Required'),
  });

  const onSubmit = async (values, { resetForm }) => {
    const url = isLogin ? 'http://localhost:5000/auth/login' : 'http://localhost:5000/auth/register';
    try {
      const response = await axios.post(url, values, { withCredentials: true });
      if (response.status === 200 || response.status === 201) {
        onAuthSuccess();
        resetForm();
        setErrorMessage('');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };

  const responseGoogle = async ({ accessToken, remember }) => {
    try {
      const res = await axios.post('http://localhost:5000/auth/google', { token: accessToken, remember }, { withCredentials: true });
      console.log('User info:', res.data);
      onAuthSuccess();
    } catch (error) {
      console.error('Error verifying token:', error);
      setErrorMessage('Failed to authenticate with Google.');
    }
  };

  const responseGoogleError = (error) => {
    console.error('Google login error:', error);
    setErrorMessage('Failed to authenticate with Google.');
  };

  return (
    <GoogleOAuthProvider clientId='362986823691-u76e3r421e7ts51cphcpcitihpu6ks51.apps.googleusercontent.com'>
      <div className={styles['modal-background']}>
        <div className={styles.container}>
          <img
            src="/assets/xdark.svg"
            alt="Close"
            className={styles.closeIcon}
            onClick={onClose}
          />
          <h1>{isLogin ? 'Login' : 'Register'}</h1>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize={true}
          >
            {({ resetForm }) => (
              <Form className={styles['form-container']}>
                {errorMessage && <div className={styles.error}>{errorMessage}</div>}
                {!isLogin && (
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
                <PasswordField
                  name="password"
                  placeholder="Password"
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
                {!isLogin && (
                  <PasswordField
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    showPassword={showConfirmPassword}
                    setShowPassword={setShowConfirmPassword}
                  />
                )}
                {isLogin && (
                  <div className={styles['remember-me']}>
                    <Field type="checkbox" name="remember" checked={remember} onChange={() => setRemember(!remember)} />
                    <label className={styles['remember-me-text']} htmlFor="remember">Remember me</label>
                  </div>
                )}
                <button type="submit" className={styles['option-button']}>
                  {isLogin ? 'Sign In' : 'Create account'}
                </button>
              </Form>
            )}
          </Formik>
          <div className={styles.socialLogin}>
            <CustomGoogleLogin isLogin={isLogin} onSuccess={responseGoogle} onError={responseGoogleError} remember={remember} />
          </div>
          <div className={styles.switchLink} onClick={() => {
            setIsLogin(!isLogin);
            setErrorMessage('');
          }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span className={styles.linkText}>
              {isLogin ? 'Register' : 'Sign in'}
            </span>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Auth;
