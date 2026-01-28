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
import { Zap, Rocket } from "lucide-react";

interface PremiumFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  variant?: "default" | "recheck";
}

const PremiumFeatureModal: React.FC<PremiumFeatureModalProps> = ({ 
  isOpen, 
  onClose, 
  featureName,
  variant = "default"
}) => {
  const isRecheck = variant === "recheck";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            🔒 {isRecheck ? "Recheck your resume after changes" : "You've used your free resume check"}
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            {isRecheck ? (
              <>
                See how your score improves after applying fixes.
                <span className="block mt-2 text-emerald-600 font-medium">
                  Most users increase their match score by 10–20 points after one recheck.
                </span>
              </>
            ) : (
              <>
                Unlock detailed resume fixes and job-specific insights to apply with confidence — and avoid silent rejections.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-3 py-4">
          {/* Primary CTA - Weekly */}
          <Button 
            asChild 
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-6 text-base"
          >
            <Link to="/#pricing" onClick={onClose}>
              <Zap className="w-4 h-4 mr-2" />
              {isRecheck ? "Unlock Recheck — £1.99" : "Get Weekly Access — £1.99"}
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
              {isRecheck ? "Upgrade to Monthly — £6.99" : "Get Monthly Access — £6.99"}
            </Link>
          </Button>
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

export default PremiumFeatureModal;
