
import { AlertCircle, CheckCircle, List } from "lucide-react";
import ResultSection from "../ResultSection";

interface BulletImprovementsProps {
  bullets: Array<{ original: string; improved: string; } | string>;
}

const BulletImprovements = ({ bullets }: BulletImprovementsProps) => {
  return (
    <ResultSection
      title="STAR Format Bullet Improvements"
      icon={<List className="h-6 w-6 text-blue-600" />}
      content={
        <div className="space-y-6">
          {bullets.map((bullet: any, i: number) => (
            <div key={i} className="border border-gray-200 rounded-lg divide-y">
              {typeof bullet === "object" && bullet.original && bullet.improved ? (
                <>
                  <div className="p-4 bg-gray-50">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <p className="font-semibold text-slate-700">Original</p>
                    </div>
                    <p className="text-slate-600">{bullet.original}</p>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <p className="font-semibold text-slate-700">Improved (STAR Format)</p>
                    </div>
                    <p className="text-slate-800">{bullet.improved}</p>
                  </div>
                </>
              ) : (
                <div className="p-4">
                  <p className="text-slate-600">
                    {typeof bullet === "string" ? bullet : "Invalid bullet format"}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      }
    />
  );
};

export default BulletImprovements;
