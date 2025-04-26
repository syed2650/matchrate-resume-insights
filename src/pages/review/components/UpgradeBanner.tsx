
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LockIcon } from "lucide-react";

interface UpgradeBannerProps {
  feature: string;
  limit: string;
}

const UpgradeBanner: React.FC<UpgradeBannerProps> = ({ feature, limit }) => {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-amber-100 p-2 rounded-full">
          <LockIcon className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h3 className="font-medium text-slate-800">Premium Feature: {feature}</h3>
          <p className="text-sm text-slate-600">
            Upgrade to our paid plan to get {limit}.
          </p>
        </div>
      </div>
      <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
        <Link to="/pricing">Upgrade Now</Link>
      </Button>
    </div>
  );
};

export default UpgradeBanner;
