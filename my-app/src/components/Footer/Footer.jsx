import React from 'react';
import './Footer.css';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="40" viewBox="0 0 48 40" fill="none" className='logo-svg'>
<path fillRule="evenodd" clipRule="evenodd" d="M0.139238 3.8203C0.415444 5.54085 0.900071 8.50926 1.49156 11.9191C1.59229 12.4998 2.02479 12.9676 2.59568 13.114L23.6328 18.5104C23.8778 18.5732 24.1346 18.5731 24.3795 18.5101L45.3474 13.1129C45.9144 12.967 46.345 12.5037 46.4488 11.9275C47.0621 8.521 47.5688 5.55422 47.8589 3.83071C48.0034 2.97238 47.3864 2.17562 46.5197 2.09614L24.1432 0.0441096C24.052 0.0357525 23.9603 0.0357526 23.8692 0.0441096L1.47992 2.09731C0.61789 2.17636 0.0020296 2.96559 0.139238 3.8203ZM6.24041 32.2832L23.4387 39.8387C23.821 40.0066 24.256 40.0076 24.639 39.8414L42.0591 32.2836C42.4668 32.1067 42.7761 31.7595 42.8942 31.331C43.6468 28.6016 44.5343 24.4162 45.3723 20.1144C45.5823 19.0365 44.5963 18.1108 43.5324 18.3832L24.4126 23.2784C24.1671 23.3412 23.9095 23.3409 23.6642 23.2772L4.80595 18.3884C3.74449 18.1133 2.7564 19.033 2.9607 20.1103C3.77757 24.4181 4.65209 28.6097 5.41404 31.3398C5.53221 31.7632 5.83797 32.1064 6.24041 32.2832Z" fill="#DFE3E7"/>
</svg>
          <span className="logo-text">CyberWhiteHat</span>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>cyberwhitearch@hack.com</p>
          <p>cwasupport@hack.com</p>
        </div>

        <div className="footer-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/source-files">Source Files</NavLink>
          <NavLink to="/tools">Tools</NavLink>
          <NavLink to="/community">Community</NavLink>
        </div>

        <div className="footer-social">
          <a href="#">Our Telegram ↗</a>
          <a href="#">Github Projects ↗</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright © 2018 CyberWhiteArch</p>
      </div>
    </footer>
  );
};

export default Footer;
