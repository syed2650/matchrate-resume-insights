// If this file doesn't exist, we need to create it with the ResumeRewriteProps interface
export interface ResumeRewriteProps {
  rewrittenResume: any;
  atsScores?: Record<string, number>;
  scoreHash?: string | null;
  jobContext?: {
    keywords: string[];
    responsibilities: string[];
    industry: string;
    tone: string;
  };
  originalResume?: string;
  jobDescription?: string;
  originalATSScore?: number;
}

export interface Feedback {
  resume?: string;
  jobDescription?: string;
  jobUrl?: string;
  jobTitle?: string;
  score: number;
  missingKeywords: string[];
  sectionFeedback: Record<string, string>;
  weakBullets: { original: string; improved: string }[];
  toneSuggestions: string;
  wouldInterview: string;
  rewrittenResume?: any;
  atsScores?: Record<string, number>;
  jobContext?: {
    keywords: string[];
    responsibilities: string[];
    industry: string;
    tone: string;
  };
  error?: string; // Add this missing property
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
  size: number;
  type: string; // Now supports both document and image MIME types
}

export interface AnalysisStep {
  id: number;
  name: string;
  description: string;
  isComplete: boolean;
  isCurrent: boolean;
}
