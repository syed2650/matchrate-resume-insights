
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { FileText, Upload } from "lucide-react";
import { jsPDF } from "jspdf";

const Review = () => {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<null | any>(null);
  const [helpfulFeedback, setHelpfulFeedback] = useState<null | boolean>(null);
  const docRef = useRef<jsPDF | null>(null);

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
      setHelpfulFeedback(null);
    }, 2000);
  };

  const generatePDF = () => {
    if (!feedback) return;
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Resume Review Analysis Results", 14, 20);

    doc.setFontSize(14);
    doc.text("Relevance Score:", 14, 35);
    doc.setFontSize(12);
    doc.text(`${feedback.score}/100`, 14, 42);

    let yPos = 52;

    doc.setFontSize(14);
    doc.text("Missing Keywords:", 14, yPos);
    yPos += 6;
    doc.setFontSize(12);
    feedback.missingKeywords.forEach((keyword: string) => {
      doc.text(`• ${keyword}`, 14, yPos);
      yPos += 7;
    });

    yPos += 4;
    doc.setFontSize(14);
    doc.text("Section-by-Section Feedback:", 14, yPos);
    yPos += 7;

    doc.setFontSize(12);
    Object.entries(feedback.sectionFeedback).forEach(([section, text]: [string, string]) => {
      doc.text(`${section.charAt(0).toUpperCase() + section.slice(1)}:`, 14, yPos);
      yPos += 6;
      const splitText = doc.splitTextToSize(text, 180);
      doc.text(splitText, 14, yPos);
      yPos += splitText.length * 6 + 4;
    });

    doc.setFontSize(14);
    doc.text("Weak Bullet Improvements:", 14, yPos);
    yPos += 7;
    doc.setFontSize(12);
    feedback.weakBullets.forEach((bullet: string) => {
      const splitBullet = doc.splitTextToSize(`• ${bullet}`, 180);
      doc.text(splitBullet, 14, yPos);
      yPos += splitBullet.length * 6 + 2;
    });

    doc.setFontSize(14);
    doc.text("Tone & Clarity Suggestions:", 14, yPos);
    yPos += 7;
    doc.setFontSize(12);
    const toneSplit = doc.splitTextToSize(feedback.toneSuggestions, 180);
    doc.text(toneSplit, 14, yPos);
    yPos += toneSplit.length * 6 + 4;

    doc.setFontSize(14);
    doc.text("Would I Interview?", 14, yPos);
    yPos += 7;
    doc.setFontSize(12);
    const interviewSplit = doc.splitTextToSize(feedback.wouldInterview, 180);
    doc.text(interviewSplit, 14, yPos);

    doc.save("resume-review-feedback.pdf");
    docRef.current = doc;
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
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setFeedback(null)}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Review Another
                </Button>
                <Button
                  variant="outline"
                  onClick={generatePDF}
                  className="flex items-center"
                >
                  <FilePdf className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
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
                    {Object.entries(feedback.sectionFeedback).map(([section, feedbackText]: [string, any]) => (
                      <div key={section}>
                        <h4 className="font-medium text-slate-900 capitalize">{section}</h4>
                        <p className="text-slate-600">{feedbackText}</p>
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

            <div className="mt-8 border-t pt-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Was this helpful?
              </h3>
              <div className="flex space-x-4">
                <Button
                  variant={helpfulFeedback === true ? "default" : "outline"}
                  disabled={helpfulFeedback !== null}
                  onClick={() => setHelpfulFeedback(true)}
                >
                  Yes
                </Button>
                <Button
                  variant={helpfulFeedback === false ? "default" : "outline"}
                  disabled={helpfulFeedback !== null}
                  onClick={() => setHelpfulFeedback(false)}
                >
                  No
                </Button>
              </div>
              {helpfulFeedback !== null && (
                <p className="mt-2 text-slate-600">
                  Thank you for your feedback!
                </p>
              )}
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

