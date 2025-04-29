
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

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect section headers
    if (line.match(/^SUMMARY$/i) || line.includes("SUMMARY")) {
      currentSection = "summary";
      continue;
    } else if (line.match(/^KEY SKILLS$/i) || line.includes("KEY SKILLS")) {
      currentSection = "skills";
      continue;
    } else if (line.match(/^PROFESSIONAL EXPERIENCE$/i) || line.includes("PROFESSIONAL EXPERIENCE")) {
      currentSection = "experience";
      continue;
    } else if (line.match(/^EDUCATION$/i) || line.includes("EDUCATION")) {
      currentSection = "education";
      continue;
    }
    
    // Process content based on current section
    if (currentSection === "header") {
      if (!name) {
        name = line;
      } else {
        contact += (contact ? " | " : "") + line;
      }
    } else if (currentSection === "summary") {
      summary.push(line);
    } else if (currentSection === "skills") {
      // Check if the line is a bullet point
      if (line.startsWith("•") || line.startsWith("-")) {
        skills.push(line.replace(/^[•-]\s*/, "").trim());
      } else {
        // Split by commas if it's a comma-separated list
        const skillItems = line.split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0);
        skills.push(...skillItems);
      }
    } else if (currentSection === "experience") {
      // Detect company/role lines - typically they're not bullet points and may contain a date pattern
      if (!line.startsWith("•") && !line.startsWith("-")) {
        // Check if this might be a new job entry (contains company name or dates)
        if (
          (i + 1 < lines.length && (lines[i + 1].startsWith("•") || lines[i + 1].startsWith("-"))) ||
          line.match(/\d{1,2}\/\d{4}/) || 
          line.match(/\d{4}\s*-\s*\d{4}/) ||
          line.match(/\bJan\b|\bFeb\b|\bMar\b|\bApr\b|\bMay\b|\bJun\b|\bJul\b|\bAug\b|\bSep\b|\bOct\b|\bNov\b|\bDec\b/)
        ) {
          // If we have an existing experience object, save it before creating a new one
          if (currentExperience) {
            experiences.push(currentExperience);
          }
          
          // Parse company name, location, title, and dates
          let company = "";
          let location = "";
          let title = "";
          let dates = "";
          
          // Try to extract dates (MM/YYYY - MM/YYYY format)
          const dateMatch = line.match(/(\d{1,2}\/\d{4}\s*-\s*\d{1,2}\/\d{4})|(\d{1,2}\/\d{4}\s*-\s*(present|current))|(\d{2}\/\d{4})|(\d{4}\s*-\s*\d{4})/i);
          if (dateMatch) {
            dates = dateMatch[0];
            // The rest is likely company and title
            const parts = line.replace(dates, "").split(/\s*[|,]\s*/);
            if (parts.length >= 2) {
              title = parts[0].trim();
              company = parts[1].trim();
            } else {
              company = parts[0].trim();
            }
          } else {
            // No date found, try to split by separator
            const parts = line.split(/\s*[|,]\s*/);
            if (parts.length >= 2) {
              title = parts[0].trim();
              company = parts[1].trim();
            } else {
              // If can't parse, just use as company name
              company = line.trim();
            }
          }
          
          currentExperience = { 
            company, 
            location, 
            title, 
            dates, 
            bullets: [] 
          };
        } else if (currentExperience) {
          // This might be additional info about the current experience
          if (!currentExperience.title) {
            currentExperience.title = line;
          } else if (!currentExperience.dates) {
            // Check if this line looks like dates
            if (line.match(/(\d{1,2}\/\d{4})/) || line.match(/\d{4}\s*-\s*\d{4}/) || 
                line.match(/\bJan\b|\bFeb\b|\bMar\b|\bApr\b|\bMay\b|\bJun\b|\bJul\b|\bAug\b|\bSep\b|\bOct\b|\bNov\b|\bDec\b/)) {
              currentExperience.dates = line;
            }
          }
        }
      } else {
        // This is a bullet point for the current experience
        if (currentExperience) {
          currentExperience.bullets.push(line.replace(/^[•-]\s*/, "").trim());
        }
      }
    } else if (currentSection === "education") {
      education.push(line.replace(/^[•-]\s*/, "").trim());
    }
  }

  // Add the last experience if it exists
  if (currentExperience) {
    experiences.push(currentExperience);
  }

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
    education: education.length > 0 ? education : ["Degree, Institution, Year"]
  };
}
