
export interface Feedback {
  score: number;
  missingKeywords: string[];
  sectionFeedback: {
    [key: string]: string;
  };
  weakBullets: Array<{
    original: string;
    improved: string;
  } | string>;
  toneSuggestions: string;
  wouldInterview: string;
  rewrittenResume?: string | {
    startup?: string;
    enterprise?: string;
    consulting?: string;
    [key: string]: string | undefined;
  };
  parsingError?: string;
}

export interface ExtractionStatus {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}
