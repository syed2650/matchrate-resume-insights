
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { FileText, Upload } from "lucide-react";

const Review = () => {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<null | any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate feedback for MVP
    setTimeout(() => {
      setFeedback({
        score: 75,
        missingKeywords: ["product strategy", "data analysis", "stakeholder management"],
        sectionFeedback: {
          summary: "Your summary lacks quantifiable achievements. Add metrics.",
          experience: "Good structure, but needs more emphasis on product impact.",
          skills: "Missing key PM tools and methodologies.",
        },
        weakBullets: [
          "Led team meetings → Facilitated cross-functional team meetings resulting in 30% faster product iterations",
        ],
        toneSuggestions: "Use more active voice and focus on outcomes rather than tasks.",
        wouldInterview: "Maybe - needs improvements in quantifying impact",
      });
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">
        Resume Review
      </h1>

      {!feedback ? (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Paste your resume
              </label>
              <Textarea
                placeholder="Copy and paste your resume text here..."
                className="min-h-[200px]"
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Paste the job description
              </label>
              <Textarea
                placeholder="Copy and paste the job description here..."
                className="min-h-[200px]"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Analyzing..."
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Get Feedback
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-900">
                Analysis Results
              </h2>
              <Button
                variant="outline"
                onClick={() => setFeedback(null)}
              >
                <Upload className="mr-2 h-4 w-4" />
                Review Another
              </Button>
            </div>

            <div className="grid gap-6">
              <ResultSection
                title="Relevance Score"
                content={`${feedback.score}/100`}
              />
              
              <ResultSection
                title="Missing Keywords"
                content={
                  <ul className="list-disc pl-5">
                    {feedback.missingKeywords.map((keyword: string, i: number) => (
                      <li key={i} className="text-slate-600">{keyword}</li>
                    ))}
                  </ul>
                }
              />

              <ResultSection
                title="Section-by-Section Feedback"
                content={
                  <div className="space-y-3">
                    {Object.entries(feedback.sectionFeedback).map(([section, feedback]: [string, any]) => (
                      <div key={section}>
                        <h4 className="font-medium text-slate-900 capitalize">{section}</h4>
                        <p className="text-slate-600">{feedback}</p>
                      </div>
                    ))}
                  </div>
                }
              />

              <ResultSection
                title="Weak Bullet Improvements"
                content={
                  <ul className="space-y-3">
                    {feedback.weakBullets.map((bullet: string, i: number) => (
                      <li key={i} className="text-slate-600">{bullet}</li>
                    ))}
                  </ul>
                }
              />

              <ResultSection
                title="Tone & Clarity Suggestions"
                content={feedback.toneSuggestions}
              />

              <ResultSection
                title="Would I Interview?"
                content={feedback.wouldInterview}
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

const ResultSection = ({ title, content }: { title: string; content: React.ReactNode }) => (
  <div>
    <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
    <div className="text-slate-600">{content}</div>
  </div>
);

export default Review;
