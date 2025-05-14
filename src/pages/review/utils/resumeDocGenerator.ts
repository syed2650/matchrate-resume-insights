import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  convertInchesToTwip
} from "docx";

export async function generateFormattedDocx(resumeText: string, theme: string = "teal"): Promise<Blob | null> {
  try {
    if (!resumeText || typeof resumeText !== "string") {
      console.error("Invalid resume text provided");
      return null;
    }

    const sections = parseResumeIntoSections(resumeText);

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(0.7),
                right: convertInchesToTwip(0.7),
                bottom: convertInchesToTwip(0.7),
                left: convertInchesToTwip(0.7),
              },
            },
          },
          children: createTealLayout(sections),
        },
      ],
    });

    return await Packer.toBlob(doc);
  } catch (error) {
    console.error("Error generating DOCX:", error);
    return null;
  }
}

function parseResumeIntoSections(text: string): Record<string, string[]> {
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const sections: Record<string, string[]> = {
    header: [], summary: [], experience: [], education: [], skills: [], additional: []
  };
  let current = "header";
  for (const line of lines) {
    if (/^(SUMMARY|EXPERIENCE|EDUCATION|SKILLS|ADDITIONAL INFORMATION)$/i.test(line)) {
      current = line.toLowerCase();
    } else {
      sections[current].push(line);
    }
  }
  return sections;
}

function createTealLayout(sections: Record<string, string[]>) {
  const docElements: Paragraph[] = [];

  if (sections.header.length > 0) {
    docElements.push(new Paragraph({
      children: [new TextRun({ text: sections.header[0], bold: true, size: 24 })],
      alignment: AlignmentType.CENTER,
    }));
    if (sections.header.length > 1) {
      docElements.push(new Paragraph({
        children: [new TextRun({ text: sections.header.slice(1).join(" | "), size: 20 })],
        alignment: AlignmentType.CENTER,
      }));
    }
  }

  const sectionTitles = {
    summary: "Summary",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    additional: "Additional Information",
  };

  for (const [key, label] of Object.entries(sectionTitles)) {
    const content = sections[key];
    if (!content || content.length === 0) continue;

    docElements.push(new Paragraph({
      text: label.toUpperCase(),
      heading: HeadingLevel.HEADING_2,
      spacing: { after: 150 }
    }));

    content.forEach(line => {
      const isBullet = /^[-•]/.test(line);
      docElements.push(new Paragraph({
        text: line.replace(/^[-•]\s*/, ""),
        bullet: isBullet ? { level: 0 } : undefined,
        spacing: { after: 100 },
      }));
    });
  }

  return docElements;
}
