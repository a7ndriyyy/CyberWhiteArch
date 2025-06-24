import React from 'react';
import hackerImg from '../../assets/hackerImg.png'; // Adjust the path as necessary
import './Community.css'; // Import the CSS file for styling
import parrotImg from '../../assets/parrotImg.png'; // Adjust the path as necessary
import kaliImg from '../../assets/kaliImg.png'; // Adjust the path as necessary
import iconCommunity from '../../assets/iconCommunity.png'; // Adjust the path as necessary 


const CommunityPage = () => {
  return (

   <section className="community-section">
      <div className="left-image">
        <img src={hackerImg} alt="Hacker silhouette" className='cyber-logo'/>
      </div>

      <div className="right-content">
        <h2>Welcome to the <strong>Cyberwhitehat</strong> Community</h2>
        <p>
          Develop tools, hack ethically, and<br />
          scan for vulnerabilities — join our<br />
          white hat community!
        </p>

        <button className="join-btn">Join a Group</button>

        <div className="community-box">
          <div className="box-column">
            <h3>Popular groups</h3>
            <div className="group">
              <img src={parrotImg} alt="ParrotOS" />
              <span>ParrotOS</span>
              <button>join</button>
            </div>
            <div className="group">
              <img src={kaliImg} alt="Kali Linux" />
              <span>Kali Linux</span>
              <button>join</button>
            </div>
          </div>

          <div className="box-column">
            <h3>Popular Channels</h3>
            <div className="channel">
              <img src={iconCommunity} alt="Ethical Hacking" />
              <div>
                <strong>Ethical Hacking</strong><br />
                <small>1,000,000+ users</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityPage;