import React, { useEffect, useState } from "react";
import '../Register/Register.css';
import logo from '../../assets/bunnylogo.png'; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
   const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < 19; i++) {
      pass += chars[Math.floor(Math.random() * chars.length)];
    }
    return pass;
  };

  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => {
        setGeneratedPassword(generatePassword());
        setStep(3);
      }, 2000); // simulate loading
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleNext = () => {
    if (username.trim() !== '') {
      setStep(2);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPassword);
     setCopied(true);
     setTimeout(() => setCopied(false), 2000);
  };

  const registerUser = async () => {
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          username: username, 
          password: generatedPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('User registered successfully!');
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);
        navigate('/login');
      } else {
        alert('Error: ' + data.msg);
      }
    } catch (error) {
       console.error('Registration error:', error);
      alert('Server error. Try again later.');
    }
  };

  return (
    <div className="register-fullscreen">
      <img src={logo} alt="Logo" className="register-logo cyber-logo" />
      {step === 1 && (
        <>
          <h2 className="register-heading">OI OI</h2>
          <p className="register-description">Create your username</p>
          <input
            required
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="register-input"
          />
          <button className="register-button" onClick={handleNext}>
            Next
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="register-heading">OI OI</h2>
          <p className="register-description">Please wait a brief moment...</p>
          <p className="register-description">The password is being requested</p>
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="register-heading">OI OI</h2>
          <p className="register-description">Your secure password below</p>
          <p className="register-description">Please copy your password and save somewhere secure. <b>We recommend keepass.</b></p>
          <div className="password-display">
            <button className="copy-button" onClick={handleCopy}>
              Copy
            </button>
            <span className="password-text">{generatedPassword}</span>
          </div>

           {copied && (
            <div style={{
              color: '#00ff00',
              backgroundColor: '#000',
              padding: '10px',
              borderRadius: '5px',
              fontFamily: 'monospace',
              marginTop: '10px'
            }}>
              Copied to clipboard
            </div>
          )}

          <button className="register-button access-button" onClick={registerUser}>Access</button>
        </>
      )}
    </div>
  );
}