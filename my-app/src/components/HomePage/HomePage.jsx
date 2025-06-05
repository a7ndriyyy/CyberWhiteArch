import React from 'react';
import logoHome from '../../assets/logoHome.png'; // Adjust the path as necessary
import './HomePage.css'; // Import the CSS file for styling

const HomePage = () => {
  return (
    <main className='globalcontainer'>
      <section className='container'>
        <div className='homecontainer'>
            <img src={logoHome} alt="Placeholder Image" className='logoimage' />
            <h1 className='hometitle'>Welcome to The Setup</h1>
            <p className='hometext'>Join a community of experts, explore cutting-edge tools, and master the art of ethical hacking</p>
        </div>
      </section>
      </main>
  );
};

export default HomePage;