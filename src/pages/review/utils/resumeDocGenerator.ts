import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";

// --- MAIN FUNCTION ---
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
          properties: {
            page: {
              margin: {
                top: 720,
                bottom: 720,
                left: 720,
                right: 720
              },
            },
          },
          children: createDocContent(sections),
        },
      ],
    });

    return await Packer.toBlob(doc);
  } catch (err) {
    console.error("DOCX generation failed:", err);
    return null;
  }
}

// --- PARSE TEXT INTO SECTION BUCKETS ---
function parseResumeIntoSections(text: string): Record<string, string[]> {
  const lines = text.split(/\n/).map(l => l.trim()).filter(Boolean);
  const sections: Record<string, string[]> = {
    header: [],
    summary: [],
    experience: [],
    education: [],
    skills: [],
    recognition: [],
    projects: [],
  };

  let current = "header";
  const headersMap: Record<string, string> = {
    "SUMMARY": "summary",
    "PROFESSIONAL SUMMARY": "summary",
    "PROFESSIONAL EXPERIENCE": "experience",
    "EXPERIENCE": "experience",
    "EDUCATION": "education",
    "KEY SKILLS": "skills",
    "SKILLS": "skills",
    "RECOGNITION": "recognition",
    "PROJECTS": "projects"
  };

  for (const line of lines) {
    const upper = line.toUpperCase();
    if (headersMap[upper]) {
      current = headersMap[upper];
      continue;
    }
    sections[current]?.push(line);
  }

  return sections;
}

// --- BUILD DOCX CONTENT ---
function createDocContent(sections: Record<string, string[]>): Paragraph[] {
  const content: Paragraph[] = [];

  // Header
  if (sections.header.length > 0) {
    const [name, ...rest] = sections.header;
    content.push(
      new Paragraph({
        children: [new TextRun({ text: name, bold: true, size: 32 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [new TextRun({ text: rest.join(" | "), size: 22 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );
  }

  const addSection = (title: string, items: string[], options: { isBullet?: boolean; isSingleParagraph?: boolean } = {}) => {
    if (!items.length) return;

    content.push(
      new Paragraph({
        text: title.toUpperCase(),
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 },
      })
    );

    if (options.isSingleParagraph) {
      content.push(
        new Paragraph({
          children: [new TextRun({ text: items.join(" "), size: 22 })],
          spacing: { after: 400 },
        })
      );
    } else if (options.isBullet) {
      items.forEach(item => {
        content.push(
          new Paragraph({
            text: item.replace(/^[-•]\s*/, ""),
            bullet: { level: 0 },
            spacing: { after: 100 },
          })
        );
      });
      content.push(new Paragraph({ spacing: { after: 400 } }));
    } else {
      items.forEach(item => {
        content.push(new Paragraph({ text: item, spacing: { after: 100 } }));
      });
      content.push(new Paragraph({ spacing: { after: 400 } }));
    }
  };

  addSection("Summary", sections.summary, { isSingleParagraph: true });
  addSection("Professional Experience", sections.experience, { isBullet: true });
  addSection("Key Skills", sections.skills, { isBullet: true });
  addSection("Education", sections.education);
  addSection("Recognition", sections.recognition, { isBullet: true });
  addSection("Projects", sections.projects, { isBullet: true });

  return content;
}
