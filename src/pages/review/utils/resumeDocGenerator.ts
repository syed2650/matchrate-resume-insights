
import { Document, Paragraph, TextRun, HeadingLevel, BorderStyle, Table, TableRow, TableCell, WidthType, AlignmentType } from 'docx';
import { Packer } from 'docx';

export const generateModernDocx = (resumeData: any, template: any) => {
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
                      ...[].concat(...resumeData.experience.map((job: any) => {
                        const paragraphs = [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: job.title,
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
                            alignment: AlignmentType.RIGHT,
                            text: job.date,
                            spacing: {
                              after: 100,
                            },
                          }),
                          
                          // Job bullets
                          ...job.bullets.map((bullet: string) => 
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
                      
                      ...resumeData.skills.map((skill: any) => 
                        new Paragraph({
                          text: typeof skill === 'string' ? skill : skill.name,
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
                      
                      ...resumeData.education.map((edu: any) => [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: edu.degree,
                              bold: true,
                            })
                          ]
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
                        }) : null,
                      ].filter(Boolean)),
                      
                      // Awards
                      resumeData.awards && resumeData.awards.length > 0 ? 
                        new Paragraph({
                          text: "ADDITIONAL INFORMATION",
                          heading: HeadingLevel.HEADING_2,
                        }) : null,
                      
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
  
  return document;
};

// Function that ResumeDownloadButton.tsx is looking for
export const generateFormattedDocx = async (resumeContent: string, template: any) => {
  try {
    // Parse the resume content into structured data
    const resumeData = parseResumeData(resumeContent);
    if (!resumeData) {
      throw new Error("Failed to parse resume data");
    }
    
    // Generate the docx document based on the template
    let doc;
    if (template.id === 'modern') {
      doc = generateModernDocx(resumeData, template);
    } else {
      // Fallback to modern template for now
      doc = generateModernDocx(resumeData, template);
    }
    
    // Create a blob from the document
    const blob = await Packer.toBlob(doc);
    return blob;
  } catch (error) {
    console.error("Error generating DOCX:", error);
    return null;
  }
};

// Helper function to parse resume data for the template
const parseResumeData = (resumeContent: string | Record<string, any>) => {
  try {
    // Check if we have a structured object already
    if (typeof resumeContent !== 'string') {
      const data = resumeContent;
      return {
        name: data.name || 'Example Name',
        email: data.email || 'email@example.com',
        phone: data.phone || '555-123-4567',
        location: data.location || 'City, State',
        summary: data.summary || 'Resume summary placeholder.',
        experience: data.experience || [],
        education: data.education || [],
        skills: data.skills || [],
        awards: data.awards || [],
      };
    }
    
    // Simple parsing for string content
    // This is a basic implementation - in a real app this would be more sophisticated
    const sections: Record<string, any> = {
      name: extractName(resumeContent),
      contact: extractContactInfo(resumeContent),
      summary: extractSummary(resumeContent),
      experience: [],
      education: [],
      skills: extractSkills(resumeContent),
    };
    
    return {
      name: sections.name || 'Example Name',
      email: sections.contact.email || 'email@example.com',
      phone: sections.contact.phone || '555-123-4567',
      location: sections.contact.location || 'City, State',
      summary: sections.summary || 'Resume summary placeholder.',
      experience: sections.experience || [],
      education: sections.education || [],
      skills: sections.skills || [],
      awards: [],
    };
  } catch (error) {
    console.error('Error parsing resume data:', error);
    return {
      name: 'Example Name',
      email: 'email@example.com',
      phone: '555-123-4567',
      location: 'City, State',
      summary: 'Resume summary placeholder.',
      experience: [],
      education: [],
      skills: [],
      awards: []
    };
  }
};

// Helper functions to extract information from resume text
function extractName(text: string): string {
  // Simple implementation: take first line as name
  const firstLine = text.split('\n')[0].trim();
  return firstLine.length > 0 ? firstLine : 'Example Name';
}

function extractContactInfo(text: string): { email: string, phone: string, location: string } {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phoneRegex = /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/;
  
  const emailMatch = text.match(emailRegex);
  const phoneMatch = text.match(phoneRegex);
  
  return {
    email: emailMatch ? emailMatch[0] : 'email@example.com',
    phone: phoneMatch ? phoneMatch[0] : '555-123-4567',
    location: 'City, State' // Simple placeholder
  };
}

function extractSummary(text: string): string {
  // Look for summary section - basic implementation
  const summaryRegex = /SUMMARY|PROFILE|OBJECTIVE/i;
  const lines = text.split('\n');
  
  let summaryStarted = false;
  let summary = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (summaryStarted) {
      // If we find a new section header, stop collecting summary
      if (line.toUpperCase() === line && line.length > 0 && !line.startsWith('•')) {
        break;
      }
      
      if (line.length > 0) {
        summary += line + ' ';
      }
    } else if (summaryRegex.test(line)) {
      summaryStarted = true;
    }
  }
  
  return summary || text.substring(0, 150) + '...'; // Fallback: use beginning of resume
}

function extractSkills(text: string): string[] {
  // Basic implementation: look for skills section and extract bullet points
  const skillsRegex = /SKILLS|EXPERTISE|TECHNOLOGIES|COMPETENCIES/i;
  const lines = text.split('\n');
  
  let skillsStarted = false;
  const skills: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (skillsStarted) {
      // If we find a new section header, stop collecting skills
      if (line.toUpperCase() === line && line.length > 0 && !line.match(/^[•\-\*]/)) {
        break;
      }
      
      if (line.match(/^[•\-\*]/) || line.length > 0 && !line.match(/^[•\-\*]/) && skills.length === 0) {
        const skill = line.replace(/^[•\-\*]\s*/, '').trim();
        if (skill.length > 0) {
          skills.push(skill);
        }
      }
    } else if (skillsRegex.test(line)) {
      skillsStarted = true;
    }
  }
  
  // Return sample skills if none found
  return skills.length > 0 ? skills : ['JavaScript', 'React', 'Node.js', 'CSS', 'HTML'];
}
