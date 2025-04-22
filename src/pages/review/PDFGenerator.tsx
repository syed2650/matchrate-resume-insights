
import { jsPDF } from "jspdf";
import { Feedback } from "./types";

export const generatePDF = (feedback: Feedback): jsPDF => {
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
      
      // Check if we need a new page
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
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
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
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
      // Check if we need a new page
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      
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

  return doc;
};

export default generatePDF;
