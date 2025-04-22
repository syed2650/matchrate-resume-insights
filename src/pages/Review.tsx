
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

      // Log the request parameters for debugging
      console.log("Sending to analyze-resume function:", { 
        resumeLength: resume?.length, 
        jobDescriptionLength: jobDescription?.length,
        jobUrl, 
        selectedRole 
      });

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

      console.log("Received analysis result:", data);

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
    
    // Create new PDF document with a4 format (210x297mm)
    const doc = new jsPDF({ 
      format: 'a4',
      unit: 'mm',
    });

    // Set margins and calculate usable width
    const margin = 15;
    const pageWidth = 210 - (margin * 2);
    
    doc.setFontSize(20);
    doc.text("Resume Review Analysis Results", margin, 20);

    // Track y position as we add content
    let yPos = 30;

    // Add relevance score
    doc.setFontSize(16);
    doc.text("Relevance Score:", margin, yPos);
    yPos += 7;
    doc.setFontSize(14);
    doc.text(`${feedback.score}/100`, margin, yPos);
    yPos += 12;

    // Add missing keywords
    doc.setFontSize(16);
    doc.text("Missing Keywords:", margin, yPos);
    yPos += 7;
    doc.setFontSize(12);
    
    if (feedback.missingKeywords && feedback.missingKeywords.length > 0) {
      feedback.missingKeywords.forEach((keyword: string) => {
        doc.text(`• ${keyword}`, margin, yPos);
        yPos += 6;
      });
    } else {
      doc.text("None identified", margin, yPos);
      yPos += 6;
    }
    yPos += 6;

    // Add section feedback
    doc.setFontSize(16);
    doc.text("Section-by-Section Feedback:", margin, yPos);
    yPos += 10;

    if (feedback.sectionFeedback) {
      doc.setFontSize(12);
      Object.entries(feedback.sectionFeedback).forEach(([section, text]: [string, string]) => {
        // Add section name
        doc.setFont(undefined, 'bold');
        doc.text(`${section.charAt(0).toUpperCase() + section.slice(1)}:`, margin, yPos);
        yPos += 6;
        
        // Reset font
        doc.setFont(undefined, 'normal');
        
        // Handle multiline text
        const splitText = doc.splitTextToSize(text, pageWidth);
        doc.text(splitText, margin, yPos);
        yPos += splitText.length * 6 + 4;
        
        // Check if we need a new page
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
      });
    }

    // Add weak bullet improvements
    // Check if we need a new page
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(16);
    doc.text("Weak Bullet Improvements:", margin, yPos);
    yPos += 8;
    
    if (feedback.weakBullets && feedback.weakBullets.length > 0) {
      doc.setFontSize(12);
      feedback.weakBullets.forEach((bullet: any) => {
        if (typeof bullet === "object" && bullet.original && bullet.improved) {
          // Bold for Original
          doc.setFont(undefined, 'bold');
          doc.text("Original:", margin, yPos);
          yPos += 5;
          
          // Normal for content
          doc.setFont(undefined, 'normal');
          const origText = doc.splitTextToSize(bullet.original, pageWidth);
          doc.text(origText, margin, yPos);
          yPos += origText.length * 5 + 2;
          
          // Bold for Improved
          doc.setFont(undefined, 'bold');
          doc.text("Improved:", margin, yPos);
          yPos += 5;
          
          // Normal for content
          doc.setFont(undefined, 'normal');
          const imprText = doc.splitTextToSize(bullet.improved, pageWidth);
          doc.text(imprText, margin, yPos);
          yPos += imprText.length * 5 + 6;
        } else if (typeof bullet === "string") {
          const bulletText = doc.splitTextToSize(`• ${bullet}`, pageWidth);
          doc.text(bulletText, margin, yPos);
          yPos += bulletText.length * 5 + 4;
        }
        
        // Check if we need a new page
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
      });
    }

    // Add tone suggestions
    // Check if we need a new page
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(16);
    doc.text("Tone & Clarity Suggestions:", margin, yPos);
    yPos += 8;
    
    if (feedback.toneSuggestions) {
      doc.setFontSize(12);
      const toneSplit = doc.splitTextToSize(feedback.toneSuggestions, pageWidth);
      doc.text(toneSplit, margin, yPos);
      yPos += toneSplit.length * 5 + 8;
    }

    // Add interview recommendation
    // Check if we need a new page
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(16);
    doc.text("Would I Interview?", margin, yPos);
    yPos += 8;
    
    if (feedback.wouldInterview) {
      doc.setFontSize(12);
      const interviewSplit = doc.splitTextToSize(feedback.wouldInterview, pageWidth);
      doc.text(interviewSplit, margin, yPos);
    }

    // Save the PDF
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
