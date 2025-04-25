import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Packer,
  AlignmentType,
  LevelFormat,
  convertInchesToTwip
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
    subheading: 14,
    normal: 11,
    small: 10
  },
  spacing: {
    afterSection: 400,
    afterParagraph: 200,
    afterHeading: 300
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
  const name = currentResume.split('\n')[0].replace('#', '').trim();
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
            font: RESUME_STYLES.fonts.heading
          })
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { after: RESUME_STYLES.spacing.afterHeading },
        border: { 
          bottom: { 
            color: "auto", 
            size: 6, 
            space: 1,
            style: 'single' 
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

  // Add footer with ATS score and timestamp
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `ATS Score: ${currentAtsScore}/100 - Generated on ${generatedTimestamp}`,
          size: RESUME_STYLES.fontSize.small * 2,
          color: "666666",
          font: RESUME_STYLES.fonts.main
        })
      ],
      spacing: { before: RESUME_STYLES.spacing.afterSection },
      alignment: AlignmentType.LEFT
    })
  );

  // Create document with proper margins
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1)
            }
          }
        },
        children: paragraphs
      }
    ]
  });

  return Packer.toBlob(doc);
};
