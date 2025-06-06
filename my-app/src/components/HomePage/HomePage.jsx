import React from 'react';
import logoHome from '../../assets/logoHome.png'; // Adjust the path as necessary
import './HomePage.css'; // Import the CSS file for styling


const HomePage = () => {
  return (

      <section className='container'>
        <div className='homecontainer'>
            <img src={logoHome} alt="Placeholder Image" className='logoimage' />
            <div className='homecircle'>
            <h1 className='hometitle'>CyberWhiteHat</h1>
            <p className='hometext'>Join a community of experts, explore cutting-edge tools,and master the art of ethical hacking</p>
            </div>
        <div className='homecircle2'>
          <button className='home-button'>
          <p className='button-text'>START YOUR HACKING JOURNEY</p>
        </button>
        </div>
        </div>
      </section>
  );
};

export default HomePage;