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

  // Identify main sections first
  const sections = identifySections(content, lines);
  
  // Extract name and contact info from the header
  const { name, contact } = extractHeaderInfo(sections.header || []);
  
  // Process each section
  const summary = processTextSection(sections.summary || []);
  const skills = processSkillsSection(sections.skills || []);
  const education = processTextSection(sections.education || []);
  const recognition = processTextSection(sections.recognition || []);
  
  // Extract experiences with more flexible approach
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

// Identify all sections in the resume
function identifySections(content: string, lines: string[]): Record<string, string[]> {
  const sections: Record<string, string[]> = {
    header: []
  };
  
  // Common section header patterns
  const sectionPatterns = {
    summary: /\b(summary|profile|about|professional\s+summary|career\s+profile)\b/i,
    skills: /\b(skills|key\s+skills|technical\s+skills|core\s+competencies|expertise)\b/i,
    experience: /\b(experience|work\s+experience|professional\s+experience|employment|work\s+history)\b/i,
    education: /\b(education|academic|academic\s+background|qualifications)\b/i,
    recognition: /\b(recognition|awards|honors|achievements|certifications|credentials)\b/i
  };
  
  let currentSection = "header";
  let sectionStartIndices: Record<string, number> = {};
  
  // First pass - identify all section headers
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].replace(/[\*\[\]]/g, "").trim();
    
    // Skip separator lines
    if (/^[-_=]{3,}$/.test(line)) {
      continue;
    }
    
    // Check if this line is a section header
    let foundSection = false;
    for (const [section, pattern] of Object.entries(sectionPatterns)) {
      if (pattern.test(line) && !line.includes("@") && line.length < 50) {
        currentSection = section;
        sectionStartIndices[section] = i + 1; // Start collecting from next line
        foundSection = true;
        break;
      }
    }
    
    if (!foundSection && !sectionStartIndices[currentSection]) {
      // If we're still in the header and no section has been found yet
      if (currentSection === "header") {
        sections.header.push(line);
      }
    }
  }
  
  // Second pass - collect lines for each section
  currentSection = "header";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip separator lines
    if (/^[-_=]{3,}$/.test(line)) {
      continue;
    }
    
    // Check if we've hit a new section
    for (const [section, startIndex] of Object.entries(sectionStartIndices)) {
      if (i === startIndex - 1) { // This is a section header
        currentSection = section;
        // Don't include the section header itself
        continue;
      }
    }
    
    // If we're at a section start index, we've already updated the current section
    // Add this line to the current section
    if (i >= (sectionStartIndices[currentSection] || 0)) {
      if (!sections[currentSection]) {
        sections[currentSection] = [];
      }
      sections[currentSection].push(line);
    }
  }
  
  return sections;
}

// Extract name and contact info from header
function extractHeaderInfo(headerLines: string[]): { name: string, contact: string } {
  let name = "";
  let contact = "";
  
  if (headerLines.length > 0) {
    // First non-empty line is likely the name
    name = headerLines[0];
    
    // Look for contact info in the following lines
    const contactLines = headerLines.slice(1).filter(line => {
      // Contact info usually contains emails, phones, LinkedIn, etc.
      return /[@|)(\d-]/.test(line) || 
             /linkedin|github|phone|email|address|location/i.test(line) ||
             /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(line) ||
             /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(line);
    });
    
    contact = contactLines.join(" | ");
  }
  
  return { name, contact };
}

// Process text sections (summary, education, recognition)
function processTextSection(sectionLines: string[]): string[] {
  return sectionLines
    .filter(line => line.trim().length > 0)
    .map(line => line.replace(/^[•\-*>]\s*/, "").trim()) // Remove bullet points
    .filter(line => {
      // Filter out lines that look like section headers
      return !/^(summary|skills|experience|education|recognition|profile)$/i.test(line.trim());
    });
}

// Process skills section with bullet point handling
function processSkillsSection(skillsLines: string[]): string[] {
  // First, check if skills are presented as a comma-separated list
  const combinedText = skillsLines.join(" ");
  if (combinedText.includes(",") && (combinedText.split(",").length > 3)) {
    return combinedText
      .split(",")
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0 && !/(experience|company|education)/i.test(skill));
  }
  
  // Otherwise, treat each line or bullet point as a skill
  return skillsLines
    .map(line => line.replace(/^[•\-*>]\s*/, "").trim())
    .filter(skill => {
      return skill.length > 0 && 
             skill.length < 100 && // Most skills are relatively short
             !/(experience|degree|university|college|job title|position)/i.test(skill);
    });
}

// Extract work experiences with a more robust approach
function extractExperiences(experienceLines: string[], fullContent: string): ResumeData["experiences"] {
  const experiences: ResumeData["experiences"] = [];
  
  if (experienceLines.length === 0) return experiences;
  
  // Join the lines with line breaks to preserve formatting
  const experienceText = experienceLines.join("\n");
  
  // Try to identify experience blocks
  // Pattern 1: Look for company name followed by title and dates
  // This regex looks for patterns like:
  // Company Name, Location
  // Job Title | MM/YYYY - MM/YYYY
  const companyBlocks = experienceText.split(/\n\s*\n/);
  
  for (let i = 0; i < companyBlocks.length; i++) {
    const block = companyBlocks[i].trim();
    if (block.length === 0) continue;
    
    // Parse this block into an experience
    const experience = parseExperienceBlock(block);
    if (experience) {
      experiences.push(experience);
    }
  }
  
  // If we couldn't parse experiences with the block approach, try regex patterns
  if (experiences.length === 0) {
    // Look for date patterns to identify job entries
    const datePatterns = [
      /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)[a-z]* \d{4}\s*(-|–|to)\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)[a-z]* \d{4}|Present|Current\b/gi,
      /\b\d{1,2}\/\d{4}\s*(-|–|to)\s*\d{1,2}\/\d{4}|Present|Current\b/gi,
      /\b\d{4}\s*(-|–|to)\s*\d{4}|Present|Current\b/gi
    ];
    
    let dateMatches: RegExpMatchArray[] = [];
    
    // Try each date pattern
    for (const pattern of datePatterns) {
      dateMatches = Array.from(experienceText.matchAll(pattern));
      if (dateMatches.length > 0) break;
    }
    
    if (dateMatches.length > 0) {
      // Use date matches to split the experience section
      let lastIndex = 0;
      
      for (let i = 0; i < dateMatches.length; i++) {
        const match = dateMatches[i];
        if (!match.index) continue;
        
        // Find the company and title before this date
        const blockStart = i === 0 ? 0 : dateMatches[i-1].index! + dateMatches[i-1][0].length;
        const blockEnd = match.index + match.length;
        const contextBefore = experienceText.substring(Math.max(0, match.index - 150), match.index).trim();
        
        // Extract company and title from the text before the date
        const companyLine = extractCompanyLine(contextBefore);
        const titleLine = extractTitleLine(contextBefore, match[0]);
        
        // Extract bullet points that follow this date until the next date or end
        const nextDateIndex = i < dateMatches.length - 1 ? dateMatches[i+1].index : experienceText.length;
        const bulletsText = experienceText.substring(blockEnd, nextDateIndex).trim();
        const bullets = extractBulletPoints(bulletsText);
        
        // Add this experience if we have the minimum required info
        if (companyLine && match[0]) {
          experiences.push({
            company: companyLine.company,
            location: companyLine.location,
            title: titleLine || "Position",
            dates: match[0].replace(/\s+/g, " ").trim(),
            bullets: bullets.length > 0 ? bullets : ["Responsibilities and achievements"]
          });
        }
        
        lastIndex = nextDateIndex;
      }
    }
  }
  
  return experiences;
}

// Parse a block of text into an experience entry
function parseExperienceBlock(block: string): ResumeData["experiences"][0] | null {
  const lines = block.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length < 2) return null;
  
  // First line is likely company and possibly location
  const companyInfo = extractCompanyLine(lines[0]);
  
  // Look for date patterns in the first few lines
  let dateStr = "";
  let titleLine = "";
  
  // Date patterns to search for
  const datePatterns = [
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)[a-z]* \d{4}\s*(-|–|to)\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)[a-z]* \d{4}|Present|Current\b/i,
    /\b\d{1,2}\/\d{4}\s*(-|–|to)\s*\d{1,2}\/\d{4}|Present|Current\b/i,
    /\b\d{4}\s*(-|–|to)\s*\d{4}|Present|Current\b/i
  ];
  
  // Check the first few lines for date and title
  for (let i = 0; i < Math.min(4, lines.length); i++) {
    for (const pattern of datePatterns) {
      const match = lines[i].match(pattern);
      if (match) {
        dateStr = match[0];
        // If we find a date, the line with or before it is likely the title
        titleLine = i > 0 ? lines[i-1] : companyInfo.company;
        break;
      }
    }
    if (dateStr) break;
  }
  
  // If no date was found, look for key words suggesting a title
  if (!titleLine) {
    for (let i = 1; i < Math.min(3, lines.length); i++) {
      if (/\b(manager|engineer|developer|specialist|analyst|assistant|director|coordinator|associate)\b/i.test(lines[i])) {
        titleLine = lines[i];
        break;
      }
    }
  }
  
  // Extract bullet points from remaining lines
  const bullets = lines.slice(2).filter(line => 
    line.startsWith("•") || 
    line.startsWith("-") || 
    line.startsWith("*") || 
    /^\d+\./.test(line) ||
    /^[\s]*•/.test(line)
  ).map(line => line.replace(/^[•\-*\d.]\s*/, "").trim());
  
  // If there are no explicit bullet points, look for short sentences that might be achievements
  if (bullets.length === 0) {
    const possibleBullets = lines.slice(2).filter(line => 
      line.length > 15 && 
      line.length < 200 &&
      !line.includes("@") &&
      !datePatterns.some(pattern => pattern.test(line))
    );
    
    for (const line of possibleBullets) {
      bullets.push(line);
    }
  }
  
  return {
    company: companyInfo.company,
    location: companyInfo.location,
    title: titleLine || "Position",
    dates: dateStr || "Date range",
    bullets: bullets.length > 0 ? bullets : ["Responsibilities and achievements"]
  };
}

// Extract company and location from a line
function extractCompanyLine(line: string): { company: string, location?: string } {
  // Look for patterns like "Company Name - Location" or "Company Name, Location"
  const locationPatterns = [
    /^(.+?)[\s]*(?:[-–—,|]|in)[\s]*([A-Za-z\s]+(?:,\s*[A-Za-z]{2})?)$/,
    /^(.+?),\s*([A-Za-z\s]+(?:,\s*[A-Za-z]{2})?)$/
  ];
  
  for (const pattern of locationPatterns) {
    const match = line.match(pattern);
    if (match) {
      return {
        company: match[1].trim(),
        location: match[2].trim()
      };
    }
  }
  
  // If no location pattern found, just return the company
  return {
    company: line.split(/[-–—,|]/)[0].trim()
  };
}

// Extract job title from text
function extractTitleLine(text: string, dateStr: string): string {
  const lines = text.split("\n");
  
  // Look for common job title keywords
  const titleKeywords = /\b(manager|director|specialist|analyst|engineer|developer|consultant|associate|assistant|coordinator|lead|head|chief|officer|ceo|cto|cfo|vp|president)\b/i;
  
  // Check the last few lines for a likely job title
  for (let i = lines.length - 1; i >= Math.max(0, lines.length - 3); i--) {
    const line = lines[i].trim();
    
    if (titleKeywords.test(line) && 
        line.length < 100 && 
        !line.includes(dateStr) &&
        !/^(summary|skills|experience|education)/i.test(line)) {
      return line;
    }
  }
  
  // If no specific title found, return the last non-empty line as a guess
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim().length > 0 && 
        lines[i].trim().length < 100 &&
        !lines[i].includes(dateStr)) {
      return lines[i].trim();
    }
  }
  
  return "";
}

// Extract bullet points from a block of text
function extractBulletPoints(text: string): string[] {
  const bullets: string[] = [];
  const lines = text.split("\n");
  
  // Look for lines that start with bullet points, dashes, or numbers
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length === 0) continue;
    
    if (trimmed.startsWith("•") || 
        trimmed.startsWith("-") || 
        trimmed.startsWith("*") || 
        /^\d+\./.test(trimmed)) {
      bullets.push(trimmed.replace(/^[•\-*\d.]\s*/, "").trim());
    } else if (bullets.length > 0) {
      // If this line doesn't start with a bullet but follows a bullet point,
      // it might be a continuation of the previous bullet
      const lastBullet = bullets.pop()!;
      bullets.push(`${lastBullet} ${trimmed}`);
    } else if (trimmed.length > 15 && trimmed.length < 200) {
      // This might be a bullet point without a marker
      bullets.push(trimmed);
    }
  }
  
  return bullets;
}
