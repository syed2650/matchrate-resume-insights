
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface UTMData {
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
  referrer?: string;
  landing_page?: string;
  timestamp?: string;
}

export const UTMTracker = () => {
  const location = useLocation();

  useEffect(() => {
    captureUTMParameters();
    trackPageView();
  }, [location]);

  const captureUTMParameters = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const utmData: UTMData = {
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_content: urlParams.get('utm_content'),
      utm_term: urlParams.get('utm_term'),
      referrer: document.referrer,
      landing_page: window.location.pathname,
      timestamp: new Date().toISOString()
    };

    // Only store if we have UTM parameters
    if (Object.values(utmData).slice(0, 5).some(value => value !== null)) {
      // Store in sessionStorage for current session
      sessionStorage.setItem('utmData', JSON.stringify(utmData));
      
      // Store in localStorage for first-touch attribution (30 days)
      const existingData = JSON.parse(localStorage.getItem('firstTouchUTM') || '{}');
      if (!existingData.utm_source) {
        localStorage.setItem('firstTouchUTM', JSON.stringify(utmData));
      }
      
      // Send to analytics
      sendToAnalytics('utm_capture', utmData);
    }
  };

  const trackPageView = () => {
    const utmData = JSON.parse(sessionStorage.getItem('utmData') || '{}');
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        ...utmData
      });
    }
  };

  const sendToAnalytics = async (eventName: string, data: UTMData) => {
    try {
      // Send to Google Analytics if available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventName, data);
      }
      
      // Send to our custom analytics endpoint
      await supabase.functions.invoke('utm-analytics', {
        body: {
          event: eventName,
          data: data,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          page_url: window.location.href
        }
      });
    } catch (error) {
      console.error('UTM tracking error:', error);
    }
  };

  return null; // This component doesn't render anything
};

// Utility function to get UTM data for forms
export const getUTMData = () => {
  const sessionUTM = JSON.parse(sessionStorage.getItem('utmData') || '{}');
  const firstTouchUTM = JSON.parse(localStorage.getItem('firstTouchUTM') || '{}');
  
  return {
    current: sessionUTM,
    firstTouch: firstTouchUTM
  };
};

// Utility function to add UTM data to form submissions
export const addUTMToFormData = (formData: any) => {
  const { current, firstTouch } = getUTMData();
  
  return {
    ...formData,
    ...current,
    first_touch_utm_source: firstTouch.utm_source,
    first_touch_utm_medium: firstTouch.utm_medium,
    first_touch_utm_campaign: firstTouch.utm_campaign,
    first_touch_utm_content: firstTouch.utm_content,
    first_touch_utm_term: firstTouch.utm_term,
    first_touch_referrer: firstTouch.referrer,
    first_touch_landing_page: firstTouch.landing_page
  };
};
