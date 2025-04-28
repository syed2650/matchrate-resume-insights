
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Packer,
  AlignmentType,
  LevelFormat,
  convertInchesToTwip,
  BorderStyle,
  WidthType,
  PageNumber,
  Footer,
  Header,
  Table,
  TableRow,
  TableCell,
  VerticalAlign
} from "docx";

interface Section {
  [key: string]: string[];
}

const RESUME_STYLES = {
  fonts: {
    main: "Calibri",
    heading: "Calibri",
  },
  fontSize: {
    heading: 16,
    subheading: 13,
    normal: 11,
    small: 9
  },
  spacing: {
    afterSection: 400,
    afterParagraph: 200,
    afterHeading: 240
  },
  colors: {
    dark: "222222",
    accent: "2563eb",
    light: "666666"
  }
};

function safeText(text: any): string {
  if (text === undefined || text === null) {
    return "";
  }
  return typeof text === 'string' ? text : String(text);
}

export const parseResumeContent = (content: string) => {
  // Check for empty content
  if (!content || typeof content !== 'string') {
    console.error("Invalid resume content provided to parser:", content);
    return { header: ["Resume content is missing or invalid"] }; 
  }

  const sections: Section = {};
  let currentSection = "header";
  sections[currentSection] = [];
  
  const lines = content.split('\n');
  
  // First pass: identify sections using headings or ALL CAPS
  lines.forEach(line => {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) return;
    
    // Check if this is a section header (markdown h1, h2, h3 or ALL CAPS)
    if (trimmedLine.match(/^#{1,3}\s+/) || 
        (trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 4)) {
      
      // Extract section name without the markdown symbols
      currentSection = trimmedLine.replace(/^#{1,3}\s+/, '').trim();
      
      // Initialize section array if it doesn't exist
      if (!sections[currentSection]) {
        sections[currentSection] = [];
      }
    } else {
      // Add content to current section
      sections[currentSection].push(trimmedLine);
    }
  });
  
  // Handle potential empty sections
  Object.keys(sections).forEach(key => {
    if (sections[key].length === 0) {
      sections[key] = ["No content provided"];
    }
  });
  
  return sections;
};

export const generateDocument = async (
  currentResume: string,
  roleSummary: string,
  currentAtsScore: number,
  generatedTimestamp: string,
  activeVersion: string,
  hasMultipleVersions: boolean
) => {
  try {
    // Validate input
    if (!currentResume || typeof currentResume !== 'string') {
      throw new Error("Invalid or empty resume content");
    }

    // Parse resume into sections
    const sections = parseResumeContent(currentResume);
    const paragraphs = [];
    
    // Add name with larger font and bold
    const nameMatch = currentResume.match(/^(?:#{1,2}\s+)?([A-Za-z\s.]+)/);
    const name = nameMatch && nameMatch[1].trim() ? nameMatch[1].trim() : "Resume";
    
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: name,
            bold: true,
            size: 32,
            font: RESUME_STYLES.fonts.main
          })
        ],
        spacing: { after: RESUME_STYLES.spacing.afterHeading },
        alignment: AlignmentType.CENTER
      })
    );
    
    // Add contact info if available
    if (sections.header && sections.header.length > 0) {
      const contactLines = sections.header
        .filter(line => 
          line.includes('@') || 
          line.includes('linkedin.com') || 
          line.includes('phone') ||
          line.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/) ||
          line.includes('github.com')
        );
      
      if (contactLines.length > 0) {
        const contactInfo = contactLines.join(' | ');
        
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: contactInfo,
                size: RESUME_STYLES.fontSize.normal * 2,
                font: RESUME_STYLES.fonts.main
              })
            ],
            spacing: { after: RESUME_STYLES.spacing.afterParagraph },
            alignment: AlignmentType.CENTER
          })
        );
      }
    }
    
    // Add role summary if available
    if (roleSummary) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${roleSummary}`,
              italics: true,
              size: RESUME_STYLES.fontSize.subheading * 2,
              color: RESUME_STYLES.colors.accent,
              font: RESUME_STYLES.fonts.main
            })
          ],
          spacing: { after: RESUME_STYLES.spacing.afterSection },
          alignment: AlignmentType.CENTER
        })
      );
    }

    // Process Professional Summary first if it exists
    const summaryKey = Object.keys(sections).find(key => 
      key.toLowerCase().includes('summary') || key.toLowerCase().includes('profile')
    );
    
    if (summaryKey) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "PROFESSIONAL SUMMARY",
              bold: true,
              size: RESUME_STYLES.fontSize.heading * 2,
              font: RESUME_STYLES.fonts.heading,
              color: RESUME_STYLES.colors.dark
            })
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { after: RESUME_STYLES.spacing.afterHeading },
          border: { 
            bottom: { 
              color: "auto", 
              size: 6, 
              space: 1,
              style: BorderStyle.SINGLE
            } 
          }
        })
      );
      
      if (sections[summaryKey] && sections[summaryKey].length > 0) {
        sections[summaryKey].forEach(line => {
          if (line && line.trim()) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    size: RESUME_STYLES.fontSize.normal * 2,
                    font: RESUME_STYLES.fonts.main
                  })
                ],
                spacing: { after: RESUME_STYLES.spacing.afterParagraph }
              })
            );
          }
        });
      } else {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "No summary provided",
                size: RESUME_STYLES.fontSize.normal * 2,
                font: RESUME_STYLES.fonts.main
              })
            ],
            spacing: { after: RESUME_STYLES.spacing.afterParagraph }
          })
        );
      }
      
      paragraphs.push(
        new Paragraph({
          spacing: { after: RESUME_STYLES.spacing.afterSection }
        })
      );
      
      delete sections[summaryKey];
    }

    // Process Skills section next if it exists
    const skillsKey = Object.keys(sections).find(key => 
      key.toLowerCase().includes('skill') || key.toLowerCase().includes('competenc')
    );
    
    if (skillsKey) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "KEY SKILLS",
              bold: true,
              size: RESUME_STYLES.fontSize.heading * 2,
              font: RESUME_STYLES.fonts.heading,
              color: RESUME_STYLES.colors.dark
            })
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { after: RESUME_STYLES.spacing.afterHeading },
          border: { 
            bottom: { 
              color: "auto", 
              size: 6, 
              space: 1,
              style: BorderStyle.SINGLE
            } 
          }
        })
      );
      
      if (sections[skillsKey] && sections[skillsKey].length > 0) {
        const skillsText = sections[skillsKey].join(' ');
        
        if (skillsText.includes(',')) {
          // Skills are comma-separated, so make a nice column layout
          const skills = skillsText
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0);
          
          if (skills.length > 0) {
            const rows = Math.ceil(skills.length / 2);
            for (let i = 0; i < rows; i++) {
              const row = [];
              
              if (i * 2 < skills.length) {
                row.push(
                  new TextRun({
                    text: `• ${skills[i * 2]}`,
                    size: RESUME_STYLES.fontSize.normal * 2,
                    font: RESUME_STYLES.fonts.main
                  })
                );
              }
              
              if (i * 2 + 1 < skills.length) {
                row.push(
                  new TextRun({
                    text: `• ${skills[i * 2 + 1]}`,
                    size: RESUME_STYLES.fontSize.normal * 2,
                    font: RESUME_STYLES.fonts.main
                  })
                );
              }
              
              paragraphs.push(
                new Paragraph({
                  children: row,
                  spacing: { after: RESUME_STYLES.spacing.afterParagraph }
                })
              );
            }
          } else {
            // Fallback if no skills found after parsing
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: "No specific skills listed",
                    size: RESUME_STYLES.fontSize.normal * 2,
                    font: RESUME_STYLES.fonts.main
                  })
                ],
                spacing: { after: RESUME_STYLES.spacing.afterParagraph }
              })
            );
          }
        } else {
          // Skills are formatted as bullet points or text blocks
          sections[skillsKey].forEach(line => {
            if (!line || !line.trim()) return;
            
            if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
              const skillText = line.replace(/^[•\-*]\s?/, '');
              paragraphs.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `• ${skillText}`,
                      size: RESUME_STYLES.fontSize.normal * 2,
                      font: RESUME_STYLES.fonts.main
                    })
                  ],
                  spacing: { after: RESUME_STYLES.spacing.afterParagraph }
                })
              );
            } else {
              paragraphs.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line,
                      size: RESUME_STYLES.fontSize.normal * 2,
                      font: RESUME_STYLES.fonts.main
                    })
                  ],
                  spacing: { after: RESUME_STYLES.spacing.afterParagraph }
                })
              );
            }
          });
        }
      } else {
        // No skills content
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "No skills listed",
                size: RESUME_STYLES.fontSize.normal * 2,
                font: RESUME_STYLES.fonts.main
              })
            ],
            spacing: { after: RESUME_STYLES.spacing.afterParagraph }
          })
        );
      }
      
      paragraphs.push(
        new Paragraph({
          spacing: { after: RESUME_STYLES.spacing.afterSection }
        })
      );
      
      delete sections[skillsKey];
    }
    
    // Process Experience section next
    const experienceKey = Object.keys(sections).find(key => 
      key.toLowerCase().includes('experience') || 
      key.toLowerCase().includes('employment') || 
      key.toLowerCase().includes('work')
    );
    
    if (experienceKey) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "PROFESSIONAL EXPERIENCE",
              bold: true,
              size: RESUME_STYLES.fontSize.heading * 2,
              font: RESUME_STYLES.fonts.heading,
              color: RESUME_STYLES.colors.dark
            })
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { after: RESUME_STYLES.spacing.afterHeading },
          border: { 
            bottom: { 
              color: "auto", 
              size: 6, 
              space: 1,
              style: BorderStyle.SINGLE
            } 
          }
        })
      );
      
      let inJobEntry = false;
      
      if (sections[experienceKey] && sections[experienceKey].length > 0) {
        sections[experienceKey].forEach(line => {
          if (!line || !line.trim()) return;
          
          if (line.match(/^[A-Za-z ]+\s+\|\s+/) || 
              (line.match(/^[A-Za-z ]+$/) && 
               !line.startsWith('•') && 
               !line.startsWith('-'))) {
            
            inJobEntry = true;
            
            let title = line;
            let company = '';
            
            if (line.includes(' | ')) {
              [title, company] = line.split(' | ');
            }
            
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: title,
                    bold: true,
                    size: RESUME_STYLES.fontSize.normal * 2,
                    font: RESUME_STYLES.fonts.main
                  }),
                  ...(company ? [
                    new TextRun({
                      text: ` | ${company}`,
                      size: RESUME_STYLES.fontSize.normal * 2,
                      font: RESUME_STYLES.fonts.main
                    })
                  ] : [])
                ],
                spacing: { after: RESUME_STYLES.spacing.afterParagraph }
              })
            );
          } else if (line.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\s+(-|–|to)\s+/i)) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    italics: true,
                    size: RESUME_STYLES.fontSize.normal * 2,
                    font: RESUME_STYLES.fonts.main,
                    color: RESUME_STYLES.colors.light
                  })
                ],
                spacing: { after: RESUME_STYLES.spacing.afterParagraph }
              })
            );
          } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
            const bulletText = line.replace(/^[•\-*]\s?/, '');
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: bulletText,
                    size: RESUME_STYLES.fontSize.normal * 2,
                    font: RESUME_STYLES.fonts.main
                  })
                ],
                bullet: {
                  level: 0
                },
                spacing: { after: RESUME_STYLES.spacing.afterParagraph }
              })
            );
          } else if (inJobEntry && line.trim()) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    size: RESUME_STYLES.fontSize.normal * 2,
                    font: RESUME_STYLES.fonts.main
                  })
                ],
                spacing: { after: RESUME_STYLES.spacing.afterParagraph }
              })
            );
          }
        });
      } else {
        // No experience content
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "No experience details provided",
                size: RESUME_STYLES.fontSize.normal * 2,
                font: RESUME_STYLES.fonts.main
              })
            ],
            spacing: { after: RESUME_STYLES.spacing.afterParagraph }
          })
        );
      }
      
      paragraphs.push(
        new Paragraph({
          spacing: { after: RESUME_STYLES.spacing.afterSection }
        })
      );
      
      delete sections[experienceKey];
    }

    // Process remaining sections
    Object.entries(sections).forEach(([sectionName, lines]) => {
      if (sectionName === 'header') return;
      
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: sectionName.toUpperCase(),
              bold: true,
              size: RESUME_STYLES.fontSize.heading * 2,
              font: RESUME_STYLES.fonts.heading,
              color: RESUME_STYLES.colors.dark
            })
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { after: RESUME_STYLES.spacing.afterHeading },
          border: { 
            bottom: { 
              color: "auto", 
              size: 6, 
              space: 1,
              style: BorderStyle.SINGLE
            } 
          }
        })
      );
      
      if (lines && lines.length > 0) {
        lines.forEach(line => {
          if (!line || !line.trim()) return;
          
          if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
            const bulletText = line.replace(/^[•\-*]\s?/, '');
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: bulletText,
                    size: RESUME_STYLES.fontSize.normal * 2,
                    font: RESUME_STYLES.fonts.main
                  })
                ],
                bullet: {
                  level: 0
                },
                spacing: { after: RESUME_STYLES.spacing.afterParagraph }
              })
            );
          } else if (line.match(/^[A-Za-z ]+\s+\|\s+/)) {
            const [title, rest] = line.split(' | ');
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: title,
                    bold: true,
                    size: RESUME_STYLES.fontSize.normal * 2,
                    font: RESUME_STYLES.fonts.main
                  }),
                  new TextRun({
                    text: ` | ${rest}`,
                    size: RESUME_STYLES.fontSize.normal * 2,
                    font: RESUME_STYLES.fonts.main
                  })
                ],
                spacing: { after: RESUME_STYLES.spacing.afterParagraph }
              })
            );
          } else {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    size: RESUME_STYLES.fontSize.normal * 2,
                    font: RESUME_STYLES.fonts.main
                  })
                ],
                spacing: { after: RESUME_STYLES.spacing.afterParagraph }
              })
            );
          }
        });
      } else {
        // No content for this section
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `No content provided for ${sectionName}`,
                size: RESUME_STYLES.fontSize.normal * 2,
                font: RESUME_STYLES.fonts.main
              })
            ],
            spacing: { after: RESUME_STYLES.spacing.afterParagraph }
          })
        );
      }
      
      paragraphs.push(
        new Paragraph({
          spacing: { after: RESUME_STYLES.spacing.afterSection }
        })
      );
    });
    
    // Ensure we have at least some content
    if (paragraphs.length === 0) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "No resume content was available to generate the document.",
              size: RESUME_STYLES.fontSize.normal * 2,
              font: RESUME_STYLES.fonts.main
            })
          ],
          spacing: { after: RESUME_STYLES.spacing.afterParagraph }
        })
      );
    }

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(0.7),
                right: convertInchesToTwip(0.7),
                bottom: convertInchesToTwip(0.7),
                left: convertInchesToTwip(0.7)
              }
            }
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `ATS Score: ${currentAtsScore}/100 | Generated on ${generatedTimestamp}`,
                      size: RESUME_STYLES.fontSize.small * 2,
                      color: RESUME_STYLES.colors.light,
                      font: RESUME_STYLES.fonts.main
                    }),
                    new TextRun({
                      text: "                                                       ",
                      size: RESUME_STYLES.fontSize.small * 2
                    }),
                    new TextRun({
                      children: [PageNumber.CURRENT],
                      size: RESUME_STYLES.fontSize.small * 2,
                      color: RESUME_STYLES.colors.light,
                      font: RESUME_STYLES.fonts.main
                    }),
                    new TextRun({
                      text: " of ",
                      size: RESUME_STYLES.fontSize.small * 2,
                      color: RESUME_STYLES.colors.light,
                      font: RESUME_STYLES.fonts.main
                    }),
                    new TextRun({
                      children: [PageNumber.TOTAL_PAGES],
                      size: RESUME_STYLES.fontSize.small * 2,
                      color: RESUME_STYLES.colors.light,
                      font: RESUME_STYLES.fonts.main
                    }),
                  ],
                  alignment: AlignmentType.JUSTIFIED,
                  border: {
                    top: {
                      color: RESUME_STYLES.colors.light,
                      space: 1,
                      style: BorderStyle.SINGLE,
                      size: 1,
                    },
                  },
                }),
              ],
            }),
          },
          children: paragraphs
        }
      ]
    });

    return Packer.toBlob(doc);
  } catch (error) {
    console.error("Error generating document:", error);
    
    // Create a simple error document
    const errorDoc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Error Generating Resume Document",
                bold: true,
                size: 32,
                color: "FF0000",
              })
            ],
            spacing: { after: 400 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "There was an error processing your resume. Please try again or contact support.",
                size: 24
              })
            ],
            spacing: { after: 300 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Error details: " + ((error as Error).message || "Unknown error"),
                size: 20,
                italics: true
              })
            ],
            spacing: { after: 300 }
          })
        ]
      }]
    });
    
    return Packer.toBlob(errorDoc);
  }
};
