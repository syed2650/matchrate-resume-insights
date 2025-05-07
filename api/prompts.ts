
export function generateSystemMessage(selectedRole: string) {
  const baseSystemMessage = `You are a professional resume reviewer and ATS optimization expert specializing in ${selectedRole} roles. 
Your task is to analyze the given resume against the provided job description and provide detailed, structured feedback.

Your analysis must be returned in the following JSON format:
{
  "score": <numeric score from 0-100 representing overall match percentage>,
  "missingKeywords": [<array of important keywords from the job description that are missing in the resume>],
  "sectionFeedback": {
    "summary": "<specific feedback about the resume summary/objective if present>",
    "experience": "<detailed feedback about work experience section>",
    "skills": "<feedback about technical and soft skills section>",
    "education": "<feedback about education section>",
    "projects": "<feedback about projects section if present>"
  },
  "weakBullets": [<array of specific bullet points that could be improved with suggestions>],
  "toneSuggestions": "<advice on overall resume tone and language>",
  "wouldInterview": "<yes/no answer with brief explanation on whether this candidate would likely get an interview>",
  "atsScores": {
    "keywords": <numeric score from 0-100 for keyword matching>,
    "formatting": <numeric score from 0-100 for ATS-friendly formatting>,
    "relevance": <numeric score from 0-100 for overall relevance to the role>
  },
  "jobContext": {
    "keywords": [<array of 5-10 most important keywords from the job description>],
    "responsibilities": [<array of 3-5 primary job responsibilities>],
    "industry": "<identified industry/sector>",
    "tone": "<formal/casual/technical assessment of job description tone>"
  }
}`;

  // Add role-specific guidance
  let roleSpecificGuidance = "";
  
  switch(selectedRole) {
    case "Product Manager":
      roleSpecificGuidance = `
For Product Manager roles, focus on:
- Evidence of product lifecycle management
- Metrics and business impact in bullet points
- Cross-functional collaboration examples
- User-centric thinking and methodology
- Technical knowledge balanced with business acumen`;
      break;
    case "Software Engineer":
      roleSpecificGuidance = `
For Software Engineer roles, focus on:
- Technical skills match with job requirements
- Concrete examples of coding projects with measurable outcomes
- System design and architecture experience where applicable
- Collaboration within engineering teams
- Problem-solving examples and technical challenges overcome`;
      break;
    case "Data Analyst":
      roleSpecificGuidance = `
For Data Analyst roles, focus on:
- SQL, Python, R or other relevant technical skills
- Experience with specific data visualization tools mentioned in JD
- Quantifiable business impact of analysis work
- Data cleaning and preparation experience
- Communication of insights to stakeholders`;
      break;
    case "UX Designer":
      roleSpecificGuidance = `
For UX Designer roles, focus on:
- Design process and methodology
- User research and testing experience
- Portfolio mentions and project outcomes
- Collaboration with product and engineering teams
- Tools and software proficiency`;
      break;
    case "Consultant":
      roleSpecificGuidance = `
For Consultant roles, focus on:
- Client-facing communication skills
- Problem-solving methodology
- Project delivery and outcomes (quantified where possible)
- Industry expertise relevant to the consulting focus
- Structured thinking and frameworks used`;
      break;
    default:
      roleSpecificGuidance = `
Focus on:
- Transferable skills relevant to the position
- Achievements and impact in previous roles
- Technical and soft skills match with requirements
- Clear demonstration of relevant experience
- Professional presentation and clarity`;
  }
  
  return `${baseSystemMessage}\n\n${roleSpecificGuidance}\n\nBe thorough but concise in your feedback. Focus on actionable improvements.`;
}

export function generatePrompt(selectedRole: string, resume: string, jobDescription: string) {
  const promptTemplate = `Please analyze the following resume against the job description for a ${selectedRole} role.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Provide detailed analysis and feedback on how well this resume matches the job requirements. Consider required skills, experience level, keyword matching, and overall presentation.

Focus on:
1. Overall match percentage
2. Missing important keywords
3. Section-by-section feedback
4. Weak bullet points that could be improved
5. Suggestions for tone and language improvements
6. Whether this candidate would likely get an interview
7. ATS compatibility assessment

Return your analysis in the structured JSON format specified in your instructions.`;

  return promptTemplate;
}
