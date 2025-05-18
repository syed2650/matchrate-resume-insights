
export const parseResumeData = (rawData: any) => {
  // This function normalizes the raw data into a consistent format
  // for rendering in templates and exporting to files
  
  try {
    const parsed = {
      name: extractName(rawData),
      email: extractEmail(rawData),
      phone: extractPhone(rawData),
      location: extractLocation(rawData),
      summary: extractSummary(rawData),
      
      // Parse experience
      experience: extractExperience(rawData),
      
      // Parse education
      education: extractEducation(rawData),
      
      // Parse skills and awards
      skills: extractSkills(rawData),
      awards: extractAwards(rawData)
    };
    
    return parsed;
  } catch (error) {
    console.error('Error parsing resume data:', error);
    return null;
  }
};

function extractName(rawData: any): string {
  if (rawData.header && rawData.header.name) {
    return rawData.header.name;
  }
  
  if (typeof rawData.name === 'string') {
    return rawData.name;
  }
  
  return '';
}

function extractEmail(rawData: any): string {
  if (rawData.header && rawData.header.contact && rawData.header.contact.email) {
    return rawData.header.contact.email;
  }
  
  if (typeof rawData.email === 'string') {
    return rawData.email;
  }
  
  return '';
}

function extractPhone(rawData: any): string {
  if (rawData.header && rawData.header.contact && rawData.header.contact.phone) {
    return rawData.header.contact.phone;
  }
  
  if (typeof rawData.phone === 'string') {
    return rawData.phone;
  }
  
  return '';
}

function extractLocation(rawData: any): string {
  if (rawData.header && rawData.header.contact && rawData.header.contact.location) {
    return rawData.header.contact.location;
  }
  
  if (typeof rawData.location === 'string') {
    return rawData.location;
  }
  
  return '';
}

function extractSummary(rawData: any): string {
  if (typeof rawData.summary === 'string') {
    return rawData.summary;
  }
  
  return '';
}

function extractExperience(rawData: any): any[] {
  if (Array.isArray(rawData.experience)) {
    return rawData.experience.map((job: any) => ({
      title: job.title || job.position || '',
      company: job.company || '',
      date: job.date || '',
      bullets: Array.isArray(job.bullets) ? job.bullets : []
    }));
  }
  
  return [];
}

function extractEducation(rawData: any): any[] {
  if (Array.isArray(rawData.education)) {
    return rawData.education.map((edu: any) => ({
      degree: edu.degree || '',
      institution: edu.institution || '',
      date: edu.date || '',
      gpa: edu.gpa || null
    }));
  }
  
  return [];
}

function extractSkills(rawData: any): string[] {
  if (Array.isArray(rawData.skills)) {
    return rawData.skills.map((skill: any) => {
      if (typeof skill === 'string') {
        return skill;
      }
      if (skill && skill.name) {
        return skill.name;
      }
      return '';
    }).filter(Boolean);
  }
  
  return [];
}

function extractAwards(rawData: any): string[] {
  if (Array.isArray(rawData.awards)) {
    return rawData.awards.filter((award: any) => typeof award === 'string');
  }
  
  if (Array.isArray(rawData.certifications)) {
    return rawData.certifications.filter((cert: any) => typeof cert === 'string');
  }
  
  if (Array.isArray(rawData.achievements)) {
    return rawData.achievements.filter((achievement: any) => typeof achievement === 'string');
  }
  
  return [];
}
