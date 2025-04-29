
// Resume data structure types

export interface ResumeData {
  name: string;
  contact: string;
  summary: string[];
  skills: string[];
  experiences: Array<{
    company: string;
    location?: string;
    dates: string;
    title: string;
    bullets: string[];
  }>;
  education: string[];
}

export interface ParseOptions {
  strictMode?: boolean;
  detectBullets?: boolean;
  normalizeWhitespace?: boolean;
}
