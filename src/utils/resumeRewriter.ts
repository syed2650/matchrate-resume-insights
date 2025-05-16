
import { templates } from "../templates";

// TypeScript interfaces for the resume rewriter
export interface ResumeData {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  summary: string;
  experience: JobExperience[];
  education: Education[];
  skills: string[];
}

export interface JobExperience {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location?: string;
  startDate?: string;
  endDate: string;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  fontFamily: string;
  primaryColor: string;
  secondaryColor: string;
  headerStyle: 'bold' | 'uppercase' | 'mixed';
  sectionDividers: boolean;
  spacing: 'compact' | 'standard' | 'airy';
  preview?: string;
}

export type JobCategory = 'leadership' | 'technical' | 'analysis' | 'achievement' | 'communication';
export type ResumeFormat = 'chronological' | 'functional' | 'hybrid';

export interface RewriteOptions {
  jobDescription?: string;
  templateId?: string;
  enhanceContent?: boolean;
  optimizeForATS?: boolean;
}

export interface RewriteResult {
  formattedResume: FormattedResume;
  keywordScore?: number;
  matchedKeywords?: string[];
  missingKeywords?: KeywordWithImportance[];
}

export interface FormattedResume {
  content: ResumeData;
  styling: ResumeTemplate & { format: ResumeFormat };
  html: string;
}

export interface KeywordWithImportance {
  keyword: string;
  importance: number;
}

export class ResumeRewriter {
  private readonly actionVerbs: Record<JobCategory, string[]>;

  constructor() {
    this.actionVerbs = {
      leadership: ["Spearheaded", "Orchestrated", "Directed", "Led", "Oversaw", "Managed"],
      technical: ["Implemented", "Developed", "Engineered", "Programmed", "Deployed", "Architected"],
      analysis: ["Analyzed", "Evaluated", "Assessed", "Investigated", "Quantified", "Examined"],
      achievement: ["Achieved", "Increased", "Reduced", "Improved", "Enhanced", "Accelerated"],
      communication: ["Presented", "Negotiated", "Collaborated", "Facilitated", "Consulted", "Liaised"]
    };
  }

  /**
   * Main function to rewrite a resume
   * @param resumeData - Parsed resume data
   * @param options - Options for rewriting the resume
   * @returns - Formatted, enhanced resume
   */
  rewriteResume(resumeData: ResumeData, options: RewriteOptions = {}): RewriteResult {
    // Default options
    const {
      jobDescription = "",
      templateId = "modern",
      enhanceContent = true,
      optimizeForATS = true
    } = options;

    // Step 1: Determine best format based on career stage
    const format = this.selectBestFormat(resumeData);

    // Step 2: Enhance content with strong action verbs and quantifiable achievements
    let enhancedResume = resumeData;
    if (enhanceContent) {
      enhancedResume = this.enhanceContent(resumeData, format);
    }

    // Step 3: Optimize for ATS if job description provided
    let optimizedResume = enhancedResume;
    let atsResult = {
      keywordScore: 0,
      matchedKeywords: [] as string[],
      missingKeywords: [] as KeywordWithImportance[]
    };

    if (optimizeForATS && jobDescription) {
      const result = this.optimizeForATS(enhancedResume, jobDescription);
      optimizedResume = result.optimizedResume;
      atsResult = {
        keywordScore: result.keywordScore,
        matchedKeywords: result.matchedKeywords,
        missingKeywords: result.missingKeywords
      };
    }

    // Step 4: Apply visual template
    const template = templates.find(t => t.id === templateId) || templates.find(t => t.id === "modern")!;
    const formattedResume = this.applyTemplate(optimizedResume, template, format);
    
    return {
      formattedResume,
      keywordScore: atsResult.keywordScore,
      matchedKeywords: atsResult.matchedKeywords,
      missingKeywords: atsResult.missingKeywords
    };
  }

  /**
   * Select best format based on career history
   */
  private selectBestFormat(resumeData: ResumeData): ResumeFormat {
    // Calculate years of experience
    const years = this.calculateTotalYearsExperience(resumeData);
    
    // Check for employment gaps
    const hasGaps = this.checkForEmploymentGaps(resumeData);
    
    // Identify career changes
    const careerChanges = this.identifyCareerChanges(resumeData);
    
    // Recent graduate check
    const isRecentGraduate = this.isRecentGraduate(resumeData);
    
    // Determine format
    if (isRecentGraduate || years < 2) {
      return "functional"; // Skills-based for new grads or less experience
    } else if (hasGaps || careerChanges > 1) {
      return "hybrid"; // Combination for gaps or career changers
    } else {
      return "chronological"; // Standard for consistent career
    }
  }

  /**
   * Calculate total years of experience
   */
  private calculateTotalYearsExperience(resumeData: ResumeData): number {
    let totalMonths = 0;
    
    resumeData.experience.forEach(job => {
      const startDate = new Date(job.startDate);
      const endDate = job.endDate === "Present" ? new Date() : new Date(job.endDate);

      // Calculate months between dates
      const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                        (endDate.getMonth() - startDate.getMonth());
      
      totalMonths += months > 0 ? months : 0;
    });
    
    return totalMonths / 12; // Convert to years
  }

  /**
   * Check for employment gaps
   */
  private checkForEmploymentGaps(resumeData: ResumeData): boolean {
    // Sort jobs by end date
    const sortedJobs = [...resumeData.experience].sort((a, b) => {
      const aDate = a.endDate === "Present" ? new Date() : new Date(a.endDate);
      const bDate = b.endDate === "Present" ? new Date() : new Date(b.endDate);
      return bDate.getTime() - aDate.getTime(); // Descending order
    });
    
    // Check for gaps > 3 months
    for (let i = 0; i < sortedJobs.length - 1; i++) {
      const currentEndDate = sortedJobs[i].endDate === "Present" 
        ? new Date() 
        : new Date(sortedJobs[i].endDate);
      
      const nextStartDate = new Date(sortedJobs[i + 1].startDate);

      // Calculate gap in months
      const gapMonths = (currentEndDate.getFullYear() - nextStartDate.getFullYear()) * 12 + 
                        (currentEndDate.getMonth() - nextStartDate.getMonth());
      
      if (gapMonths > 3) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Identify career changes by analyzing job titles and industries
   */
  private identifyCareerChanges(resumeData: ResumeData): number {
    let changes = 0;
    let previousField = "";

    // Extract career field from each job
    resumeData.experience.forEach(job => {
      const currentField = this.extractCareerField(job.title);
      
      if (previousField && previousField !== currentField) {
        changes++;
      }
      
      previousField = currentField;
    });
    
    return changes;
  }

  /**
   * Extract career field from job title
   */
  private extractCareerField(title: string): string {
    // Simple implementation - would be enhanced with NLP in production
    const fields: Record<string, string> = {
      "engineer": "engineering",
      "developer": "software",
      "analyst": "data",
      "manager": "management",
      "director": "executive",
      "specialist": "support",
      "coordinator": "administration"
    };
    
    const titleLower = title.toLowerCase();
    
    for (const [keyword, field] of Object.entries(fields)) {
      if (titleLower.includes(keyword)) {
        return field;
      }
    }
    
    return "other";
  }

  /**
   * Check if the person is a recent graduate
   */
  private isRecentGraduate(resumeData: ResumeData): boolean {
    if (!resumeData.education || resumeData.education.length === 0) {
      return false;
    }
    
    const mostRecentEducation = resumeData.education[0];
    const gradDate = new Date(mostRecentEducation.endDate);
    const now = new Date();

    // Calculate months since graduation
    const monthsSinceGrad = (now.getFullYear() - gradDate.getFullYear()) * 12 + 
                              (now.getMonth() - gradDate.getMonth());
    
    return monthsSinceGrad <= 12; // Within last year
  }

  /**
   * Enhance resume content with strong action verbs and quantifiable achievements
   */
  private enhanceContent(resumeData: ResumeData, format: ResumeFormat): ResumeData {
    const enhanced: ResumeData = JSON.parse(JSON.stringify(resumeData)); // Deep copy
    
    // Enhance the summary
    enhanced.summary = this.enhanceSummary(enhanced.summary, format);
    
    // Enhance experience bullets
    enhanced.experience = enhanced.experience.map(job => {
      const enhancedJob = {...job};
      
      // Determine job category for appropriate action verbs
      const category = this.determineJobCategory(job.title, job.bullets.join(' '));
      
      // Enhance each bullet point
      enhancedJob.bullets = job.bullets.map(bullet => 
        this.enhanceBulletPoint(bullet, category)
      );
      
      return enhancedJob;
    });
    
    // Enhance skills section based on format
    if (format === "functional" || format === "hybrid") {
      enhanced.skills = this.enhanceSkillsSection(enhanced.skills);
    }
    
    return enhanced;
  }

  /**
   * Enhance the summary section
   */
  private enhanceSummary(summary: string, format: ResumeFormat): string {
    // Different summary styles based on format
    if (format === "chronological") {
      // Career-focused summary
      return summary.replace(/^(.*) with over (\d+) years of experience in (.*)$/i, 
        "Results-driven, strategic $1 with $2+ years of proven expertise in $3.");
    } else if (format === "functional") {
      // Skills-focused summary
      return summary.replace(/^(.*) with over (\d+) years of experience in (.*)$/i,
        "Highly skilled $1 offering expertise in $3, developed through $2+ years of hands-on experience.");
    } else {
      // Hybrid summary
      return summary.replace(/^(.*) with over (\d+) years of experience in (.*)$/i,
        "Versatile $1 bringing $2+ years of experience and demonstrated skills in $3.");
    }
  }

  /**
   * Determine job category for appropriate action verbs
   */
  private determineJobCategory(title: string, content: string): JobCategory {
    const titleLower = title.toLowerCase();
    const contentLower = content.toLowerCase();
    
    // Simple category determination logic
    if (titleLower.includes("manager") || 
        titleLower.includes("director") || 
        titleLower.includes("lead") ||
        contentLower.includes("managed") || 
        contentLower.includes("led")) {
      return "leadership";
    } else if (titleLower.includes("engineer") || 
               titleLower.includes("developer") ||
               contentLower.includes("developed") || 
               contentLower.includes("implemented")) {
      return "technical";
    } else if (titleLower.includes("analyst") || 
               contentLower.includes("analyzed") || 
               contentLower.includes("evaluated")) {
      return "analysis";
    } else if (contentLower.includes("increased") || 
               contentLower.includes("improved") || 
               contentLower.includes("achieved")) {
      return "achievement";
    } else {
      return "communication";
    }
  }

  /**
   * Enhance a single bullet point with strong action verbs and metrics
   */
  private enhanceBulletPoint(bullet: string, category: JobCategory): string {
    // Replace weak verbs with strong action verbs
    const weakVerbPatterns = [
      /^worked on/i, 
      /^helped/i, 
      /^was responsible for/i, 
      /^did/i, 
      /^made/i
    ];
    
    // Get random action verb from category
    const actionVerbs = this.actionVerbs[category] || this.actionVerbs.communication;
    const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
    
    let enhancedBullet = bullet;
    
    // Replace weak verbs
    weakVerbPatterns.forEach(pattern => {
      enhancedBullet = enhancedBullet.replace(pattern, randomVerb);
    });
    
    // Add metrics if not present
    if (!this.hasMetrics(enhancedBullet)) {
      enhancedBullet = this.addMetricsPlaceholder(enhancedBullet);
    }
    
    return enhancedBullet;
  }

  /**
   * Check if a bullet point contains metrics
   */
  private hasMetrics(bullet: string): boolean {
    // Check for numbers, percentages, currency
    return /\d+%|\$\d+|\d+ [a-z]+/i.test(bullet);
  }

  /**
   * Add a placeholder for metrics if none are present
   */
  private addMetricsPlaceholder(bullet: string): string {
    // This would be enhanced in production to suggest more specific metrics
    if (bullet.endsWith('.')) {
      bullet = bullet.slice(0, -1);
    }
    
    return `${bullet}, resulting in [quantifiable outcome or improvement].`;
  }

  /**
   * Enhance the skills section based on format
   */
  private enhanceSkillsSection(skills: string[]): string[] {
    // Group skills by category for functional/hybrid formats
    const skillCategories: Record<string, string[]> = {
      "Technical": [],
      "Analysis": [],
      "Management": [],
      "Software": [],
      "Domain": []
    };
    
    // Simple categorization
    skills.forEach(skill => {
      if (skill.includes("SQL") || 
          skill.includes("Python") || 
          skill.includes("Java") ||
          skill.includes("Excel")) {
        skillCategories["Technical"].push(skill);
      } else if (skill.includes("Analysis") || 
                skill.includes("Research") || 
                skill.includes("Data")) {
        skillCategories["Analysis"].push(skill);
      } else if (skill.includes("Management") || 
                skill.includes("Leadership") || 
                skill.includes("Strategy")) {
        skillCategories["Management"].push(skill);
      } else if (skill.includes("SAP") || 
                skill.includes("Oracle") || 
                skill.includes("Power BI") ||
                skill.includes("Tableau")) {
        skillCategories["Software"].push(skill);
      } else {
        skillCategories["Domain"].push(skill);
      }
    });
    
    // Return categorized skills
    const enhancedSkills: string[] = [];
    
    Object.entries(skillCategories).forEach(([category, categorySkills]) => {
      if (categorySkills.length > 0) {
        enhancedSkills.push(`${category}: ${categorySkills.join(', ')}`);
      }
    });
    
    return enhancedSkills;
  }

  /**
   * Optimize resume for ATS based on job description
   */
  private optimizeForATS(resumeData: ResumeData, jobDescription: string): {
    optimizedResume: ResumeData;
    keywordScore: number;
    matchedKeywords: string[];
    missingKeywords: KeywordWithImportance[];
  } {
    // Extract keywords from job description
    const keywords = this.extractKeywords(jobDescription);
    
    // Deep copy resume
    const optimized: ResumeData = JSON.parse(JSON.stringify(resumeData));
    
    // Calculate current keyword match
    const currentMatches = this.matchKeywords(optimized, keywords);
    
    // Find missing important keywords
    const missingKeywords = keywords.filter(k => !currentMatches.includes(k.keyword));
    
    // Incorporate missing keywords where appropriate
    if (missingKeywords.length > 0) {
      // Add to summary
      optimized.summary = this.incorporateKeywordsInSummary(optimized.summary, missingKeywords);
      
      // Add to experience bullets
      optimized.experience = optimized.experience.map(job => {
        const relevantKeywords = this.findRelevantKeywords(job, missingKeywords);
        job.bullets = this.incorporateKeywordsInBullets(job.bullets, relevantKeywords);
        return job;
      });
      
      // Add to skills
      optimized.skills = this.incorporateKeywordsInSkills(optimized.skills, missingKeywords);
    }
    
    // Calculate new keyword match score
    const newMatches = this.matchKeywords(optimized, keywords);
    const score = keywords.length > 0 ? (newMatches.length / keywords.length) * 100 : 0;
    
    return {
      optimizedResume: optimized,
      keywordScore: score,
      matchedKeywords: newMatches,
      missingKeywords
    };
  }

  /**
   * Extract keywords from job description
   */
  private extractKeywords(jobDescription: string): KeywordWithImportance[] {
    // This would use NLP in production
    // Simple keyword extraction for demo
    const commonKeywords = [
      "SQL", "Python", "data analysis", "visualization", 
      "reporting", "Power BI", "Tableau", "dashboard", 
      "stakeholder", "requirements", "metrics", "KPI",
      "CRM", "segmentation", "analytics"
    ];
    
    const keywords: KeywordWithImportance[] = [];
    
    commonKeywords.forEach(keyword => {
      if (jobDescription.toLowerCase().includes(keyword.toLowerCase())) {
        keywords.push({
          keyword: keyword,
          importance: jobDescription.split(new RegExp(keyword, "i")).length - 1
        });
      }
    });
    
    // Sort by importance (frequency)
    return keywords.sort((a, b) => b.importance - a.importance);
  }

  /**
   * Match keywords in resume
   */
  private matchKeywords(resumeData: ResumeData, keywords: KeywordWithImportance[]): string[] {
    const matches: string[] = [];
    const resumeText = JSON.stringify(resumeData).toLowerCase();
    
    keywords.forEach(k => {
      if (resumeText.includes(k.keyword.toLowerCase())) {
        matches.push(k.keyword);
      }
    });
    
    return matches;
  }

  /**
   * Incorporate keywords in summary
   */
  private incorporateKeywordsInSummary(summary: string, keywords: KeywordWithImportance[]): string {
    if (keywords.length === 0) return summary;
    
    // Take top 2 keywords to incorporate
    const topKeywords = keywords.slice(0, 2);
    
    // Add keywords to summary if not already present
    let enhancedSummary = summary;
    
    topKeywords.forEach(k => {
      if (!summary.toLowerCase().includes(k.keyword.toLowerCase())) {
        // Add keyword in contextually appropriate way
        if (summary.includes("specializing in")) {
          enhancedSummary = enhancedSummary.replace(
            /specializing in ([^.]*)/i,
            `specializing in ${k.keyword} and $1`
          );
        } else if (summary.includes("with a strong focus on")) {
          enhancedSummary = enhancedSummary.replace(
            /with a strong focus on ([^.]*)/i,
            `with a strong focus on ${k.keyword} and $1`
          );
        } else {
          // Append to end if no good insertion point
          enhancedSummary = enhancedSummary.replace(
            /\.\s*$/,
            `, with additional expertise in ${k.keyword}.`
          );
        }
      }
    });
    
    return enhancedSummary;
  }

  /**
   * Find keywords relevant to a specific job
   */
  private findRelevantKeywords(job: JobExperience, keywords: KeywordWithImportance[]): KeywordWithImportance[] {
    // Simple relevance checking - would be enhanced in production
    const jobText = `${job.title} ${job.bullets.join(' ')}`.toLowerCase();
    
    return keywords.filter(k => {
      // Check if keyword is relevant to job responsibilities
      if (k.keyword.toLowerCase().includes("data") && jobText.includes("data")) {
        return true;
      } else if (k.keyword.toLowerCase().includes("report") && jobText.includes("report")) {
        return true;
      } else if (k.keyword.toLowerCase().includes("analy") && jobText.includes("analy")) {
        return true;
      } else if (k.keyword.toLowerCase().includes("stakeholder") && jobText.includes("stakeholder")) {
        return true;
      }
      return false;
    });
  }

  /**
   * Incorporate keywords in bullet points
   */
  private incorporateKeywordsInBullets(bullets: string[], keywords: KeywordWithImportance[]): string[] {
    if (keywords.length === 0) return bullets;
    
    // Only modify a maximum of 2 bullets
    const maxBulletsToModify = Math.min(2, bullets.length);
    const modifiedBullets = [...bullets];
    
    for (let i = 0; i < maxBulletsToModify; i++) {
      if (keywords.length > i) {
        const keyword = keywords[i].keyword;
        
        // Only add if not already present
        if (!modifiedBullets[i].toLowerCase().includes(keyword.toLowerCase())) {
          // Add contextually
          if (modifiedBullets[i].includes("using")) {
            modifiedBullets[i] = modifiedBullets[i].replace(
              /using ([^,\.]*)/i,
              `using ${keyword} and $1`
            );
          } else if (modifiedBullets[i].includes("through")) {
            modifiedBullets[i] = modifiedBullets[i].replace(
              /through ([^,\.]*)/i,
              `through ${keyword} and $1`
            );
          } else {
            // Append to end if no good insertion point
            if (modifiedBullets[i].endsWith('.')) {
              modifiedBullets[i] = modifiedBullets[i].slice(0, -1);
            }
            modifiedBullets[i] += ` utilizing ${keyword}.`;
          }
        }
      }
    }
    
    return modifiedBullets;
  }

  /**
   * Incorporate keywords in skills section
   */
  private incorporateKeywordsInSkills(skills: string[], keywords: KeywordWithImportance[]): string[] {
    const modifiedSkills = [...skills];
    
    // Add missing keywords as skills
    keywords.forEach(k => {
      const keywordLower = k.keyword.toLowerCase();
      
      // Check if already exists
      const exists = modifiedSkills.some(skill => 
        skill.toLowerCase().includes(keywordLower)
      );
      
      if (!exists) {
        modifiedSkills.push(k.keyword);
      }
    });
    
    return modifiedSkills;
  }

  /**
   * Apply template to the resume
   */
  private applyTemplate(resumeData: ResumeData, template: ResumeTemplate, format: ResumeFormat): FormattedResume {
    // This would generate HTML/CSS in production
    // Simplified version for demo
    const formattedResume: FormattedResume = {
      content: resumeData,
      styling: {
        ...template,
        format
      },
      html: this.generateHTML(resumeData, template, format)
    };
    
    return formattedResume;
  }

  /**
   * Generate HTML based on template and format
   */
  private generateHTML(resumeData: ResumeData, template: ResumeTemplate, format: ResumeFormat): string {
    // In production, this would generate complete HTML/CSS
    // Returning template string for demo
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${resumeData.name} - Resume</title>
        <style>
          body {
            font-family: ${template.fontFamily};
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            color: #333333;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .header {
            background-color: ${template.primaryColor};
            color: white;
            padding: 20px;
            text-align: center;
          }
          
          .section {
            margin: 20px 0;
            padding: ${template.spacing === "compact" ? "10px" : "20px"};
            ${template.sectionDividers ? `border-bottom: 1px solid ${template.primaryColor};` : ""}
          }
          
          .section-title {
            color: ${template.primaryColor};
            ${template.headerStyle === "uppercase" ? "text-transform: uppercase;" : ""}
            ${template.headerStyle === "bold" ? "font-weight: bold;" : ""}
            margin-bottom: 10px;
          }
          
          .two-column {
            display: flex;
            justify-content: space-between;
          }
          
          .left-column {
            flex: ${format === "functional" ? "2" : "1"};
            padding-right: 20px;
          }
          
          .right-column {
            flex: ${format === "functional" ? "3" : "2"};
          }
          
          .experience-item {
            margin-bottom: 15px;
          }
          
          .job-title {
            font-weight: bold;
          }
          
          .job-company {
            font-style: italic;
          }
          
          .job-date {
            color: #666666;
          }
          
          .skill-category {
            margin-bottom: 10px;
          }
          
          .bullet-list {
            margin-top: 5px;
            padding-left: 20px;
          }
          
          .bullet-item {
            margin-bottom: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${resumeData.name}</h1>
            <p>${resumeData.email || ''} ${resumeData.phone ? '| ' + resumeData.phone : ''} ${resumeData.location ? '| ' + resumeData.location : ''}</p>
          </div>
          
          <div class="section">
            <h2 class="section-title">Summary</h2>
            <p>${resumeData.summary}</p>
          </div>
          
          <div class="section">
            <h2 class="section-title">Experience</h2>
            ${resumeData.experience.map(job => `
              <div class="experience-item">
                <div class="job-title">${job.title}</div>
                <div class="job-company">${job.company}${job.location ? ' | ' + job.location : ''}</div>
                <div class="job-date">${job.startDate} - ${job.endDate}</div>
                <ul class="bullet-list">
                  ${job.bullets.map(bullet => `<li class="bullet-item">${bullet}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
          
          <div class="section">
            <h2 class="section-title">Education</h2>
            ${resumeData.education.map(edu => `
              <div class="experience-item">
                <div class="job-title">${edu.degree}</div>
                <div class="job-company">${edu.institution}${edu.location ? ' | ' + edu.location : ''}</div>
                <div class="job-date">${edu.startDate ? edu.startDate + ' - ' : ''}${edu.endDate}</div>
              </div>
            `).join('')}
          </div>
          
          <div class="section">
            <h2 class="section-title">Skills</h2>
            <p>${resumeData.skills.join(', ')}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
