interface ParsedResumeData {
  name: string;
  contact: string;
  summary: string[];
  skills: string[];
  experiences: {
    company: string;
    location: string;
    dates: string;
    title: string;
    bullets: string[];
  }[];
  education: string[];
}

export function parseResumeForPdf(currentResume: string): ParsedResumeData {
  const lines = currentResume.split("\n").map(line => line.trim()).filter(Boolean);

  let name = "Your Name";
  let contact = "";
  const summary: string[] = [];
  const skills: string[] = [];
  const experiences: ParsedResumeData["experiences"] = [];
  const education: string[] = [];

  let currentSection = "";

  for (const line of lines) {
    const cleanLine = line.trim();

    // Section Headers
    if (["PROFESSIONAL SUMMARY", "SUMMARY", "PROFILE"].includes(cleanLine.toUpperCase())) {
      currentSection = "summary";
      continue;
    }
    if (["KEY SKILLS", "SKILLS", "TECHNICAL SKILLS", "COMPETENCIES"].includes(cleanLine.toUpperCase())) {
      currentSection = "skills";
      continue;
    }
    if (["PROFESSIONAL EXPERIENCE", "EXPERIENCE", "WORK HISTORY", "EMPLOYMENT HISTORY"].includes(cleanLine.toUpperCase())) {
      currentSection = "experiences";
      continue;
    }
    if (["EDUCATION"].includes(cleanLine.toUpperCase())) {
      currentSection = "education";
      continue;
    }

    // Fallback logic
    if (!currentSection && cleanLine.includes("@")) {
      contact = cleanLine;
      continue;
    }

    if (!currentSection && name === "Your Name") {
      name = cleanLine;
      continue;
    }

    // Parsing sections
    if (currentSection === "summary") {
      summary.push(cleanLine);
    } else if (currentSection === "skills") {
      if (cleanLine.includes(",")) {
        skills.push(...cleanLine.split(",").map(s => s.trim()));
      } else {
        skills.push(cleanLine.replace(/^[-•*]\s*/, ""));
      }
    } else if (currentSection === "experiences") {
      if (cleanLine.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)/i)) {
        if (experiences.length > 0) {
          experiences[experiences.length - 1].dates = cleanLine;
        }
      } else if (cleanLine.startsWith("•") || cleanLine.startsWith("-") || cleanLine.startsWith("*")) {
        if (experiences.length > 0) {
          experiences[experiences.length - 1].bullets.push(cleanLine.replace(/^[-•*]\s*/, ""));
        }
      } else {
        experiences.push({
          company: cleanLine,
          location: "",
          dates: "",
          title: cleanLine,
          bullets: [],
        });
      }
    } else if (currentSection === "education") {
      education.push(cleanLine);
    }
  }

  return {
    name,
    contact,
    summary,
    skills,
    experiences,
    education
  };
}
