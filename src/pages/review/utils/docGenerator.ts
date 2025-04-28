
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

export const parseResumeContent = (content: string) => {
  const sections: Section = {};
  let currentSection = "header";
  sections[currentSection] = [];
  
  const lines = content.split('\n');
  lines.forEach(line => {
    if (line.match(/^#{1,2}\s+/) || line.match(/^[A-Z\s]{5,}$/)) {
      currentSection = line.replace(/^#{1,2}\s+/, '').trim();
      sections[currentSection] = [];
    } else if (line.trim()) {
      sections[currentSection].push(line);
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
  const sections = parseResumeContent(currentResume);
  const paragraphs = [];
  
  // Add name with larger font and bold
  const nameMatch = currentResume.match(/^(?:#{1,2}\s+)?([A-Za-z\s.]+)/);
  const name = nameMatch ? nameMatch[1].trim() : "Resume";
  
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
      .slice(0, 3)
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
  if (sections["PROFESSIONAL SUMMARY"] || sections["Professional Summary"] || sections["SUMMARY"] || sections["Summary"]) {
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
      
      sections[summaryKey].forEach(line => {
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
      });
      
      paragraphs.push(
        new Paragraph({
          spacing: { after: RESUME_STYLES.spacing.afterSection }
        })
      );
      
      delete sections[summaryKey];
    }
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
    
    const skillsText = sections[skillsKey].join(' ');
    
    if (skillsText.includes(',')) {
      const skills = skillsText
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
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
      sections[skillsKey].forEach(line => {
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
    
    paragraphs.push(
      new Paragraph({
        spacing: { after: RESUME_STYLES.spacing.afterSection }
      })
    );
    
    delete sections[skillsKey];
  }
  
  // Process Experience section next
  const experienceKey = Object.keys(sections).find(key => 
    key.toLowerCase().includes('experience') || key.toLowerCase().includes('employment') || key.toLowerCase().includes('work')
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
    
    sections[experienceKey].forEach(line => {
      if (line.match(/^[A-Za-z ]+\s+\|\s+/) || (line.match(/^[A-Za-z ]+$/) && !line.startsWith('•') && !line.startsWith('-'))) {
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
    
    paragraphs.push(
      new Paragraph({
        spacing: { after: RESUME_STYLES.spacing.afterSection }
      })
    );
    
    delete sections[experienceKey];
  }

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
    
    lines.forEach(line => {
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
    
    paragraphs.push(
      new Paragraph({
        spacing: { after: RESUME_STYLES.spacing.afterSection }
      })
    );
  });

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
};
