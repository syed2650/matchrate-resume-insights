
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

  // Get the date when monthly limits reset
  const monthlyResetDate = getMonthlyResetDate();
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Usage Limit Reached</DialogTitle>
          <DialogDescription>
            {stats.plan === 'free' ? (
              <>
                You've reached your daily limit of 1 resume review on the Free Plan.
                Your limit resets {formatResetTime()}.
              </>
            ) : (
              <>
                You've reached your monthly limit of 30 resume reviews on the Paid Plan.
                Your limit will reset on {new Date(monthlyResetDate).toLocaleDateString()}.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-2 py-4">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
            <h3 className="font-medium text-amber-800 mb-2">Premium Plan Benefits</h3>
            <ul className="text-amber-800 text-sm list-disc pl-5 space-y-1">
              <li>Unlimited resume analyses</li>
              <li>15 AI-powered resume rewrites per month</li>
              <li>Export to PDF and Word formats</li>
              <li>Priority support</li>
            </ul>
            <p className="text-amber-800 text-sm font-medium mt-3">Only $7/month</p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          {stats.plan === 'free' && (
            <Button asChild>
              <Link to="/#pricing">Upgrade Now</Link>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UsageLimitModal;
