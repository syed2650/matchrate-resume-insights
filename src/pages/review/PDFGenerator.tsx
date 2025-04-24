
import { jsPDF } from "jspdf";
import { Feedback } from "./types";

export const generatePDF = (feedback: Feedback): jsPDF => {
  // Create new PDF document with a4 format (210x297mm)
  const doc = new jsPDF({ 
    format: 'a4',
    unit: 'mm',
  });

  // Set fonts for a more professional look
  doc.addFont('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ.ttf', 'Inter', 'normal');
  doc.addFont('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiJ.ttf', 'Inter', 'bold');
  
  // Set default font
  doc.setFont('Inter');

  // Set margins and calculate usable width
  const margin = 15;
  const pageWidth = 210 - (margin * 2);
  
  // Add a branded header
  doc.setFillColor(30, 41, 59); // Dark blue header
  doc.rect(0, 0, 210, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('Inter', 'bold');
  doc.text("Matchrate.ai Resume Analysis", margin, 20);
  
  // Reset text color for rest of document
  doc.setTextColor(0, 0, 0);
  
  // Track y position as we add content
  let yPos = 40;

  // Add date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const today = new Date();
  doc.text(`Generated on ${today.toLocaleDateString()}`, margin, yPos);
  yPos += 10;
  
  // Add company logo/name
  doc.setFontSize(12);
  doc.setFont('Inter', 'bold');
  doc.setTextColor(59, 130, 246); // Blue
  doc.text("MATCHRATE.AI", margin, yPos);
  doc.setFont('Inter', 'normal');
  doc.setTextColor(0, 0, 0);
  yPos += 12;

  // Add scores section with consistent ATS score (from feedback if available)
  doc.setFillColor(248, 250, 252); // Light gray background
  doc.rect(margin, yPos, pageWidth, 25, 'F');
  
  doc.setFontSize(14);
  doc.setFont('Inter', 'bold');
  doc.text("Relevance Score:", margin + 5, yPos + 8);
  
  // Color code the score
  const score = feedback.score;
  if (score >= 80) {
    doc.setTextColor(22, 163, 74); // Green
  } else if (score >= 60) {
    doc.setTextColor(217, 119, 6); // Orange
  } else {
    doc.setTextColor(220, 38, 38); // Red
  }
  
  doc.text(`${score}/100`, margin + 45, yPos + 8);
  doc.setTextColor(0, 0, 0);
  
  // Add ATS score from feedback if available or calculate it deterministically
  let atsScore = 0;
  if (feedback.atsScores && typeof feedback.atsScores === 'object') {
    // Get the first score available
    const scores = Object.values(feedback.atsScores);
    if (scores.length > 0) {
      atsScore = scores[0];
    }
  } else {
    // Calculate a score deterministically based on the relevance score
    atsScore = Math.min(95, Math.max(40, feedback.score + 5));
  }
  
  doc.text("ATS Readiness:", margin + 85, yPos + 8);
  
  if (atsScore >= 80) {
    doc.setTextColor(22, 163, 74); // Green
  } else if (atsScore >= 60) {
    doc.setTextColor(217, 119, 6); // Orange
  } else {
    doc.setTextColor(220, 38, 38); // Red
  }
  
  doc.text(`${atsScore}/100`, margin + 125, yPos + 8);
  doc.setTextColor(0, 0, 0);
  
  yPos += 35;

  // Add missing keywords
  doc.setFont('Inter', 'bold');
  doc.setFontSize(16);
  doc.text("Missing Keywords & Skills:", margin, yPos);
  yPos += 8;
  doc.setFont('Inter', 'normal');
  doc.setFontSize(12);
  
  if (feedback.missingKeywords && feedback.missingKeywords.length > 0) {
    doc.setDrawColor(226, 232, 240); // Light gray border
    
    const columns = 2;
    const colWidth = pageWidth / columns;
    const itemsPerCol = Math.ceil(feedback.missingKeywords.length / columns);
    
    for (let i = 0; i < feedback.missingKeywords.length; i++) {
      const colIndex = Math.floor(i / itemsPerCol);
      const rowIndex = i % itemsPerCol;
      const xPos = margin + (colWidth * colIndex);
      const currentY = yPos + (rowIndex * 8);
      
      // Draw background for each item
      doc.setFillColor(239, 246, 255); // Light blue background
      doc.roundedRect(xPos, currentY - 4, colWidth - 4, 7, 1, 1, 'F');
      
      doc.text(`• ${feedback.missingKeywords[i]}`, xPos + 3, currentY);
      
      // Check if we need a new page
      if (currentY > 270 && i < feedback.missingKeywords.length - 1) {
        doc.addPage();
        yPos = 20;
        break;
      }
    }
    
    yPos += (Math.min(itemsPerCol, feedback.missingKeywords.length) * 8) + 6;
  } else {
    doc.text("No critical keywords missing.", margin, yPos);
    yPos += 10;
  }
  
  // Check if we need a new page
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }

  // Add section feedback
  doc.setFontSize(16);
  doc.setFont('Inter', 'bold');
  doc.text("Section-by-Section Feedback:", margin, yPos);
  yPos += 8;

  if (feedback.sectionFeedback) {
    doc.setFontSize(12);
    Object.entries(feedback.sectionFeedback).forEach(([section, text]: [string, string]) => {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      // Add section name with background
      doc.setFillColor(248, 250, 252); // Light gray background
      doc.rect(margin, yPos - 5, pageWidth, 10, 'F');
      doc.setFont('Inter', 'bold');
      doc.text(`${section.charAt(0).toUpperCase() + section.slice(1)}:`, margin + 2, yPos);
      yPos += 7;
      
      // Reset font
      doc.setFont('Inter', 'normal');
      
      // Handle multiline text
      const splitText = doc.splitTextToSize(text, pageWidth - 4);
      doc.text(splitText, margin + 2, yPos);
      yPos += splitText.length * 6 + 10;
    });
  }

  // Add weak bullet improvements
  // Check if we need a new page
  if (yPos > 240) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(16);
  doc.setFont('Inter', 'bold');
  doc.text("STAR Format Bullet Improvements:", margin, yPos);
  yPos += 8;
  
  if (feedback.weakBullets && feedback.weakBullets.length > 0) {
    doc.setFontSize(12);
    feedback.weakBullets.forEach((bullet: any, index: number) => {
      // Check if we need a new page
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }
      
      if (typeof bullet === "object" && bullet.original && bullet.improved) {
        // Original bullet with light gray background
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, yPos - 4, pageWidth, 6 + doc.getTextDimensions(bullet.original, { maxWidth: pageWidth - 8 }).h, 'F');
        
        // Bold for Original
        doc.setFont('Inter', 'bold');
        doc.setTextColor(100, 116, 139); // Slate 500
        doc.text("Original:", margin + 2, yPos);
        yPos += 6;
        
        // Normal for content
        doc.setFont('Inter', 'normal');
        doc.setTextColor(71, 85, 105); // Slate 600
        const origText = doc.splitTextToSize(bullet.original, pageWidth - 8);
        doc.text(origText, margin + 4, yPos);
        yPos += origText.length * 5 + 4;
        
        // Improved bullet with light blue background
        doc.setFillColor(239, 246, 255); // Light blue
        doc.rect(margin, yPos - 4, pageWidth, 6 + doc.getTextDimensions(bullet.improved, { maxWidth: pageWidth - 8 }).h, 'F');
        
        // Bold for Improved
        doc.setFont('Inter', 'bold');
        doc.setTextColor(37, 99, 235); // Blue 600
        doc.text("Improved:", margin + 2, yPos);
        yPos += 6;
        
        // Normal for content
        doc.setFont('Inter', 'normal');
        doc.setTextColor(0, 0, 0);
        const imprText = doc.splitTextToSize(bullet.improved, pageWidth - 8);
        doc.text(imprText, margin + 4, yPos);
        yPos += imprText.length * 5 + 8;
      } else if (typeof bullet === "string") {
        const bulletText = doc.splitTextToSize(bullet, pageWidth);
        doc.text(bulletText, margin, yPos);
        yPos += bulletText.length * 5 + 4;
      }
    });
  }

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Add tone suggestions
  // Check if we need a new page
  if (yPos > 240) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(16);
  doc.setFont('Inter', 'bold');
  doc.text("Tone & Clarity Suggestions:", margin, yPos);
  yPos += 8;
  
  if (feedback.toneSuggestions) {
    doc.setFontSize(12);
    doc.setFont('Inter', 'normal');
    const toneSplit = doc.splitTextToSize(feedback.toneSuggestions, pageWidth);
    doc.text(toneSplit, margin, yPos);
    yPos += toneSplit.length * 5 + 8;
  }

  // Add interview recommendation
  // Check if we need a new page
  if (yPos > 240) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFillColor(30, 41, 59, 0.05); // Very light blue background
  doc.rect(margin, yPos, pageWidth, 40, 'F');

  doc.setFontSize(16);
  doc.setFont('Inter', 'bold');
  doc.text("Final Verdict: Would I Interview?", margin + 2, yPos + 8);
  yPos += 14;
  
  if (feedback.wouldInterview) {
    doc.setFontSize(12);
    doc.setFont('Inter', 'normal');
    const interviewSplit = doc.splitTextToSize(feedback.wouldInterview, pageWidth - 4);
    doc.text(interviewSplit, margin + 2, yPos);
  }

  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.height;
    
    doc.setFillColor(248, 250, 252);
    doc.rect(0, pageHeight - 15, 210, 15, 'F');
    
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.text(`Generated by Matchrate.ai - Professional Resume Analysis & Optimization`, margin, pageHeight - 8);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  return doc;
};

export default generatePDF;
