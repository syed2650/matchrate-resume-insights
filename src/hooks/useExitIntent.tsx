
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useExitIntent = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [timeOnPage, setTimeOnPage] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Don't show on ATS checker page or if already captured
    if (location.pathname === '/free-ats-check' || 
        sessionStorage.getItem('emailCaptured') ||
        sessionStorage.getItem('exitIntentShown')) {
      return;
    }

    // Track time on page
    const timeInterval = setInterval(() => {
      setTimeOnPage(prev => prev + 1000);
    }, 1000);

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && timeOnPage >= 30000 && !showPopup) {
        setShowPopup(true);
        sessionStorage.setItem('exitIntentShown', 'true');
        
        // Track event if gtag is available
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'exit_intent_popup_shown');
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearInterval(timeInterval);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [timeOnPage, showPopup, location.pathname]);

  const closePopup = () => {
    setShowPopup(false);
    
    // Track event if gtag is available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exit_intent_popup_closed');
    }
  };

  return { showPopup, closePopup };
};
