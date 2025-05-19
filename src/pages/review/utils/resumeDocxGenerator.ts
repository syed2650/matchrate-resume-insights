
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopPosition, TabStopType, BorderStyle } from "docx";
import { ResumeData } from "./standardResumeTemplate";

export async function generateFormattedDocx(resumeData: ResumeData): Promise<Blob | null> {
  try {
    // Create document with proper styling
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: createFormattedDocument(resumeData)
        }
      ],
      styles: {
        paragraphStyles: [
          {
            id: "Normal",
            name: "Normal",
            run: {
              font: "Calibri",
              size: 22, // 11pt
              color: "000000",
            },
            paragraph: {
              spacing: {
                line: 276, // 1.15x line spacing
                before: 0,
                after: 200, // 10pt after paragraph
              },
            },
          },
          {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            run: {
              font: "Calibri",
              size: 32, // 16pt
              bold: true,
              color: "000000",
            },
            paragraph: {
              spacing: {
                before: 240, // 12pt
                after: 60, // 3pt
              },
              alignment: AlignmentType.CENTER,
            },
          },
          {
            id: "ContactInfo",
            name: "Contact Info",
            basedOn: "Normal",
            next: "Normal",
            run: {
              font: "Calibri",
              size: 22, // 11pt
              color: "000000",
            },
            paragraph: {
              alignment: AlignmentType.CENTER,
              spacing: {
                before: 60, // 3pt
                after: 240, // 12pt
              },
            },
          },
          {
            id: "JobTitle",
            name: "Job Title",
            basedOn: "Normal",
            next: "Normal",
            run: {
              font: "Calibri",
              size: 28, // 14pt
              bold: true,
              color: "000000",
            },
            paragraph: {
              alignment: AlignmentType.CENTER,
              spacing: {
                before: 0,
                after: 240, // 12pt
              },
            },
          },
          {
            id: "SectionHeading",
            name: "Section Heading",
            basedOn: "Normal",
            next: "Normal",
            run: {
              font: "Calibri",
              size: 24, // 12pt
              bold: true,
              color: "000000",
              allCaps: true,
            },
            paragraph: {
              spacing: {
                before: 240, // 12pt
                after: 120, // 6pt
              },
              border: {
                bottom: {
                  color: "auto",
                  space: 1,
                  style: BorderStyle.SINGLE,
                  size: 6,
                },
              },
            },
          },
          {
            id: "Company",
            name: "Company",
            basedOn: "Normal",
            next: "Normal",
            run: {
              font: "Calibri",
              size: 24, // 12pt
              bold: true,
              color: "000000",
            },
          },
          {
            id: "JobPosition",
            name: "Job Position",
            basedOn: "Normal",
            next: "Normal",
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
            run: {
              font: "Calibri",
              size: 22, // 11pt
              color: "000000",
            },
            paragraph: {
              spacing: {
                line: 276, // 1.15x
                before: 0,
                after: 80, // 4pt
              },
              indent: {
                left: 720, // 0.5 inch indent for bullets
              },
            },
          },
          {
            id: "Institution",
            name: "Institution",
            basedOn: "Normal",
            next: "Normal",
            run: {
              font: "Calibri",
              size: 24, // 12pt
              bold: true,
              color: "000000",
            },
          },
          {
            id: "Degree",
            name: "Degree",
            basedOn: "Normal",
            next: "Normal",
            run: {
              font: "Calibri",
              size: 22, // 11pt
              italics: true,
              color: "000000",
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

function createFormattedDocument(resumeData: ResumeData) {
  const documentElements = [];
  
  // Name (centered, large)
  documentElements.push(
    new Paragraph({
      text: resumeData.header.name,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
    })
  );
  
  // Contact Info (centered)
  const contactParts = [];
  if (resumeData.header.location) contactParts.push(resumeData.header.location);
  if (resumeData.header.phone) contactParts.push(resumeData.header.phone);
  if (resumeData.header.email) contactParts.push(resumeData.header.email);
  if (resumeData.header.linkedin) contactParts.push(resumeData.header.linkedin);
  if (resumeData.header.website) contactParts.push(resumeData.header.website);
  
  documentElements.push(
    new Paragraph({
      text: contactParts.join(' • '),
      style: "ContactInfo",
      alignment: AlignmentType.CENTER,
    })
  );
  
  // Job Title (if present)
  if (resumeData.jobTitle) {
    documentElements.push(
      new Paragraph({
        text: resumeData.jobTitle,
        style: "JobTitle",
        alignment: AlignmentType.CENTER,
      })
    );
  }
  
  // Summary
  if (resumeData.summary && resumeData.summary.length > 0) {
    documentElements.push(
      new Paragraph({
        text: "SUMMARY",
        style: "SectionHeading",
      })
    );
    
    // Add each summary paragraph
    resumeData.summary.forEach(paragraph => {
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
  if (resumeData.experience && resumeData.experience.length > 0) {
    documentElements.push(
      new Paragraph({
        text: "EXPERIENCE",
        style: "SectionHeading",
      })
    );
    
    // Add each experience entry
    resumeData.experience.forEach(exp => {
      // Company and dates on the same line, with dates right-aligned
      documentElements.push(
        new Paragraph({
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: TabStopPosition.MAX,
            },
          ],
          spacing: {
            before: 180, // 9pt
          },
          children: [
            new TextRun({
              text: `${exp.company}${exp.location ? ' • ' + exp.location : ''}`,
              bold: true,
              size: 24,
            }),
            new TextRun({
              text: "\t",
            }),
            new TextRun({
              text: exp.dates || '',
              size: 22,
            }),
          ],
        })
      );
      
      // Job title
      documentElements.push(
        new Paragraph({
          text: exp.title,
          style: "JobPosition",
          spacing: {
            before: 60, // 3pt
            after: 60, // 3pt
          }
        })
      );
      
      // Bullets
      exp.bullets.forEach(bullet => {
        documentElements.push(
          new Paragraph({
            text: `• ${bullet}`,
            style: "BulletPoint",
          })
        );
      });
    });
  }
  
  // Education
  if (resumeData.education && resumeData.education.length > 0) {
    documentElements.push(
      new Paragraph({
        text: "EDUCATION",
        style: "SectionHeading",
      })
    );
    
    // Add each education entry
    resumeData.education.forEach(edu => {
      // Institution name and dates
      documentElements.push(
        new Paragraph({
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: TabStopPosition.MAX,
            },
          ],
          spacing: {
            before: 180, // 9pt
          },
          children: [
            new TextRun({
              text: edu.institution,
              bold: true,
              size: 24,
            }),
            new TextRun({
              text: "\t",
            }),
            new TextRun({
              text: edu.dates || '',
              size: 22,
            }),
          ],
        })
      );
      
      // Location if available
      if (edu.location) {
        documentElements.push(
          new Paragraph({
            text: edu.location,
            spacing: {
              before: 0,
              after: 60, // 3pt
            },
          })
        );
      }
      
      // Degree
      documentElements.push(
        new Paragraph({
          text: edu.degree,
          style: "Degree",
          spacing: {
            before: 60, // 3pt
            after: 60, // 3pt
          }
        })
      );
      
      // Additional details
      if (edu.details && edu.details.length > 0) {
        edu.details.forEach(detail => {
          documentElements.push(
            new Paragraph({
              text: `• ${detail}`,
              style: "BulletPoint",
            })
          );
        });
      }
    });
  }
  
  // Skills
  if (resumeData.skills && (resumeData.skills.technical?.length || resumeData.skills.soft?.length || resumeData.skills.other?.length)) {
    documentElements.push(
      new Paragraph({
        text: "SKILLS",
        style: "SectionHeading",
      })
    );
    
    // Technical Skills
    if (resumeData.skills.technical && resumeData.skills.technical.length > 0) {
      documentElements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Technical Skills",
              bold: true,
              size: 24,
            })
          ],
          spacing: {
            before: 120, // 6pt
            after: 60, // 3pt
          },
        })
      );
      
      resumeData.skills.technical.forEach(skill => {
        documentElements.push(
          new Paragraph({
            text: `• ${skill}`,
            style: "BulletPoint",
          })
        );
      });
    }
    
    // Soft Skills
    if (resumeData.skills.soft && resumeData.skills.soft.length > 0) {
      documentElements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Soft Skills",
              bold: true,
              size: 24,
            })
          ],
          spacing: {
            before: 120, // 6pt
            after: 60, // 3pt
          },
        })
      );
      
      resumeData.skills.soft.forEach(skill => {
        documentElements.push(
          new Paragraph({
            text: `• ${skill}`,
            style: "BulletPoint",
          })
        );
      });
    }
    
    // Other Skills
    if (resumeData.skills.other && resumeData.skills.other.length > 0) {
      documentElements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Additional Skills",
              bold: true,
              size: 24,
            })
          ],
          spacing: {
            before: 120, // 6pt
            after: 60, // 3pt
          },
        })
      );
      
      resumeData.skills.other.forEach(skill => {
        documentElements.push(
          new Paragraph({
            text: `• ${skill}`,
            style: "BulletPoint",
          })
        );
      });
    }
  }
  
  // Certifications
  if (resumeData.certifications && resumeData.certifications.length > 0) {
    documentElements.push(
      new Paragraph({
        text: "CERTIFICATIONS",
        style: "SectionHeading",
      })
    );
    
    resumeData.certifications.forEach(cert => {
      documentElements.push(
        new Paragraph({
          children: [
            new TextRun({
              text: cert.name,
              bold: true,
              size: 24,
            }),
            ...(cert.issuer ? [
              new TextRun({
                text: " - ",
                size: 22,
              }),
              new TextRun({
                text: cert.issuer,
                size: 22,
              })
            ] : [])
          ],
          spacing: {
            before: 120, // 6pt
            after: 0,
          },
        })
      );
      
      if (cert.date) {
        documentElements.push(
          new Paragraph({
            text: cert.date,
            spacing: {
              before: 40, // 2pt
              after: 80, // 4pt
            },
          })
        );
      } else {
        // Add spacing if no date
        documentElements.push(
          new Paragraph({
            text: "",
            spacing: {
              before: 0,
              after: 80, // 4pt
            },
          })
        );
      }
    });
  }
  
  // Projects
  if (resumeData.projects && resumeData.projects.length > 0) {
    documentElements.push(
      new Paragraph({
        text: "PROJECTS",
        style: "SectionHeading",
      })
    );
    
    resumeData.projects.forEach(project => {
      // Project name and dates
      documentElements.push(
        new Paragraph({
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: TabStopPosition.MAX,
            },
          ],
          spacing: {
            before: 180, // 9pt
          },
          children: [
            new TextRun({
              text: project.name,
              bold: true,
              size: 24,
            }),
            ...(project.dates ? [
              new TextRun({
                text: "\t",
              }),
              new TextRun({
                text: project.dates,
                size: 22,
              })
            ] : [])
          ],
        })
      );
      
      // URL if available
      if (project.url) {
        documentElements.push(
          new Paragraph({
            text: project.url,
            spacing: {
              before: 40, // 2pt
              after: 40, // 2pt
            },
          })
        );
      }
      
      // Description if available
      if (project.description) {
        documentElements.push(
          new Paragraph({
            text: project.description,
            spacing: {
              before: 40, // 2pt
              after: 60, // 3pt
            },
          })
        );
      }
      
      // Bullets if available
      if (project.bullets && project.bullets.length > 0) {
        project.bullets.forEach(bullet => {
          documentElements.push(
            new Paragraph({
              text: `• ${bullet}`,
              style: "BulletPoint",
            })
          );
        });
      }
    });
  }
  
  // Volunteering
  if (resumeData.volunteering && resumeData.volunteering.length > 0) {
    documentElements.push(
      new Paragraph({
        text: "VOLUNTEERING & LEADERSHIP",
        style: "SectionHeading",
      })
    );
    
    resumeData.volunteering.forEach(vol => {
      // Organization name and dates
      documentElements.push(
        new Paragraph({
          tabStops: [
            {
              type: TabStopType.RIGHT,
              position: TabStopPosition.MAX,
            },
          ],
          spacing: {
            before: 180, // 9pt
          },
          children: [
            new TextRun({
              text: vol.organization,
              bold: true,
              size: 24,
            }),
            ...(vol.dates ? [
              new TextRun({
                text: "\t",
              }),
              new TextRun({
                text: vol.dates,
                size: 22,
              })
            ] : [])
          ],
        })
      );
      
      // Role and location
      documentElements.push(
        new Paragraph({
          text: `${vol.role}${vol.location ? ' • ' + vol.location : ''}`,
          style: "JobPosition",
          spacing: {
            before: 60, // 3pt
            after: 60, // 3pt
          }
        })
      );
      
      // Bullets if available
      if (vol.bullets && vol.bullets.length > 0) {
        vol.bullets.forEach(bullet => {
          documentElements.push(
            new Paragraph({
              text: `• ${bullet}`,
              style: "BulletPoint",
            })
          );
        });
      }
    });
  }
  
  return documentElements;
}
