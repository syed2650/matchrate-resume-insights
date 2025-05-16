import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopPosition, TabStopType, BorderStyle, Table, TableRow, TableCell, WidthType, VerticalAlign } from "docx";
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
function createTextRun(text: string, bold?: boolean, italics?: boolean, underline?: boolean, size?: number, color?: string) {
  return new TextRun({
    text: text,
    bold: bold,
    italics: italics,
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
function createTableCell(text: string, bold?: boolean, italics?: boolean, alignment?: AlignmentType, verticalAlign?: VerticalAlign) {
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
      run.text += ", ";
    }

    return run;
  });

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

  const fontFamily = t.fontFamily.replace(/[''"]/g, '');
  const primaryColor = t.primaryColor.replace('#', '');

  // Left column content
  const contactInfo = sections.contactInfo;
  const skills = sections.skills;

  // Right column content
  const experience = sections.experience;
  const education = sections.education;
  const projects = sections.projects;
  const certifications = sections.certifications;
  const awards = sections.awards;

  // Create left column rows
  const leftColumnRows: TableRow[] = [];

  // Add contact info to left column
  if (contactInfo && contactInfo.length > 0) {
    const contactInfoParagraphs = contactInfo.map((info: any) => createContactInfoParagraph(info.value));
    leftColumnRows.push(createTableRow([createTableCell(contactInfoParagraphs.map(p => p.children[0].root.value).join('\n'), false, false, AlignmentType.CENTER)]));
  }

  // Add skills to left column
  if (skills && skills.length > 0) {
    const skillsParagraph = createSkillsParagraph(skills);
    leftColumnRows.push(createTableRow([createTableCell(skillsParagraph.children.map(c => c.root.value).join(''), false, false, AlignmentType.LEFT)]));
  }

  // Create right column rows
  const rightColumnRows: TableRow[] = [];

  // Add experience to right column
  if (experience && experience.length > 0) {
    const experienceParagraphs: Paragraph[] = [];
    experience.forEach((exp: any) => {
      experienceParagraphs.push(createJobTitleParagraph(exp.jobTitle));
      experienceParagraphs.push(createCompanyParagraph(`${exp.company} | ${exp.date}`));
      if (exp.bullets && exp.bullets.length > 0) {
        exp.bullets.forEach((bullet: string) => {
          experienceParagraphs.push(createBulletPoint(bullet, template));
        });
      }
    });
    rightColumnRows.push(createTableRow([createTableCell(experienceParagraphs.map(p => p.children[0].root.value).join('\n'), false, false, AlignmentType.LEFT)]));
  }

  // Add education to right column
  if (education && education.length > 0) {
    const educationParagraphs: Paragraph[] = [];
    education.forEach((edu: any) => {
      educationParagraphs.push(createJobTitleParagraph(edu.degree));
      educationParagraphs.push(createCompanyParagraph(`${edu.institution} | ${edu.date}`));
    });
    rightColumnRows.push(createTableRow([createTableCell(educationParagraphs.map(p => p.children[0].root.value).join('\n'), false, false, AlignmentType.LEFT)]));
  }

  // Add projects to right column
  if (projects && projects.length > 0) {
    const projectsParagraphs: Paragraph[] = [];
    projects.forEach((project: any) => {
      projectsParagraphs.push(createJobTitleParagraph(project.name));
      projectsParagraphs.push(createCompanyParagraph(project.description));
      if (project.bullets && project.bullets.length > 0) {
        project.bullets.forEach((bullet: string) => {
          projectsParagraphs.push(createBulletPoint(bullet, template));
        });
      }
    });
    rightColumnRows.push(createTableRow([createTableCell(projectsParagraphs.map(p => p.children[0].root.value).join('\n'), false, false, AlignmentType.LEFT)]));
  }

  // Add certifications to right column
  if (certifications && certifications.length > 0) {
    const certificationsParagraphs: Paragraph[] = [];
    certifications.forEach((cert: any) => {
      certificationsParagraphs.push(createJobTitleParagraph(cert.name));
      certificationsParagraphs.push(createCompanyParagraph(cert.institution));
    });
    rightColumnRows.push(createTableRow([createTableCell(certificationsParagraphs.map(p => p.children[0].root.value).join('\n'), false, false, AlignmentType.LEFT)]));
  }

  // Add awards to right column
  if (awards && awards.length > 0) {
    const awardsParagraphs: Paragraph[] = [];
    awards.forEach((award: any) => {
      awardsParagraphs.push(createJobTitleParagraph(award.name));
      awardsParagraphs.push(createCompanyParagraph(award.institution));
    });
    rightColumnRows.push(createTableRow([createTableCell(awardsParagraphs.map(p => p.children[0].root.value).join('\n'), false, false, AlignmentType.LEFT)]));
  }

  // Create left and right column tables
  const leftColumnTable = createTable(leftColumnRows);
  const rightColumnTable = createTable(rightColumnRows);

  // Create main table with two columns
  const mainTable = createTable([
    createTableRow([
      new TableCell({
        children: [leftColumnTable],
        width: {
          size: 50,
          type: WidthType.PERCENTAGE,
        },
      }),
      new TableCell({
        children: [rightColumnTable],
        width: {
          size: 50,
          type: WidthType.PERCENTAGE,
        },
      }),
    ]),
  ]);

  return mainTable;
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

  const fontFamily = t.fontFamily.replace(/['"']/g, '');
  const primaryColor = t.primaryColor.replace('#', '');
  const layout = t.layout;

  const document = new Document({
    styles: createDocumentStyles(template),
    sections: [
      {
        children: [
          createNameParagraph(sections.name),
          ...(sections.contactInfo ? sections.contactInfo.map((info: any) => createContactInfoParagraph(info.value)) : []),
          createSectionHeading("Experience", template),
          ...(sections.experience ? sections.experience.map((exp: any) => {
            const paragraphs = [
              createJobTitleParagraph(exp.jobTitle),
              createCompanyParagraph(`${exp.company} | ${exp.date}`),
              ...(exp.bullets ? exp.bullets.map((bullet: string) => createBulletPoint(bullet, template)) : [])
            ];
            return paragraphs;
          }).flat() : []),
          createSectionHeading("Education", template),
          ...(sections.education ? sections.education.map((edu: any) => {
            const paragraphs = [
              createJobTitleParagraph(edu.degree),
              createCompanyParagraph(`${edu.institution} | ${edu.date}`)
            ];
            return paragraphs;
          }).flat() : []),
          createSectionHeading("Skills", template),
          ...(sections.skills ? [createSkillsParagraph(sections.skills)] : []),
        ],
      },
    ],
  });

  if (layout === "two-column") {
    const document = new Document({
      styles: createDocumentStyles(template),
      sections: [
        {
          children: [
            createNameParagraph(sections.name),
            createTwoColumnLayout(sections, template)
          ],
        },
      ],
    });
    return document;
  }

  // For single column layout
  if (layout === "single-column") {
    const document = new Document({
      styles: createDocumentStyles(template),
      sections: [
        {
          children: [
            createNameParagraph(sections.name),
            ...(sections.contactInfo ? sections.contactInfo.map((info: any) => createContactInfoParagraph(info.value)) : []),
            createSectionHeading("Experience", template),
            ...(sections.experience ? sections.experience.map((exp: any) => {
              const paragraphs: Paragraph[] = [
                createJobTitleParagraph(exp.jobTitle),
                createCompanyParagraph(`${exp.company} | ${exp.date}`),
                ...(exp.bullets ? exp.bullets.map((bullet: string) => createBulletPoint(bullet, template)) : [])
              ];
              return paragraphs;
            }).flat() : []),
            createSectionHeading("Projects", template),
            ...(sections.projects ? sections.projects.map((project: any) => {
              const paragraphs: Paragraph[] = [
                createJobTitleParagraph(project.name),
                createCompanyParagraph(project.description),
                ...(project.bullets ? project.bullets.map((bullet: string) => createBulletPoint(bullet, template)) : [])
              ];
              return paragraphs;
            }).flat() : []),
            createSectionHeading("Education", template),
            ...(sections.education ? sections.education.map((education: any) => {
              const educationParagraphs: Paragraph[] = [
                createJobTitleParagraph(education.degree),
                createCompanyParagraph(`${education.institution} | ${education.date}`),
              ];

              educationParagraphs.push(
                new Paragraph({
                  text: education.date,
                  style: "Normal",
                  formatting: {
                    italic: true
                  }
                })
              );

              return educationParagraphs;
            }).flat() : []),
            createSectionHeading("Skills", template),
            ...(sections.skills ? [createSkillsParagraph(sections.skills)] : []),
            createSectionHeading("Certifications", template),
            ...(sections.certifications ? sections.certifications.map((certification: any) => {
              const certificationParagraphs: Paragraph[] = [
                createJobTitleParagraph(certification.name),
                createCompanyParagraph(certification.institution),
              ];
              return certificationParagraphs;
            }).flat() : []),
            createSectionHeading("Awards", template),
            ...(sections.awards ? sections.awards.map((award: any) => {
              const awardParagraphs: Paragraph[] = [
                createJobTitleParagraph(award.name),
                createCompanyParagraph(award.institution),
              ];
              return awardParagraphs;
            }).flat() : []),
          ],
        },
      ],
    });
    return document;
  }

  return document;
}

async function generateResumeDocument(resumeData: any, template?: ResumeTemplate) {
  const doc = createFormattedDocument(resumeData, template);

  // Used to debug
  // console.log(JSON.stringify(doc, null, 2));

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}

export default generateResumeDocument;
