
import { ResumeData, ParseOptions } from "./types";
import { 
  parseHeaderSection, 
  parseSummarySection, 
  parseSkillsSection, 
  parseExperienceEntry,
  parseEducationSection 
} from "./sectionParsers";

/**
 * Default values for resume sections when no data is found
 */
const DEFAULT_VALUES = {
  name: "Full Name",
  contact: "Location | Phone | Email",
  summary: ["Professional summary goes here."],
  skills: ["Skill 1", "Skill 2", "Skill 3"],
  experiences: [{
    company: "Company Name",
    title: "Job Title",
    dates: "MM/YYYY - Present",
    bullets: ["Responsibility 1", "Achievement 2"]
  }],
  education: ["Degree, Institution, Year"]
};

/**
 * Main function to parse resume content into structured data
 */
export function parseResumeIntoData(content: string, options: ParseOptions = {}): ResumeData {
  // Preprocess content
  const lines = content.split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0);

  if (lines.length === 0) {
    return { ...DEFAULT_VALUES };
  }

  // Initialize result structure
  let name = "";
  let contact = "";
  const summary: string[] = [];
  const skills: string[] = [];
  const experiences: ResumeData["experiences"] = [];
  const education: string[] = [];

  // Parse state tracking
  let currentSection = "header";
  let currentSectionStart = 0;

  // Process line by line to identify sections
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect section headers
    if (line.match(/^SUMMARY$/i) || line.includes("SUMMARY")) {
      // Process previous section if needed
      if (currentSection === "header" && i > 0) {
        const { name: parsedName, contact: parsedContact } = parseHeaderSection(lines, currentSectionStart);
        name = parsedName;
        contact = parsedContact;
      }
      
      currentSection = "summary";
      currentSectionStart = i + 1;
      continue;
    } else if (line.match(/^KEY SKILLS$/i) || line.includes("KEY SKILLS")) {
      if (currentSection === "summary") {
        summary.push(...parseSummarySection(lines, currentSectionStart, i));
      }
      
      currentSection = "skills";
      currentSectionStart = i + 1;
      continue;
    } else if (line.match(/^PROFESSIONAL EXPERIENCE$/i) || line.includes("PROFESSIONAL EXPERIENCE")) {
      if (currentSection === "skills") {
        skills.push(...parseSkillsSection(lines, currentSectionStart, i));
      }
      
      currentSection = "experience";
      currentSectionStart = i + 1;
      continue;
    } else if (line.match(/^EDUCATION$/i) || line.includes("EDUCATION")) {
      if (currentSection === "experience") {
        // Process experiences - this is more complex as we need to detect job boundaries
        let j = currentSectionStart;
        while (j < i) {
          // Find the end of the current experience entry
          // This is a simplification - in a real parser, we'd need smarter logic
          let nextExpStart = j;
          for (let k = j + 1; k < i; k++) {
            // Detect start of new experience by checking for a non-bullet line that may contain dates
            if (!lines[k].startsWith("•") && !lines[k].startsWith("-")) {
              if (
                (k + 1 < i && (lines[k + 1].startsWith("•") || lines[k + 1].startsWith("-"))) ||
                lines[k].match(/\d{1,2}\/\d{4}/) || 
                lines[k].match(/\d{4}\s*-\s*\d{4}/) ||
                lines[k].match(/\bJan\b|\bFeb\b|\bMar\b|\bApr\b|\bMay\b|\bJun\b|\bJul\b|\bAug\b|\bSep\b|\bOct\b|\bNov\b|\bDec\b/)
              ) {
                nextExpStart = k;
                break;
              }
            }
          }
          
          if (nextExpStart === j) {
            // No more experience entries found
            nextExpStart = i;
          }
          
          const { experience } = parseExperienceEntry(lines, j, nextExpStart);
          experiences.push(experience);
          j = nextExpStart;
        }
      }
      
      currentSection = "education";
      currentSectionStart = i + 1;
      continue;
    }
  }
  
  // Process the final section based on where we ended
  if (currentSection === "header") {
    const { name: parsedName, contact: parsedContact } = parseHeaderSection(lines, currentSectionStart);
    name = parsedName;
    contact = parsedContact;
  } else if (currentSection === "summary") {
    summary.push(...parseSummarySection(lines, currentSectionStart, lines.length));
  } else if (currentSection === "skills") {
    skills.push(...parseSkillsSection(lines, currentSectionStart, lines.length));
  } else if (currentSection === "experience") {
    // Similar to above but processing to the end of the document
    let j = currentSectionStart;
    while (j < lines.length) {
      // Find the end of the current experience
      let nextExpStart = j;
      for (let k = j + 1; k < lines.length; k++) {
        if (!lines[k].startsWith("•") && !lines[k].startsWith("-")) {
          if (
            (k + 1 < lines.length && (lines[k + 1].startsWith("•") || lines[k + 1].startsWith("-"))) ||
            lines[k].match(/\d{1,2}\/\d{4}/) || 
            lines[k].match(/\d{4}\s*-\s*\d{4}/) ||
            lines[k].match(/\bJan\b|\bFeb\b|\bMar\b|\bApr\b|\bMay\b|\bJun\b|\bJul\b|\bAug\b|\bSep\b|\bOct\b|\bNov\b|\bDec\b/)
          ) {
            nextExpStart = k;
            break;
          }
        }
      }
      
      if (nextExpStart === j) {
        // No more experience entries found
        nextExpStart = lines.length;
      }
      
      const { experience } = parseExperienceEntry(lines, j, nextExpStart);
      experiences.push(experience);
      j = nextExpStart;
    }
  } else if (currentSection === "education") {
    education.push(...parseEducationSection(lines, currentSectionStart, lines.length));
  }

  // Return parsed data or defaults for missing sections
  return {
    name: name || DEFAULT_VALUES.name,
    contact: contact || DEFAULT_VALUES.contact,
    summary: summary.length > 0 ? summary : DEFAULT_VALUES.summary,
    skills: skills.length > 0 ? skills : DEFAULT_VALUES.skills,
    experiences: experiences.length > 0 ? experiences : DEFAULT_VALUES.experiences,
    education: education.length > 0 ? education : DEFAULT_VALUES.education
  };
}
