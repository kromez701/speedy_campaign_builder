// SuccessScreen.js
import React from 'react';
import PropTypes from 'prop-types';
import styles from './SuccessScreen.module.css';

const SuccessScreen = ({ onGoBack }) => {
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.heading}>Success!</h2>
        <p>Your ad campaign has been successfully created.</p>
        <button className={styles.successGoBackButton} onClick={onGoBack}>Go Back</button>
      </div>
    </div>
  );
};

SuccessScreen.propTypes = {
  onGoBack: PropTypes.func.isRequired,
};

export default SuccessScreen;
