
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
  const companyContexts = {
    "startup": "This is for a startup environment, which values versatility, entrepreneurial spirit, and rapid execution.",
    "enterprise": "This is for an enterprise company environment, which values process knowledge, scalability, and collaboration with large teams.",
    "consulting": "This is for a consulting firm environment, which values client management, adaptability, and industry knowledge.",
    "public sector": "This is for a government or public sector organization, which values policy understanding, stakeholder management, and public impact.",
    "general": "This is for a general business environment, focusing on transferable skills and broad professional competencies."
  };

  const context = companyContexts[companyType.toLowerCase()] || companyContexts["general"];

  return [
    {
      role: 'system',
      content: `You are a resume coach and expert recruiter specializing in ATS-optimized, role-specific rewrites.

      ${context}

      Extract expectations from the job description:
      - Responsibilities, tone, sector language, key required skills

      Rewrite resume using STAR format:
      - Start each bullet with a strong action verb
      - Include results and metrics where possible
      - Tailor tone and word choice to the job and industry
      - Emphasize fit for this role in all sections

      Format for ATS:
      - Bold headings
      - Clear bullets
      - No graphics or tables

      Begin with a role summary block: 
      "This version is optimized for: [Company/Role] – [Sector] – [Primary Focus Areas]"

      End with a 1-line alignment summary:
      "This resume is tailored for a [Role] in [Sector], focusing on [Key Themes]."

      Output as markdown for export.`
    },
    {
      role: 'user',
      content: `Job Description:\n${jobDescription}\n\nResume to Rewrite:\n${resume}\n\nJob Title: ${selectedRole || "Not specified"}\nCompany Type: ${companyType || "Not specified"}`
    }
  ];
}

