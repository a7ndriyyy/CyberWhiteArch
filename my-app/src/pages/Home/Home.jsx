import React from 'react';
import HomePage from '../../components/HomePage/HomePage';
import WhatWeAre from '../../components/HomePage/WhatWeAre/WhatWeAre';
import '../../components/HomePage/HomePage.css'; // Import the CSS file for styling 

const Home = () => {
  return (
    <main className='globalcontainer'>
    <HomePage/>
    <WhatWeAre/>
    </main>
  );
};

export default Home;