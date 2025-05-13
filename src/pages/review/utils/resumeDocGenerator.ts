
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopPosition, TabStopType, BorderStyle, Table, TableRow, TableCell, WidthType, convertInchesToTwip } from "docx";

export async function generateFormattedDocx(resumeText: string): Promise<Blob | null> {
  try {
    if (!resumeText || typeof resumeText !== 'string') {
      console.error("Invalid resume text provided");
      return null;
    }
    
    // Parse resume text into sections
    const sections = parseResumeIntoSections(resumeText);
    
    // Create document with proper styling
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 720, // 0.5 inch in twip (1/20 point)
                right: 720,
                bottom: 720,
                left: 720
              }
            }
          },
          children: createFormattedDocument(sections)
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
              font: "Calibri",
              size: 22, // 11pt
              color: "000000",
            },
            paragraph: {
              spacing: {
                line: 276, // 1.15 line spacing
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
              font: "Calibri",
              size: 32, // 16pt
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
              font: "Calibri",
              size: 26, // 13pt
              bold: true,
              color: "000000",
              allCaps: true,
            },
            paragraph: {
              spacing: {
                before: 240,
                after: 120,
              },
              border: {
                bottom: {
                  style: BorderStyle.SINGLE,
                  size: 10,
                  color: "CCCCCC",
                  space: 1,
                }
              }
            },
          },
          {
            id: "JobTitle",
            name: "Job Title",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              font: "Calibri",
              size: 24, // 12pt
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
              font: "Calibri",
              size: 24, // 12pt
              bold: true,
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
              font: "Calibri",
              size: 22, // 11pt
              color: "000000",
            },
            paragraph: {
              spacing: {
                line: 276,
                before: 60,
                after: 60,
              },
              indent: {
                left: 540, // 0.375 inch indent for bullets
                hanging: 360, // hanging indent for bullet character
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
              font: "Calibri",
              size: 22, // 11pt
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

function parseResumeIntoSections(resumeText: string): any {
  // Split the text by lines
  const lines = resumeText.split(/\n/).filter(line => line.trim().length > 0);
  
  // First line is usually the name
  const name = lines[0]?.trim() || "Resume";
  
  // Look for contact information in the first few lines
  const contactInfo = lines.slice(1, 4).join(" • ");
  
  // Initialize sections
  const sections: Record<string, string[]> = {
    name: [name],
    contactInfo: [contactInfo],
    summary: [],
    experience: [],
    education: [],
    skills: [],
    other: []
  };
  
  // Regular expressions to identify section headers
  const sectionHeaderPatterns = {
    summary: /^(SUMMARY|PROFILE|PROFESSIONAL SUMMARY|OBJECTIVE|ABOUT)$/i,
    experience: /^(EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT|WORK HISTORY|PROFESSIONAL EXPERIENCE)$/i,
    education: /^(EDUCATION|ACADEMIC|QUALIFICATIONS|EDUCATIONAL BACKGROUND)$/i,
    skills: /^(SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES|TECHNOLOGIES|KEY SKILLS)$/i,
  };
  
  // Current section we're parsing
  let currentSection = "summary";
  
  // Parse the resume by identifying sections and their content
  for (let i = 4; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Check if this line is a section header (all caps or with heading markers)
    const isHeader = /^(#+\s*)?[A-Z\s]{5,}$/.test(line);
    if (isHeader) {
      // Clean the header text by removing markdown syntax and trimming
      const cleanHeader = line.replace(/^#+\s*/, '').trim();
      
      // Determine which section this header represents
      if (sectionHeaderPatterns.summary.test(cleanHeader)) {
        currentSection = "summary";
        continue;
      } else if (sectionHeaderPatterns.experience.test(cleanHeader)) {
        currentSection = "experience";
        continue;
      } else if (sectionHeaderPatterns.education.test(cleanHeader)) {
        currentSection = "education";
        continue;
      } else if (sectionHeaderPatterns.skills.test(cleanHeader)) {
        currentSection = "skills";
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

function createFormattedDocument(sections: Record<string, string[]>) {
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
      })
    );
    
    // Parse experience entries and organize them
    let currentCompany = "";
    let currentTitle = "";
    let currentDates = "";
    let bulletPoints: string[] = [];
    
    for (let i = 0; i < sections.experience.length; i++) {
      const line = sections.experience[i].trim();
      
      // Check if line is empty
      if (!line) continue;
      
      // Check if this line is a bullet point
      if (line.startsWith('•') || line.startsWith('-')) {
        bulletPoints.push(line.replace(/^[•-]\s*/, ''));
        continue;
      }
      
      // Check if this might be a company name (typically followed by location/dates)
      // Companies often have name + location, with dates at the end or on next line
      if ((!currentCompany || bulletPoints.length > 0) && 
          (/^[A-Z]/.test(line) || line.includes('|')) && 
          !line.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}/i)) {
        
        // If we have accumulated data for a previous position, add it to the document first
        if (currentCompany && (currentTitle || bulletPoints.length > 0)) {
          addExperienceEntry(documentElements, currentCompany, currentTitle, currentDates, bulletPoints);
          bulletPoints = [];
        }
        
        // Try to parse company and date
        // FIX: Adding the missing closing parenthesis in the regular expression
        const dateMatch = line.match(/.*\s+((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\s*-\s*(?:Present|Current|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}))/i);
        
        if (dateMatch) {
          // Line contains both company and date
          currentCompany = line.substring(0, dateMatch.index).trim();
          currentDates = dateMatch[1].trim();
        } else if (line.includes('|')) {
          // Line may contain company and location separated by pipe
          const parts = line.split('|').map(p => p.trim());
          currentCompany = parts[0];
          // Leave dates empty for now
          currentDates = "";
        } else {
          // Assume it's just company name
          currentCompany = line;
          currentDates = "";
        }
        
        currentTitle = "";
        continue;
      }
      
      // Check if this might be a date range (if not already captured)
      // FIX: Using the corrected regular expression here as well
      if (!currentDates && line.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\s*-\s*(?:Present|Current|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/i)) {
        currentDates = line.trim();
        continue;
      }
      
      // If we have a company but no title yet, this might be the job title
      if (currentCompany && !currentTitle && !/^\d{1,2}\/\d{4}/.test(line)) {
        currentTitle = line;
        continue;
      }
    }
    
    // Add the last experience entry if there's any remaining data
    if (currentCompany && (currentTitle || bulletPoints.length > 0)) {
      addExperienceEntry(documentElements, currentCompany, currentTitle, currentDates, bulletPoints);
    }
  }
  
  // Education
  if (sections.education && sections.education.length > 0) {
    documentElements.push(
      new Paragraph({
        text: "EDUCATION",
        heading: HeadingLevel.HEADING_2,
      })
    );
    
    // Organize education entries
    let currentDegree = "";
    let currentSchool = "";
    let currentDate = "";
    const educationEntries = [];
    
    for (let i = 0; i < sections.education.length; i++) {
      const line = sections.education[i].trim();
      
      // Skip empty lines
      if (!line) continue;
      
      // Check if this might be a degree (typically starts with Bachelor, Master, etc.)
      if (line.match(/^(Bachelor|Master|Doctor|PhD|BSc|BA|MS|MA|MBA|PhD|Associate|Diploma|Certificate)/i)) {
        
        // If we have data for a previous degree, add it first
        if (currentDegree || currentSchool) {
          educationEntries.push({
            degree: currentDegree,
            school: currentSchool,
            date: currentDate
          });
        }
        
        currentDegree = line;
        currentSchool = "";
        currentDate = "";
        continue;
      }
      
      // Check if this is a date
      if (line.match(/\d{4}/)) {
        currentDate = line;
        continue;
      }
      
      // Otherwise assume it's the school name
      if (!currentSchool) {
        currentSchool = line;
        continue;
      }
    }
    
    // Add the last education entry
    if (currentDegree || currentSchool) {
      educationEntries.push({
        degree: currentDegree,
        school: currentSchool,
        date: currentDate
      });
    }
    
    // Format and add education entries to document
    educationEntries.forEach(entry => {
      // Degree with right-aligned date
      if (entry.degree) {
        documentElements.push(
          new Paragraph({
            tabStops: [
              {
                type: TabStopType.RIGHT,
                position: TabStopPosition.MAX,
              },
            ],
            spacing: {
              before: 180,
            },
            children: [
              new TextRun({
                text: entry.degree,
                bold: true,
                size: 24,
              }),
              new TextRun({
                text: "\t",
              }),
              new TextRun({
                text: entry.date,
                size: 22,
              }),
            ],
          })
        );
      }
      
      // School
      if (entry.school) {
        documentElements.push(
          new Paragraph({
            text: entry.school,
            spacing: {
              before: 60,
              after: 60,
            },
          })
        );
      }
    });
  }
  
  // Skills
  if (sections.skills && sections.skills.length > 0) {
    documentElements.push(
      new Paragraph({
        text: "SKILLS",
        heading: HeadingLevel.HEADING_2,
      })
    );
    
    // Process skills - either as bullet points or comma-separated lists
    const skillLines = sections.skills.join('\n');
    
    // Check if skills are in bullet format
    if (skillLines.includes('•') || skillLines.includes('-')) {
      sections.skills.forEach(skill => {
        if (skill.trim().startsWith('•') || skill.trim().startsWith('-')) {
          documentElements.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "•  ",
                  bold: true,
                }),
                new TextRun({
                  text: skill.replace(/^[•-]\s*/, ''),
                }),
              ],
              style: "BulletPoint",
            })
          );
        } else {
          documentElements.push(
            new Paragraph({
              text: skill,
              spacing: {
                before: 60,
                after: 60,
              },
            })
          );
        }
      });
    } else {
      // Handle skills as regular text (possibly comma-separated)
      documentElements.push(
        new Paragraph({
          text: skillLines,
          spacing: {
            before: 120,
            after: 120,
          },
        })
      );
    }
  }
  
  // Other sections
  if (sections.other && sections.other.length > 0) {
    documentElements.push(
      new Paragraph({
        text: "ADDITIONAL INFORMATION",
        heading: HeadingLevel.HEADING_2,
      })
    );
    
    // Add other entries
    sections.other.forEach(entry => {
      if (entry.trim().startsWith('•') || entry.trim().startsWith('-')) {
        documentElements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "•  ",
                bold: true,
              }),
              new TextRun({
                text: entry.replace(/^[•-]\s*/, ''),
              }),
            ],
            style: "BulletPoint",
          })
        );
      } else {
        documentElements.push(
          new Paragraph({
            text: entry,
            spacing: {
              before: 60,
              after: 60,
            },
          })
        );
      }
    });
  }
  
  return documentElements;
}

// Helper function to add a formatted experience entry to the document
function addExperienceEntry(
  documentElements: any[],
  company: string,
  title: string,
  dates: string,
  bulletPoints: string[]
) {
  // Company and dates (right-aligned)
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
          text: company,
          bold: true,
          size: 24,
        }),
        new TextRun({
          text: "\t",
        }),
        new TextRun({
          text: dates,
          size: 22,
        }),
      ],
    })
  );
  
  // Job title
  if (title) {
    documentElements.push(
      new Paragraph({
        text: title,
        style: "JobTitle",
        spacing: {
          before: 60,
          after: 120,
        },
      })
    );
  }
  
  // Bullet points
  bulletPoints.forEach(bullet => {
    documentElements.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "•  ",
            bold: true,
          }),
          new TextRun({
            text: bullet,
          }),
        ],
        style: "BulletPoint",
      })
    );
  });
}
