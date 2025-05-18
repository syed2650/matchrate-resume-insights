// src/utils/resumeRewriter.ts

/**
 * Resume Template interface - defines the structure of resume templates
 */
export interface ResumeTemplate {
  id: string;
  name: string;
  fontFamily: string;
  primaryColor: string;
  secondaryColor: string;
  headerStyle: string;
  sectionDividers: boolean;
  spacing: string;
  layout: string;
  columnRatio?: number;
  headerSpanColumns?: boolean;
  sidebarSection?: string;
  skillStyle?: string;
  borderRadius?: string;
  sectionTitleCase?: string;
  iconSet?: string;
  bulletStyle?: string;
  preview?: string;
}

/**
 * Resume Data interface - defines the data structure for a resume
 */
export interface ResumeData {
  header: {
    name: string;
    contact: {
      email: string;
      phone: string;
      location: string;
    }
  };
  summary: string;
  experience: Array<{
    position?: string;
    company?: string;
    date?: string;
    bullets?: string[];
  }>;
  education: Array<{
    degree?: string;
    institution?: string;
    date?: string;
    details?: string[];
  }>;
  skills: Array<{
    name: string;
    level: number;
  }>;
  projects?: Array<{
    name?: string;
    description?: string;
    bullets?: string[];
  }>;
  certifications?: string[];
  achievements?: string[];
}

/**
 * Available templates for resume
 */
export const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'modern',
    name: 'Modern',
    fontFamily: "'Open Sans', sans-serif",
    primaryColor: "#2D74FF",
    secondaryColor: "#E6F0FF",
    headerStyle: "bold",
    sectionDividers: true,
    spacing: "compact",
    layout: "two-column",
    columnRatio: 70,
    headerSpanColumns: true,
    sidebarSection: "right",
    skillStyle: "bar",
    borderRadius: "4px",
    sectionTitleCase: "uppercase",
    iconSet: "minimal",
    bulletStyle: "circle"
  },
  {
    id: 'professional',
    name: 'Professional',
    fontFamily: "'Georgia', serif",
    primaryColor: "#143564",
    secondaryColor: "#F5F5F5",
    headerStyle: "uppercase",
    sectionDividers: true,
    spacing: "standard",
    layout: "single-column",
    sectionTitleCase: "uppercase",
    bulletStyle: "square"
  },
  {
    id: 'creative',
    name: 'Creative',
    fontFamily: "'Montserrat', sans-serif",
    primaryColor: "#6B3FA0",
    secondaryColor: "#FDF7FF",
    headerStyle: "mixed",
    sectionDividers: false,
    spacing: "airy",
    layout: "asymmetric",
    skillStyle: "circle",
    borderRadius: "8px",
    sectionTitleCase: "titlecase",
    iconSet: "decorative",
    bulletStyle: "dash"
  }
];

/**
 * Enhanced resume content with stronger action verbs and quantifiable achievements
 * @param resumeData Original resume data
 * @returns Enhanced resume data
 */
export function enhanceContent(resumeData: ResumeData): ResumeData {
  const enhanced = JSON.parse(JSON.stringify(resumeData)) as ResumeData;
  
  // Enhance summary with stronger language
  if (enhanced.summary) {
    enhanced.summary = enhanced.summary
      .replace(/^(.*) with over (\d+) years of experience in (.*)$/i, 
        "Results-driven, strategic $1 with $2+ years of proven expertise in $3.")
      .replace(/detailed oriented/i, "detail-oriented")
      .replace(/help/i, "drive")
      .replace(/worked on/i, "spearheaded")
      .replace(/responsible for/i, "led");
  }
  
  // Enhance experience bullets with stronger action verbs and metrics
  enhanced.experience = enhanced.experience.map(job => {
    const enhancedJob = {...job};
    
    // Enhance bullets with stronger action verbs
    if (enhancedJob.bullets) {
      enhancedJob.bullets = enhancedJob.bullets.map(bullet => {
        let enhanced = bullet
          .replace(/^worked on/i, "Spearheaded")
          .replace(/^helped/i, "Contributed to")
          .replace(/^was responsible for/i, "Led")
          .replace(/^responsible for/i, "Led")
          .replace(/^did/i, "Executed")
          .replace(/^made/i, "Developed");
        
        // Add metrics if not present
        if (!enhanced.match(/\d+%|\$\d+|\d+ [a-z]+/i)) {
          // Don't add metrics placeholder in production, just for illustration
          // enhanced += ", resulting in significant improvements";
        }
        
        return enhanced;
      });
    }
    
    return enhancedJob;
  });
  
  // Enhance skills - sort by relevance
  if (enhanced.skills.length > 0) {
    enhanced.skills.sort((a, b) => b.level - a.level);
  }
  
  return enhanced;
}

/**
 * Select the best resume format based on career stage
 * @param resumeData Resume data to analyze
 * @returns Format name (chronological, functional, hybrid)
 */
export function selectBestFormat(resumeData: ResumeData): string {
  // Calculate total years of experience
  const totalExperience = resumeData.experience.reduce((total, job) => {
    if (job.date) {
      const years = extractYearsFromDateRange(job.date);
      return total + years;
    }
    return total;
  }, 0);
  
  // Check for employment gaps
  const hasGaps = checkForEmploymentGaps(resumeData.experience);
  
  // Check for career changes
  const hasCareerChanges = checkForCareerChanges(resumeData.experience);
  
  if (totalExperience < 2 || hasGaps) {
    return "functional"; // Skills-based for less experience or gaps
  } else if (hasCareerChanges) {
    return "hybrid"; // Combination for career changers
  } else {
    return "chronological"; // Standard for consistent career path
  }
}

/**
 * Extract years of experience from a date range string
 * @param dateRange Date range string (e.g., "Jan 2020 - Present")
 * @returns Number of years
 */
function extractYearsFromDateRange(dateRange: string): number {
  const parts = dateRange.split(/[-–—]/);
  if (parts.length !== 2) return 0;
  
  const startDateStr = parts[0].trim();
  const endDateStr = parts[1].trim();
  
  const startYear = extractYearFromDateString(startDateStr);
  const endYear = endDateStr.toLowerCase() === 'present' 
    ? new Date().getFullYear() 
    : extractYearFromDateString(endDateStr);
  
  return endYear - startYear;
}

/**
 * Extract year from date string
 * @param dateStr Date string (e.g., "Jan 2020")
 * @returns Year as number
 */
function extractYearFromDateString(dateStr: string): number {
  const yearMatch = dateStr.match(/\b(19|20)\d{2}\b/);
  return yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();
}

/**
 * Check for employment gaps in experience
 * @param experience Experience array
 * @returns True if gaps found
 */
function checkForEmploymentGaps(experience: ResumeData['experience']): boolean {
  const sortedExperience = [...experience].sort((a, b) => {
    const aYear = a.date ? extractYearFromDateString(a.date.split(/[-–—]/)[0]) : 0;
    const bYear = b.date ? extractYearFromDateString(b.date.split(/[-–—]/)[0]) : 0;
    return bYear - aYear;
  });
  
  for (let i = 0; i < sortedExperience.length - 1; i++) {
    const currentJob = sortedExperience[i];
    const nextJob = sortedExperience[i + 1];
    
    if (currentJob.date && nextJob.date) {
      const currentEndDateStr = currentJob.date.split(/[-–—]/)[1].trim();
      const nextStartDateStr = nextJob.date.split(/[-–—]/)[0].trim();
      
      const currentEndYear = currentEndDateStr.toLowerCase() === 'present' 
        ? new Date().getFullYear() 
        : extractYearFromDateString(currentEndDateStr);
      
      const nextStartYear = extractYearFromDateString(nextStartDateStr);
      
      if (currentEndYear - nextStartYear > 1) {
        return true; // Gap of more than 1 year
      }
    }
  }
  
  return false;
}

/**
 * Check for career changes in experience
 * @param experience Experience array
 * @returns True if career changes found
 */
function checkForCareerChanges(experience: ResumeData['experience']): boolean {
  const titles = experience.map(job => job.position || '');
  
  // Simple heuristic - check if job titles are very different
  for (let i = 0; i < titles.length - 1; i++) {
    if (!titlesAreRelated(titles[i], titles[i + 1])) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if two job titles are related
 * @param title1 First job title
 * @param title2 Second job title
 * @returns True if related
 */
function titlesAreRelated(title1: string, title2: string): boolean {
  // Convert to lowercase for comparison
  const t1 = title1.toLowerCase();
  const t2 = title2.toLowerCase();
  
  // Common job title words
  const commonWords = [
    'manager', 'director', 'lead', 'senior', 'junior',
    'engineer', 'developer', 'analyst', 'specialist',
    'coordinator', 'assistant', 'associate'
  ];
  
  // Check if they share common job words
  for (const word of commonWords) {
    if (t1.includes(word) && t2.includes(word)) {
      return true;
    }
  }
  
  // Check if they share other words (excluding common stopwords)
  const stopwords = ['and', 'or', 'the', 'of', 'in', 'a', 'an', 'for'];
  const words1 = t1.split(/\s+/).filter(w => !stopwords.includes(w));
  const words2 = t2.split(/\s+/).filter(w => !stopwords.includes(w));
  
  for (const word of words1) {
    if (word.length > 3 && words2.includes(word)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Generate preview for a resume template
 * @param template Template to generate preview for
 * @returns HTML/CSS for preview
 */
export function generateTemplatePreview(template: ResumeTemplate): string {
  // This would generate HTML/CSS for the template preview
  // In a real implementation, this might return a React component or HTML string
  return `<div class="template-preview ${template.id}">
    <!-- Preview content for ${template.name} template -->
  </div>`;
}
