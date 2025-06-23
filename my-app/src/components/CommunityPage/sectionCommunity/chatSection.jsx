import React from 'react';
import './chatSection.css';
import chatting1 from '../../../assets/chatting1.png'; // Adjust the path as necessary
import chatting2 from '../../../assets/chatting2.png'; // Adjust the path as necessary

const ChatCard = () => {
  return (
     <section className="privacy-section">
            <div className='privacy-banner '>
         <h1 className="privacy-title">We respect your privacy</h1> <hr className="privacy-line" />
      </div>
      <div className="screenshots-container">
        <div className='screenshot-with-img'>
               <img
          src={chatting1}
          alt="Social network screenshot left"
          className="screenshot"
        />
        </div>
        <div className="screenshot-with-text">
          <h1 className="screenshot-heading">Chatting with friend</h1>
          <img
            src={chatting2}
            alt="Social network screenshot right"
            className="screenshot"
          />
        </div>
      </div>
    </section>
  );
};

export default ChatCard;