
export interface FeedbackSectionFeedback {
  summary: string;
  experience: string;
  skills: string;
  [key: string]: string;
}

export interface FeedbackWeakBullet {
  original: string;
  improved: string;
}

export interface Feedback {
  score: number;
  missingKeywords: string[];
  sectionFeedback: FeedbackSectionFeedback;
  weakBullets: (string | FeedbackWeakBullet)[];
  toneSuggestions: string;
  wouldInterview: string;
}
