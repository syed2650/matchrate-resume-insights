
import { ResumeData, ContactInfo, ParsedResume } from './standardResumeTemplate';

/**
 * Parses a raw resume text into structured data
 */
export function parseResumeText(text: string): ParsedResume {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  const resumeData: ResumeData = {
    header: extractContactInfo(lines),
    summary: extractSummary(lines, text),
    experience: extractExperience(lines, text),
    education: extractEducation(lines, text),
    skills: extractSkills(lines, text),
    certifications: extractCertifications(lines, text),
    projects: extractProjects(lines, text),
    volunteering: extractVolunteering(lines, text)
  };

  // Extract job title if present (usually after name)
  resumeData.jobTitle = extractJobTitle(lines, text);

  return {
    data: resumeData,
    rawText: text
  };
}

/**
 * Extract contact information from the resume
 */
function extractContactInfo(lines: string[]): ContactInfo {
  // Typically the first line is the name
  const name = lines[0];
  
  // Look for contact info in the first few lines
  const contactLines = lines.slice(1, 5);
  const contactText = contactLines.join(' ');
  
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i;
  const phoneRegex = /(\+?[0-9\s-]{10,15})/;
  const linkedinRegex = /(linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i;
  const websiteRegex = /(www\.[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i;
  const locationRegex = /(.*?),\s*(.*?)(?:\s*[•|\|]|$)/;
  
  const email = contactText.match(emailRegex)?.[0] || '';
  const phone = contactText.match(phoneRegex)?.[0] || '';
  const linkedin = contactText.match(linkedinRegex)?.[0] || '';
  const website = contactText.match(websiteRegex)?.[0] || '';
  const locationMatch = contactText.match(locationRegex);
  const location = locationMatch ? locationMatch[0].split(/[•|]/)[0].trim() : '';
  
  return {
    name,
    location,
    phone,
    email,
    linkedin,
    website
  };
}

/**
 * Extract job title if present
 */
function extractJobTitle(lines: string[], fullText: string): string {
  // Usually the job title appears right after the name and before the summary
  // Look for it in the first 10 lines
  const potentialTitles = lines.slice(1, 10);
  
  for (const line of potentialTitles) {
    // Job titles often contain words like "Manager", "Engineer", "Specialist", etc.
    if (/(Manager|Engineer|Specialist|Consultant|Director|Analyst|Developer|Designer|Coordinator|Assistant|Lead|Head|Chief|Officer)/i.test(line) &&
        line.length < 60 && // Not too long
        !line.includes('@') && // Not an email
        !line.includes('http') && // Not a website
        !line.includes('•') && // Not a bullet point
        !(/\d{4}/).test(line)) { // Not a date
      return line;
    }
  }
  
  return '';
}

/**
 * Extract summary section
 */
function extractSummary(lines: string[], fullText: string): string[] {
  const summarySection = extractSection(fullText, 'summary', 'experience');
  if (!summarySection) return [];
  
  return summarySection
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.toLowerCase().includes('summary'));
}

/**
 * Extract experience section and parse into structured format
 */
function extractExperience(lines: string[], fullText: string): ResumeData['experience'] {
  const experienceSection = extractSection(fullText, 'experience', 'education');
  if (!experienceSection) return [];
  
  const experiences: ResumeData['experience'] = [];
  
  // Split by double line breaks or potential company names (companies often have dates on the same line)
  const blocks = experienceSection.split(/\n\n+|(?=\n[A-Z][A-Za-z\s&]+\n)/);
  
  for (const block of blocks) {
    if (!block.trim() || block.toLowerCase().includes('experience')) continue;
    
    const lines = block.split('\n').map(line => line.trim()).filter(Boolean);
    if (lines.length < 2) continue;
    
    let company = '';
    let title = '';
    let location = '';
    let dates = '';
    const bullets: string[] = [];
    
    // First line is often company or title
    let firstLine = lines[0];
    
    // Check if it contains a date pattern
    const dateRegex = /(0?[1-9]|1[0-2])\/\d{4}\s*(?:-|–|to)\s*(0?[1-9]|1[0-2])\/\d{4}|(0?[1-9]|1[0-2])\/\d{4}\s*(?:-|–|to)\s*Present/i;
    const dateMatch = firstLine.match(dateRegex);
    
    if (dateMatch) {
      // If first line has dates, it's likely "Company - Location [tab] Dates"
      const parts = firstLine.split(/\s{2,}|\t/);
      company = parts[0].split(/\s*(?:-|–|•)\s*/)[0].trim();
      
      if (parts[0].includes('-') || parts[0].includes('–') || parts[0].includes('•')) {
        location = parts[0].split(/\s*(?:-|–|•)\s*/)[1]?.trim() || '';
      }
      
      dates = parts.length > 1 ? parts[parts.length - 1].trim() : '';
      
      // Next line is likely the title
      if (lines.length > 1) {
        title = lines[1];
      }
      
      // Bullets start from line 2
      for (let i = 2; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('•') || line.startsWith('-')) {
          bullets.push(line.substring(1).trim());
        } else if (bullets.length > 0) {
          // Continuation of previous bullet
          bullets[bullets.length - 1] += ' ' + line;
        } else {
          // This could be part of the title or a non-bulleted description
          title += ' ' + line;
        }
      }
    } else {
      // First line might be the company
      company = firstLine;
      
      // Second line might be the title
      if (lines.length > 1) {
        // Check if second line has dates
        const secondDateMatch = lines[1].match(dateRegex);
        
        if (secondDateMatch) {
          const parts = lines[1].split(/\s{2,}|\t/);
          title = parts[0].trim();
          dates = parts.length > 1 ? parts[parts.length - 1].trim() : '';
        } else {
          title = lines[1];
          
          // Third line might have dates
          if (lines.length > 2) {
            const thirdDateMatch = lines[2].match(dateRegex);
            
            if (thirdDateMatch) {
              dates = lines[2];
            }
          }
        }
      }
      
      // Bullets start after title and dates
      let bulletStart = 2;
      if (lines.length > 2 && lines[2].match(dateRegex)) {
        bulletStart = 3;
      }
      
      for (let i = bulletStart; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('•') || line.startsWith('-')) {
          bullets.push(line.substring(1).trim());
        } else if (bullets.length > 0) {
          // Continuation of previous bullet
          bullets[bullets.length - 1] += ' ' + line;
        }
      }
    }
    
    // Only add if we have at least a company and title
    if (company && title) {
      experiences.push({
        company,
        title,
        location,
        dates,
        bullets
      });
    }
  }
  
  return experiences;
}

/**
 * Extract education section
 */
function extractEducation(lines: string[], fullText: string): ResumeData['education'] {
  const educationSection = extractSection(fullText, 'education', 'skills|certifications|projects|volunteering');
  if (!educationSection) return [];
  
  const education: ResumeData['education'] = [];
  
  // Split by double line breaks or educational institution patterns
  const blocks = educationSection.split(/\n\n+|(?=\n[A-Z][A-Za-z\s&]+\n)/);
  
  for (const block of blocks) {
    if (!block.trim() || block.toLowerCase().includes('education')) continue;
    
    const lines = block.split('\n').map(line => line.trim()).filter(Boolean);
    if (lines.length < 1) continue;
    
    let degree = '';
    let institution = '';
    let location = '';
    let dates = '';
    const details: string[] = [];
    
    // First line could be degree or institution
    const firstLine = lines[0];
    
    // If it contains common degree abbreviations, it's likely the degree
    if (/\b(BS|BA|MS|MA|PhD|MBA|BSc|MSc|BBA|MEng|BEng)\b/i.test(firstLine)) {
      degree = firstLine;
      
      // Second line is likely the institution
      if (lines.length > 1) {
        institution = lines[1];
      }
    } else {
      // First line is likely the institution
      institution = firstLine;
      
      // Second line might be the degree
      if (lines.length > 1) {
        degree = lines[1];
      }
    }
    
    // Check for dates in any line
    const dateRegex = /(0?[1-9]|1[0-2])\/\d{4}\s*(?:-|–|to)\s*(0?[1-9]|1[0-2])\/\d{4}|(0?[1-9]|1[0-2])\/\d{4}\s*(?:-|–|to)\s*Present|\d{4}\s*(?:-|–|to)\s*\d{4}|\d{4}/i;
    
    for (let i = 0; i < lines.length; i++) {
      const dateMatch = lines[i].match(dateRegex);
      
      if (dateMatch) {
        dates = lines[i];
        
        // If this line contains both location and dates, split them
        if (lines[i].includes(',') && !lines[i].startsWith('20')) {
          const parts = lines[i].split(/,\s*/);
          if (parts.length > 1) {
            location = parts[0];
            dates = parts.slice(1).join(', ');
          }
        }
        
        // Don't include this line as a detail
        continue;
      }
      
      // Check for location if not found
      if (!location && i > 1 && lines[i].includes(',') && !lines[i].startsWith('•') && !lines[i].startsWith('-')) {
        location = lines[i];
        continue;
      }
      
      // Add any other lines as details
      if (i > 1 && !lines[i].includes(degree) && !lines[i].includes(institution)) {
        if (lines[i].startsWith('•') || lines[i].startsWith('-')) {
          details.push(lines[i].substring(1).trim());
        } else if (!lines[i].match(/education|university|college|school/i)) {
          details.push(lines[i]);
        }
      }
    }
    
    // Only add if we have at least an institution
    if (institution) {
      education.push({
        degree,
        institution,
        location,
        dates,
        details: details.length > 0 ? details : undefined
      });
    }
  }
  
  return education;
}

/**
 * Extract skills section
 */
function extractSkills(lines: string[], fullText: string): ResumeData['skills'] {
  const skillsSection = extractSection(fullText, 'skills', 'certifications|projects|volunteering|education');
  if (!skillsSection) return { technical: [], soft: [] };
  
  const skillLines = skillsSection
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.toLowerCase().includes('skills'));
  
  // Check if skills are already categorized
  const technicalHeader = skillLines.findIndex(line => 
    /technical|tools|technologies|programming|software|hard skills/i.test(line)
  );
  
  const softHeader = skillLines.findIndex(line => 
    /soft|personal|interpersonal|communication/i.test(line)
  );
  
  let technical: string[] = [];
  let soft: string[] = [];
  let other: string[] = [];
  
  if (technicalHeader !== -1 || softHeader !== -1) {
    // Skills are categorized, extract accordingly
    if (technicalHeader !== -1) {
      const nextHeader = softHeader !== -1 && softHeader > technicalHeader ? softHeader : skillLines.length;
      
      technical = extractBulletList(skillLines.slice(technicalHeader + 1, nextHeader));
    }
    
    if (softHeader !== -1) {
      const nextHeader = technicalHeader !== -1 && technicalHeader > softHeader ? technicalHeader : skillLines.length;
      
      soft = extractBulletList(skillLines.slice(softHeader + 1, nextHeader));
    }
  } else {
    // Not categorized, try to guess based on common technical vs soft skills
    const allSkills = extractBulletList(skillLines);
    
    const technicalKeywords = /\b(SQL|Python|Java|JavaScript|TypeScript|React|Angular|Vue|Node|Express|Git|API|AWS|Azure|Cloud|DevOps|Docker|Kubernetes|HTML|CSS|PHP|Ruby|C\+\+|C#|Swift|Kotlin|R|Tableau|Power BI|Excel|SPSS|MATLAB|SAP|Oracle|MongoDB|PostgreSQL|MySQL|NoSQL|Linux|Windows|MacOS|iOS|Android|Mobile|Web|Frontend|Backend|Fullstack|UI|UX|SEO|SEM|PPC|CRM|ERP|Agile|Scrum|Waterfall|Jira|Confluence|Salesforce|HubSpot|Adobe|Photoshop|Illustrator|InDesign|Figma|Sketch)\b/i;
    
    const softKeywords = /\b(Communication|Leadership|Teamwork|Problem.Solving|Critical.Thinking|Decision.Making|Time.Management|Adaptability|Flexibility|Creativity|Innovation|Emotional.Intelligence|Interpersonal|Presentation|Public.Speaking|Writing|Editing|Negotiation|Conflict.Resolution|Customer.Service|Project.Management|Organization|Planning|Mentoring|Coaching|Training|Strategy|Analysis|Research|Collaboration)\b/i;
    
    technical = allSkills.filter(skill => technicalKeywords.test(skill));
    soft = allSkills.filter(skill => softKeywords.test(skill) && !technical.includes(skill));
    other = allSkills.filter(skill => !technical.includes(skill) && !soft.includes(skill));
  }
  
  return {
    technical,
    soft,
    other: other.length > 0 ? other : undefined
  };
}

/**
 * Extract certifications section
 */
function extractCertifications(lines: string[], fullText: string): ResumeData['certifications'] {
  const certificationsSection = extractSection(fullText, 'certifications', 'projects|volunteering|skills|education');
  if (!certificationsSection) return undefined;
  
  const certLines = certificationsSection
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.toLowerCase().includes('certification'));
  
  const certifications: ResumeData['certifications'] = [];
  
  // Process each line or block of certifications
  let currentCert: { name: string; issuer?: string; date?: string } = { name: '' };
  
  for (let i = 0; i < certLines.length; i++) {
    const line = certLines[i];
    
    // Check if this is a new certification (typically starts with a name)
    if (line && !line.startsWith('•') && !line.startsWith('-') && 
        (i === 0 || certLines[i-1] === '' || i === certLines.length-1 || 
        line.match(/^[A-Z]/) || line.includes('Certification'))) {
      
      // Save the previous certification if it exists
      if (currentCert.name && i > 0) {
        certifications.push({ ...currentCert });
      }
      
      // Start a new certification
      currentCert = { name: line };
      
      // Check if the line includes both name and issuer
      if (line.includes('-') || line.includes('–') || line.includes('|')) {
        const parts = line.split(/\s*(?:-|–|\|)\s*/);
        currentCert.name = parts[0].trim();
        currentCert.issuer = parts[1]?.trim();
      }
      
      // Check for dates in the line
      const dateMatch = line.match(/\b(0?[1-9]|1[0-2])\/\d{4}\b|\b\d{4}\b/);
      if (dateMatch) {
        currentCert.date = dateMatch[0];
        
        // Remove date from name if it's there
        currentCert.name = currentCert.name.replace(dateMatch[0], '').trim();
        currentCert.name = currentCert.name.replace(/\s*(?:-|–|\|)\s*$/, '').trim();
      }
    }
    // Check if this line has a date
    else if (line && !currentCert.date) {
      const dateMatch = line.match(/\b(0?[1-9]|1[0-2])\/\d{4}\b|\b\d{4}\b/);
      if (dateMatch) {
        currentCert.date = dateMatch[0];
      } else if (!currentCert.issuer && (line.includes('Issued by') || !line.startsWith('•'))) {
        currentCert.issuer = line;
      }
    }
  }
  
  // Add the last certification if it exists
  if (currentCert.name) {
    certifications.push(currentCert);
  }
  
  return certifications.length > 0 ? certifications : undefined;
}

/**
 * Extract projects section
 */
function extractProjects(lines: string[], fullText: string): ResumeData['projects'] {
  const projectsSection = extractSection(fullText, 'projects', 'volunteering|certifications|skills|education');
  if (!projectsSection) return undefined;
  
  const projectLines = projectsSection
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.toLowerCase().includes('project'));
  
  const projects: ResumeData['projects'] = [];
  
  // Process each project block
  let currentProject: { name: string; description?: string; url?: string; dates?: string; bullets?: string[] } | null = null;
  let bullets: string[] = [];
  
  for (let i = 0; i < projectLines.length; i++) {
    const line = projectLines[i];
    
    // Check if this is a new project (typically starts with a name)
    if (line && !line.startsWith('•') && !line.startsWith('-') && 
        (i === 0 || projectLines[i-1] === '' || line.match(/^[A-Z]/))) {
      
      // Save the previous project if it exists
      if (currentProject) {
        if (bullets.length > 0) {
          currentProject.bullets = [...bullets];
        }
        projects.push({ ...currentProject });
        bullets = [];
      }
      
      // Start a new project
      currentProject = { name: line };
      
      // Check if the line includes a URL
      const urlMatch = line.match(/(https?:\/\/[^\s]+)|(www\.[^\s]+)/);
      if (urlMatch) {
        currentProject.url = urlMatch[0];
        currentProject.name = line.replace(urlMatch[0], '').trim();
        currentProject.name = currentProject.name.replace(/\s*(?:-|–|\|)\s*$/, '').trim();
      }
      
      // Check for dates in the line
      // Fixed: Use a safer date regex pattern
      const dateRegex = /(0?[1-9]|1[0-2])\/\d{4}\s*(?:-|–|to)\s*(0?[1-9]|1[0-2])\/\d{4}|(0?[1-9]|1[0-2])\/\d{4}\s*(?:-|–|to)\s*Present|\d{4}\s*(?:-|–|to)\s*\d{4}|\d{4}-\d{2}|\d{4}/i;
      const dateMatch = line.match(dateRegex);
      
      if (dateMatch) {
        currentProject.dates = dateMatch[0];
        currentProject.name = currentProject.name.replace(dateMatch[0], '').trim();
        currentProject.name = currentProject.name.replace(/\s*(?:-|–|\|)\s*$/, '').trim();
      }
    }
    // Check if this is a bullet point for the current project
    else if (line && (line.startsWith('•') || line.startsWith('-'))) {
      bullets.push(line.substring(1).trim());
    }
    // This might be a description or other information
    else if (line && currentProject && !currentProject.description) {
      // Check if it's a URL
      const urlMatch = line.match(/(https?:\/\/[^\s]+)|(www\.[^\s]+)/);
      if (urlMatch) {
        currentProject.url = urlMatch[0];
      }
      // Check if it's a date
      else {
        // Fixed: Use a safer date regex pattern
        const dateRegex = /(0?[1-9]|1[0-2])\/\d{4}\s*(?:-|–|to)\s*(0?[1-9]|1[0-2])\/\d{4}|(0?[1-9]|1[0-2])\/\d{4}\s*(?:-|–|to)\s*Present|\d{4}\s*(?:-|–|to)\s*\d{4}|\d{4}/i;
        const dateMatch = line.match(dateRegex);
        
        if (dateMatch) {
          currentProject.dates = dateMatch[0];
        } else {
          currentProject.description = line;
        }
      }
    }
    // Continuation of bullets or other information
    else if (line && bullets.length > 0) {
      bullets[bullets.length - 1] += ' ' + line;
    }
  }
  
  // Add the last project if it exists
  if (currentProject) {
    if (bullets.length > 0) {
      currentProject.bullets = [...bullets];
    }
    projects.push(currentProject);
  }
  
  return projects.length > 0 ? projects : undefined;
}

/**
 * Extract volunteering section
 */
function extractVolunteering(lines: string[], fullText: string): ResumeData['volunteering'] {
  const volunteeringSection = extractSection(fullText, 'volunteering|leadership', 'projects|certifications|skills|education');
  if (!volunteeringSection) return undefined;
  
  const volunteeringLines = volunteeringSection
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.toLowerCase().includes('volunteer') && !line.toLowerCase().includes('leadership'));
  
  const volunteering: ResumeData['volunteering'] = [];
  
  // Process each volunteering block
  let currentRole: { organization: string; role: string; location?: string; dates?: string; bullets?: string[] } | null = null;
  let bullets: string[] = [];
  
  for (let i = 0; i < volunteeringLines.length; i++) {
    const line = volunteeringLines[i];
    
    // Check if this is a new volunteering role
    if (line && !line.startsWith('•') && !line.startsWith('-') && 
        (i === 0 || volunteeringLines[i-1] === '' || line.match(/^[A-Z]/))) {
      
      // Save the previous role if it exists
      if (currentRole) {
        if (bullets.length > 0) {
          currentRole.bullets = [...bullets];
        }
        volunteering.push({ ...currentRole });
        bullets = [];
      }
      
      // Start a new role
      currentRole = { organization: line, role: '' };
      
      // Check for a second line that might be the role title
      if (i + 1 < volunteeringLines.length && !volunteeringLines[i+1].startsWith('•') && !volunteeringLines[i+1].startsWith('-')) {
        currentRole.role = volunteeringLines[i+1];
        i++; // Skip the next line since we've processed it
      }
      
      // Check for location in the organization name (often formatted as "Organization • Location")
      if (line.includes('•')) {
        const parts = line.split('•').map(p => p.trim());
        currentRole.organization = parts[0];
        
        // The last part might be a date
        const lastPart = parts[parts.length - 1];
        // Fixed: Use a safer date regex pattern
        const dateRegex = /(0?[1-9]|1[0-2])\/\d{4}\s*(?:-|–|to)\s*(0?[1-9]|1[0-2])\/\d{4}|(0?[1-9]|1[0-2])\/\d{4}\s*(?:-|–|to)\s*Present|\d{4}\s*(?:-|–|to)\s*\d{4}|\d{4}/i;
        const dateMatch = lastPart.match(dateRegex);
        
        if (dateMatch) {
          currentRole.dates = lastPart;
          // If there are more than 2 parts, the middle one is likely the location
          if (parts.length > 2) {
            currentRole.location = parts[1];
          }
        } else {
          currentRole.location = lastPart;
        }
      }
      
      // Check for dates in the current line or the role line
      // Fixed: Use a safer date regex pattern
      const dateRegex = /(0?[1-9]|1[0-2])\/\d{4}\s*(?:-|–|to)\s*(0?[1-9]|1[0-2])\/\d{4}|(0?[1-9]|1[0-2])\/\d{4}\s*(?:-|–|to)\s*Present|\d{4}\s*(?:-|–|to)\s*\d{4}|\d{4}/i;
      const dateMatch = (currentRole.role || line).match(dateRegex);
      
      if (dateMatch) {
        currentRole.dates = dateMatch[0];
        
        // Remove date from role if it's there
        if (currentRole.role) {
          currentRole.role = currentRole.role.replace(dateMatch[0], '').trim();
        }
      }
    }
    // Check if this is a bullet point for the current role
    else if (line && (line.startsWith('•') || line.startsWith('-'))) {
      bullets.push(line.substring(1).trim());
    }
    // This might be additional information
    else if (line && currentRole) {
      // Check if it's a date
      // Fixed: Use a safer date regex pattern
      const dateRegex = /(0?[1-9]|1[0-2])\/\d{4}\s*(?:-|–|to)\s*(0?[1-9]|1[0-2])\/\d{4}|(0?[1-9]|1[0-2])\/\d{4}\s*(?:-|–|to)\s*Present|\d{4}\s*(?:-|–|to)\s*\d{4}|\d{4}/i;
      const dateMatch = line.match(dateRegex);
      
      if (dateMatch && !currentRole.dates) {
        currentRole.dates = line;
      }
      // Check if it's a location
      else if (line.includes(',') && !currentRole.location) {
        currentRole.location = line;
      }
      // If the role is empty, this might be the role
      else if (!currentRole.role) {
        currentRole.role = line;
      }
    }
    // Continuation of bullets
    else if (line && bullets.length > 0) {
      bullets[bullets.length - 1] += ' ' + line;
    }
  }
  
  // Add the last role if it exists
  if (currentRole) {
    // If role is empty but we have an organization, use the organization as the role
    if (!currentRole.role && currentRole.organization) {
      currentRole.role = "Volunteer";
    }
    
    if (bullets.length > 0) {
      currentRole.bullets = [...bullets];
    }
    volunteering.push(currentRole);
  }
  
  return volunteering.length > 0 ? volunteering : undefined;
}

/**
 * Extract a section from the full text
 */
function extractSection(fullText: string, sectionName: string, nextSectionPattern?: string): string | null {
  const sectionRegex = new RegExp(`(?:^|\\n)(?:\\[${sectionName}\\]|${sectionName})(?:\\s|\\n)`, 'i');
  const sectionMatch = fullText.match(sectionRegex);
  
  if (!sectionMatch) return null;
  
  const sectionStart = sectionMatch.index! + sectionMatch[0].length;
  let sectionEnd = fullText.length;
  
  if (nextSectionPattern) {
    const nextSectionRegex = new RegExp(`(?:^|\\n)(?:\\[${nextSectionPattern}\\]|${nextSectionPattern})(?:\\s|\\n)`, 'i');
    const nextSectionMatch = fullText.substring(sectionStart).match(nextSectionRegex);
    
    if (nextSectionMatch) {
      sectionEnd = sectionStart + nextSectionMatch.index!;
    }
  }
  
  return fullText.substring(sectionStart, sectionEnd).trim();
}

/**
 * Extract bullet points from lines
 */
function extractBulletList(lines: string[]): string[] {
  const result: string[] = [];
  
  for (const line of lines) {
    if (line.startsWith('•') || line.startsWith('-')) {
      result.push(line.substring(1).trim());
    } else if (line.includes('•')) {
      // Split by bullet points
      const parts = line.split('•').map(p => p.trim()).filter(Boolean);
      result.push(...parts);
    } else if (line.includes(',')) {
      // Split by commas
      const parts = line.split(',').map(p => p.trim()).filter(Boolean);
      result.push(...parts);
    } else if (!line.match(/technical|soft|skills|proficiencies/i)) {
      // Just add the whole line
      result.push(line);
    }
  }
  
  return result.filter(Boolean);
}

/**
 * Formats the raw resume into a consistent plain text format
 */
export function formatResumeContent(parseResult: ParsedResume): string {
  const { data } = parseResult;
  let content = '';
  
  // Header
  content += `${data.header.name}\n`;
  
  // Contact info
  const contactParts = [];
  if (data.header.location) contactParts.push(data.header.location);
  if (data.header.phone) contactParts.push(data.header.phone);
  if (data.header.email) contactParts.push(data.header.email);
  if (data.header.linkedin) contactParts.push(data.header.linkedin);
  if (data.header.website) contactParts.push(data.header.website);
  
  content += contactParts.join(' • ') + '\n\n';
  
  // Job title if present
  if (data.jobTitle) {
    content += `${data.jobTitle}\n\n`;
  }
  
  // Summary
  if (data.summary.length > 0) {
    content += 'SUMMARY\n';
    content += data.summary.join('\n') + '\n\n';
  }
  
  // Experience
  if (data.experience.length > 0) {
    content += 'EXPERIENCE\n';
    data.experience.forEach((exp, i) => {
      content += `${exp.company}`;
      if (exp.location) content += ` • ${exp.location}`;
      if (exp.dates) content += `\t${exp.dates}`;
      content += '\n';
      content += `${exp.title}\n`;
      exp.bullets.forEach(bullet => {
        content += `• ${bullet}\n`;
      });
      if (i < data.experience.length - 1) content += '\n';
    });
    content += '\n';
  }
  
  // Education
  if (data.education.length > 0) {
    content += 'EDUCATION\n';
    data.education.forEach((edu, i) => {
      content += `${edu.degree}\n`;
      content += `${edu.institution}`;
      if (edu.location) content += `, ${edu.location}`;
      if (edu.dates) content += `\t${edu.dates}`;
      content += '\n';
      
      if (edu.details && edu.details.length > 0) {
        edu.details.forEach(detail => {
          content += `• ${detail}\n`;
        });
      }
      if (i < data.education.length - 1) content += '\n';
    });
    content += '\n';
  }
  
  // Skills
  if (data.skills.technical?.length || data.skills.soft?.length || data.skills.other?.length) {
    content += 'SKILLS\n';
    
    if (data.skills.technical && data.skills.technical.length > 0) {
      content += 'Technical Skills\n';
      data.skills.technical.forEach(skill => {
        content += `• ${skill}\n`;
      });
      content += '\n';
    }
    
    if (data.skills.soft && data.skills.soft.length > 0) {
      content += 'Soft Skills\n';
      data.skills.soft.forEach(skill => {
        content += `• ${skill}\n`;
      });
      content += '\n';
    }
    
    if (data.skills.other && data.skills.other.length > 0) {
      content += 'Additional Skills\n';
      data.skills.other.forEach(skill => {
        content += `• ${skill}\n`;
      });
    }
    
    content += '\n';
  }
  
  // Certifications
  if (data.certifications && data.certifications.length > 0) {
    content += 'CERTIFICATIONS\n';
    data.certifications.forEach((cert, i) => {
      content += cert.name;
      if (cert.issuer) content += ` - ${cert.issuer}`;
      content += '\n';
      if (cert.date) content += `${cert.date}\n`;
      if (i < data.certifications.length - 1) content += '\n';
    });
    content += '\n';
  }
  
  // Projects
  if (data.projects && data.projects.length > 0) {
    content += 'PROJECTS\n';
    data.projects.forEach((project, i) => {
      content += project.name;
      if (project.dates) content += `\t${project.dates}`;
      content += '\n';
      
      if (project.url) content += `${project.url}\n`;
      if (project.description) content += `${project.description}\n`;
      
      if (project.bullets && project.bullets.length > 0) {
        project.bullets.forEach(bullet => {
          content += `• ${bullet}\n`;
        });
      }
      if (i < data.projects.length - 1) content += '\n';
    });
    content += '\n';
  }
  
  // Volunteering
  if (data.volunteering && data.volunteering.length > 0) {
    content += 'VOLUNTEERING & LEADERSHIP\n';
    data.volunteering.forEach((vol, i) => {
      content += vol.organization;
      if (vol.dates) content += `\t${vol.dates}`;
      content += '\n';
      
      content += `${vol.role}`;
      if (vol.location) content += ` • ${vol.location}`;
      content += '\n';
      
      if (vol.bullets && vol.bullets.length > 0) {
        vol.bullets.forEach(bullet => {
          content += `• ${bullet}\n`;
        });
      }
      if (i < data.volunteering.length - 1) content += '\n';
    });
  }
  
  return content;
}
