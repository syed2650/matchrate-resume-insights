
import React from "react";
import { CheckCircle } from "lucide-react";

const ResumeOptimizedAlert: React.FC = () => {
  return (
    <div className="bg-green-50 border border-green-100 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-green-100 p-2 rounded-full">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-green-800">Resume Successfully Optimized</h3>
      </div>
      <p className="text-green-700 mb-4">Your resume has been rewritten to improve your chances of getting an interview with Matchrate.co.</p>
    </div>
  );
};

export default ResumeOptimizedAlert;
