
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
import { getUsageStats } from "../utils";
import { Link } from "react-router-dom";

interface UsageLimitModalProps {
  isOpen: boolean; // Required prop
  onClose: () => void;
}

const UsageLimitModal: React.FC<UsageLimitModalProps> = ({ isOpen, onClose }) => {
  const stats = getUsageStats();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Usage Limit Reached</DialogTitle>
          <DialogDescription>
            {stats.plan === 'free' ? (
              <>
                You've reached your daily limit of 1 resume review on the Free Plan.
                Your limit resets tomorrow.
              </>
            ) : (
              <>
                You've reached your monthly limit of 30 resume reviews on the Paid Plan.
                Your limit will reset on {new Date(stats.monthly.resetDate).toLocaleDateString()}.
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
