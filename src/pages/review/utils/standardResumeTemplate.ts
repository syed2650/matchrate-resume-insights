
export interface StandardResumeSection {
  title: string;
  content: string[];
}

export interface ContactInfo {
  name: string;
  location?: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  website?: string;
}

export interface ResumeData {
  header: ContactInfo;
  jobTitle?: string;
  summary: string[];
  experience: Array<{
    company: string;
    title: string;
    location?: string;
    dates: string;
    bullets: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location?: string;
    dates?: string;
    details?: string[];
  }>;
  skills: {
    technical?: string[];
    soft?: string[];
    other?: string[];
  };
  certifications?: Array<{
    name: string;
    issuer?: string;
    date?: string;
  }>;
  projects?: Array<{
    name: string;
    description?: string;
    url?: string;
    dates?: string;
    bullets?: string[];
  }>;
  volunteering?: Array<{
    organization: string;
    role: string;
    location?: string;
    dates?: string;
    bullets?: string[];
  }>;
}

export interface ParsedResume {
  data: ResumeData;
  rawText: string;
}
