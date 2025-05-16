import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopPosition, TabStopType, BorderStyle, Table, TableRow, TableCell, WidthType, VerticalAlign } from "docx";
import { ResumeTemplate } from "@/utils/resumeRewriter";

export async function generateFormattedDocx(resumeText: string, template?: ResumeTemplate): Promise<Blob | null> {
  try {
    if (!resumeText || typeof resumeText !== 'string') {
      console.error("Invalid resume text provided");
      return null;
    }
    
    // Parse resume text into sections
    const sections = parseResumeIntoSections(resumeText);
    
    // Create document with proper styling based on template
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: createFormattedDocument(sections, template)
        }
      ],
      styles: createDocumentStyles(template),
    });
    
    // Convert to blob
    const buffer = await Packer.toBlob(doc);
    return buffer;
  } catch (error) {
    console.error("Error generating DOCX:", error);
    return null;
  }
}

// Create document styles based on the selected template
function createDocumentStyles(template?: ResumeTemplate) {
  // Default to modern if no template provided
  const t = template || {
    id: "modern",
    name: "Modern",
    fontFamily: "Open Sans",
    primaryColor: "#2D74FF",
    secondaryColor: "#E6F0FF",
    headerStyle: "bold" as const,
    sectionDividers: true,
    spacing: "compact" as const,
    layout: "two-column" as const,
  };

  // Clean font name - remove quotes
  const fontFamily = t.fontFamily.replace(/[''"]/g, '');
  const primaryColor = t.primaryColor.replace('#', '');
  
  // Spacing settings based on template spacing preference
  const paragraphSpacing = {
    compact: { before: 80, after: 80, line: 240 },
    standard: { before: 120, after: 120, line: 276 },
    airy: { before: 160, after: 160, line: 320 },
  }[t.spacing];

  return {
    paragraphStyles: [
      {
        id: "Normal",
        name: "Normal",
        run: {
          font: fontFamily,
          size: 22, // ~11pt
          color: "000000",
        },
        paragraph: {
          spacing: {
            line: paragraphSpacing.line,
            before: 0,
            after: paragraphSpacing.after,
          },
        },
      },
      {
        id: "Name",
        name: "Name",
        basedOn: "Normal",
        next: "Normal",
        run: {
          font: fontFamily,
          size: 36, // ~18pt
          bold: true,
          color: t.id === "modern" ? primaryColor : "000000",
        },
        paragraph: {
          alignment: AlignmentType.CENTER,
          spacing: {
            before: 0,
            after: 80,
          },
        },
      },
      {
        id: "ContactInfo",
        name: "Contact Info",
        basedOn: "Normal",
        next: "Normal",
        run: {
          font: fontFamily,
          size: 20, // ~10pt
          color: "333333",
        },
        paragraph: {
          alignment: AlignmentType.CENTER,
          spacing: {
            before: 0,
            after: 160,
          },
        },
      },
      {
        id: "SectionHeading",
        name: "Section Heading",
        basedOn: "Normal",
        next: "Normal",
        run: {
          font: fontFamily,
          size: 26, // ~13pt
          bold: true,
          color: primaryColor,
          allCaps: t.headerStyle === "uppercase",
        },
        paragraph: {
          spacing: {
            before: 160,
            after: 80,
          },
          border: t.sectionDividers ? {
            bottom: {
              color: primaryColor,
              space: 4,
              style: BorderStyle.SINGLE,
              size: 8, // 0.5pt
            },
          } : undefined,
        },
      },
      {
        id: "JobTitle",
        name: "Job Title",
        basedOn: "Normal",
        next: "Normal",
        run: {
          font: fontFamily,
          size: 24, // ~12pt
          bold: true,
        },
        paragraph: {
          spacing: {
            before: paragraphSpacing.before,
            after: 40,
          },
        },
      },
      {
        id: "Company",
        name: "Company",
        basedOn: "Normal",
        next: "Normal",
        run: {
          font: fontFamily,
          size: 22, // ~11pt
          bold: false,
        },
      },
      {
        id: "BulletPoint",
        name: "Bullet Point",
        basedOn: "Normal",
        next: "Normal",
        run: {
          font: fontFamily,
          size: 22, // ~11pt
        },
        paragraph: {
          spacing: {
            line: paragraphSpacing.line,
            before: 40,
            after: 40,
          },
          indent: {
            left: 360, // 0.25 inch indent for bullets
          },
        },
      },
    ]
  };
}

function parseResumeIntoSections(resumeText: string): any {
  // Split the text by lines
  const lines = resumeText.split(/\n/).filter(line => line.trim().length > 0);
  
  // First line is usually the name
  const name = lines[0]?.trim() || "Resume";
  
  // Look for contact information in the first few lines
  const contactInfo = lines.slice(1, 4).filter(line => 
    line.includes('@') || line.includes('|') || line.includes('+') || 
    line.includes('linkedin') || /\d{3}[-\.\s]??\d{3}[-\.\s]??\d{4}/.test(line)
  ).join(" • ");
  
  // Initialize sections
  const sections: Record<string, any> = {
    name,
    contactInfo,
    summary: { title: "Summary", content: [] },
    experience: { title: "Experience", jobs: [] },
    education: { title: "Education", items: [] },
    skills: { title: "Skills", items: [] },
    additional: []
  };
  
  // Simple heuristic to identify sections
  let currentSection = "summary";
  let currentJob: any = null;
  let currentEducation: any = null;
  
  for (let i = 4; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Check if this is a section header
    if (line.toUpperCase() === line && line.length < 30 || line.startsWith('# ')) {
      // This is likely a section header - determine which section
      const headerText = line.replace(/^#\s+/, '').trim();
      
      if (/EXPERIENCE|EMPLOYMENT|WORK|CAREER|PROFESSIONAL/i.test(headerText)) {
        currentSection = "experience";
        sections.experience.title = headerText;
        currentJob = null;
        continue;
      } else if (/EDUCATION|ACADEMIC|DEGREE|UNIVERSITY|COLLEGE/i.test(headerText)) {
        currentSection = "education";
        sections.education.title = headerText;
        currentEducation = null;
        continue;
      } else if (/SKILLS|TECHNOLOGIES|COMPETENCIES|PROFICIENCIES/i.test(headerText)) {
        currentSection = "skills";
        sections.skills.title = headerText;
        continue;
      } else if (/SUMMARY|PROFILE|OBJECTIVE|ABOUT/i.test(headerText)) {
        currentSection = "summary";
        sections.summary.title = headerText;
        continue;
      } else {
        // Other section
        currentSection = "additional";
        sections.additional.push({
          title: headerText,
          content: []
        });
        continue;
      }
    }
    
    // Process content based on current section
    if (currentSection === "summary") {
      sections.summary.content.push(line);
    } 
    else if (currentSection === "experience") {
      // Check if this is a new job entry
      if (
        // Detect job entries by patterns
        /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/i.test(line) ||
        /\d{4}\s*(-|–|to)\s*(\d{4}|Present|Current)/i.test(line) ||
        /^[A-Z][a-zA-Z\s,]+$/.test(line) && !line.startsWith('•') && !line.startsWith('-')
      ) {
        // Create a new job entry
        if (
          !currentJob || 
          (currentJob && currentJob.title && currentJob.company)
        ) {
          currentJob = {
            company: "",
            title: "",
            date: "",
            location: "",
            bullets: []
          };
          sections.experience.jobs.push(currentJob);
        }
        
        // Try to determine if this is company, title, or date
        if (/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/i.test(line) ||
            /\d{4}\s*(-|–|to)\s*(\d{4}|Present|Current)/i.test(line)) {
          currentJob.date = line;
        } else {
          // Likely company name or job title
          if (line.includes(',') || line.includes('|')) {
            // Might be "Company, Location" or "Company | Location" format
            const parts = line.split(/[,|]/);
            currentJob.company = parts[0].trim();
            if (parts.length > 1) {
              currentJob.location = parts[1].trim();
            }
          } else if (!currentJob.company) {
            currentJob.company = line;
          } else if (!currentJob.title) {
            currentJob.title = line;
          }
        }
      } 
      else if (line.startsWith('•') || line.startsWith('-')) {
        // This is a bullet point
        if (currentJob) {
          currentJob.bullets.push(line.replace(/^[•-]\s*/, ''));
        }
      } 
      else if (currentJob) {
        // This could be a job title or continuation of a bullet
        if (!currentJob.title) {
          currentJob.title = line;
        } else if (currentJob.bullets.length > 0) {
          // Add to the last bullet as it might be a continuation
          currentJob.bullets[currentJob.bullets.length - 1] += ' ' + line;
        } else {
          // Create a new bullet
          currentJob.bullets.push(line);
        }
      }
    } 
    else if (currentSection === "education") {
      // Check for a new education entry
      if (/^[A-Z]/.test(line) && !line.startsWith('•') && !line.startsWith('-')) {
        // New education entry
        currentEducation = {
          degree: "",
          institution: "",
          date: "",
          location: "",
          details: []
        };
        sections.education.items.push(currentEducation);
        
        if (!currentEducation.degree) {
          currentEducation.degree = line;
        }
      } 
      else if (currentEducation) {
        // Fill in education details
        if (!currentEducation.institution) {
          currentEducation.institution = line;
        } 
        else if (/\d{4}/.test(line) && !currentEducation.date) {
          currentEducation.date = line;
        } 
        else if (!currentEducation.location) {
          currentEducation.location = line;
        } 
        else {
          currentEducation.details.push(line);
        }
      }
    } 
    else if (currentSection === "skills") {
      sections.skills.items.push(line);
    } 
    else if (currentSection === "additional" && sections.additional.length > 0) {
      sections.additional[sections.additional.length - 1].content.push(line);
    }
  }
  
  return sections;
}

function createFormattedDocument(sections: Record<string, any>, template?: ResumeTemplate) {
  const documentElements = [];
  const layout = template?.layout || "single-column";
  
  // Name (centered, large)
  documentElements.push(
    new Paragraph({
      text: sections.name,
      style: "Name",
    })
  );
  
  // Contact Info (centered)
  if (sections.contactInfo) {
    documentElements.push(
      new Paragraph({
        text: sections.contactInfo,
        style: "ContactInfo",
      })
    );
  }

  // If using two-column layout, create a table for the layout
  if (layout === "two-column") {
    const table = createTwoColumnLayout(sections, template);
    documentElements.push(table);
  } else {
    // Single column layout - add sections sequentially
    // Summary
    if (sections.summary && sections.summary.content.length > 0) {
      documentElements.push(
        new Paragraph({
          text: sections.summary.title,
          style: "SectionHeading",
        })
      );
      
      // Add each summary paragraph
      sections.summary.content.forEach((paragraph: string) => {
        documentElements.push(
          new Paragraph({
            text: paragraph,
            style: "Normal",
          })
        );
      });
    }
    
    // Experience
    if (sections.experience && sections.experience.jobs.length > 0) {
      documentElements.push(
        new Paragraph({
          text: sections.experience.title,
          style: "SectionHeading",
        })
      );
      
      // Add each job
      sections.experience.jobs.forEach((job: any) => {
        // Job title
        documentElements.push(
          new Paragraph({
            text: job.title,
            style: "JobTitle",
          })
        );
        
        // Company and date
        documentElements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: job.company,
                bold: true,
              }),
              new TextRun({
                text: job.location ? ` | ${job.location}` : "",
              }),
              new TextRun({
                text: "\t",
              }),
              new TextRun({
                text: job.date,
                italics: true,
              }),
            ],
            tabStops: [
              {
                type: TabStopType.RIGHT,
                position: TabStopPosition.MAX,
              },
            ],
            style: "Company",
          })
        );
        
        // Bullets
        job.bullets.forEach((bullet: string) => {
          documentElements.push(
            new Paragraph({
              text: bullet,
              bullet: {
                level: 0,
              },
              style: "BulletPoint",
            })
          );
        });
      });
    }
    
    // Education
    if (sections.education && sections.education.items.length > 0) {
      documentElements.push(
        new Paragraph({
          text: sections.education.title,
          style: "SectionHeading",
        })
      );
      
      // Add each education item
      sections.education.items.forEach((education: any) => {
        documentElements.push(
          new Paragraph({
            text: education.degree,
            style: "JobTitle",
          })
        );
        
        documentElements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: education.institution,
                bold: true,
              }),
              new TextRun({
                text: education.location ? ` | ${education.location}` : "",
              }),
              new TextRun({
                text: "\t",
              }),
              new TextRun({
                text: education.date,
                italics: true,
              }),
            ],
            tabStops: [
              {
                type: TabStopType.RIGHT,
                position: TabStopPosition.MAX,
              },
            ],
            style: "Company",
          })
        );
        
        // Education details
        education.details.forEach((detail: string) => {
          documentElements.push(
            new Paragraph({
              text: detail,
              style: "Normal",
            })
          );
        });
      });
    }
    
    // Skills
    if (sections.skills && sections.skills.items.length > 0) {
      documentElements.push(
        new Paragraph({
          text: sections.skills.title,
          style: "SectionHeading",
        })
      );
      
      // Add skills items
      const skillChunks = chunkArray(sections.skills.items, 3); // Group skills in chunks of 3 for multi-column layout
      
      skillChunks.forEach((chunk: string[]) => {
        documentElements.push(
          new Paragraph({
            children: chunk.map((skill: string, index: number) => {
              return new TextRun({
                text: skill + (index < chunk.length - 1 ? "\t" : ""),
              });
            }),
            tabStops: [
              {
                type: TabStopType.CENTER,
                position: TabStopPosition.MAX / 3,
              },
              {
                type: TabStopType.CENTER,
                position: (TabStopPosition.MAX / 3) * 2,
              },
            ],
            style: "Normal",
          })
        );
      });
    }
    
    // Additional sections
    sections.additional.forEach((section: any) => {
      documentElements.push(
        new Paragraph({
          text: section.title,
          style: "SectionHeading",
        })
      );
      
      // Add content
      section.content.forEach((content: string) => {
        documentElements.push(
          new Paragraph({
            text: content,
            style: "Normal",
          })
        );
      });
    });
  }
  
  return documentElements;
}

// Helper function to create two-column layout table
function createTwoColumnLayout(sections: Record<string, any>, template?: ResumeTemplate) {
  const mainColumnCells = [];
  const sidebarColumnCells = [];
  
  // Main column - typically contains Summary and Experience
  // Summary
  if (sections.summary && sections.summary.content.length > 0) {
    mainColumnCells.push(
      new TableCell({
        children: [
          new Paragraph({
            text: sections.summary.title,
            style: "SectionHeading",
          }),
          ...sections.summary.content.map((paragraph: string) => 
            new Paragraph({
              text: paragraph,
              style: "Normal",
            })
          )
        ],
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
        },
      })
    );
  }
  
  // Experience
  if (sections.experience && sections.experience.jobs.length > 0) {
    const experienceParagraphs = [
      new Paragraph({
        text: sections.experience.title,
        style: "SectionHeading",
      })
    ];
    
    // Add each job
    sections.experience.jobs.forEach((job: any) => {
      // Job title
      experienceParagraphs.push(
        new Paragraph({
          text: job.title,
          style: "JobTitle",
        })
      );
      
      // Company and date
      experienceParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: job.company,
              bold: true,
            }),
            new TextRun({
              text: job.location ? ` | ${job.location}` : "",
            }),
            new TextRun({
              text: "\t",
            }),
            new TextRun({
              text: job.date,
              italics: true,
            }),
          ],
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: TabStopPosition.MAX,
            },
          ],
          style: "Company",
        })
      );
      
      // Bullets
      job.bullets.forEach((bullet: string) => {
        experienceParagraphs.push(
          new Paragraph({
            text: bullet,
            bullet: {
              level: 0,
            },
            style: "BulletPoint",
          })
        );
      });
    });
    
    mainColumnCells.push(
      new TableCell({
        children: experienceParagraphs,
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
        },
      })
    );
  }
  
  // Education - can be in either column depending on template
  // For modern template, put education in sidebar
  const educationParagraphs = sections.education && sections.education.items.length > 0 ? [
    new Paragraph({
      text: sections.education.title,
      style: "SectionHeading",
    })
  ] : [];
  
  if (sections.education && sections.education.items.length > 0) {
    // Add each education item
    sections.education.items.forEach((education: any) => {
      educationParagraphs.push(
        new Paragraph({
          text: education.degree,
          style: "JobTitle",
        })
      );
      
      educationParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: education.institution,
              bold: true,
            }),
            new TextRun({
              text: education.location ? ` | ${education.location}` : "",
            }),
          ],
          style: "Company",
        })
      );
      
      if (education.date) {
        educationParagraphs.push(
          new Paragraph({
            text: education.date,
            style: "Normal",
            italics: true,
          })
        );
      }
      
      // Education details
      education.details.forEach((detail: string) => {
        educationParagraphs.push(
          new Paragraph({
            text: detail,
            style: "Normal",
          })
        );
      });
    });
  }
  
  // Skills section - typically in sidebar
  const skillsParagraphs = sections.skills && sections.skills.items.length > 0 ? [
    new Paragraph({
      text: sections.skills.title,
      style: "SectionHeading",
    })
  ] : [];
  
  if (sections.skills && sections.skills.items.length > 0) {
    // Add skills items as bullet points for better sidebar formatting
    sections.skills.items.forEach((skill: string) => {
      skillsParagraphs.push(
        new Paragraph({
          text: skill,
          bullet: {
            level: 0,
          },
          style: "BulletPoint",
        })
      );
    });
  }
  
  // For modern template: skills and education go in sidebar
  if (template?.id === "modern" || !template) {
    sidebarColumnCells.push(
      new TableCell({
        children: [
          ...skillsParagraphs,
          ...educationParagraphs
        ],
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
        },
        shading: {
          fill: (template?.secondaryColor || "#E6F0FF").replace('#', ''),
        },
      })
    );
  } else {
    // For other templates: education goes in main column, skills in sidebar
    mainColumnCells.push(
      new TableCell({
        children: educationParagraphs,
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
        },
      })
    );
    
    sidebarColumnCells.push(
      new TableCell({
        children: skillsParagraphs,
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
        },
      })
    );
  }
  
  // Create the two-column table
  return new Table({
    rows: [
      new TableRow({
        children: [
          // Main column (70%)
          new TableCell({
            children: mainColumnCells,
            width: {
              size: 70,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            verticalAlign: VerticalAlign.TOP,
          }),
          // Sidebar column (30%)
          new TableCell({
            children: sidebarColumnCells,
            width: {
              size: 30,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
            },
            verticalAlign: VerticalAlign.TOP,
          }),
        ],
        tableHeader: false,
      }),
    ],
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
    },
  });
}

// Helper function to chunk array into groups
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
