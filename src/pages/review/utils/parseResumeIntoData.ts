
export interface ResumeData {
  name: string;
  contact: string;
  summary: string[];
  skills: string[];
  experiences: Array<{
    company: string;
    location: string;
    dates: string;
    title: string;
    bullets: string[];
  }>;
  education: string[];
}

export function parseResumeIntoData(content: string): ResumeData {
  const lines = content.split("\n").map(l => l.trim()).filter(l => l.length > 0);

  let name = "";
  let contact = "";
  const summary: string[] = [];
  const skills: string[] = [];
  const experiences: ResumeData["experiences"] = [];
  const education: string[] = [];

  let currentSection = "header";
  let currentExperience: any = null;

  lines.forEach((line) => {
    if (line.toUpperCase() === "PROFESSIONAL SUMMARY") {
      currentSection = "summary";
    } else if (line.toUpperCase() === "KEY SKILLS") {
      currentSection = "skills";
    } else if (line.toUpperCase() === "PROFESSIONAL EXPERIENCE") {
      currentSection = "experience";
    } else if (line.toUpperCase() === "EDUCATION") {
      currentSection = "education";
    } else {
      if (currentSection === "header") {
        if (!name) {
          name = line;
        } else {
          contact += (contact ? " | " : "") + line;
        }
      } else if (currentSection === "summary") {
        summary.push(line);
      } else if (currentSection === "skills") {
        const skillItems = line.split(/[•,]/).map(s => s.trim()).filter(s => s.length > 0);
        skills.push(...skillItems);
      } else if (currentSection === "experience") {
        if (line.includes("•")) {
          const [company, location] = line.split("•").map(l => l.trim());
          if (currentExperience) experiences.push(currentExperience);
          currentExperience = { company, location, dates: "", title: "", bullets: [] };
        } else if (/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(line)) {
          if (currentExperience) currentExperience.dates = line;
        } else if (line.startsWith("•") || line.startsWith("-")) {
          if (currentExperience) {
            currentExperience.bullets.push(line.replace(/^[-•]\s*/, ""));
          }
        } else {
          if (currentExperience) {
            currentExperience.title = line;
          }
        }
      } else if (currentSection === "education") {
        education.push(line);
      }
    }
  });

  if (currentExperience) {
    experiences.push(currentExperience);
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
