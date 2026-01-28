import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getUsageStats, getMonthlyResetDate } from "../utils";
import { Link } from "react-router-dom";
import { Zap, Rocket, AlertTriangle } from "lucide-react";

interface UsageLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UsageLimitModal: React.FC<UsageLimitModalProps> = ({ isOpen, onClose }) => {
  const stats = getUsageStats();
  
  // Calculate when the limit resets
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  // Format the reset time in a user-friendly way
  const formatResetTime = () => {
    const today = new Date();
    const resetTime = new Date(today);
    resetTime.setDate(resetTime.getDate() + 1);
    resetTime.setHours(0, 0, 0, 0);
    
    // Calculate hours until reset
    const hoursUntilReset = Math.round((resetTime.getTime() - today.getTime()) / (1000 * 60 * 60));
    
    if (hoursUntilReset < 1) {
      return "in less than an hour";
    } else if (hoursUntilReset === 1) {
      return "in 1 hour";
    } else if (hoursUntilReset < 24) {
      return `in ${hoursUntilReset} hours`;
    } else {
      return "tomorrow";
    }
  };

  // Get context-specific messaging
  const getPlanLimitMessage = () => {
    switch (stats.plan) {
      case 'weekly':
        return "You've reached your weekly limit of 5 job match checks.";
      case 'monthly':
        return "You've reached your monthly limit of 25 job match checks.";
      default:
        return "You've used your free resume check.";
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            You've reached your plan limit
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            {getPlanLimitMessage()}
            <span className="block mt-2">
              Upgrade to continue optimizing your resume for more jobs.
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-3 py-4">
          {stats.plan === 'free' && (
            <>
              {/* Primary CTA - Weekly */}
              <Button 
                asChild 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-6 text-base"
              >
                <Link to="/#pricing" onClick={onClose}>
                  <Zap className="w-4 h-4 mr-2" />
                  Get Weekly Access — £1.99
                </Link>
              </Button>
              
              {/* Secondary CTA - Monthly */}
              <Button 
                asChild 
                variant="outline"
                className="w-full border-emerald-200 hover:bg-emerald-50 text-emerald-700 font-semibold py-6 text-base"
              >
                <Link to="/#pricing" onClick={onClose}>
                  <Rocket className="w-4 h-4 mr-2" />
                  Get Monthly Access — £6.99
                </Link>
              </Button>
            </>
          )}
          
          {stats.plan === 'weekly' && (
            <Button 
              asChild 
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-6 text-base"
            >
              <Link to="/#pricing" onClick={onClose}>
                <Rocket className="w-4 h-4 mr-2" />
                Upgrade to Monthly — £6.99
              </Link>
            </Button>
          )}
          
          {stats.plan === 'monthly' && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
              <p className="text-slate-600 text-sm">
                Your limit will reset on {new Date(getMonthlyResetDate()).toLocaleDateString('en-GB', { 
                  day: 'numeric', 
                  month: 'long' 
                })}.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row sm:justify-center gap-2 pt-0">
          <p className="text-xs text-slate-500 text-center">
            Takes under 2 minutes · Cancel anytime
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UsageLimitModal;
