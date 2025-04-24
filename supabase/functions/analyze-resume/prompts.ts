
// Role-specific prompts for different job types
const rolePrompts: Record<string, string> = {
  "Product Manager": "You are reviewing a resume for a Product Manager at a tech company. Focus on product strategy, metrics, cross-functional leadership, and measurable outcomes.",
  "UX Designer": "You are reviewing a resume for a UX Designer. Emphasize design thinking, user research, prototyping, and impact on user experience.",
  "Data Analyst": "You are reviewing a resume for a Data Analyst. Highlight statistical analysis, data visualization, SQL skills, and business insights.",
  "Software Engineer": "You are reviewing a resume for a Software Engineer. Focus on technical skills, programming languages, system design, and project impact.",
  "Consultant": "You are reviewing a resume for a Business Consultant. Emphasize problem-solving, strategic thinking, client management, and quantifiable results."
};

export function buildAnalysisPrompt(selectedRole: string, effectiveJobDescription: string, resume: string) {
  return [
    {
      role: 'system',
      content: `${rolePrompts[selectedRole] || rolePrompts["Product Manager"]} 
        Provide brutally honest, structured feedback focusing on: relevance score, missing keywords, section-by-section critique, STAR-format bullet improvements, tone suggestions, and a clear interview recommendation. 
        Format your response as JSON with the following fields: 
        - score (number between 0-100)
        - missingKeywords (array of strings)
        - sectionFeedback (object with section names as keys and feedback as string values)
        - weakBullets (array of objects with "original" and "improved" properties)
        - toneSuggestions (string)
        - wouldInterview (string)
        Ensure all fields are properly formatted for JSON parsing.`
    },
    {
      role: 'user',
      content: `Job Description:\n${effectiveJobDescription || 'No specific job description provided'}\n\nResume:\n${resume}`
    }
  ];
}

export function buildRewritePrompt(resume: string, jobDescription: string, companyType: string, selectedRole: string) {
  return [
    {
      role: 'system',
      content: `You are a career coach and resume expert. Rewrite the user's resume using the job description, job title, and company type provided. Match tone, skills, and language to the job level and sector.

      Tasks:
      
      Parse job description to detect:
      - Seniority level (Junior/Mid/Senior)
      - Sector (${companyType || 'Startup, Enterprise, or Public sector'})
      - Required tools and tone

      Rewrite with STAR format (Situation, Task, Action, Result):
      - Prioritize Action + Result
      - Use metrics (%, $, #) where possible
      
      Format:
      - Bold headings, job titles
      - Date alignment
      - Clear bullets
      
      If resume is too senior for the job:
      - Reposition to focus on humility, learning, collaboration
      - Avoid executive tone
      - Emphasize value without sounding overqualified
      
      Finish with a 1-line alignment summary:
      "This resume is optimized for a [Level] [Role] role at a [Company Type] company, emphasizing [Key Skill 1], [Key Skill 2], and [Key Skill 3]."
      
      Output in markdown ready for export to PDF and .docx.`
    },
    {
      role: 'user',
      content: `Job Description:\n${jobDescription}\n\nResume to Rewrite:\n${resume}\n\nJob Title: ${selectedRole || "Not specified"}\nCompany Type: ${companyType || "Not specified"}`
    }
  ];
}

