import React from 'react';
import './WhatWeAre.css'; // Import the CSS file for styling
import logowhatweare from '../../../assets/logowhatweare.png';
import toolkit from '../../../assets/toolkit.png'; // Assuming you have a toolkit image

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
      <h2 className="item-title">DISCOVER LATEST NEWS</h2>
      <p className="item-text">Stay Ahead of the Curve with Real-Time Cybersecurity Updates. Read articles every week.</p>
    </div>

    <div className="grid-item share">
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20" fill="none" className='icon-logo'>
       <path fillRule="evenodd" clipRule="evenodd" d="M23.9304 1.911C23.7923 2.77128 23.5499 4.25549 23.2542 5.96039C23.2038 6.25074 22.9876 6.48464 22.7021 6.55786L12.1836 9.25605C12.0611 9.28747 11.9327 9.28741 11.8103 9.2559L1.32629 6.55732C1.04276 6.48434 0.827484 6.25272 0.775606 5.96458C0.468946 4.26135 0.215588 2.77797 0.0705376 1.91621C-0.00169754 1.48704 0.306774 1.08867 0.740156 1.04892L11.9284 0.0229093C11.974 0.0187307 12.0198 0.0187308 12.0654 0.0229093L23.26 1.04951C23.691 1.08904 23.999 1.48365 23.9304 1.911ZM20.8798 16.1425L12.2806 19.9202C12.0895 20.0042 11.872 20.0047 11.6805 19.9216L2.97042 16.1427C2.76657 16.0543 2.61194 15.8806 2.55287 15.6664C2.17656 14.3017 1.73282 12.209 1.31381 10.0581C1.20882 9.51917 1.70185 9.05633 2.23379 9.19252L11.7937 11.6401C11.9165 11.6715 12.0452 11.6713 12.1679 11.6395L21.597 9.19514C22.1277 9.05755 22.6218 9.51739 22.5196 10.0561C22.1112 12.21 21.6739 14.3057 21.293 15.6708C21.2339 15.8825 21.081 16.0541 20.8798 16.1425Z" fill="#A6ADB5"/>
  </svg>
      <h2 className="item-title">Collaborate and Share</h2>
      <p className="item-text">Share your findings and insights with the community to help others learn and grow.</p>
    </div>
   
    <div className="grid-item news">
      <img src={logowhatweare} alt='logo' className='what-logo'/>
       <p className='under-title-1'>0101 0111.1111 0000.1101 1101.0000 1111</p>
      <p className='item-text'>WTF is that error ...</p>
      <h2 className="item-title">LEARN FROM OTHERS</h2>
      <p className="item-text">Don't know what to do next? Feeling stuck on the problem? Go ahead and ask experienced hackers.</p>
    </div>

    <div className="grid-item learn">
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20" fill="none" className='icon-logo'>
       <path fillRule="evenodd" clipRule="evenodd" d="M23.9304 1.911C23.7923 2.77128 23.5499 4.25549 23.2542 5.96039C23.2038 6.25074 22.9876 6.48464 22.7021 6.55786L12.1836 9.25605C12.0611 9.28747 11.9327 9.28741 11.8103 9.2559L1.32629 6.55732C1.04276 6.48434 0.827484 6.25272 0.775606 5.96458C0.468946 4.26135 0.215588 2.77797 0.0705376 1.91621C-0.00169754 1.48704 0.306774 1.08867 0.740156 1.04892L11.9284 0.0229093C11.974 0.0187307 12.0198 0.0187308 12.0654 0.0229093L23.26 1.04951C23.691 1.08904 23.999 1.48365 23.9304 1.911ZM20.8798 16.1425L12.2806 19.9202C12.0895 20.0042 11.872 20.0047 11.6805 19.9216L2.97042 16.1427C2.76657 16.0543 2.61194 15.8806 2.55287 15.6664C2.17656 14.3017 1.73282 12.209 1.31381 10.0581C1.20882 9.51917 1.70185 9.05633 2.23379 9.19252L11.7937 11.6401C11.9165 11.6715 12.0452 11.6713 12.1679 11.6395L21.597 9.19514C22.1277 9.05755 22.6218 9.51739 22.5196 10.0561C22.1112 12.21 21.6739 14.3057 21.293 15.6708C21.2339 15.8825 21.081 16.0541 20.8798 16.1425Z" fill="#A6ADB5"/>
  </svg>
      <h2 className="item-title">Respect Privacy</h2>
      <p className="item-text">Do not attempt to access, share, or exploit personal information without explicit consent.</p>
    </div>

    <div className="grid-item good">
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20" fill="none" className='icon-logo'>
       <path fillRule="evenodd" clipRule="evenodd" d="M23.9304 1.911C23.7923 2.77128 23.5499 4.25549 23.2542 5.96039C23.2038 6.25074 22.9876 6.48464 22.7021 6.55786L12.1836 9.25605C12.0611 9.28747 11.9327 9.28741 11.8103 9.2559L1.32629 6.55732C1.04276 6.48434 0.827484 6.25272 0.775606 5.96458C0.468946 4.26135 0.215588 2.77797 0.0705376 1.91621C-0.00169754 1.48704 0.306774 1.08867 0.740156 1.04892L11.9284 0.0229093C11.974 0.0187307 12.0198 0.0187308 12.0654 0.0229093L23.26 1.04951C23.691 1.08904 23.999 1.48365 23.9304 1.911ZM20.8798 16.1425L12.2806 19.9202C12.0895 20.0042 11.872 20.0047 11.6805 19.9216L2.97042 16.1427C2.76657 16.0543 2.61194 15.8806 2.55287 15.6664C2.17656 14.3017 1.73282 12.209 1.31381 10.0581C1.20882 9.51917 1.70185 9.05633 2.23379 9.19252L11.7937 11.6401C11.9165 11.6715 12.0452 11.6713 12.1679 11.6395L21.597 9.19514C22.1277 9.05755 22.6218 9.51739 22.5196 10.0561C22.1112 12.21 21.6739 14.3057 21.293 15.6708C21.2339 15.8825 21.081 16.0541 20.8798 16.1425Z" fill="#A6ADB5"/>
  </svg>
      <h2 className="item-title"> Use Skills for Good</h2>
      <p className="item-text">Only use your hacking skills for ethical purposes, like learning and improving security.</p>
    </div>

    <div className="grid-item noharm">
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20" fill="none" className='icon-logo'>
       <path fillRule="evenodd" clipRule="evenodd" d="M23.9304 1.911C23.7923 2.77128 23.5499 4.25549 23.2542 5.96039C23.2038 6.25074 22.9876 6.48464 22.7021 6.55786L12.1836 9.25605C12.0611 9.28747 11.9327 9.28741 11.8103 9.2559L1.32629 6.55732C1.04276 6.48434 0.827484 6.25272 0.775606 5.96458C0.468946 4.26135 0.215588 2.77797 0.0705376 1.91621C-0.00169754 1.48704 0.306774 1.08867 0.740156 1.04892L11.9284 0.0229093C11.974 0.0187307 12.0198 0.0187308 12.0654 0.0229093L23.26 1.04951C23.691 1.08904 23.999 1.48365 23.9304 1.911ZM20.8798 16.1425L12.2806 19.9202C12.0895 20.0042 11.872 20.0047 11.6805 19.9216L2.97042 16.1427C2.76657 16.0543 2.61194 15.8806 2.55287 15.6664C2.17656 14.3017 1.73282 12.209 1.31381 10.0581C1.20882 9.51917 1.70185 9.05633 2.23379 9.19252L11.7937 11.6401C11.9165 11.6715 12.0452 11.6713 12.1679 11.6395L21.597 9.19514C22.1277 9.05755 22.6218 9.51739 22.5196 10.0561C22.1112 12.21 21.6739 14.3057 21.293 15.6708C21.2339 15.8825 21.081 16.0541 20.8798 16.1425Z" fill="#A6ADB5"/>
  </svg>
      <h2 className="item-title"> No Harm to Systems</h2>
      <p className="item-text">Avoid actions that could disrupt, damage, or compromise the functionality of systems or networks.</p>
    </div>

    <div className="grid-item learning">
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20" fill="none" className='icon-logo'>
       <path fillRule="evenodd" clipRule="evenodd" d="M23.9304 1.911C23.7923 2.77128 23.5499 4.25549 23.2542 5.96039C23.2038 6.25074 22.9876 6.48464 22.7021 6.55786L12.1836 9.25605C12.0611 9.28747 11.9327 9.28741 11.8103 9.2559L1.32629 6.55732C1.04276 6.48434 0.827484 6.25272 0.775606 5.96458C0.468946 4.26135 0.215588 2.77797 0.0705376 1.91621C-0.00169754 1.48704 0.306774 1.08867 0.740156 1.04892L11.9284 0.0229093C11.974 0.0187307 12.0198 0.0187308 12.0654 0.0229093L23.26 1.04951C23.691 1.08904 23.999 1.48365 23.9304 1.911ZM20.8798 16.1425L12.2806 19.9202C12.0895 20.0042 11.872 20.0047 11.6805 19.9216L2.97042 16.1427C2.76657 16.0543 2.61194 15.8806 2.55287 15.6664C2.17656 14.3017 1.73282 12.209 1.31381 10.0581C1.20882 9.51917 1.70185 9.05633 2.23379 9.19252L11.7937 11.6401C11.9165 11.6715 12.0452 11.6713 12.1679 11.6395L21.597 9.19514C22.1277 9.05755 22.6218 9.51739 22.5196 10.0561C22.1112 12.21 21.6739 14.3057 21.293 15.6708C21.2339 15.8825 21.081 16.0541 20.8798 16.1425Z" fill="#A6ADB5"/>
  </svg>
      <h2 className="item-title">Continuous Learning</h2>
      <p className="item-text">Join events, take courses, and challenge yourself to improve your skills.</p>
    </div>

    <div className="grid-item privacy news">
        <div className='grid-for-tor'>
           <img src={toolkit} alt="toolkit" />
        </div>
      <h2 className="item-title"> TOOL KIT </h2>
      <p className="item-text">access a powerful suite of cybersecurity tools designed for ethical hacking, penetration & testing.</p>
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