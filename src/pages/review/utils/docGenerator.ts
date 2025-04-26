
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
  Header
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
  const name = currentResume.split('\n')[0].replace(/^#+ /, '').trim();
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
    const contactInfo = sections.header
      .filter(line => line.includes('@') || line.includes('linkedin.com') || line.includes('phone'))
      .join(' | ');
    
    if (contactInfo) {
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
            font: RESUME_STYLES.fonts.main
          })
        ],
        spacing: { after: RESUME_STYLES.spacing.afterSection },
        alignment: AlignmentType.CENTER
      })
    );
  }

  // Add sections with proper formatting
  Object.entries(sections).forEach(([sectionName, lines]) => {
    if (sectionName === 'header') return;
    
    // Add section heading
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
      if (line.startsWith('* ') || line.startsWith('- ')) {
        // Format bullet points
        const bulletText = line.replace(/^[*-]\s/, '');
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
        // Format job titles and companies
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
        // Regular text
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
    
    // Add extra space after sections
    paragraphs.push(
      new Paragraph({
        spacing: { after: RESUME_STYLES.spacing.afterSection }
      })
    );
  });

  // Create document with proper margins
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.8),
              right: convertInchesToTwip(0.8),
              bottom: convertInchesToTwip(0.8),
              left: convertInchesToTwip(0.8)
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
