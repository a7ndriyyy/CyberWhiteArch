// ToolCard.jsx
import React from 'react';
import '../ToolsPage/Tools.css'; // Import the CSS file for styling

const ToolCard = ({ title, description }) => (
  <div className="tool-card">
    <div className="tool-info">
      <h3 className='tool-name'>{title}</h3>
      <p className='tool-description'>{description}</p>
    </div>
    <div className="tool-icon">
        <a href="https://your-doc-link.com" title="View Documentation">
        <svg xmlns="http://www.w3.org/2000/svg" width="68" height="68" viewBox="0 0 68 68" fill="none">
<path fillRule="evenodd" clipRule="evenodd" d="M45.3604 1.17353C44.6102 0.42338 43.5928 0.00195312 42.532 0.00195312H4C1.79086 0.00195312 0 1.79281 0 4.00195V64.002C0 66.2111 1.79086 68.002 4 68.002H64C66.2091 68.002 68 66.2111 68 64.002V25.47C68 24.4091 67.5786 23.3917 66.8284 22.6416L45.3604 1.17353Z" fill="#303741"/>
<path d="M67 0.00195385C67.5523 0.00195388 68 0.449669 68 1.00195V16.5877C68 17.4786 66.9229 17.9248 66.2929 17.2948L50.7071 1.70906C50.0772 1.0791 50.5233 0.00195308 51.4142 0.00195312L67 0.00195385Z" fill="#546172"/>
  <path d="M50 20 L60 34 L50 48" stroke="#21a1f1" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</a>
    </div>
  </div>
);

export default ToolCard;
