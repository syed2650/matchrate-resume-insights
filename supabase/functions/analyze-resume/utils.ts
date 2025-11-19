import { performRealATSChecks } from './ats-checker.ts';

/**
 * Calculate real ATS score using comprehensive checks
 */
export async function calculateATSScore(
  input: string,
  jobDescription: string,
  fileType: string = 'txt'
): Promise<number> {
  try {
    const result = await performRealATSChecks(input, fileType, jobDescription);
    console.log(`Real ATS score calculated: ${result.score}/100`);
    console.log(`Critical issues: ${result.criticalIssues}, Warnings: ${result.warnings}`);
    return result.score;
  } catch (error) {
    console.error('Error calculating ATS score:', error);
    // Fallback to basic keyword matching if detailed check fails
    return calculateBasicATSScore(input, jobDescription);
  }
}

/**
 * Fallback basic ATS score calculation based on keyword matching
 */
function calculateBasicATSScore(resumeText: string, jobDescription: string): number {
  if (!resumeText || !jobDescription) {
    return 0;
  }

  // Extract keywords from job description and resume
  const jobKeywords = extractKeywords(jobDescription);
  const resumeKeywords = new Set(extractKeywords(resumeText));

  // Count matches
  let matches = 0;
  jobKeywords.forEach(keyword => {
    if (resumeKeywords.has(keyword)) {
      matches++;
    }
  });

  // Calculate score as percentage of matches
  const totalKeywords = jobKeywords.length;
  const score = totalKeywords > 0 ? Math.round((matches / totalKeywords) * 100) : 0;

  // Ensure score is within 0-100 range
  return Math.min(100, Math.max(0, score));
}

/**
 * Extract keywords from text for basic matching
 */
function extractKeywords(text: string): string[] {
  const cleanedText = text.toLowerCase().replace(/[^\w\s]/g, ' ');
  const words = cleanedText.split(/\s+/);

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

  const filteredWords = words.filter(word =>
    word.length > 2 && !stopWords.has(word)
  );

  const wordFrequency: {[key: string]: number} = {};
  filteredWords.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });

  const sortedKeywords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);

  return sortedKeywords.slice(0, 50);
}

export function getATSScoreExplanation(score: number): string {
  if (score >= 90) {
    return "This resume is highly optimized for ATS systems with excellent keyword matching, clear structure, and professional formatting.";
  } else if (score >= 80) {
    return "This resume has good ATS compatibility with strong keyword usage and proper section formatting.";
  } else if (score >= 70) {
    return "This resume has adequate ATS compatibility but could improve keyword alignment and section structure.";
  } else {
    return "This resume needs optimization for ATS systems, including better keyword matching and clearer section formatting.";
  }
}

export function parseAndValidateAnalysis(data: any): any {
  try {
    // Try to parse as JSON
    let analysis;
    try {
      analysis = JSON.parse(data.choices[0].message.content);
      console.log("Successfully parsed AI response as JSON");
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", e);
      const content = data.choices[0].message.content;
      if (typeof content === 'object') {
        analysis = content;
        console.log("Using AI response directly as object");
      } else {
        analysis = {
          error: "Failed to parse AI response as JSON",
          rawContent: content,
          score: 0,
          missingKeywords: ["Unable to parse response"],
          sectionFeedback: { error: "Unable to parse AI response properly" },
          weakBullets: [],
          toneSuggestions: "Error occurred during analysis",
          wouldInterview: "Unable to provide recommendation due to error"
        };
      }
    }

    // Validate and post-process
    if (typeof analysis.score !== 'number') {
      try { analysis.score = parseInt(analysis.score) || 0; } catch { analysis.score = 0; }
    }
    if (!Array.isArray(analysis.missingKeywords)) analysis.missingKeywords = [];
    if (typeof analysis.sectionFeedback !== 'object' || analysis.sectionFeedback === null) analysis.sectionFeedback = {};
    if (!Array.isArray(analysis.weakBullets)) analysis.weakBullets = [];
    if (typeof analysis.toneSuggestions !== 'string') analysis.toneSuggestions = "No tone suggestions available";
    if (typeof analysis.wouldInterview !== 'string') analysis.wouldInterview = "No interview recommendation available";

    return analysis;
  } catch (error) {
    console.error("Error in parseAndValidateAnalysis:", error);
    throw error;
  }
}
