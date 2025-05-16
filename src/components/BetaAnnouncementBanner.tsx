
import { useState, useEffect } from "react";
import { X } from "lucide-react";

const BetaAnnouncementBanner = () => {
  const [visible, setVisible] = useState(true);
  const storageKey = "beta-banner-dismissed";
  
  useEffect(() => {
    const isDismissed = localStorage.getItem(storageKey) === "true";
    setVisible(!isDismissed);
  }, []);
  
  const dismissBanner = () => {
    localStorage.setItem(storageKey, "true");
    setVisible(false);
  };
  
  const scrollToPricing = () => {
    const pricingSection = document.getElementById("pricing");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  if (!visible) return null;
  
  return (
    <div className="sticky top-0 z-50 w-full bg-amber-50 border-b border-amber-100 shadow-sm">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex-1"></div>
        <div 
          className="flex-grow text-center cursor-pointer flex items-center justify-center"
          onClick={scrollToPricing}
        >
          <span className="text-amber-700">
            🎉 <span className="font-medium">MatchRate Beta is Live!</span> Get 50% off your first month — exclusive for early users.
          </span>
        </div>
        <div className="flex-1 flex justify-end">
          <button 
            onClick={dismissBanner} 
            className="text-amber-500 hover:text-amber-700 focus:outline-none"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BetaAnnouncementBanner;
