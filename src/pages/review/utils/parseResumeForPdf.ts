
interface ResumeData {
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
  recognition: string[];
}

export function parseResumeForPdf(currentResume: string): ResumeData {
  const lines = currentResume.split("\n").map(line => line.trim());

  let name = "";
  let contact = "";
  const summary: string[] = [];
  const skills: string[] = [];
  const experiences: ResumeData["experiences"] = [];
  const education: string[] = [];
  const recognition: string[] = [];

  let currentSection = "";
  let currentExperience: ResumeData["experiences"][0] | null = null;

  // First pass - identify the name from the first non-empty line
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] && !lines[i].includes('@') && !lines[i].includes('•') && !lines[i].includes('|')) {
      name = lines[i];
      break;
    }
  }

  // Second pass - identify contact info (usually after name, contains email, phone, LinkedIn, etc.)
  for (let i = 0; i < 5; i++) {
    if (lines[i] && (lines[i].includes('@') || lines[i].includes('•') || lines[i].includes('|'))) {
      contact = lines[i];
      break;
    }
  }

  // Main parsing pass
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Section detection using common resume section headers
    const upperLine = line.toUpperCase();
    if (upperLine === "EDUCATION" || upperLine.includes("EDUCATION")) {
      currentSection = "education";
      continue;
    }
    if (upperLine === "PROFESSIONAL SUMMARY" || upperLine === "SUMMARY" || upperLine === "PROFILE" || upperLine === "ABOUT") {
      currentSection = "summary";
      continue;
    }
    if (upperLine === "SKILLS" || upperLine === "KEY SKILLS" || upperLine === "TECHNICAL SKILLS" || upperLine.includes("SKILLS")) {
      currentSection = "skills";
      continue;
    }
    if (upperLine === "EXPERIENCE" || upperLine === "WORK EXPERIENCE" || upperLine === "PROFESSIONAL EXPERIENCE" || upperLine.includes("EXPERIENCE")) {
      currentSection = "experience";
      continue;
    }
    if (upperLine === "RECOGNITION" || upperLine === "AWARDS" || upperLine === "ACHIEVEMENTS" || upperLine.includes("RECOGNITION")) {
      currentSection = "recognition";
      continue;
    }

    // Parse sections based on current section
    switch (currentSection) {
      case "education":
        education.push(line);
        break;

      case "summary":
        summary.push(line);
        break;

      case "skills":
        if (line.includes(",")) {
          skills.push(...line.split(",").map(s => s.trim()).filter(Boolean));
        } else if (line.startsWith("•") || line.startsWith("-")) {
          skills.push(line.replace(/^[•-]\s*/, "").trim());
        } else if (!line.toUpperCase().includes("SKILLS")) {
          skills.push(line);
        }
        break;

      case "recognition":
        if (!line.toUpperCase().includes("RECOGNITION")) {
          recognition.push(line);
        }
        break;

      case "experience":
        // Check if line contains a date pattern (common in experience entries)
        const datePattern = /(\d{1,2}\/\d{4}|\d{4})\s*(?:-|–|to)\s*(\d{1,2}\/\d{4}|\d{4}|Present)/i;
        const dateMatch = line.match(datePattern);

        if (dateMatch && currentExperience) {
          // This is a date line for the current experience
          currentExperience.dates = line;
        } else if (line.startsWith("•") || line.startsWith("-")) {
          // This is a bullet point for the current experience
          if (currentExperience) {
            currentExperience.bullets.push(line.replace(/^[•-]\s*/, ""));
          }
        } else if (currentExperience && !currentExperience.title && currentExperience.company) {
          // This might be the title line (follows company line)
          currentExperience.title = line;
        } else {
          // New experience entry
          currentExperience = {
            company: line,
            location: "",
            dates: "",
            title: "",
            bullets: []
          };
          experiences.push(currentExperience);

          // Try to extract location if it exists (typically after a comma, hyphen, or bullet)
          const locationMatch = line.match(/[,•|-]\s*([^,•|-]+)$/);
          if (locationMatch) {
            currentExperience.location = locationMatch[1].trim();
            currentExperience.company = line.replace(locationMatch[0], "").trim();
          }
        }
        break;
    }
  }

  // If no name was found, provide a default
  if (!name) {
    name = "Your Name";
  }

  // Ensure experiences have titles
  experiences.forEach(exp => {
    if (!exp.title) {
      exp.title = exp.company;
    }
  });

  return {
    name,
    contact,
    summary,
    skills,
    experiences,
    education,
    recognition
  };
}
