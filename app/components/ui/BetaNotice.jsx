'use client';

import { useState, useEffect } from 'react';
import { FaInfoCircle, FaTimes } from 'react-icons/fa';

export default function BetaNotice() {
  const [isVisible, setIsVisible] = useState(true);
  
  // Check localStorage on component mount to see if user has dismissed the notice
  useEffect(() => {
    try {
      const betaNoticeDismissed = localStorage.getItem('betaNoticeDismissed');
      if (betaNoticeDismissed === 'true') {
        setIsVisible(false);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);
  
  const handleDismiss = () => {
    try {
      localStorage.setItem('betaNoticeDismissed', 'true');
      setIsVisible(false);
      console.log('Beta notice dismissed');
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="bg-indigo-600 text-white py-2 px-4 w-full z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <FaInfoCircle className="mr-2" />
          <p className="text-sm font-medium">
            This site is currently in beta. Some features may not work as expected.
          </p>
        </div>
        <button 
          onClick={handleDismiss}
          className="ml-4 text-white hover:text-indigo-200 focus:outline-none"
          aria-label="Dismiss"
        >
          <FaTimes size={16} />
        </button>
      </div>
    </div>
  );
} 