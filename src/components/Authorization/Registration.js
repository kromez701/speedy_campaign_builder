import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Auth.module.css';
import config from '../../config';
import axios from 'axios';

const apiUrl = config.apiUrl;

const PasswordField = ({ name, placeholder, showPassword, setShowPassword }) => (
  <div className={styles['password-container']}>
    <Field
      type={showPassword ? 'text' : 'password'}
      name={name}
      placeholder={placeholder}
      className={styles['form-input']}
    />
    <img
      src={showPassword ? '/assets/eye-off.svg' : '/assets/eye.svg'}
      alt="Toggle Password"
      className={styles['password-toggle']}
      onClick={() => setShowPassword(!showPassword)}
    />
    <ErrorMessage name={name} component="div" className={styles.error} />
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sessionId, setSessionId] = useState(null); // ✅ Store sessionId in state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    email: '', // ✅ Ensure email is blank initially
  });

  useEffect(() => {
    const fetchSessionDetails = async () => {
      const queryParams = new URLSearchParams(location.search);
      const sessionIdParam = queryParams.get('session_id');

      if (!sessionIdParam) {
        toast.error('Invalid session. Please check your email.');
        navigate('/');
        return;
      }

      setSessionId(sessionIdParam); // ✅ Store sessionId in state

      try {
        const response = await axios.get(`${apiUrl}/payment/get-checkout-session?session_id=${sessionIdParam}`);
        if (response.data && response.data.name) {
          setUserData({
            username: response.data.name,
            email: '', // ✅ Force email field to be empty
          });
        }
      } catch (error) {
        toast.error('Failed to retrieve session details.');
        navigate('/');
      }
    };

    fetchSessionDetails();
  }, [location, navigate]);

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const onSubmit = async (values) => {
    if (!sessionId) {
      toast.error('Session ID is missing. Please refresh the page.');
      return;
    }

    try {
      const requestData = {
        originalEmail: `anon_${sessionId}@quickcampaigns.io`, 
        updatedEmail: values.email.trim(),
        username: values.username,
        password: values.password,
      };

      const updateResponse = await axios.post(`${apiUrl}/auth/update-user`, requestData, { withCredentials: true });

      if (updateResponse.status === 200) {
        toast.success('Profile updated successfully!');
        window.location.href = updateResponse.data.redirect_url;
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile. Please try again.');
    }
  };

  return (
    <div className={styles['page-container']}>
      <Link to="/">
        <img src="/assets/logo-header.png" alt="Logo" className={styles['logo-header']} />
      </Link>
      <div className={styles.container}>
        <h1>Complete Your Registration</h1>
        <p>Set your username and password to proceed.</p>

        <Formik
          initialValues={{
            username: userData.username || '',
            email: '', // ✅ Email starts empty
            password: '',
            confirmPassword: '',
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize={true}
        >
          {({ values, setFieldValue }) => (
            <Form className={styles['form-container']}>
              <Field
                type="text"
                name="username"
                placeholder="Username"
                className={styles['form-input']}
                value={values.username}
                onChange={(e) => setFieldValue('username', e.target.value)}
              />
              <ErrorMessage name="username" component="div" className={styles.error} />

              <Field
                type="email"
                name="email"
                placeholder="Enter your email"
                className={styles['form-input']}
                value={values.email}
                onChange={(e) => setFieldValue('email', e.target.value)}
              />
              <ErrorMessage name="email" component="div" className={styles.error} />

              <PasswordField name="password" placeholder="Password" showPassword={showPassword} setShowPassword={setShowPassword} />
              <PasswordField name="confirmPassword" placeholder="Confirm Password" showPassword={showConfirmPassword} setShowPassword={setShowConfirmPassword} />

              <button type="submit" className={styles['option-button']}>Finish</button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
