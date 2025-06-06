import React from 'react';
import './WhatWeAre.css'; // Import the CSS file for styling
import logowhatweare from '../../../assets/logowhatweare.png';

const WhatWeAre = () => {
  return (

      <section className='container-whatweare'>
         <div className='whatwearecontainer'>
            <h2 className='what-title'>What are we?</h2>
            <p className='what-text'>At CyberWhiteArch, we believe in using hacking skills for good.</p>
         </div>
       <div className='grid-section'>
         <div className="grid-container">
    <div className="grid-item news">
         <p className='under-title'>LIVE</p>
      <h1 className='title-news'>NEWS</h1>
      <h2 className="item-title">📰 DISCOVER LATEST NEWS</h2>
      <p className="item-text">Stay Ahead of the Curve with Real-Time Cybersecurity Updates. Read articles every week.</p>
    </div>

    <div className="grid-item share">
      <h2 className="item-title">🤝 Collaborate and Share</h2>
      <p className="item-text">Share your findings and insights with the community to help others learn and grow.</p>
    </div>
   
    <div className="grid-item news">
         <p className='under-title'>010101</p>
      <img src={logowhatweare} alt='logo' className='what-logo'/>
      <p className='item-text'>WTF is that error ...</p>
      <h2 className="item-title">LEARN FROM OTHERS</h2>
      <p className="item-text">Don't know what to do next? Feeling stuck on the problem? Go ahead and ask experienced hackers.</p>
    </div>

    <div className="grid-item learn">
      <h2 className="item-title">👨‍🏫 LEARN FROM OTHERS</h2>
      <p className="item-text">Feeling stuck? Go ahead and ask experienced hackers.</p>
    </div>

    <div className="grid-item good">
      <h2 className="item-title">✅ Use Skills for Good</h2>
      <p className="item-text">Only use your hacking skills for ethical purposes, like learning and improving security.</p>
    </div>

    <div className="grid-item noharm">
      <h2 className="item-title">⚠️ No Harm to Systems</h2>
      <p className="item-text">Avoid actions that could disrupt or damage systems or networks.</p>
    </div>

    <div className="grid-item learning">
      <h2 className="item-title">📚 Continuous Learning</h2>
      <p className="item-text">Join events, take courses, and challenge yourself to improve your skills.</p>
    </div>

    <div className="grid-item privacy">
        <div className='grid-for-tor'>
            <h1 className='tor'>TOR</h1>
      <h1 className='osint'>OSINT</h1>
      <h1 className='bcrypt'>bcrypt</h1>
        </div>
      <h2 className="item-title">TOOL KIT</h2>
      <p className="item-text">access a powerful suite of cybersecurity tools designed for ethical hacking, penetration & testing.</p>
    </div>

    <div className="grid-item toolkit">
      <h2 className="item-title">🧰 TOOL KIT</h2>
      <p className="item-text">Access tools for ethical hacking, penetration testing, and cybersecurity research.</p>
    </div>

    <div className="grid-item empty">
      {/* Optional blank space or decoration */}
    </div>
  </div>
       </div>
      </section>

  );
};

export default WhatWeAre;