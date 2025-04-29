
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";

// Enhanced DOCX generation that preserves formatting
export const generateFormattedDocx = async (content: string) => {
  if (!content) return null;
  
  try {
    // Parse the resume into sections
    const sections = content.split(/^(#+\s.*|[A-Z\s]{5,})$/m).filter(Boolean);
    const docChildren: Paragraph[] = [];
    
    let currentSection: string | null = null;
    let isHeader = true;
    
    // Process each section
    sections.forEach((section, sectionIndex) => {
      const isHeading = /^(#+\s.*|[A-Z\s]{5,})$/m.test(section);
      
      if (isHeading) {
        // Add section headings
        const headingText = section.replace(/^#+\s*/g, '').replace(/^\s+|\s+$/g, '');
        
        docChildren.push(
          new Paragraph({
            text: headingText.toUpperCase(),
            heading: HeadingLevel.HEADING_2,
            thematicBreak: true,
            spacing: { before: 300, after: 120 }
          })
        );
        
        currentSection = headingText.toLowerCase();
        isHeader = currentSection.includes("summary") && sectionIndex <= 2;
      } else {
        // Process content within each section
        const lines = section.split('\n');
        
        lines.forEach((line, lineIndex) => {
          // Handle empty lines
          if (!line.trim()) {
            docChildren.push(new Paragraph({ spacing: { before: 120, after: 120 } }));
            return;
          }
          
          // Process header (name and contact info)
          if (isHeader && lineIndex === 0) {
            docChildren.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    bold: true,
                    size: 36
                  })
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 120 }
              })
            );
            return;
          }
          
          // Process contact info
          if (isHeader && (lineIndex === 1 || lineIndex === 2) && 
              (line.includes('@') || line.includes('|') || line.includes('+') || line.includes('linkedin'))) {
            docChildren.push(
              new Paragraph({
                text: line,
                alignment: AlignmentType.CENTER,
                spacing: { after: 120 }
              })
            );
            return;
          }
          
          // Process bullet points
          if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
            docChildren.push(
              new Paragraph({
                text: line.replace(/^[•-]\s*/, ''),
                bullet: { level: 0 },
                spacing: { before: 60, after: 60 }
              })
            );
            return;
          }
          
          // Process date ranges (right-aligned)
          if (line.match(/^\d{1,2}\/\d{4}\s*-\s*\d{1,2}\/\d{4}/) || 
              line.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}/i)) {
            docChildren.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    bold: true,
                  })
                ],
                alignment: AlignmentType.RIGHT,
                spacing: { after: 120 }
              })
            );
            return;
          }
          
          // Process company names and job titles
          const isCompanyName = (currentSection === "experience" || currentSection?.includes("work")) && 
                               lineIndex === 0 && line.split('•')[0].trim();
          
          const isJobTitle = (currentSection === "experience" || currentSection?.includes("work")) && 
                            lineIndex === 1 && line.match(/^[A-Z][a-z]+(\s+[A-Z][a-z]+)*/);
          
          if (isCompanyName) {
            // Only use the company name part (before any delimiter like •)
            const companyNameOnly = line.split('•')[0].trim();
            docChildren.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: companyNameOnly,
                    bold: true,
                  })
                ],
                spacing: { after: 60 }
              })
            );
            return;
          }
          
          if (isJobTitle) {
            docChildren.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    bold: true,
                  })
                ],
                spacing: { after: 120 }
              })
            );
            return;
          }
          
          // Handle education details
          const isEducationSection = currentSection === "education" || currentSection?.includes("education");
          const isEducationDegree = isEducationSection && lineIndex === 0 && line.match(/^[A-Z][a-zA-Z\s,]+$/) && !line.includes('•');
          const isInstitution = isEducationSection && lineIndex === 1;
          const isCountry = isEducationSection && lineIndex === 2;
          const isYear = isEducationSection && lineIndex === 3;
          
          if (isEducationDegree) {
            docChildren.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: line.split('•')[0].trim(), // Remove location if present
                    bold: true,
                  })
                ],
                spacing: { after: 60 }
              })
            );
            return;
          }
          
          if (isInstitution) {
            docChildren.push(
              new Paragraph({
                text: line.split('•')[0].trim(), // Remove location if present
                spacing: { after: 60 }
              })
            );
            return;
          }
          
          if (isCountry) {
            docChildren.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    italics: true,
                  })
                ],
                spacing: { after: 60 }
              })
            );
            return;
          }
          
          if (isYear) {
            docChildren.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    bold: true,
                  })
                ],
                spacing: { after: 240 }
              })
            );
            return;
          }
          
          // Default paragraph formatting
          docChildren.push(
            new Paragraph({
              text: line,
              spacing: { after: 60 }
            })
          );
        });
      }
    });
    
    // Create the document with all formatted paragraphs
    const doc = new Document({
      sections: [{
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
        children: docChildren
      }]
    });
    
    return await Packer.toBlob(doc);
  } catch (error) {
    console.error("Error generating DOCX:", error);
    
    // Fallback to simple document if formatting fails
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: content,
                  size: 24
                })
              ],
              spacing: { line: 360 }
            })
          ]
        }]
      });
      return await Packer.toBlob(doc);
    } catch (fallbackError) {
      console.error("Fallback document generation failed:", fallbackError);
      return null;
    }
  }
};
