
// Re-export from the new refactored location
import { parseResumeIntoData as parseResume, ResumeData } from './resume/types';
export { ResumeData };
export const parseResumeIntoData = parseResume;
