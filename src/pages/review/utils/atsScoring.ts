
// ATS Score calculation utilities

/**
 * Returns an ATS score based on actual resume content and job description matching
 * 
 * @param resume The candidate's resume text
 * @param jobDescription The job description text
 * @returns A score from 0-100 representing ATS compatibility
 */
export function calculateATSScore(resume: string, jobDescription: string): number {
  if (!resume || !jobDescription) {
    return 0;
  }

  // Normalize texts for processing
  const resumeText = normalizeText(resume);
  const jobText = normalizeText(jobDescription);
  
  // Extract keywords from both texts
  const jobKeywords = extractKeywords(jobText);
  const resumeKeywords = new Set(extractKeywords(resumeText));
  
  // Count matching keywords
  let matches = 0;
  for (const keyword of jobKeywords) {
    if (resumeKeywords.has(keyword)) {
      matches++;
    }
  }
  
  // Calculate base keyword match score (60% of total score)
  const keywordMatchRatio = jobKeywords.length > 0 ? matches / jobKeywords.length : 0;
  const keywordScore = Math.min(60, Math.round(keywordMatchRatio * 60));
  
  // Check for section headers (20% of total score)
  const sectionScore = calculateSectionScore(resumeText);
  
  // Check for formatting and structure (20% of total score)
  const formatScore = calculateFormatScore(resumeText);
  
  // Calculate final score
  const totalScore = keywordScore + sectionScore + formatScore;
  
  return Math.min(100, Math.max(0, totalScore));
}

/**
 * Normalizes text for consistent processing
 */
function normalizeText(text: string): string {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts meaningful keywords from text
 */
function extractKeywords(text: string): string[] {
  // Split into words and remove common stop words
  const words = text.split(/\s+/);
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 
    'be', 'been', 'being', 'in', 'on', 'at', 'to', 'for', 'with', 
    'by', 'about', 'against', 'between', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'from', 'up', 'down', 'of',
    'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here',
    'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each',
    'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
    'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will',
    'just', 'should', 'now', 'you', 'your', 'we', 'our', 'i', 'my'
  ]);
  
  // Filter out stop words and short words
  const filteredWords = words.filter(word => 
    word.length > 2 && !stopWords.has(word)
  );

  // Count frequency of each word
  const wordFrequency: {[key: string]: number} = {};
  filteredWords.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });
  
  // Sort by frequency and get top keywords
  const sortedKeywords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);
  
  // Return up to 50 most common words as keywords
  return sortedKeywords.slice(0, 50);
}

/**
 * Calculate score based on presence of common resume sections
 */
function calculateSectionScore(text: string): number {
  const commonSections = [
    'experience', 'work experience', 'employment', 
    'education', 'qualifications', 'skills',
    'summary', 'professional summary', 'profile',
    'certifications', 'projects', 'achievements'
  ];
  
  let sectionMatches = 0;
  for (const section of commonSections) {
    const pattern = new RegExp(`(^|\\s)${section}(\\s|:|$)`, 'i');
    if (pattern.test(text)) {
      sectionMatches++;
    }
  }
  
  // Score based on matching at least 3 key sections
  return Math.min(20, Math.round((sectionMatches / 3) * 20));
}

/**
 * Calculate score based on resume formatting and structure
 */
function calculateFormatScore(text: string): number {
  let score = 0;
  
  // Check for bullet points (common in well-formatted resumes)
  const bulletPoints = (text.match(/•|\-|\*/) || []).length;
  if (bulletPoints > 5) {
    score += 5;
  } else if (bulletPoints > 0) {
    score += 3;
  }
  
  // Check for dates (common in well-formatted resumes)
  const datePatterns = /\b(20\d{2}|19\d{2})\b|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/gi;
  const dateMatches = (text.match(datePatterns) || []).length;
  if (dateMatches > 4) {
    score += 5;
  } else if (dateMatches > 0) {
    score += 3;
  }
  
  // Check for action verbs (common in well-written resumes)
  const actionVerbs = /\b(achieved|improved|managed|developed|created|implemented|led|increased|decreased|reduced|delivered|coordinated)\b/gi;
  const verbMatches = (text.match(actionVerbs) || []).length;
  if (verbMatches > 8) {
    score += 10;
  } else if (verbMatches > 3) {
    score += 5;
  } else if (verbMatches > 0) {
    score += 2;
  }
  
  return Math.min(20, score);
}

/**
 * Get explanatory text for an ATS score
 */
export function getATSScoreExplanation(score: number): string {
  if (score >= 90) {
    return "This resume is highly optimized for ATS systems with excellent keyword matching, clear structure, and professional formatting.";
  } else if (score >= 80) {
    return "This resume has good ATS compatibility with strong keyword usage and proper section formatting.";
  } else if (score >= 70) {
    return "This resume has adequate ATS compatibility but could improve keyword alignment and section structure.";
  } else if (score >= 50) {
    return "This resume needs optimization for ATS systems, including better keyword matching and clearer section formatting.";
  } else {
    return "This resume requires significant improvement for ATS compatibility. Consider adding relevant keywords and restructuring content.";
  }
}

/**
 * Get detailed explanation of an ATS score
 */
export function getATSScoreDetail(score: number): string {
  if (score >= 90) {
    return "Score calculated based on excellent keyword density, proper section headings, and ATS-friendly formatting. Minimal improvements needed.";
  } else if (score >= 80) {
    return "Score reflects good keyword alignment with job requirements and clear section structure, though some formatting improvements could further optimize scanning.";
  } else if (score >= 70) {
    return "Score indicates adequate keyword presence but suboptimal section organization and formatting that could be improved for better ATS performance.";
  } else if (score >= 50) {
    return "Score shows significant gaps in keyword alignment, improper formatting, or missing crucial sections that ATS systems require for successful scanning.";
  } else {
    return "Score indicates major ATS compatibility issues. Focus on adding industry keywords from the job description and organizing content into clear, labeled sections.";
  }
}
