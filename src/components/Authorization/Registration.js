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

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State to hold user data
  const [userData, setUserData] = useState({
    username: '',
    email: '',
  });

  useEffect(() => {
    const fetchSessionDetails = async () => {
      const queryParams = new URLSearchParams(location.search);
      const sessionId = queryParams.get('session_id');

      if (!sessionId) {
        toast.error('Invalid session. Please check your email.');
        navigate('/');
        return;
      }

      try {
        const response = await axios.get(`${apiUrl}/payment/get-checkout-session?session_id=${sessionId}`);
        if (response.data && response.data.email && response.data.name) {
          setUserData({
            username: response.data.name,  // Populate the name as username
            email: response.data.email,
          });
        } else {
          toast.error('Invalid session details. Please check your email.');
          navigate('/');
        }
      } catch (error) {
        toast.error('Failed to retrieve session details.');
        navigate('/');
      }
    };

    fetchSessionDetails();
  }, [location, navigate]);

  const initialValues = {
    username: userData.username || '',
    email: userData.email || '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const onSubmit = async (values) => {
    // Ensure updatedEmail is not null or undefined by providing a fallback to original email
    const updatedEmail = values.email ? values.email.trim() : userData.email;
  
    const requestData = {
      originalEmail: userData.email,  // Email from session details
      updatedEmail: updatedEmail,     // Use form email or fallback to original email
      username: values.username,
      password: values.password,
    };
  
    console.log('Submitting request data:', requestData);
  
    try {
      const updateResponse = await axios.post(
        `${apiUrl}/auth/update-user`,
        requestData,
        { withCredentials: true }
      );
  
      if (updateResponse.status === 200) {
        toast.success('Profile updated successfully!');
        window.location.href = updateResponse.data.redirect_url;
      }
    } catch (error) {
      console.error('Error response:', error.response);
      toast.error(error.response?.data?.message || 'Failed to update profile. Please try again.');
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
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            const requestData = {
              originalEmail: userData.email,  // Original email from session details
              updatedEmail: values.email,     // User-modified email from form
              username: values.username,
              password: values.password,
            };

            onSubmit(requestData);
          }}
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
                placeholder="Email"
                className={styles['form-input']}
                value={values.email}
                onChange={(e) => setFieldValue('email', e.target.value)}
              />
              <ErrorMessage name="email" component="div" className={styles.error} />

              <PasswordField
                name="password"
                placeholder="Password"
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />

              <PasswordField
                name="confirmPassword"
                placeholder="Confirm Password"
                showPassword={showConfirmPassword}
                setShowPassword={setShowConfirmPassword}
              />

              <button type="submit" className={styles['option-button']}>
                Finish
              </button>
            </Form>
          )}
        </Formik>

        <div className={styles.switchLink} onClick={() => navigate('/login')}>
          <span className={styles.linkText}>Back to Login</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
