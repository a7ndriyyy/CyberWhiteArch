// PublicLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../src/components/Header/Header';
import Footer from '../src/components/Footer/Footer';

const PublicLayout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

export default PublicLayout;

