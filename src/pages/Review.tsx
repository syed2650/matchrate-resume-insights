
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Feedback } from "./review/types";
import ResultList from "./review/ResultList";
import ReviewForm from "./review/ReviewForm";

const Review = () => {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [helpfulFeedback, setHelpfulFeedback] = useState<null | boolean>(null);
  const docRef = useRef<jsPDF | null>(null);
  const { toast } = useToast();

  const handleFormSubmit = async (
    resume: string, 
    jobDescription: string, 
    jobUrl?: string, 
    selectedRole?: string,
    file?: File
  ) => {
    setIsLoading(true);

    try {
      // If a file is uploaded, we'll need to handle file upload to Supabase storage
      let filePath = null;
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(fileName, file);

        if (uploadError) throw uploadError;
        filePath = uploadData?.path;
      }

      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: { 
          resume: resume, 
          jobDescription, 
          jobUrl, 
          selectedRole 
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Store submission in database
      await supabase
        .from('submissions')
        .insert({
          resume_text: resume,
          job_description: jobDescription,
          job_url: jobUrl,
          selected_role: selectedRole as any,
          file_path: filePath,
          file_type: file?.type,
          file_name: file?.name,
          feedback_results: data
        });

      setFeedback(data);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze resume",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setHelpfulFeedback(null);
    }
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
    feedback.weakBullets.forEach((bullet: any) => {
      if (typeof bullet === "object" && bullet.original && bullet.improved) {
        const orig = doc.splitTextToSize(`Original: ${bullet.original}`, 180);
        const impr = doc.splitTextToSize(`Improved: ${bullet.improved}`, 180);
        doc.text(orig, 14, yPos);
        yPos += orig.length * 6 + 2;
        doc.text(impr, 14, yPos);
        yPos += impr.length * 6 + 2;
      } else if (typeof bullet === "string") {
        const bulletText = doc.splitTextToSize(`• ${bullet}`, 180);
        doc.text(bulletText, 14, yPos);
        yPos += bulletText.length * 6 + 2;
      }
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
        <ReviewForm onSubmit={handleFormSubmit} isLoading={isLoading} />
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
                  <FileText className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>

            <ResultList feedback={feedback} />

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

export default Review;
