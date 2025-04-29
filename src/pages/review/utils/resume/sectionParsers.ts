
import { ResumeData } from "./types";

/**
 * Parse the header section (name and contact info)
 */
export function parseHeaderSection(lines: string[], startIndex: number): {
  name: string;
  contact: string;
  nextIndex: number;
} {
  let name = "";
  let contact = "";
  let i = startIndex;

  // First non-empty line is usually the name
  if (i < lines.length) {
    name = lines[i];
    i++;
  }

  // Second line is usually contact info
  if (i < lines.length) {
    contact = lines[i];
    i++;
  }

  return { name, contact, nextIndex: i };
}

/**
 * Parse the summary section
 */
export function parseSummarySection(lines: string[], startIndex: number, endIndex: number): string[] {
  const summary: string[] = [];
  
  for (let i = startIndex; i < endIndex; i++) {
    summary.push(lines[i]);
  }
  
  return summary;
}

/**
 * Parse the skills section
 */
export function parseSkillsSection(lines: string[], startIndex: number, endIndex: number): string[] {
  const skills: string[] = [];

  for (let i = startIndex; i < endIndex; i++) {
    const line = lines[i];
    // Check if the line is a bullet point
    if (line.startsWith("•") || line.startsWith("-")) {
      skills.push(line.replace(/^[•-]\s*/, "").trim());
    } else {
      // Split by commas if it's a comma-separated list
      const skillItems = line.split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0);
      skills.push(...skillItems);
    }
  }

  return skills;
}

/**
 * Parse a single experience entry
 */
export function parseExperienceEntry(
  lines: string[], 
  startIndex: number, 
  endIndex: number
): {
  experience: ResumeData["experiences"][0],
  nextIndex: number
} {
  let company = "";
  let location = "";
  let title = "";
  let dates = "";
  const bullets: string[] = [];
  let i = startIndex;

  // First line might contain company, title, and/or dates
  if (i < endIndex) {
    const line = lines[i];
    
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
    i++;
  }

  // Second line might be additional info (title or dates)
  if (i < endIndex) {
    const line = lines[i];
    if (!line.startsWith("•") && !line.startsWith("-")) {
      if (!title) {
        title = line;
      } else if (!dates) {
        // Check if this line looks like dates
        if (line.match(/(\d{1,2}\/\d{4})/) || 
            line.match(/\d{4}\s*-\s*\d{4}/) || 
            line.match(/\bJan\b|\bFeb\b|\bMar\b|\bApr\b|\bMay\b|\bJun\b|\bJul\b|\bAug\b|\bSep\b|\bOct\b|\bNov\b|\bDec\b/)) {
          dates = line;
        }
      }
      i++;
    }
  }

  // Remaining lines are usually bullet points
  for (; i < endIndex; i++) {
    const line = lines[i];
    if (line.startsWith("•") || line.startsWith("-")) {
      bullets.push(line.replace(/^[•-]\s*/, "").trim());
    } else if (line.trim()) {
      // If not a bullet but not empty, add it anyway
      bullets.push(line.trim());
    }
  }

  return {
    experience: {
      company,
      location,
      title,
      dates,
      bullets
    },
    nextIndex: endIndex
  };
}

/**
 * Parse the education section
 */
export function parseEducationSection(lines: string[], startIndex: number, endIndex: number): string[] {
  const education: string[] = [];
  let currentItem = "";

  for (let i = startIndex; i < endIndex; i++) {
    const line = lines[i].trim();
    
    // If this is a bullet point or a new line containing a degree or year
    if (line.startsWith("•") || line.startsWith("-") || 
        line.match(/degree|diploma|certificate|bachelor|master|phd|doctor/i) || 
        line.match(/\b\d{4}\b/)) {
      
      // If we already have an item, push it before starting a new one
      if (currentItem.trim()) {
        education.push(currentItem.trim());
        currentItem = "";
      }
      
      // Start a new education item
      currentItem = line.replace(/^[•-]\s*/, "").trim();
    } else if (line) {
      // Continue previous item
      currentItem += " " + line;
    } else if (currentItem) {
      // Empty line and we have a current item - finish it
      education.push(currentItem.trim());
      currentItem = "";
    }
  }
  
  // Don't forget the last item if any
  if (currentItem.trim()) {
    education.push(currentItem.trim());
  }

  return education;
}
