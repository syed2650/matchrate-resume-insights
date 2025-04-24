
import { jsPDF } from "jsPDF";
import { PDF_STYLES as styles } from "./styles";
import { Feedback } from "../types";

function checkPageBreak(doc: jsPDF, yPos: number, margin: number = 20): number {
  if (yPos > 250) {
    doc.addPage();
    return margin;
  }
  return yPos;
}

export function drawMissingKeywords(doc: jsPDF, feedback: Feedback, pageWidth: number, yPos: number): number {
  doc.setFont(styles.fonts.regular, 'bold');
  doc.setFontSize(styles.fontSize.large);
  doc.text("Missing Keywords & Skills:", styles.margins.side, yPos);
  yPos += 8;
  doc.setFont(styles.fonts.regular, 'normal');
  doc.setFontSize(styles.fontSize.normal);
  
  if (feedback.missingKeywords && feedback.missingKeywords.length > 0) {
    const columns = 2;
    const colWidth = (pageWidth - (styles.margins.side * 2)) / columns;
    const itemsPerCol = Math.ceil(feedback.missingKeywords.length / columns);
    
    for (let i = 0; i < feedback.missingKeywords.length; i++) {
      const colIndex = Math.floor(i / itemsPerCol);
      const rowIndex = i % itemsPerCol;
      const xPos = styles.margins.side + (colWidth * colIndex);
      const currentY = yPos + (rowIndex * 8);
      
      // Draw background for each item
      const lightBlueColor = styles.backgrounds.lightBlue;
      doc.setFillColor(lightBlueColor[0], lightBlueColor[1], lightBlueColor[2]);
      doc.roundedRect(xPos, currentY - 4, colWidth - 4, 7, 1, 1, 'F');
      
      doc.text(`• ${feedback.missingKeywords[i]}`, xPos + 3, currentY);
      
      yPos = checkPageBreak(doc, currentY);
    }
    
    yPos += (Math.min(itemsPerCol, feedback.missingKeywords.length) * 8) + 6;
  } else {
    doc.text("No critical keywords missing.", styles.margins.side, yPos);
    yPos += 10;
  }
  
  return yPos;
}

export function drawSectionFeedback(doc: jsPDF, feedback: Feedback, pageWidth: number, yPos: number): number {
  yPos = checkPageBreak(doc, yPos);
  
  doc.setFontSize(styles.fontSize.large);
  doc.setFont(styles.fonts.regular, 'bold');
  doc.text("Section-by-Section Feedback:", styles.margins.side, yPos);
  yPos += 8;

  if (feedback.sectionFeedback) {
    doc.setFontSize(styles.fontSize.normal);
    Object.entries(feedback.sectionFeedback).forEach(([section, text]: [string, string]) => {
      yPos = checkPageBreak(doc, yPos);
      
      // Add section name with background
      const lightGrayColor = styles.backgrounds.lightGray;
      doc.setFillColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2]);
      doc.rect(styles.margins.side, yPos - 5, pageWidth - (styles.margins.side * 2), 10, 'F');
      doc.setFont(styles.fonts.regular, 'bold');
      doc.text(`${section.charAt(0).toUpperCase() + section.slice(1)}:`, styles.margins.side + 2, yPos);
      yPos += 7;
      
      doc.setFont(styles.fonts.regular, 'normal');
      const splitText = doc.splitTextToSize(text, pageWidth - (styles.margins.side * 2) - 4);
      doc.text(splitText, styles.margins.side + 2, yPos);
      yPos += splitText.length * 6 + 10;
    });
  }

  return yPos;
}

export function drawWeakBullets(doc: jsPDF, feedback: Feedback, pageWidth: number, yPos: number): number {
  yPos = checkPageBreak(doc, yPos);

  doc.setFontSize(styles.fontSize.large);
  doc.setFont(styles.fonts.regular, 'bold');
  doc.text("STAR Format Bullet Improvements:", styles.margins.side, yPos);
  yPos += 8;
  
  if (feedback.weakBullets && feedback.weakBullets.length > 0) {
    doc.setFontSize(styles.fontSize.normal);
    feedback.weakBullets.forEach((bullet: any) => {
      yPos = checkPageBreak(doc, yPos);
      
      if (typeof bullet === "object" && bullet.original && bullet.improved) {
        // Original bullet
        const lightGrayColor = styles.backgrounds.lightGray;
        doc.setFillColor(lightGrayColor[0], lightGrayColor[1], lightGrayColor[2]);
        const origHeight = doc.getTextDimensions(bullet.original, { maxWidth: pageWidth - (styles.margins.side * 2) - 8 }).h;
        doc.rect(styles.margins.side, yPos - 4, pageWidth - (styles.margins.side * 2), 6 + origHeight, 'F');
        
        doc.setFont(styles.fonts.regular, 'bold');
        doc.setTextColor(styles.colors.slate[500]);
        doc.text("Original:", styles.margins.side + 2, yPos);
        yPos += 6;
        
        doc.setFont(styles.fonts.regular, 'normal');
        doc.setTextColor(styles.colors.slate[600]);
        const origText = doc.splitTextToSize(bullet.original, pageWidth - (styles.margins.side * 2) - 8);
        doc.text(origText, styles.margins.side + 4, yPos);
        yPos += origText.length * 5 + 4;
        
        // Improved bullet
        const lightBlueColor = styles.backgrounds.lightBlue;
        doc.setFillColor(lightBlueColor[0], lightBlueColor[1], lightBlueColor[2]);
        const imprHeight = doc.getTextDimensions(bullet.improved, { maxWidth: pageWidth - (styles.margins.side * 2) - 8 }).h;
        doc.rect(styles.margins.side, yPos - 4, pageWidth - (styles.margins.side * 2), 6 + imprHeight, 'F');
        
        doc.setFont(styles.fonts.regular, 'bold');
        doc.setTextColor(styles.colors.blue[600]);
        doc.text("Improved:", styles.margins.side + 2, yPos);
        yPos += 6;
        
        doc.setFont(styles.fonts.regular, 'normal');
        doc.setTextColor(styles.colors.black);
        const imprText = doc.splitTextToSize(bullet.improved, pageWidth - (styles.margins.side * 2) - 8);
        doc.text(imprText, styles.margins.side + 4, yPos);
        yPos += imprText.length * 5 + 8;
      }
    });
  }

  return yPos;
}

export function drawFinalSection(doc: jsPDF, feedback: Feedback, pageWidth: number, yPos: number): number {
  yPos = checkPageBreak(doc, yPos);

  // Add tone suggestions
  doc.setFontSize(styles.fontSize.large);
  doc.setFont(styles.fonts.regular, 'bold');
  doc.text("Tone & Clarity Suggestions:", styles.margins.side, yPos);
  yPos += 8;
  
  if (feedback.toneSuggestions) {
    doc.setFontSize(styles.fontSize.normal);
    doc.setFont(styles.fonts.regular, 'normal');
    const toneSplit = doc.splitTextToSize(feedback.toneSuggestions, pageWidth - (styles.margins.side * 2));
    doc.text(toneSplit, styles.margins.side, yPos);
    yPos += toneSplit.length * 5 + 8;
  }

  yPos = checkPageBreak(doc, yPos);

  // Add interview recommendation
  doc.setFillColor(30, 41, 59, 0.05);
  doc.rect(styles.margins.side, yPos, pageWidth - (styles.margins.side * 2), 40, 'F');

  doc.setFontSize(styles.fontSize.large);
  doc.setFont(styles.fonts.regular, 'bold');
  doc.text("Final Verdict: Would I Interview?", styles.margins.side + 2, yPos + 8);
  yPos += 14;
  
  if (feedback.wouldInterview) {
    doc.setFontSize(styles.fontSize.normal);
    doc.setFont(styles.fonts.regular, 'normal');
    const interviewSplit = doc.splitTextToSize(feedback.wouldInterview, pageWidth - (styles.margins.side * 2) - 4);
    doc.text(interviewSplit, styles.margins.side + 2, yPos);
  }

  return yPos;
}
