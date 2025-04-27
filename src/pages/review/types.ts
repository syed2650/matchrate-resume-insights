
export interface Feedback {
  score: number;
  missingKeywords: string[];
  sectionFeedback: Record<string, string>;
  weakBullets: { original: string; improved: string }[];
  toneSuggestions: string;
  wouldInterview: string;
  rewrittenResume?: any;
  atsScores?: Record<string, number>;
  jobContext?: JobContext;
  resume?: string;
  jobDescription?: string;
  jobUrl?: string;
  jobTitle?: string;
  resumeText?: string; // For backward compatibility
  error?: string; // Added error property
  rewriteRequested?: boolean; // Flag to track if rewrite was requested
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

export interface AnalysisStep {
  id: number;
  name: string;
  description: string;
  isComplete: boolean;
  isCurrent: boolean;
}
