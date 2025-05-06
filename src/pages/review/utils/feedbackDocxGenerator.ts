
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } from "docx";
import { Feedback } from "../types";

export const generateFeedbackDocx = (feedback: Feedback) => {
  // Validate the feedback object to ensure it has the required properties
  if (!feedback) {
    throw new Error("No feedback data provided");
  }
  
  // Create safe accessors for feedback properties
  const score = feedback.score ?? 0;
  const missingKeywords = Array.isArray(feedback.missingKeywords) ? feedback.missingKeywords : [];
  const sectionFeedback = feedback.sectionFeedback || {};
  const weakBullets = Array.isArray(feedback.weakBullets) ? feedback.weakBullets : [];
  const toneSuggestions = feedback.toneSuggestions || "No tone suggestions available";
  const wouldInterview = feedback.wouldInterview || "No interview recommendation available";
  
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: "Resume Analysis Report",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),
          
          // Score section
          new Paragraph({
            text: `Match Score: ${score}/100`,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          
          new Paragraph({
            children: [
              new TextRun({
                text: `This resume has a ${score}% match with the job description. `,
                size: 24
              }),
              new TextRun({
                text: wouldInterview,
                size: 24,
                bold: true
              })
            ],
            spacing: { after: 200 }
          }),
          
          // Missing Keywords section
          new Paragraph({
            text: "Missing Keywords",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          
          ...(missingKeywords.length > 0 ? missingKeywords.map(keyword => 
            new Paragraph({
              text: `• ${keyword}`,
              spacing: { after: 100 }
            })
          ) : [new Paragraph({ text: "No missing keywords data available", spacing: { after: 100 } })]),
          
          // Section Feedback
          new Paragraph({
            text: "Section-by-Section Feedback",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          
          ...(Object.entries(sectionFeedback).length > 0 ? 
            Object.entries(sectionFeedback).flatMap(([section, content]) => [
              new Paragraph({
                text: section,
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 200, after: 100 }
              }),
              new Paragraph({
                text: content as string,
                spacing: { after: 100 }
              })
            ]) : 
            [new Paragraph({ text: "No section feedback available", spacing: { after: 100 } })]
          ),
          
          // Bullet Improvements
          new Paragraph({
            text: "Bullet Point Improvements",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          
          ...(weakBullets.length > 0 ? weakBullets.flatMap((bullet, index) => {
            if (!bullet || typeof bullet !== 'object') {
              return [new Paragraph({ text: `No data for bullet ${index + 1}`, spacing: { after: 100 } })];
            }
            
            return [
              new Paragraph({
                text: `Bullet ${index + 1}`,
                heading: HeadingLevel.HEADING_3,
                spacing: { before: 200, after: 100 }
              }),
              new Paragraph({
                children: [new TextRun({ text: "Original:", bold: true })],
                spacing: { after: 100 }
              }),
              new Paragraph({
                text: bullet.original || "No original content",
                spacing: { after: 200 }
              }),
              new Paragraph({
                children: [new TextRun({ text: "Improved:", bold: true })],
                spacing: { after: 100 }
              }),
              new Paragraph({
                text: bullet.improved || "No improved content",
                spacing: { after: 300 }
              })
            ];
          }) : [new Paragraph({ text: "No bullet improvements available", spacing: { after: 100 } })]
          ),
          
          // Tone Suggestions
          new Paragraph({
            text: "Tone & Clarity Suggestions",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),
          
          new Paragraph({
            text: toneSuggestions,
            spacing: { after: 400 }
          }),
          
          // Footer
          new Paragraph({
            text: "Generated by Matchrate.ai",
            alignment: AlignmentType.CENTER,
            spacing: { before: 800 }
          })
        ]
      }
    ]
  });
  
  return Packer.toBlob(doc);
};
