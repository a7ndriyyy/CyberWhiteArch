import React from "react";
import "./RegistrationSuccess.css";
import logoHome from '../../src/assets/logoHome.png'; // Adjust the path as necessary

const RegistrationSuccess = ({ onStartSetup }) => {
  return (
    <div className="registration-success-container">
      <div>
        <img src={logoHome} alt="Placeholder Image" className='logoimage cyber-logo' />
      </div>
      <h2 className="register-style">You've successfully registered.</h2>
      <button className="start-setup-btn" onClick={onStartSetup}>
        Start Setup
      </button>
    </div>
  );
};

export default RegistrationSuccess;
