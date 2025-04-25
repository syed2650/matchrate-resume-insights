
import React from "react";
import { ListCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BulletRewriteSuggestionsProps {
  originalBullets: string[];
  suggestedBullets: string[];
}

const BulletRewriteSuggestions: React.FC<BulletRewriteSuggestionsProps> = ({
  originalBullets,
  suggestedBullets
}) => {
  // Make sure we have both sets of bullets
  const hasPairs = originalBullets.length > 0 && suggestedBullets.length > 0;
  
  // Determine how many pairs to display
  const pairCount = Math.min(originalBullets.length, suggestedBullets.length);
  
  return (
    <div className="border rounded-xl p-6 bg-white shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <ListCheck className="h-5 w-5 text-blue-600" />
        <h3 className="font-bold text-lg">Suggested Bullet Rewrites</h3>
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 ml-2">
          STAR Format
        </Badge>
      </div>
      
      {!hasPairs && (
        <p className="text-slate-500 italic">
          No bullet point suggestions available for this section.
        </p>
      )}
      
      {hasPairs && (
        <div className="space-y-6">
          {Array.from({ length: pairCount }).map((_, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <div className="flex gap-4 mb-3">
                <div className="bg-red-50 text-red-800 px-2 py-1 rounded text-xs font-medium">
                  Original
                </div>
                <div className="flex-1 text-slate-700 text-sm">
                  {originalBullets[index]}
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-green-50 text-green-800 px-2 py-1 rounded text-xs font-medium">
                  Improved
                </div>
                <div className="flex-1 text-slate-800 font-medium text-sm">
                  {suggestedBullets[index]}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BulletRewriteSuggestions;
