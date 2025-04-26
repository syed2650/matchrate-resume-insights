
import { jsPDF } from "jspdf";
import { PDF_STYLES as styles } from "./styles";
import { Feedback } from "../types";

export function drawHeader(doc: jsPDF, pageWidth: number) {
  const headerColor = styles.backgrounds.header;
  doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
  doc.rect(0, 0, pageWidth, 25, 'F');
  
  doc.setTextColor(styles.colors.white);
  doc.setFontSize(styles.fontSize.title);
  doc.setFont(styles.fonts.regular, 'bold');
  doc.text("Resume Analysis Report", styles.margins.side, 15);
  
  doc.setTextColor(styles.colors.black);
}

export function drawMetadata(doc: jsPDF, yPos: number) {
  doc.setFontSize(styles.fontSize.small);
  doc.setTextColor(styles.colors.slate[500]);
  const today = new Date();
  doc.text(`Generated on ${today.toLocaleDateString()}`, styles.margins.side, yPos);
  
  yPos += 8;
  doc.setFontSize(styles.fontSize.normal);
  doc.setFont(styles.fonts.regular, 'bold');
  doc.setTextColor(styles.colors.blue[600]);
  doc.text("RESUME FEEDBACK REPORT", styles.margins.side, yPos);
  doc.setFont(styles.fonts.regular, 'normal');
  doc.setTextColor(styles.colors.black);
  
  return yPos + 12;
}

export function drawScores(doc: jsPDF, feedback: Feedback, pageWidth: number, yPos: number) {
  const lightGrayColor = styles.backgrounds.lightGray;
  doc.setFillColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2]);
  const scoreHeight = 25;
  doc.rect(styles.margins.side, yPos, pageWidth - (styles.margins.side * 2), scoreHeight, 'F');
  
  doc.setFontSize(styles.fontSize.large);
  doc.setFont(styles.fonts.regular, 'bold');
  doc.text("Relevance Score:", styles.margins.side + 5, yPos + 8);
  
  // Color code the score
  const score = feedback.score;
  if (score >= 80) {
    doc.setTextColor('#16A34A'); // Green
  } else if (score >= 60) {
    doc.setTextColor('#D97706'); // Orange
  } else {
    doc.setTextColor('#DC2626'); // Red
  }
  
  doc.text(`${score}/100`, styles.margins.side + 45, yPos + 8);
  doc.setTextColor(styles.colors.black);
  
  // Add ATS score
  let atsScore = 0;
  if (feedback.atsScores && typeof feedback.atsScores === 'object') {
    const scores = Object.values(feedback.atsScores);
    if (scores.length > 0) {
      atsScore = scores[0];
    }
  }
  
  doc.text("ATS Readiness:", styles.margins.side + 85, yPos + 8);
  
  if (atsScore >= 80) {
    doc.setTextColor('#16A34A');
  } else if (atsScore >= 60) {
    doc.setTextColor('#D97706');
  } else {
    doc.setTextColor('#DC2626');
  }
  
  doc.text(`${atsScore}/100`, styles.margins.side + 125, yPos + 8);
  doc.setTextColor(styles.colors.black);
  
  // Add Job title if available
  if (feedback.jobTitle) {
    doc.setFontSize(styles.fontSize.normal);
    doc.text(`Target Role: ${feedback.jobTitle}`, styles.margins.side + 5, yPos + 18);
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
