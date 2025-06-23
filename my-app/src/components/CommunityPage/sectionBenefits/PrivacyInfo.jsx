import React from 'react';
import './PrivacyInfo.css';
import UnionIcon from '../../../assets/icons/UnionIcon.png'; // Adjust the path as necessary
import mailIcon from '../../../assets/icons/mailIcon.png';
import LockIcon from '../../../assets/icons/LockIcon.png';
import TrackersIcon from '../../../assets/icons/TrackersIcon.png';
import openSourceIcon from '../../../assets/icons/openSourceicon.png';
import telIcon from '../../../assets/icons/telIcon.png';

const features = [
  { icon: UnionIcon, label: 'Full privacy' },
  { icon: mailIcon, label: 'No Email Required' },
  { icon: LockIcon, label: 'Data is Encrypted' },
  { icon: TrackersIcon, label: 'No trackers' },
  { icon: openSourceIcon, label: 'Full Open Source' },
  { icon: telIcon, label: 'No phone number required' },
];

const PrivacyInfo = () => (
  <section className="privacy-info-section">
    <div className="privacy-banner">
         <div className="privacy-line"></div>
      <h1 className="privacy-title">Your Privacy is Our Priority</h1>
    </div>
        
    <p className="privacy-info-text">
      In this community, your privacy comes first. We don’t ask for your phone number, email, or passwords—nothing personal is required. Everything is completely anonymous, with randomly generated identities ensuring your full privacy and freedom. No tracking, no data harvesting—just a safe and private space to connect.
    </p>
    <div className="privacy-features">
      {features.map(({ icon, label }, index) => (
        <div key={index} className="feature-card wrapper">
          <img src={icon} alt={label} className="feature-icon" />
          <p>{label}</p>
        </div>
      ))}
    </div>
  </section>
);

export default PrivacyInfo;
