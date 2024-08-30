// DeviceConverter.js
import { useState, useEffect } from 'react';

export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      setDeviceType({
        isMobile: width <= 480,              // Mobile devices (<= 768px)
        isTablet: width > 768 && width <= 1024, // Tablet devices (768px - 1024px)
        isDesktop: width > 1024,             // Desktop devices (> 1024px)
      });
    };

    // Initial check on load
    handleResize();

    // Add event listener to handle window resize
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return deviceType;
};
