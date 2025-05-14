import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopPosition, TabStopType } from "docx";

export async function generateFormattedDocx(resumeText: string): Promise<Blob | null> {
  try {
    if (!resumeText || typeof resumeText !== 'string') {
      console.error("Invalid resume text provided");
      return null;
    }

    const sections = parseResumeIntoSections(resumeText);

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: createFormattedDocument(sections)
        }
      ]
    });

    const buffer = await Packer.toBlob(doc);
    return buffer;
  } catch (error) {
    console.error("Error generating DOCX:", error);
    return null;
  }
}

function parseResumeIntoSections(resumeText: string): Record<string, string[]> {
  const lines = resumeText.split(/\n/).filter(line => line.trim().length > 0);
  const sections: Record<string, string[]> = {
    header: [],
    summary: [],
    experience: [],
    education: [],
    skills: [],
    additional: []
  };

  let current = "header";
  for (const line of lines) {
    const clean = line.trim();
    if (/^(SUMMARY|EXPERIENCE|EDUCATION|SKILLS|ADDITIONAL INFORMATION)$/i.test(clean)) {
      current = clean.toLowerCase();
    } else {
      sections[current]?.push(clean);
    }
  }
  return sections;
}

function createFormattedDocument(sections: Record<string, string[]>) {
  const docElements = [];

  // Header
  if (sections.header.length > 0) {
    docElements.push(
      new Paragraph({
        text: sections.header[0],
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        text: sections.header.slice(1).join(" | "),
        alignment: AlignmentType.CENTER
      })
    );
  }

  const addSection = (title: string, content: string[]) => {
    if (!content.length) return;
    docElements.push(
      new Paragraph({
        text: title.toUpperCase(),
        heading: HeadingLevel.HEADING_2,
      })
    );
    content.forEach(line => {
      if (line.startsWith("•") || line.startsWith("-")) {
        docElements.push(
          new Paragraph({
            text: line.replace(/^[-•]\s*/, ""),
            bullet: { level: 0 },
          })
        );
      } else {
        docElements.push(
          new Paragraph({
            text: line,
          })
        );
      }
    });
  };

  addSection("Summary", sections.summary);
  addSection("Experience", sections.experience);
  addSection("Education", sections.education);
  addSection("Skills", sections.skills);
  addSection("Additional Information", sections.additional);

  return docElements;
}
