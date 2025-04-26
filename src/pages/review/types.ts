
export interface Feedback {
  score: number;
  missingKeywords: string[];
  sectionFeedback: Record<string, string>;
  weakBullets: { original: string; improved: string }[];
  toneSuggestions: string;
  wouldInterview: string;
  rewrittenResume?: any; // Can be string or object with version keys
  atsScores?: Record<string, number>;
  jobContext?: JobContext;
  // Add missing fields for Supabase storage
  resume?: string;
  jobDescription?: string;
  jobUrl?: string;
  jobTitle?: string;
}

export interface JobContext {
  keywords: string[];
  responsibilities: string[];
  industry: string;
  tone: string;
}

export type ExtractionStatus = 
  | { status: 'idle' }
  | { status: 'loading'; message: string }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string };

export interface ResumeFile {
  name: string;
  url?: string;
  type?: string;
  size?: number;
}
