
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
  const lines = currentResume.split("\n").map(line => line.trim()).filter(Boolean);

  let name = "Your Name";
  let contact = "";
  const summary: string[] = [];
  const skills: string[] = [];
  const experiences: ResumeData["experiences"] = [];
  const education: string[] = [];
  const recognition: string[] = [];

  let currentSection = "";
  let currentExperience: ResumeData["experiences"][0] | null = null;

  for (const line of lines) {
    const cleanLine = line.trim();

    // Handle section headers with better detection
    const upperLine = cleanLine.toUpperCase();
    if (upperLine === "EDUCATION" || upperLine.includes("EDUCATION")) {
      currentSection = "education";
      continue;
    }
    if (upperLine === "PROFESSIONAL SUMMARY" || upperLine === "SUMMARY" || upperLine === "PROFILE") {
      currentSection = "summary";
      continue;
    }
    if (upperLine === "SKILLS" || upperLine === "KEY SKILLS" || upperLine === "TECHNICAL SKILLS") {
      currentSection = "skills";
      continue;
    }
    if (upperLine === "EXPERIENCE" || upperLine === "WORK EXPERIENCE" || upperLine === "PROFESSIONAL EXPERIENCE") {
      currentSection = "experience";
      continue;
    }
    if (upperLine === "RECOGNITION" || upperLine === "AWARDS" || upperLine === "ACHIEVEMENTS") {
      currentSection = "recognition";
      continue;
    }

    // Detect header information (name and contact)
    if (!currentSection) {
      if (name === "Your Name" && cleanLine.length > 0 && !cleanLine.includes("@") && !cleanLine.includes("•")) {
        name = cleanLine;
        continue;
      }
      if (cleanLine.includes("@") || cleanLine.includes("•") || cleanLine.includes("|")) {
        contact = cleanLine;
        continue;
      }
    }

    // Parse sections
    switch (currentSection) {
      case "education":
        if (cleanLine !== "") {
          education.push(cleanLine);
        }
        break;

      case "summary":
        if (cleanLine !== "") {
          summary.push(cleanLine);
        }
        break;

      case "skills":
        if (cleanLine !== "") {
          if (cleanLine.includes(",")) {
            skills.push(...cleanLine.split(",").map(s => s.trim()));
          } else if (cleanLine.startsWith("•") || cleanLine.startsWith("-")) {
            skills.push(cleanLine.replace(/^[•-]\s*/, "").trim());
          } else {
            skills.push(cleanLine);
          }
        }
        break;

      case "recognition":
        if (cleanLine !== "") {
          recognition.push(cleanLine);
        }
        break;

      case "experience":
        const datePattern = /(\d{1,2}\/\d{4}|Present)\s*(?:-|–|to)\s*(\d{1,2}\/\d{4}|Present)/i;
        const dateMatch = cleanLine.match(datePattern);

        if (dateMatch) {
          if (currentExperience) {
            currentExperience.dates = cleanLine;
          }
        } else if (cleanLine.startsWith("•") || cleanLine.startsWith("-")) {
          if (currentExperience) {
            currentExperience.bullets.push(cleanLine.replace(/^[•-]\s*/, ""));
          }
        } else if (cleanLine) {
          // New experience entry
          currentExperience = {
            company: cleanLine,
            location: "",
            dates: "",
            title: cleanLine,
            bullets: []
          };
          experiences.push(currentExperience);

          // Try to extract location if it exists (usually after a comma or bullet)
          const locationMatch = cleanLine.match(/[,•]\s*([^,•]+)$/);
          if (locationMatch) {
            currentExperience.location = locationMatch[1].trim();
            currentExperience.company = cleanLine.replace(locationMatch[0], "").trim();
          }
        }
        break;
    }
  }

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
