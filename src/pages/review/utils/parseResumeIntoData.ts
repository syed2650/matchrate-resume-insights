
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
        // Check if this line looks like a job title (often starting with a capital letter)
        const possibleJobTitle = line.match(/^[A-Z][a-zA-Z\s]+/);
        
        // Detect new job position by looking for titles and company names
        if (possibleJobTitle && !line.startsWith('•') && !line.startsWith('-') && 
            !line.match(/^\d{1,2}\/\d{4}/) && !line.match(/^\d{4}/)) {
          
          // If we have a previous experience object, save it
          if (currentExperience) {
            resumeData.experiences.push(currentExperience);
          }
          
          // Create new experience object
          currentExperience = {
            company: "",
            title: line,  // This line looks like a job title
            location: "",
            dates: "",
            bullets: []
          };
        }
        // Check if this is a company name (often follows the job title)
        else if (currentExperience && !currentExperience.company && 
                !line.startsWith('•') && !line.startsWith('-')) {
          currentExperience.company = line;
          
          // Check if company includes location
          if (line.includes(',')) {
            const parts = line.split(',').map(p => p.trim());
            currentExperience.company = parts[0];
            currentExperience.location = parts.slice(1).join(', ');
          }
        }
        // Check if this is a date range
        else if (currentExperience && !currentExperience.dates && 
                (line.match(/^\d{1,2}\/\d{4}\s*[-–]\s*(\d{1,2}\/\d{4}|Present)/) || 
                 line.match(/^\d{4}\s*[-–]\s*(\d{4}|Present)/))) {
          currentExperience.dates = line;
        }
        // Check if this is a bullet point
        else if (currentExperience && (line.startsWith('•') || line.startsWith('-'))) {
          const bulletText = line.substring(1).trim();
          if (bulletText) {
            currentExperience.bullets.push(bulletText);
          }
        }
        // If line doesn't match any of the above patterns but we're in experience section
        else if (currentExperience) {
          // If bullets exist, this might be continuation of a bullet
          if (currentExperience.bullets.length > 0) {
            currentExperience.bullets[currentExperience.bullets.length - 1] += " " + line;
          }
          // If no bullets yet, this might be additional info about company/role
          else if (!currentExperience.dates) {
            currentExperience.dates = line;
          }
        }
        break;
    }
  }
  
  // Don't forget to add the last experience
  if (currentSection === "experience" && currentExperience) {
    resumeData.experiences.push(currentExperience);
  }

  // Set a fallback name if none was found
  if (!resumeData.name) {
    resumeData.name = "Resume";
  }
  
  return resumeData;
}
