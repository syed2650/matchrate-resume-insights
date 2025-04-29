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
  const lines = content.split("\n").map(l => l.trim()).filter(l => l.length > 0);

  let name = "";
  let contact = "";
  const summary: string[] = [];
  const skills: string[] = [];
  const experiences: ResumeData["experiences"] = [];
  const education: string[] = [];
  const recognition: string[] = [];

  let currentSection = "header";
  let currentExperience: any = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect section headers
    if ((line.toUpperCase().includes("SUMMARY") || line.match(/^\*\*\[SUMMARY\]\{\.underline\}\*\*$/)) && !line.includes("bullet")) {
      currentSection = "summary";
      continue;
    } else if ((line.toUpperCase().includes("KEY SKILLS") || line.match(/^\*\*\[KEY SKILLS\]\{\.underline\}\*\*$/)) && !line.includes("bullet")) {
      currentSection = "skills";
      continue;
    } else if ((line.toUpperCase().includes("PROFESSIONAL EXPERIENCE") || line.match(/^\*\*\[PROFESSIONAL EXPERIENCE\]\{\.underline\}\*\*$/)) && !line.includes("bullet")) {
      currentSection = "experience";
      continue;
    } else if ((line.toUpperCase().includes("EDUCATION") || line.match(/^\*\*\[EDUCATION\]\{\.underline\}\*\*$/)) && !line.includes("bullet")) {
      currentSection = "education";
      continue;
    } else if ((line.toUpperCase().includes("RECOGNITION") || line.match(/^\*\*\[RECOGNITION\]\{\.underline\}\*\*$/)) && !line.includes("bullet")) {
      currentSection = "recognition";
      continue;
    }
    
    // Process content based on current section
    if (currentSection === "header") {
      if (!name && !line.includes("_")) {
        name = line.replace(/\*\*/g, "").trim();
      } else if (!line.includes("_") && !line.includes("SUMMARY") && !line.includes("PROFESSIONAL")) {
        contact += (contact ? " | " : "") + line;
      }
    } else if (currentSection === "summary") {
      if (!line.includes("_") && !line.includes("PROFESSIONAL")) {
        summary.push(line.replace(/\*\*/g, "").trim());
      }
    } else if (currentSection === "skills") {
      // Check if the line is a bullet point
      if (line.startsWith("•") || line.startsWith("-")) {
        skills.push(line.replace(/^[•>-]\s*/, "").trim());
      } else if (!line.includes("EXPERIENCE") && !line.includes("EDUCATION")) {
        // Split by commas if it's a comma-separated list
        const skillItems = line.split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0);
        skills.push(...skillItems);
      }
    } else if (currentSection === "experience") {
      // Detect company/role lines - typically they're not bullet points and may contain a date pattern
      if (!line.startsWith("•") && !line.startsWith("-") && !line.startsWith(">")) {
        // Check if this might be a new job entry (contains company name or dates)
        if (
          line.includes("|") || 
          line.match(/\d{1,2}\/\d{4}/) || 
          line.match(/\d{4}\s*-\s*\d{4}/) ||
          line.match(/\bJan\b|\bFeb\b|\bMar\b|\bApr\b|\bMay\b|\bJun\b|\bJul\b|\bAug\b|\bSep\b|\bOct\b|\bNov\b|\bDec\b/) ||
          (i + 1 < lines.length && (lines[i + 1].startsWith("•") || lines[i + 1].startsWith("-")))
        ) {
          // If we have an existing experience object, save it before creating a new one
          if (currentExperience && currentExperience.company) {
            experiences.push(currentExperience);
          }
          
          // Parse company name, location, title, and dates
          let company = "";
          let location = "";
          let title = "";
          let dates = "";
          
          const lineCleaned = line.replace(/\*\*/g, "").trim();
          
          // Try to extract dates
          const dateMatch = lineCleaned.match(/(\d{1,2}\/\d{4}\s*-\s*\d{1,2}\/\d{4})|(\d{1,2}\/\d{4}\s*-\s*(present|current|Present))|((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*-\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})|((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*-\s*(Present|present|current|Current))/i);
          
          if (dateMatch) {
            dates = dateMatch[0];
            // The rest is likely company and title
            const remainder = lineCleaned.replace(dates, "");
            const parts = remainder.split(/\s*[|]\s*/);
            
            if (parts.length >= 2) {
              title = parts[0].trim();
              company = parts[1].trim();
            } else {
              // Try to parse based on common patterns
              if (remainder.toLowerCase().includes("senior") || 
                  remainder.toLowerCase().includes("analyst") || 
                  remainder.toLowerCase().includes("engineer") || 
                  remainder.toLowerCase().includes("specialist") ||
                  remainder.toLowerCase().includes("manager") ||
                  remainder.toLowerCase().includes("director")) {
                title = remainder.trim();
              } else {
                company = remainder.trim();
              }
            }
          } else {
            // No date found, try to split by separator
            const parts = lineCleaned.split(/\s*[|]\s*/);
            if (parts.length >= 2) {
              // Look for date patterns in the parts
              const datePart = parts.find(p => 
                p.match(/\d{1,2}\/\d{4}/) || 
                p.match(/\d{4}\s*-\s*\d{4}/) ||
                p.match(/\bJan\b|\bFeb\b|\bMar\b|\bApr\b|\bMay\b|\bJun\b|\bJul\b|\bAug\b|\bSep\b|\bOct\b|\bNov\b|\bDec\b/)
              );
              
              if (datePart) {
                dates = datePart;
                const otherParts = parts.filter(p => p !== datePart);
                if (otherParts.length >= 2) {
                  title = otherParts[0].trim();
                  company = otherParts[1].trim();
                } else if (otherParts.length === 1) {
                  // Try to guess if it's a title or company
                  if (otherParts[0].toLowerCase().includes("senior") || 
                      otherParts[0].toLowerCase().includes("analyst") || 
                      otherParts[0].toLowerCase().includes("engineer") || 
                      otherParts[0].toLowerCase().includes("specialist") ||
                      otherParts[0].toLowerCase().includes("manager") ||
                      otherParts[0].toLowerCase().includes("director")) {
                    title = otherParts[0].trim();
                  } else {
                    company = otherParts[0].trim();
                  }
                }
              } else {
                title = parts[0].trim();
                company = parts[1].trim();
              }
            } else {
              // If can't parse, just store as is and we'll try to fix it later
              const unknownPart = lineCleaned.trim();
              
              if (unknownPart.toLowerCase().includes("senior") || 
                  unknownPart.toLowerCase().includes("analyst") || 
                  unknownPart.toLowerCase().includes("engineer") || 
                  unknownPart.toLowerCase().includes("specialist") ||
                  unknownPart.toLowerCase().includes("manager") ||
                  unknownPart.toLowerCase().includes("director")) {
                title = unknownPart;
              } else {
                company = unknownPart;
              }
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
            currentExperience.title = line.replace(/\*\*/g, "").trim();
          } else if (!currentExperience.dates) {
            // Check if this line looks like dates
            if (line.match(/(\d{1,2}\/\d{4})/) || 
                line.match(/\d{4}\s*-\s*\d{4}/) || 
                line.match(/\bJan\b|\bFeb\b|\bMar\b|\bApr\b|\bMay\b|\bJun\b|\bJul\b|\bAug\b|\bSep\b|\bOct\b|\bNov\b|\bDec\b/)) {
              currentExperience.dates = line.replace(/\*\*/g, "").trim();
            }
          }
        }
      } else {
        // This is a bullet point for the current experience
        if (currentExperience) {
          currentExperience.bullets.push(line.replace(/^[•>-]\s*/, "").replace(/\*\*/g, "").trim());
        }
      }
    } else if (currentSection === "education") {
      if (!line.includes("RECOGNITION")) {
        education.push(line.replace(/^[•>-]\s*/, "").replace(/\*\*/g, "").trim());
      }
    } else if (currentSection === "recognition") {
      recognition.push(line.replace(/^[•>-]\s*/, "").replace(/\*\*/g, "").trim());
    }
  }

  // Add the last experience if it exists
  if (currentExperience && currentExperience.company) {
    experiences.push(currentExperience);
  }

  // Do some post-processing to fix missing info
  for (const exp of experiences) {
    // If title is empty but company is not, try to extract from company
    if (!exp.title && exp.company) {
      const parts = exp.company.split(/\s*[,|]\s*/);
      if (parts.length >= 2) {
        exp.title = parts[0].trim();
        exp.company = parts[1].trim();
      }
    }
    
    // If dates is empty but there's a date in company or title, extract it
    if (!exp.dates) {
      const titleDateMatch = exp.title.match(/(\d{1,2}\/\d{4}\s*-\s*\d{1,2}\/\d{4})|(\d{1,2}\/\d{4}\s*-\s*(present|current|Present))|((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*-\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})|((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*-\s*(Present|present|current|Current))/i);
      if (titleDateMatch) {
        exp.dates = titleDateMatch[0];
        exp.title = exp.title.replace(exp.dates, "").trim();
      }
      
      const companyDateMatch = exp.company.match(/(\d{1,2}\/\d{4}\s*-\s*\d{1,2}\/\d{4})|(\d{1,2}\/\d{4}\s*-\s*(present|current|Present))|((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*-\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})|((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*-\s*(Present|present|current|Current))/i);
      if (companyDateMatch) {
        exp.dates = companyDateMatch[0];
        exp.company = exp.company.replace(exp.dates, "").trim();
      }
    }
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
    education: education.length > 0 ? education : ["Degree, Institution, Year"],
    recognition: recognition.length > 0 ? recognition : undefined
  };
}
