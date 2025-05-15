import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopPosition, TabStopType, BorderStyle } from "docx";

export async function generateFormattedDocx(resumeText: string, formattingStyle = null): Promise<Blob | null> {
  try {
    if (!resumeText || typeof resumeText !== 'string') {
      console.error("Invalid resume text provided");
      return null;
    }
    
    // Parse resume text into sections
    const sections = parseResumeIntoSections(resumeText);
    
    // Apply formatting style if provided
    const formatting = formattingStyle || {
      font: "Calibri",
      heading_style: "bold black",
      bullet_indent: "0.5in",
      line_spacing: "1.15"
    };
    
    // Create document with proper styling
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: createFormattedDocument(sections, formatting)
        }
      ],
      styles: {
        paragraphStyles: [
          {
            id: "Normal",
            name: "Normal",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: formatting.font || "Calibri",
              size: 22,
              color: "000000",
            },
            paragraph: {
              spacing: {
                line: 276,
                before: 0,
                after: 200,
              },
            },
          },
          {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: formatting.font || "Calibri",
              size: 32,
              bold: true,
              color: "000000",
            },
            paragraph: {
              spacing: {
                before: 240,
                after: 120,
              },
              alignment: AlignmentType.CENTER,
            },
          },
          {
            id: "Heading2",
            name: "Heading 2",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: formatting.font || "Calibri",
              size: 26,
              bold: true,
              color: getHeadingColorFromStyle(formatting.heading_style || "bold black"),
              underline: {
                type: "single",
                color: "000000",
              },
            },
            paragraph: {
              spacing: {
                before: 240,
                after: 120,
              },
            },
          },
          {
            id: "JobTitle",
            name: "Job Title",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: formatting.font || "Calibri",
              size: 24,
              bold: true,
              color: "000000",
            },
          },
          {
            id: "Company",
            name: "Company",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: formatting.font || "Calibri",
              size: 22,
              bold: false,
              color: "000000",
            },
          },
          {
            id: "BulletPoint",
            name: "Bullet Point",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: formatting.font || "Calibri",
              size: 22,
              color: "000000",
            },
            paragraph: {
              spacing: {
                line: 276,
                before: 0,
                after: 100,
              },
              indent: {
                left: parseBulletIndent(formatting.bullet_indent || "0.5in"),
              },
            },
          },
          {
            id: "ContactInfo",
            name: "Contact Info",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: formatting.font || "Calibri",
              size: 22,
              color: "000000",
            },
            paragraph: {
              alignment: AlignmentType.CENTER,
              spacing: {
                before: 0,
                after: 240,
              },
            },
          },
        ],
      },
    });
    
    // Convert to blob
    const buffer = await Packer.toBlob(doc);
    return buffer;
  } catch (error) {
    console.error("Error generating DOCX:", error);
    return null;
  }
}

// Helper function to parse bullet indent
function parseBulletIndent(indentStr: string): number {
  if (indentStr.includes('in')) {
    // Convert inches to twips (1 inch = 1440 twips)
    const inches = parseFloat(indentStr);
    return inches * 1440;
  }
  // Default to 0.5 inches (720 twips)
  return 720;
}

// Helper function to get heading color from style string
function getHeadingColorFromStyle(style: string): string {
  const colorMap: Record<string, string> = {
    'blue': '0000FF',
    'navy': '000080',
    'dark': '333333',
    'black': '000000',
    'gray': '808080',
    'charcoal': '36454F'
  };
  
  for (const [color, hex] of Object.entries(colorMap)) {
    if (style.toLowerCase().includes(color)) {
      return hex;
    }
  }
  
  // Default to black if no color match
  return '000000';
}

function parseResumeIntoSections(resumeText: string): any {
  // Split the text by double newlines to separate sections
  const lines = resumeText.split(/\n/).filter(line => line.trim().length > 0);
  
  // First line is usually the name
  const name = lines[0]?.trim() || "Resume";
  
  // Look for contact information in the first few lines
  const contactInfo = lines.slice(1, 4).join(" • ");
  
  // Try to identify sections like "Experience", "Education", "Skills", etc.
  const sections: Record<string, string[]> = {
    name: [name],
    contactInfo: [contactInfo],
    summary: [],
    experience: [],
    education: [],
    skills: [],
    other: []
  };
  
  // Simple heuristic to identify sections
  let currentSection = "summary";
  
  for (let i = 4; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Check if this is a section header
    if (line.toUpperCase() === line && line.length < 30) {
      // This is likely a section header - determine which section
      if (/EXPERIENCE|EMPLOYMENT|WORK|CAREER|PROFESSIONAL/i.test(line)) {
        currentSection = "experience";
        continue;
      } else if (/EDUCATION|ACADEMIC|DEGREE|UNIVERSITY|COLLEGE/i.test(line)) {
        currentSection = "education";
        continue;
      } else if (/SKILLS|TECHNOLOGIES|COMPETENCIES|PROFICIENCIES/i.test(line)) {
        currentSection = "skills";
        continue;
      } else if (/SUMMARY|PROFILE|OBJECTIVE|ABOUT/i.test(line)) {
        currentSection = "summary";
        continue;
      } else {
        currentSection = "other";
        continue;
      }
    }
    
    // Add the line to the current section
    sections[currentSection].push(line);
  }
  
  return sections;
}

function createFormattedDocument(sections: Record<string, string[]>, formatting: any = {}) {
  const documentElements = [];
  
  // Name (centered, large)
  if (sections.name && sections.name.length > 0) {
    documentElements.push(
      new Paragraph({
        text: sections.name[0],
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
      })
    );
  }
  
  // Contact Info (centered)
  if (sections.contactInfo && sections.contactInfo.length > 0) {
    documentElements.push(
      new Paragraph({
        text: sections.contactInfo[0],
        style: "ContactInfo",
        alignment: AlignmentType.CENTER,
      })
    );
  }
  
  // Summary
  if (sections.summary && sections.summary.length > 0) {
    documentElements.push(
      new Paragraph({
        text: "SUMMARY",
        heading: HeadingLevel.HEADING_2,
        border: {
          bottom: {
            color: "auto",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );
    
    // Add each summary paragraph
    sections.summary.forEach(paragraph => {
      documentElements.push(
        new Paragraph({
          text: paragraph,
          spacing: {
            before: 100,
            after: 100,
          },
        })
      );
    });
  }
  
  // Experience
  if (sections.experience && sections.experience.length > 0) {
    documentElements.push(
      new Paragraph({
        text: "EXPERIENCE",
        heading: HeadingLevel.HEADING_2,
        border: {
          bottom: {
            color: "auto",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );
    
    // Parse experience entries - usually in format:
    // Company Name | Location                            Date - Date
    // Job Title
    // • Bullet point
    // • Bullet point
    
    let i = 0;
    while (i < sections.experience.length) {
      const line = sections.experience[i];
      
      // Check if this line contains a company name (often has a pipe or dash)
      if (line.includes('|') || line.includes('-') || /\d{4}\s*-\s*\d{4}|\d{4}\s*-\s*(Present|Current)/.test(line)) {
        // Company line with date
        const companyParts = line.split(/\s{2,}|\t/);
        
        const companyText = companyParts[0];
        const dateText = companyParts.length > 1 ? companyParts[companyParts.length - 1] : "";
        
        documentElements.push(
          new Paragraph({
            tabStops: [
              {
                type: TabStopType.RIGHT,
                position: TabStopPosition.MAX,
              },
            ],
            spacing: {
              before: 240,
            },
            children: [
              new TextRun({
                text: companyText,
                bold: true,
                size: 24,
              }),
              new TextRun({
                text: "\t",
              }),
              new TextRun({
                text: dateText,
                size: 22,
              }),
            ],
          })
        );
        
        // Next line may be the job title
        if (i + 1 < sections.experience.length) {
          i++;
          documentElements.push(
            new Paragraph({
              text: sections.experience[i],
              style: "JobTitle",
            })
          );
        }
      } else if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        // This is a bullet point
        documentElements.push(
          new Paragraph({
            text: line,
            style: "BulletPoint",
          })
        );
      } else {
        // Regular text line
        documentElements.push(
          new Paragraph({
            text: line,
          })
        );
      }
      
      i++;
    }
  }
  
  // Education
  if (sections.education && sections.education.length > 0) {
    documentElements.push(
      new Paragraph({
        text: "EDUCATION",
        heading: HeadingLevel.HEADING_2,
        border: {
          bottom: {
            color: "auto",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );
    
    // Add education entries
    sections.education.forEach(entry => {
      documentElements.push(
        new Paragraph({
          text: entry,
          spacing: {
            before: 120,
            after: 120,
          },
        })
      );
    });
  }
  
  // Skills
  if (sections.skills && sections.skills.length > 0) {
    documentElements.push(
      new Paragraph({
        text: "SKILLS",
        heading: HeadingLevel.HEADING_2,
        border: {
          bottom: {
            color: "auto",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );
    
    // Add skills entries
    sections.skills.forEach(skill => {
      if (skill.trim().startsWith('•') || skill.trim().startsWith('-')) {
        documentElements.push(
          new Paragraph({
            text: skill,
            style: "BulletPoint",
          })
        );
      } else {
        documentElements.push(
          new Paragraph({
            text: skill,
          })
        );
      }
    });
  }
  
  // Other sections
  if (sections.other && sections.other.length > 0) {
    documentElements.push(
      new Paragraph({
        text: "ADDITIONAL INFORMATION",
        heading: HeadingLevel.HEADING_2,
        border: {
          bottom: {
            color: "auto",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );
    
    // Add other entries
    sections.other.forEach(entry => {
      documentElements.push(
        new Paragraph({
          text: entry,
        })
      );
    });
  }
  
  return documentElements;
}
