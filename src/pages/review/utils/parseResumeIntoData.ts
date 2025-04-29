
// Re-export from the new refactored location
import { parseResumeIntoData as parseResume } from './resume/resumeParser';
import type { ResumeData } from './resume/types';

export type { ResumeData };
export const parseResumeIntoData = parseResume;
