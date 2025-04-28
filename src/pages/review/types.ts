
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
}
