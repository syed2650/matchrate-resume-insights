
interface SuggestedBulletsProps {
  bullets: string[];
}

const SuggestedBullets = ({ bullets }: SuggestedBulletsProps) => {
  return (
    <div className="border-t pt-6 mt-6">
      <h4 className="font-bold text-lg text-slate-900 mb-3">Suggested Resume Upgrades</h4>
      <p className="text-sm text-slate-600 mb-4">
        These STAR-format bullet points are tailored to highlight your relevant skills and match the job requirements:
      </p>
      <ul className="space-y-3">
        {bullets.length > 0 ? (
          bullets.map((bullet, idx) => (
            <li key={idx} className="pl-6 relative text-slate-700">
              <span className="absolute top-0 left-0 text-blue-600">•</span>
              {bullet}
            </li>
          ))
        ) : (
          <li className="text-slate-500 italic">No suggested bullet points available.</li>
        )}
      </ul>
    </div>
  );
};

export default SuggestedBullets;
