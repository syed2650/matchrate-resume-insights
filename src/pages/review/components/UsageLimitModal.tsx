
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
  isOpen: boolean;
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
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800 text-sm">
            {stats.plan === 'free' ? (
              <p>
                Upgrade to our Paid Plan to unlock 30 resume reviews and 15 resume rewrites per month.
              </p>
            ) : (
              <p>
                Your subscription allows for 30 reviews per month.
                Need more? Please contact our support team.
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          {stats.plan === 'free' && (
            <Button asChild>
              <Link to="/pricing">View Upgrade Options</Link>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UsageLimitModal;
