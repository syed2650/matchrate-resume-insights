
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
import { Link } from "react-router-dom";

interface PremiumFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

const PremiumFeatureModal: React.FC<PremiumFeatureModalProps> = ({ 
  isOpen, 
  onClose, 
  featureName 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Premium Feature</DialogTitle>
          <DialogDescription>
            <span className="font-medium">{featureName}</span> is a premium feature available on our paid plan.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-2 py-4">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800 text-sm">
            <p className="font-medium mb-2">Upgrade to our Premium Plan ($7/month) to get:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Unlimited resume analysis</li>
              <li>15 AI resume rewrites each month</li>
              <li>Export to PDF and Word formats</li>
              <li>Priority support</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={onClose}>Continue with Free Plan</Button>
          <Button asChild>
            <Link to="/#pricing">Upgrade Now</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumFeatureModal;
