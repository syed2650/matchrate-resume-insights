
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface SuggestedBulletsProps {
  bullets: string[];
}

const SuggestedBullets = ({ bullets }: SuggestedBulletsProps) => {
  return (
    <div className="border-t pt-6 mt-6">
      <div className="flex items-center gap-2 mb-3">
        <h4 className="font-bold text-lg text-warm-text">Suggested STAR Format Bullets</h4>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
          Premium Feature
        </Badge>
      </div>
      <p className="text-sm text-slate-600 mb-4">
        These optimized bullet points are tailored to highlight your relevant skills and match the job requirements using the STAR format:
      </p>
      <ul className="space-y-3">
        {bullets.length > 0 ? (
          bullets.map((bullet, idx) => (
            <li key={idx} className="pl-7 relative text-slate-700 bg-warm-section p-3 rounded-lg border border-slate-100">
              <Star className="absolute top-3 left-2 h-4 w-4 text-warm-accent" />
              {bullet}
            </li>
          ))
        ) : (
          <li className="text-slate-500 italic p-3 bg-warm-section rounded-lg">No suggested bullet points available.</li>
        )}
      </ul>
    </div>
  );
};

export default SuggestedBullets;
