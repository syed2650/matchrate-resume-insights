
export interface ResumeData {
  name: string;
  contact: string;
  summary: string[];
  skills: string[];
  experiences: Array<{
    company: string;
    location?: string;
    dates: string;
    title: string;
    bullets: string[];
  }>;
  education: string[];
  recognition?: string[];
}

export function parseResumeIntoData(content: string): ResumeData {
  // Clean up the content
  content = content.replace(/\*\*/g, "").replace(/\{\.underline\}/g, "");

  const lines = content.split("\n").map(l => l.trim()).filter(l => l.length > 0);

  const sections = parseResumeIntoSections(content);

  const { name, contact } = extractHeaderInfo(sections.header || []);

  const summary = processTextSection(sections.summary || []);
  const skills = processSkillsSection(sections.skills || [], content);
  const education = processTextSection(sections.education || []);
  const recognition = processTextSection(sections.recognition || []);
  const experiences = extractExperiences(sections.experience || [], content);

  return {
    name: name || "Full Name",
    contact: contact || "Location | Phone | Email",
    summary: summary.length > 0 ? summary : ["Professional summary goes here."],
    skills: skills.length > 0 ? skills : ["Skill 1", "Skill 2", "Skill 3"],
    experiences: experiences.length > 0 ? experiences : [
      {
        company: "Company Name",
        title: "Job Title",
        dates: "MM/YYYY - Present",
        bullets: ["Responsibility 1", "Achievement 2"]
      }
    ],
    education: education.length > 0 ? education : ["Degree, Institution, Year"],
    recognition: recognition.length > 0 ? recognition : undefined
  };
}

// NEW version of this section parser
function parseResumeIntoSections(content: string): Record<string, string[]> {
  const lines = content.split("\n").map(line => line.trim()).filter(Boolean);
  const sections: Record<string, string[]> = {
    header: [],
    summary: [],
    skills: [],
    experience: [],
    education: [],
    recognition: [],
    other: []
  };

  const sectionTitles = {
    summary: /\bSUMMARY\b/i,
    skills: /\bKEY SKILLS\b/i,
    experience: /\b(PROFESSIONAL|WORK)?\s*EXPERIENCE\b/i,
    education: /\bEDUCATION\b/i,
    recognition: /\bRECOGNITION\b/i
  };

  let current = "header";
  for (const line of lines) {
    const normalized = line.toUpperCase();

    let matched = false;
    for (const [key, regex] of Object.entries(sectionTitles)) {
      if (regex.test(normalized)) {
        current = key;
        matched = true;
        break;
      }
    }

    if (!matched) {
      sections[current].push(line);
    }
  }

  return sections;
}

function extractHeaderInfo(headerLines: string[]): { name: string, contact: string } {
  let name = "";
  let contact = "";

  if (headerLines.length > 0) {
    name = headerLines[0].replace(/\*\*/g, "").trim();
    const contactLines = headerLines.slice(1).filter(line => {
      return line.includes("@") || line.includes("+") || /\d/.test(line) || line.includes("•") || line.includes("|");
    });
    contact = contactLines.join(" ").replace(/\s+\|\s+/g, " | ").trim();
  }

  return { name, contact };
}

function processTextSection(sectionLines: string[]): string[] {
  return sectionLines
    .filter(line => line.trim().length > 0)
    .map(line => line.replace(/^[•>-]\s*/, "").trim())
    .filter(line => line.length > 0);
}

function processSkillsSection(skillsLines: string[], fullContent: string): string[] {
  return skillsLines
    .filter(line => line.trim().length > 0)
    .flatMap(line => line.split(/[•,]/).map(s => s.trim()))
    .filter(skill => skill.length > 0 && skill.length < 100);
}

function extractExperiences(experienceLines: string[], fullContent: string): ResumeData["experiences"] {
  const experiences: ResumeData["experiences"] = [];
  let currentExperience: any = null;

  for (const line of experienceLines) {
    if (line.includes("|")) {
      if (currentExperience) experiences.push(currentExperience);
      const [title, company] = line.split("|").map(s => s.trim());
      currentExperience = { title, company, dates: "", bullets: [] };
    } else if (/\d{1,2}\/\d{4}/.test(line) || line.includes("Present")) {
      if (currentExperience) currentExperience.dates = line.trim();
    } else if (line.startsWith("•") || line.startsWith("-")) {
      if (currentExperience) currentExperience.bullets.push(line.replace(/^[-•]\s*/, "").trim());
    }
  }

  if (currentExperience) experiences.push(currentExperience);

  return experiences;
}
