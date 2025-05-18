
import { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle, Table, TableRow, TableCell, WidthType, AlignmentType } from 'docx';
import { ResumeTemplate, ResumeData } from "@/utils/resumeRewriter";

export async function generateFormattedDocx(resumeText: string, template?: ResumeTemplate): Promise<Blob | null> {
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
          properties: {},
          children: createFormattedDocument(sections, template)
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
              font: template?.fontFamily.replace(/[''"]/g, '') || "Calibri",
              size: 22,
              color: "000000",
            },
            paragraph: {
              spacing: {
                line: 276,
                before: 0,
                after: template?.spacing === 'airy' ? 300 : template?.spacing === 'standard' ? 200 : 100,
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
              font: template?.fontFamily.replace(/[''"]/g, '') || "Calibri",
              size: 32,
              bold: true,
              color: template?.primaryColor.replace('#', '') || "000000",
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
              font: template?.fontFamily.replace(/[''"]/g, '') || "Calibri",
              size: 26,
              bold: template?.headerStyle === 'bold' ? true : false,
              color: template?.primaryColor.replace('#', '') || "000000",
              underline: template?.sectionDividers ? {
                type: "single",
                color: template?.primaryColor.replace('#', '') || "000000",
              } : undefined,
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
              font: template?.fontFamily.replace(/[''"]/g, '') || "Calibri",
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
              font: template?.fontFamily.replace(/[''"]/g, '') || "Calibri",
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
              font: template?.fontFamily.replace(/[''"]/g, '') || "Calibri",
              size: 22,
              color: "000000",
            },
            paragraph: {
              spacing: {
                line: 276,
                before: 0,
                after: template?.spacing === 'airy' ? 150 : template?.spacing === 'standard' ? 100 : 50,
              },
              indent: {
                left: 720, // 0.5 inch indent for bullets
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
              font: template?.fontFamily.replace(/[''"]/g, '') || "Calibri",
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

function createFormattedDocument(sections: Record<string, string[]>, template?: ResumeTemplate) {
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
        text: template?.headerStyle === 'uppercase' ? "SUMMARY" : "Summary",
        heading: HeadingLevel.HEADING_2,
        border: template?.sectionDividers ? {
          bottom: {
            color: template?.primaryColor.replace('#', '') || "auto",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        } : undefined,
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
        text: template?.headerStyle === 'uppercase' ? "EXPERIENCE" : "Experience",
        heading: HeadingLevel.HEADING_2,
        border: template?.sectionDividers ? {
          bottom: {
            color: template?.primaryColor.replace('#', '') || "auto",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        } : undefined,
      })
    );
    
    // Parse experience entries
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
        text: template?.headerStyle === 'uppercase' ? "EDUCATION" : "Education",
        heading: HeadingLevel.HEADING_2,
        border: template?.sectionDividers ? {
          bottom: {
            color: template?.primaryColor.replace('#', '') || "auto",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        } : undefined,
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
        text: template?.headerStyle === 'uppercase' ? "SKILLS" : "Skills",
        heading: HeadingLevel.HEADING_2,
        border: template?.sectionDividers ? {
          bottom: {
            color: template?.primaryColor.replace('#', '') || "auto",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        } : undefined,
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
        text: template?.headerStyle === 'uppercase' ? "ADDITIONAL INFORMATION" : "Additional Information",
        heading: HeadingLevel.HEADING_2,
        border: template?.sectionDividers ? {
          bottom: {
            color: template?.primaryColor.replace('#', '') || "auto",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        } : undefined,
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

// Add this new function to generate modern docx format
export async function generateModernDocx(resumeData: any, template: any): Promise<Blob | null> {
  try {
    const document = new Document({
      styles: {
        paragraphStyles: [
          {
            id: 'Normal',
            name: 'Normal',
            basedOn: 'Normal',
            quickFormat: true,
            run: {
              font: 'Open Sans',
              size: 22,
              color: '333333'
            },
          },
          {
            id: 'Heading1',
            name: 'Heading 1',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {
              font: 'Open Sans',
              size: 36,
              bold: true,
              color: 'FFFFFF'
            },
            paragraph: {
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 200,
              },
            },
          },
          {
            id: 'Heading2',
            name: 'Heading 2',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {
              font: 'Open Sans',
              size: 28,
              bold: true,
              color: '2D74FF',
              allCaps: true,
            },
            paragraph: {
              spacing: {
                before: 240,
                after: 120,
              },
              border: {
                bottom: {
                  color: '2D74FF',
                  style: BorderStyle.SINGLE,
                  size: 1,
                },
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
          children: [
            // Header with background color
            new Paragraph({
              text: resumeData.name,
              heading: HeadingLevel.HEADING_1,
              shading: {
                fill: '2D74FF',
              },
            }),
            
            // Contact information
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: `${resumeData.location} • ${resumeData.phone} • ${resumeData.email}`,
                  size: 20,
                  color: '666666',
                }),
              ],
            }),
            
            // Two column layout using tables
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              borders: {
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE },
              },
              rows: [
                new TableRow({
                  children: [
                    // Main column (70%)
                    new TableCell({
                      width: {
                        size: 70,
                        type: WidthType.PERCENTAGE,
                      },
                      margins: {
                        left: 200,
                        right: 200,
                      },
                      children: [
                        // Summary
                        new Paragraph({
                          text: "SUMMARY",
                          heading: HeadingLevel.HEADING_2,
                        }),
                        new Paragraph({
                          text: resumeData.summary,
                        }),
                        
                        // Experience
                        new Paragraph({
                          text: "PROFESSIONAL EXPERIENCE",
                          heading: HeadingLevel.HEADING_2,
                        }),
                        
                        // Generate job entries
                        ...[].concat(...(resumeData.experience || []).map((job: any) => {
                          const paragraphs = [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: job.title || job.position || '',
                                  bold: true,
                                  size: 24,
                                }),
                                new TextRun({
                                  text: ` | ${job.company}`,
                                  italics: true,
                                  size: 24,
                                }),
                              ],
                            }),
                            new Paragraph({
                              text: job.date,
                              alignment: AlignmentType.RIGHT,
                              spacing: {
                                after: 100,
                              },
                            }),
                            
                            // Job bullets
                            ...(job.bullets || []).map((bullet: string) => 
                              new Paragraph({
                                text: bullet,
                                bullet: {
                                  level: 0,
                                },
                                spacing: {
                                  after: 80,
                                },
                              })
                            ),
                            
                            // Spacing after each job
                            new Paragraph({
                              text: "",
                              spacing: {
                                after: 200,
                              },
                            }),
                          ];
                          
                          return paragraphs;
                        })),
                      ],
                    }),
                    
                    // Sidebar column (30%)
                    new TableCell({
                      width: {
                        size: 30,
                        type: WidthType.PERCENTAGE,
                      },
                      shading: {
                        fill: "E6F0FF",
                      },
                      margins: {
                        left: 200,
                        right: 200,
                      },
                      children: [
                        // Skills
                        new Paragraph({
                          text: "SKILLS",
                          heading: HeadingLevel.HEADING_2,
                        }),
                        
                        ...(resumeData.skills || []).map((skill: any) => 
                          new Paragraph({
                            text: typeof skill === 'string' ? skill : (skill.name || ''),
                            spacing: {
                              after: 100,
                            },
                          })
                        ),
                        
                        // Education
                        new Paragraph({
                          text: "EDUCATION",
                          heading: HeadingLevel.HEADING_2,
                        }),
                        
                        ...(resumeData.education || []).map((edu: any) => [
                          new Paragraph({
                            text: edu.degree,
                            bold: true,
                          }),
                          new Paragraph({
                            text: edu.institution,
                          }),
                          new Paragraph({
                            text: edu.date,
                          }),
                          edu.gpa ? new Paragraph({
                            text: `CGPA: ${edu.gpa}`,
                            spacing: {
                              after: 200,
                            },
                          }) : new Paragraph({
                            text: "",
                            spacing: {
                              after: 200,
                            },
                          }),
                        ]).flat(),
                        
                        // Awards
                        resumeData.awards && resumeData.awards.length > 0 ? 
                          new Paragraph({
                            text: "ADDITIONAL INFORMATION",
                            heading: HeadingLevel.HEADING_2,
                          }) : new Paragraph({}),
                        
                        ...(resumeData.awards || []).map((award: string) => 
                          new Paragraph({
                            text: award,
                            spacing: {
                              after: 80,
                            },
                          })
                        ),
                      ].filter(Boolean),
                    }),
                  ],
                }),
              ],
            }),
          ],
        },
      ],
    });
    
    const buffer = await Packer.toBlob(document);
    return buffer;
  } catch (error) {
    console.error("Error generating Modern DOCX:", error);
    return null;
  }
}
