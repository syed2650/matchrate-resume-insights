
import { jsPDF } from "jspdf";
import { PDF_STYLES as styles } from "./styles";
import { Feedback } from "../types";

export function drawHeader(doc: jsPDF, pageWidth: number) {
  const headerColor = styles.backgrounds.header;
  doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
  doc.rect(0, 0, pageWidth, 28, 'F');
  
  doc.setTextColor(styles.colors.white);
  doc.setFontSize(styles.fontSize.title);
  doc.setFont(styles.fonts.heading);
  doc.text("Resume Analysis Report", styles.margins.side, 18);
  
  doc.setFontSize(styles.fontSize.small);
  doc.setFont(styles.fonts.regular);
  doc.text("Powered by AI & Recruiter Insights", pageWidth - styles.margins.side, 18, { align: 'right' });
  
  doc.setTextColor(styles.colors.black);
}

export function drawMetadata(doc: jsPDF, yPos: number) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });
  
  doc.setFontSize(styles.fontSize.small);
  doc.setTextColor(styles.colors.slate[500]);
  doc.text(`Generated on ${formattedDate}`, styles.margins.side, yPos);
  
  yPos += 10;
  doc.setFontSize(styles.fontSize.normal);
  doc.setFont(styles.fonts.heading);
  doc.setTextColor(styles.colors.blue[600]);
  doc.text("PROFESSIONAL RESUME FEEDBACK", styles.margins.side, yPos);
  doc.setFont(styles.fonts.regular);
  doc.setTextColor(styles.colors.black);
  
  return yPos + 14;
}

export function drawScores(doc: jsPDF, feedback: Feedback, pageWidth: number, yPos: number) {
  const lightGrayColor = styles.backgrounds.lightGray;
  doc.setFillColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2]);
  const scoreHeight = 35;
  doc.roundedRect(styles.margins.side, yPos, pageWidth - (styles.margins.side * 2), scoreHeight, 2, 2, 'F');
  
  doc.setFontSize(styles.fontSize.large);
  doc.setFont(styles.fonts.heading);
  doc.text("Relevance Score:", styles.margins.side + 5, yPos + 10);
  
  // Color code the score
  const score = feedback.score;
  if (score >= 80) {
    doc.setTextColor('#16A34A'); // Green
  } else if (score >= 60) {
    doc.setTextColor('#D97706'); // Orange
  } else {
    doc.setTextColor('#DC2626'); // Red
  }
  
  doc.text(`${score}/100`, styles.margins.side + 50, yPos + 10);
  doc.setTextColor(styles.colors.black);
  
  // Add visual score indicator
  const barWidth = 120;
  const barHeight = 6;
  const startX = pageWidth - styles.margins.side - barWidth;
  const startY = yPos + 8;
  
  // Background bar
  doc.setFillColor(220, 220, 220);
  doc.roundedRect(startX, startY, barWidth, barHeight, 3, 3, 'F');
  
  // Score bar
  const fillWidth = (score / 100) * barWidth;
  if (score >= 80) {
    doc.setFillColor(22, 163, 74); // Green
  } else if (score >= 60) {
    doc.setFillColor(217, 119, 6); // Orange
  } else {
    doc.setFillColor(220, 38, 38); // Red
  }
  doc.roundedRect(startX, startY, fillWidth, barHeight, 3, 3, 'F');
  
  // Add Job title if available
  if (feedback.jobTitle) {
    doc.setFontSize(styles.fontSize.normal);
    doc.setFont(styles.fonts.regular);
    doc.text(`Target Role: ${feedback.jobTitle}`, styles.margins.side + 5, yPos + 24);
  }
  
  return yPos + scoreHeight + 10;
}

export function addFooters(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    const lightGrayColor = styles.backgrounds.lightGray;
    doc.setFillColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2]);
    doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
    
    doc.setTextColor(styles.colors.slate[500]);
    doc.setFontSize(styles.fontSize.small);
    doc.text(`Resume Analysis & Optimization - Professional Report`, 
      styles.margins.side, pageHeight - 8);
    doc.text(`Page ${i} of ${pageCount}`, 
      pageWidth - styles.margins.side, pageHeight - 8, { align: 'right' });
  }
}
