import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="logo">LOGO</Link>
      <nav>
        <Link to="/about">About</Link>
        <Link to="/tools">Tools</Link>
      </nav>
    </header>
  );
};

export default Header;