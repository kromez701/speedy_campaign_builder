import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PaymentSuccess.module.css';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.paymentSuccess}>
      <div className={styles.successMessageContainer}>
        <h2 className={styles.successHeading}>Subscription Successful !</h2>
        <p className={styles.successText}>
          Thank you for your subscription. Your journey towards effective ad management starts now!
        </p>
        <button onClick={() => navigate('/')} className={styles.successButton}>
          Go home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
