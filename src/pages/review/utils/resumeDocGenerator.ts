
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopPosition, TabStopType, BorderStyle, Table, TableRow, TableCell, WidthType } from "docx";
import { ResumeTemplate } from "@/utils/resumeRewriter";

// Function to convert inches to twips (1 inch = 1440 twips)
const inchesToTwips = (inches: number) => {
  return inches * 1440;
};

// Function to convert points to half points (1 point = 2 half points)
const pointsToHalfPoints = (points: number) => {
  return points * 2;
};

// Function to create a section heading
function createSectionHeading(text: string, template?: ResumeTemplate) {
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

  return new Paragraph({
    text: text,
    heading: HeadingLevel.HEADING_2,
    style: "SectionHeading",
  });
}

// Function to create a bullet point paragraph
function createBulletPoint(text: string, template?: ResumeTemplate) {
  return new Paragraph({
    text: text,
    style: "BulletPoint",
    bullet: {
      level: 0,
    },
  });
}

// Function to create a paragraph with a specific style
function createStyledParagraph(text: string, style: string) {
  return new Paragraph({
    text: text,
    style: style,
  });
}

// Function to create a text run with specific formatting
function createTextRun(text: string, bold?: boolean, italic?: boolean, underline?: boolean, size?: number, color?: string) {
  return new TextRun({
    text: text,
    bold: bold,
    italic: italic,
    underline: underline,
    size: size,
    color: color,
  });
}

// Function to create a table with specific properties
function createTable(rows: TableRow[]) {
  return new Table({
    rows: rows,
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
  });
}

// Function to create a table row
function createTableRow(cells: TableCell[]) {
  return new TableRow({
    children: cells,
  });
}

// Function to create a table cell
function createTableCell(text: string, bold?: boolean, italic?: boolean, alignment?: AlignmentType, verticalAlign?: number) {
  return new TableCell({
    children: [
      new Paragraph({
        text: text,
        alignment: alignment,
      }),
    ],
    verticalAlign: verticalAlign,
  });
}

// Function to create a contact info paragraph
function createContactInfoParagraph(text: string) {
  return new Paragraph({
    text: text,
    style: "ContactInfo",
  });
}

// Function to create a name paragraph
function createNameParagraph(text: string) {
  return new Paragraph({
    text: text,
    style: "Name",
  });
}

// Function to create a job title paragraph
function createJobTitleParagraph(text: string) {
  return new Paragraph({
    text: text,
    style: "JobTitle",
  });
}

// Function to create a company paragraph
function createCompanyParagraph(text: string) {
  return new Paragraph({
    text: text,
    style: "Company",
  });
}

// Function to create a skills paragraph
function createSkillsParagraph(skills: string[]) {
  const skillRuns = skills.map((skill, index) => {
    const run = new TextRun({
      text: skill,
      bold: true,
    });

    if (index < skills.length - 1) {
      return [run, new TextRun({ text: ", " })];
    }
    return [run];
  }).flat();

  return new Paragraph({
    children: skillRuns,
  });
}

// Function to create a document styles object
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

function createTwoColumnLayout(sections: Record<string, any>, template?: ResumeTemplate) {
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

  // Left column content (simple representation for now)
  const leftColumnContent = [
    new Paragraph({ text: "Contact Info Section" }),
    new Paragraph({ text: "Skills Section" })
  ];

  // Right column content
  const rightColumnContent = [
    new Paragraph({ text: "Experience Section" }),
    new Paragraph({ text: "Education Section" })
  ];

  // Create table with two columns
  const table = new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: leftColumnContent,
            width: {
              size: 30,
              type: WidthType.PERCENTAGE,
            },
          }),
          new TableCell({
            children: rightColumnContent,
            width: {
              size: 70,
              type: WidthType.PERCENTAGE,
            },
          }),
        ],
      }),
    ],
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
  });

  return table;
}

function createFormattedDocument(sections: Record<string, any>, template?: ResumeTemplate) {
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

  const layout = t.layout;

  // Create document content based on template layout
  let documentContent = [];
  
  // Always add name at the top
  documentContent.push(createNameParagraph(sections.name || "Your Name"));
  
  // Add contact info if available
  if (sections.contactInfo && sections.contactInfo.length > 0) {
    sections.contactInfo.forEach((info: any) => {
      documentContent.push(createContactInfoParagraph(info.value));
    });
  }

  // For two-column layout, use a table
  if (layout === "two-column") {
    documentContent.push(createTwoColumnLayout(sections, template));
  } else {
    // For single-column layout, add sections sequentially
    
    // Experience section
    documentContent.push(createSectionHeading("Experience", template));
    if (sections.experience && sections.experience.length > 0) {
      sections.experience.forEach((exp: any) => {
        documentContent.push(createJobTitleParagraph(exp.jobTitle));
        documentContent.push(createCompanyParagraph(`${exp.company} | ${exp.date}`));
        if (exp.bullets && exp.bullets.length > 0) {
          exp.bullets.forEach((bullet: string) => {
            documentContent.push(createBulletPoint(bullet, template));
          });
        }
      });
    }

    // Education section
    documentContent.push(createSectionHeading("Education", template));
    if (sections.education && sections.education.length > 0) {
      sections.education.forEach((edu: any) => {
        documentContent.push(createJobTitleParagraph(edu.degree));
        documentContent.push(createCompanyParagraph(`${edu.institution} | ${edu.date}`));
      });
    }

    // Skills section
    documentContent.push(createSectionHeading("Skills", template));
    if (sections.skills && sections.skills.length > 0) {
      documentContent.push(createSkillsParagraph(sections.skills));
    }
  }

  // Create the document with the content
  const doc = new Document({
    styles: createDocumentStyles(template),
    sections: [
      {
        children: documentContent,
      },
    ],
  });

  return doc;
}

async function generateResumeDocument(resumeData: any, template?: ResumeTemplate) {
  try {
    const doc = createFormattedDocument(resumeData, template);
    const buffer = await Packer.toBuffer(doc);
    return new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  } catch (error) {
    console.error("Error generating document:", error);
    return null;
  }
}

export default generateResumeDocument;
