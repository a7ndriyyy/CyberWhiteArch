import React from 'react';
import { Link, NavLink  } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <div className='global-header'>
   <header className="header-container">
    {/* <div className='container-header-inside'> */}
      <Link to="/" className="logo">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="40" viewBox="0 0 48 40" fill="none">
<path fillRule="evenodd" clipRule="evenodd" d="M0.139269 3.81956C0.415474 5.54012 0.900101 8.50853 1.49159 11.9183C1.59232 12.499 2.02482 12.9668 2.59571 13.1133L23.6329 18.5097C23.8778 18.5725 24.1346 18.5724 24.3795 18.5094L45.3474 13.1122C45.9145 12.9662 46.345 12.503 46.4488 11.9267C47.0621 8.52026 47.5688 5.55349 47.8589 3.82998C48.0034 2.97165 47.3865 2.17489 46.5197 2.0954L24.1432 0.0433772C24.0521 0.0350201 23.9604 0.0350201 23.8692 0.0433772L1.47995 2.09658C0.617921 2.17563 0.00206012 2.96486 0.139269 3.81956ZM6.24044 32.2824L23.4387 39.8379C23.821 40.0059 24.256 40.0069 24.6391 39.8407L42.0592 32.2829C42.4669 32.106 42.7761 31.7587 42.8943 31.3303C43.6469 28.6009 44.5344 24.4154 45.3724 20.1137C45.5824 19.0358 44.5963 18.1101 43.5324 18.3825L24.4127 23.2776C24.1671 23.3405 23.9096 23.3401 23.6642 23.2765L4.80598 18.3877C3.74452 18.1125 2.75643 19.0322 2.96073 20.1096C3.7776 24.4174 4.65212 28.6089 5.41407 31.339C5.53224 31.7624 5.838 32.1056 6.24044 32.2824Z" fill="#DFE3E7"/>
</svg>
      </Link>

      <nav className="nav">
        <NavLink className="nav-link" to="/source-files">Source Files</NavLink>
        <NavLink className="nav-link" to="/tools">
          Tools
          <span className="arrow">
         <svg xmlns="http://www.w3.org/2000/svg" width="10" height="20" viewBox="0 0 10 20" fill="none">
<path fillRule="evenodd" clipRule="evenodd" d="M0.117837 17.7299C-0.0340706 17.8818 -0.0340707 18.1281 0.117837 18.28L0.80547 18.9676C0.957377 19.1195 1.20367 19.1195 1.35558 18.9676L9.88222 10.441C10.0012 10.322 10.027 10.1452 9.95966 10.0012C10.0271 9.85708 10.0013 9.6802 9.88228 9.56123L1.35564 1.03458C1.20373 0.882673 0.957437 0.882673 0.805529 1.03458L0.117896 1.72221C-0.0340113 1.87412 -0.0340111 2.12041 0.117897 2.27232L7.84664 10.0011L0.117837 17.7299Z" fill="#707989"/>
</svg>
          </span>
        </NavLink>
        <NavLink className="nav-link" to="/community">Community</NavLink>
      </nav>

      <button className="button">GET STARTED</button>
      
    </header>
    </div>
  );
};

export default Header;