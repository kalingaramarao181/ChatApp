import React, { useState } from 'react';
import './index.css';

function Swipe() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleContainer = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="App">
      <div className="background">This is the background</div>
      <button className="toggle-button" onClick={toggleContainer}>
        {isExpanded ? 'Collapse' : 'Expand'}
      </button>
      <div className={`container ${isExpanded ? 'expanded' : ''}`}>
        <p>Your content here...</p>
      </div>
    </div>
  );
}

export default Swipe;
