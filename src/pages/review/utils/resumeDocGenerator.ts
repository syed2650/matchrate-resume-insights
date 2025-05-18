
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx";
import { templates } from "@/templates";
import { parseRoleSummary } from "./resumeFormatter";

// This function generates a formatted DOCX document based on the resume content and selected template
export const generateFormattedDocx = async (resumeText: string, template: any): Promise<Blob> => {
  const parsedRoleSummary = parseRoleSummary(extractBasicInfo(resumeText));
  
  // Get the document based on template
  let doc;
  
  if (template.id === "modern") {
    doc = generateModernTemplate(resumeText, parsedRoleSummary, template);
  } else {
    // Default to a simple template for now
    doc = generateSimpleTemplate(resumeText, parsedRoleSummary);
  }
  
  // Generate and return the document as a blob
  return await Packer.toBlob(doc);
};

function extractBasicInfo(text: string): string {
  // Extract the first few lines which typically contain contact info
  const lines = text.split('\n');
  const headerLines = lines.slice(0, 10).join('\n'); // Get first 10 lines
  return headerLines;
}

// Simple template generation
function generateSimpleTemplate(text: string, info: any): Document {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: info.name || "Resume",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `${info.email || ""} • ${info.phone || ""} • ${info.location || ""}`,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: "" }), // Spacer
          ...text.split('\n').map(line => 
            new Paragraph({ text: line })
          )
        ],
      },
    ],
  });
  return doc;
}

// Modern template generation with two columns and styling
function generateModernTemplate(text: string, info: any, templateConfig: any): Document {
  // Split resume into sections (simplified)
  const sections = text.split(/\n(?=[A-Z\s]+:)/);
  
  // Prepare paragraphs array
  const paragraphs = [];
  
  // Header
  paragraphs.push(
    new Paragraph({
      text: info.name || "Resume",
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );
  
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `${info.email || ""} • ${info.phone || ""} • ${info.location || ""}`,
          size: 20,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );
  
  // Add sections
  for (const section of sections) {
    if (!section.trim()) continue;
    
    // Try to identify section title
    const lines = section.split('\n');
    const title = lines[0].replace(':', '').trim();
    
    paragraphs.push(
      new Paragraph({
        text: title,
        heading: HeadingLevel.HEADING_2,
        thematicBreak: true,
        spacing: { before: 400, after: 200 },
      })
    );
    
    // Add section content
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      if (lines[i].startsWith('•') || lines[i].startsWith('-')) {
        // Bullet point
        paragraphs.push(
          new Paragraph({
            text: lines[i].substring(1).trim(),
            bullet: { level: 0 },
            spacing: { after: 100 },
          })
        );
      } else {
        // Normal paragraph
        paragraphs.push(
          new Paragraph({
            text: lines[i],
            spacing: { after: 100 },
          })
        );
      }
    }
  }
  
  // Create the document with all paragraphs
  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          run: {
            size: 36,
            bold: true,
            color: templateConfig.primaryColor?.replace('#', '') || "2D74FF",
          },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          run: {
            size: 28,
            bold: true,
            color: templateConfig.primaryColor?.replace('#', '') || "2D74FF",
          },
          paragraph: {
            spacing: {
              before: 240,
              after: 120,
            },
          },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              right: 1000,
              bottom: 1000,
              left: 1000,
            },
          },
        },
        children: paragraphs,
      },
    ],
  });
  
  return doc;
}

// Add a function to extract a skill list from the resume text
function extractSkills(text: string): string[] {
  const skillsRegex = /SKILLS?:?\s*([\s\S]*?)(?=\n\s*[A-Z]+:|\n\s*$)/i;
  const match = text.match(skillsRegex);
  
  if (!match || !match[1]) return [];
  
  // Split skills by bullets, commas, or new lines
  return match[1]
    .split(/[•,\n]/g)
    .map(skill => skill.trim())
    .filter(skill => skill.length > 0);
}
