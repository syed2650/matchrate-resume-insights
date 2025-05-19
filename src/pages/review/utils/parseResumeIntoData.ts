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
  
  // Initialize the resume data structure
  const resumeData: ResumeData = {
    name: "",
    contact: "",
    summary: [],
    skills: [],
    experiences: [],
    education: [],
    recognition: []
  };

  // Simple section markers
  const sectionMarkers = {
    summary: /^SUMMARY$|^Professional Summary$|^Profile$/i,
    experience: /^EXPERIENCE$|^PROFESSIONAL EXPERIENCE$|^WORK EXPERIENCE$/i,
    education: /^EDUCATION$/i,
    skills: /^SKILLS$|^KEY SKILLS$/i,
    recognition: /^RECOGNITION$|^AWARDS$|^ACHIEVEMENTS$/i
  };

  // First extract name and contact info (usually the first 1-3 lines)
  if (lines.length > 0) {
    resumeData.name = lines[0];
    
    // Look for contact info in the next few lines
    for (let i = 1; i < Math.min(5, lines.length); i++) {
      if (lines[i].includes('@') || 
          lines[i].includes('•') || 
          lines[i].includes('|') || 
          /\d{3}[-.]?\d{3}[-.]?\d{4}/.test(lines[i])) {
        resumeData.contact = lines[i];
        break;
      }
    }
  }

  // Then process the rest of the content by sections
  let currentSection = "";
  let currentExperience: any = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Check if this line is a section header
    let foundSection = false;
    for (const [section, pattern] of Object.entries(sectionMarkers)) {
      if (pattern.test(line)) {
        currentSection = section;
        foundSection = true;
        break;
      }
    }
    
    if (foundSection) continue;
    
    // Process content based on current section
    switch (currentSection) {
      case "summary":
        resumeData.summary.push(line);
        break;
        
      case "skills":
        // Handle skills that might be in a list or comma-separated
        if (line.includes(',')) {
          const skillItems = line.split(',').map(s => s.trim());
          resumeData.skills.push(...skillItems);
        } else if (line.startsWith('•') || line.startsWith('-')) {
          resumeData.skills.push(line.substring(1).trim());
        } else if (!line.toLowerCase().includes('skills')) {
          resumeData.skills.push(line);
        }
        break;
        
      case "education":
        resumeData.education.push(line);
        break;
        
      case "recognition":
        resumeData.recognition.push(line);
        break;
        
      case "experience":
        // Try to detect if this is a new company/position
        const isDateLine = /\d{1,2}\/\d{4}\s*-\s*(\d{1,2}\/\d{4}|Present)|^\d{4}\s*-\s*(\d{4}|Present)/i.test(line);
        const isBulletPoint = line.startsWith('•') || line.startsWith('-');
        
        // If it looks like a company name (not a date, not a bullet)
        if (!isDateLine && !isBulletPoint && line.length > 0) {
          // If we have a previous experience, push it
          if (currentExperience) {
            resumeData.experiences.push(currentExperience);
          }
          
          // Start a new experience
          currentExperience = {
            company: line,
            title: "",
            location: "",
            dates: "",
            bullets: []
          };
          
          // Check if company has location in the same line (separated by comma or bullet)
          if (line.includes(',') || line.includes('•') || line.includes('|')) {
            const seperator = line.includes(',') ? ',' : (line.includes('•') ? '•' : '|');
            const parts = line.split(seperator).map(p => p.trim());
            
            currentExperience.company = parts[0];
            if (parts.length > 1) {
              // Last part might be a location
              currentExperience.location = parts[parts.length - 1];
            }
          }
        } 
        // If it looks like a date
        else if (isDateLine && currentExperience) {
          currentExperience.dates = line;
        }
        // If this is the next line after company (likely title)
        else if (currentExperience && !currentExperience.title) {
          currentExperience.title = line;
        }
        // If this is a bullet point
        else if (isBulletPoint && currentExperience) {
          currentExperience.bullets.push(line.substring(1).trim());
        }
        // Otherwise it's additional info
        else if (currentExperience) {
          // If we have bullets already, this might be a continuation
          if (currentExperience.bullets.length > 0) {
            currentExperience.bullets[currentExperience.bullets.length - 1] += " " + line;
          } 
          // Otherwise it might be part of the title
          else if (currentExperience.title) {
            currentExperience.title += " " + line;
          }
        }
        break;
    }
  }
  
  // Don't forget to add the last experience if it exists
  if (currentSection === "experience" && currentExperience) {
    resumeData.experiences.push(currentExperience);
  }

  // Set a fallback name if none was found
  if (!resumeData.name) {
    resumeData.name = "Resume";
  }
  
  return resumeData;
}
