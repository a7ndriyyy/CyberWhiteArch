import React, { useState, useEffect } from 'react';
import { HiChevronDoubleUp } from "react-icons/hi2"; // Optional icon
import './Scroll.css'; // Ensure you have a CSS file for styling

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) setIsVisible(true);
    else setIsVisible(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    isVisible && (
      <div className="scroll-to-top" onClick={scrollToTop}>
        <HiChevronDoubleUp size={40} />
      </div>
    )
  );
};

export default ScrollToTop;
