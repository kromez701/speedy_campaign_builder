import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import styles from './Auth.module.css';
import config from '../../config';

const apiUrl = config.apiUrl;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Extract token from the query params
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing reset password link.');
      navigate('/login'); // Redirect to login page
    }
  }, [token, navigate]);

  const initialValues = {
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const onSubmit = async (values) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/reset_password`, {
        token,
        newPassword: values.password,
      });
      if (response.status === 200) {
        toast.success('Password reset successfully! Please log in.');
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password.');
    }
  };

  return (
    <div className={styles['page-container']}>
        <Link to="/">
            <img src="./assets/logo-header.png" alt="Logo" className={styles['logo-header']} />
        </Link>
      <div className={styles.container}>
        <h1>Reset Password</h1>
        <p>Enter a new password to reset your account.</p>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className={styles['form-container']}>
            <div className={styles['password-container']}>
              <Field
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="New Password"
                className={styles['form-input']}
              />
              <img
                src={showPassword ? './assets/eye-off.svg' : './assets/eye.svg'}
                alt="Toggle Password"
                className={styles['password-toggle']}
                onClick={() => setShowPassword(!showPassword)}
              />
              <ErrorMessage name="password" component="div" className={styles.error} />
            </div>
            <div className={styles['password-container']}>
              <Field
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                className={styles['form-input']}
              />
              <img
                src={showConfirmPassword ? './assets/eye-off.svg' : './assets/eye.svg'}
                alt="Toggle Password"
                className={styles['password-toggle']}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
              <ErrorMessage name="confirmPassword" component="div" className={styles.error} />
            </div>
            <button type="submit" className={styles['option-button']}>
              Reset Password
            </button>
            <div className={styles.switchLink} onClick={() => navigate('/login')}>
                <span className={styles.linkText}>Back to Login</span>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default ResetPassword;
