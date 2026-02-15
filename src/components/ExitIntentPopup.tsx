
import React, { useState } from 'react';
import { X, Tag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { track } from '@/lib/mixpanel';

interface ExitIntentPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

export const ExitIntentPopup = ({ isVisible, onClose }: ExitIntentPopupProps) => {
  const handleClaim = () => {
    track("Exit Intent Claimed", { code: "FIRST20" });
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exit_intent_conversion', { offer: 'FIRST20' });
    }
    onClose();
    window.location.href = '/#pricing';
  };

  const handleClose = () => {
    track("Exit Intent Dismissed");
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-8 relative animate-in zoom-in duration-300">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mx-auto mb-4">
            <Tag className="w-7 h-7 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-warm-text mb-2">
            Wait! Get 20% Off Your First Month
          </h2>
          <p className="text-slate-500 text-sm">
            One-time offer — don't miss out on smarter job applications.
          </p>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-xl p-5 text-center mb-6">
          <p className="text-xs uppercase tracking-wider text-amber-600 font-medium mb-1">Use code at checkout</p>
          <p className="text-3xl font-bold text-warm-text tracking-widest">FIRST20</p>
        </div>

        <Button
          onClick={handleClaim}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-6 text-base rounded-xl transition-transform hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Claim My 20% Discount
        </Button>

        <button 
          onClick={handleClose}
          className="w-full text-center text-xs text-slate-400 mt-4 hover:text-slate-600 transition-colors"
        >
          No thanks, I'll pay full price
        </button>
      </div>
    </div>
  );
};
