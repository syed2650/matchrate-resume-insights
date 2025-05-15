
import { jsPDF } from "jspdf";
import { Feedback } from "./types";

export const generatePDF = async (doc: jsPDF, feedback: Feedback) => {
  // Simple implementation to make TypeScript happy
  // This should be replaced with your actual PDF generation logic
  
  // Set up document
  doc.setFont("helvetica");
  doc.setFontSize(22);
  doc.text("Resume Analysis Report", 20, 20);
  
  // Add score
  doc.setFontSize(16);
  doc.text(`ATS Score: ${feedback.score}/100`, 20, 40);
  
  // Add missing keywords if available
  if (feedback.missingKeywords && feedback.missingKeywords.length > 0) {
    doc.setFontSize(14);
    doc.text("Missing Keywords:", 20, 60);
    
    let yPos = 70;
    feedback.missingKeywords.forEach((keyword, index) => {
      doc.setFontSize(12);
      doc.text(`• ${keyword}`, 30, yPos);
      yPos += 10;
    });
  }
  
  // Add section feedback
  if (feedback.sectionFeedback && Object.keys(feedback.sectionFeedback).length > 0) {
    doc.addPage();
    doc.setFontSize(14);
    doc.text("Section Feedback:", 20, 20);
    
    let yPos = 30;
    Object.entries(feedback.sectionFeedback).forEach(([section, feedbackText]) => {
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(section, 20, yPos);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      
      // Simple text wrapping logic
      const maxWidth = 170;
      const lines = doc.splitTextToSize(feedbackText, maxWidth);
      
      yPos += 10;
      doc.text(lines, 20, yPos);
      yPos += lines.length * 7 + 10;
      
      // Check if we need a new page
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });
  }
  
  return doc;
};

export default generatePDF; // Add a default export for flexibility
