
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { addUTMToFormData } from '@/components/UTMTracker';

interface ExitIntentPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

export const ExitIntentPopup = ({ isVisible, onClose }: ExitIntentPopupProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      // Add UTM data to the submission
      const formDataWithUTM = addUTMToFormData({
        email,
        source: 'exit_intent_popup'
      });

      const { data, error } = await supabase.functions.invoke('exit-intent-signup', {
        body: formDataWithUTM
      });

      if (error) throw error;

      // Mark as captured in session
      sessionStorage.setItem('emailCaptured', 'true');
      
      toast({
        title: "Thank you!",
        description: "Check your email for your free resume analysis guide.",
      });

      onClose();
      
      // Track conversion event with UTM data
      if (typeof window !== 'undefined' && (window as any).gtag) {
        const utmData = JSON.parse(sessionStorage.getItem('utmData') || '{}');
        (window as any).gtag('event', 'exit_intent_conversion', {
          utm_source: utmData.utm_source,
          utm_medium: utmData.utm_medium,
          utm_campaign: utmData.utm_campaign
        });
      }
      
      // Redirect to thank you page
      window.location.href = '/free-ats-check';
    } catch (error) {
      console.error('Exit intent signup error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 relative animate-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🚨 Wait! Don't Leave Without Your FREE Resume Analysis
          </h2>
          <p className="text-gray-600">
            Is your resume getting lost in the ATS black hole?
          </p>
        </div>

        <div className="text-left mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
            Get Your FREE ATS Compatibility Report:
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              Instant ATS compatibility score
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              Keyword optimization tips
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              Formatting recommendations
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              Industry-specific advice
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full text-base py-3"
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 text-base transition-transform hover:scale-[1.02]"
          >
            {isSubmitting ? 'Getting Your Analysis...' : 'Get My FREE Analysis'}
          </Button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          Takes 30 seconds • No spam, ever • Join 10,000+ job seekers
        </p>
      </div>
    </div>
  );
};
