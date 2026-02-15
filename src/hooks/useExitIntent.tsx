
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { track } from '@/lib/mixpanel';

const EXIT_INTENT_KEY = 'exitIntentLastShown';
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const useExitIntent = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [timeOnPage, setTimeOnPage] = useState(0);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/free-ats-check') return;

    // Check 7-day localStorage cooldown
    const lastShown = localStorage.getItem(EXIT_INTENT_KEY);
    if (lastShown && Date.now() - Number(lastShown) < COOLDOWN_MS) return;

    const timeInterval = setInterval(() => {
      setTimeOnPage(prev => prev + 1000);
    }, 1000);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && timeOnPage >= 15000 && !showPopup) {
        setShowPopup(true);
        localStorage.setItem(EXIT_INTENT_KEY, String(Date.now()));
        track("Exit Intent Shown");
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
  };

  return { showPopup, closePopup };
};
