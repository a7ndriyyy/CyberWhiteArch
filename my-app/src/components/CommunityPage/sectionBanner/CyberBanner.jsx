import React from 'react';
import './CyberBanner.css';
import bunnylogo from '../../../assets/bunnylogo.png'; // Adjust the path as necessary

const CyberBanner = () => (
  <section className="cyber-banner">
    <div className="binary-strip">
  <div className="binary-strip-container">
    <div className='binary'>
         <span className='hover-binary'>1101001 1010101 1110001 0010110 1001010 1101010 1111000 </span>
    <span className='hover-binary'>1101001 1010101 1110001 0010110 1001010 1101010 1111000 </span>
    <span className='hover-binary'>1101001 1010101 1110001 0010110 1001010 1101010 1111000 </span>
    <span className='hover-binary'>1101001 1010101 1110001 0010110 1001010 1101010 1111000 </span>
    <span className='hover-binary'>1101001 1010101 1110001 0010110 1001010 1101010 1111000 </span>
    <span className='hover-binary'>1101001 1010101 1110001 0010110 1001010 1101010 1111000 </span>
    </div>

  </div>

    </div>
    <div className="cyber-message">
        <div className='cyber-text'>
     <p>If you are interested in your security on the internet, join our ranks of cyber warriors</p>
      <div className="light-button">
  <button className="bt">
    <div className="light-holder">
      <div className="dot"></div>
      <div className="light"></div>
    </div>
    <div className="button-holder">
      <p>TRY to HACK RIGHT NOW</p>
    </div>
  </button>
</div>
        </div>
         <img src={bunnylogo} alt="bunylogo" className='cyber-logo' />
    </div>
  </section>
);

export default CyberBanner;
