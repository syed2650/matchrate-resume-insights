export interface Feedback {
  score: number;
  missingKeywords: string[];
  sectionFeedback: Record<string, string>;
  weakBullets: Array<{ original: string; improved: string; } | string>;
  toneSuggestions: string;
  wouldInterview: string;
  rewrittenResume?: string | Record<string, string>;
  atsScores?: Record<string, number>;
  error?: string;
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
