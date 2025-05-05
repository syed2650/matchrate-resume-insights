
function hashCode(str: string): number {
  let hash = 0;
  if (str.length === 0) return hash;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return hash;
}

export function calculateATSScore(input: string, jobDescription: string): number {
  // If either input is empty, provide a reasonable default score
  if (!input || !jobDescription) {
    return 55; // Default reasonable score
  }
  
  try {
    // Use a simple keyword matching approach
    const inputWords = new Set(
      input.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2)
    );
    
    const jobWords = jobDescription.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
    
    // Count matching words
    let matches = 0;
    for (const word of jobWords) {
      if (inputWords.has(word)) {
        matches++;
      }
    }
    
    // Calculate score based on match percentage
    const matchRate = jobWords.length > 0 ? matches / jobWords.length : 0;
    const baseScore = Math.floor(matchRate * 70) + 30; // Score between 30-100
    
    console.log(`Calculated ATS score: ${baseScore} from match rate: ${matchRate}`);
    return Math.min(99, Math.max(30, baseScore));
  } catch (error) {
    console.error("Error calculating ATS score:", error);
    // Fallback to a moderate score
    return 60;
  }
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
          score: 55, // Provide a reasonable default score
          missingKeywords: ["Unable to parse response"],
          sectionFeedback: { error: "Unable to parse AI response properly" },
          weakBullets: [],
          toneSuggestions: "Error occurred during analysis",
          wouldInterview: "Unable to provide recommendation due to error"
        };
      }
    }

    // Validate and post-process
    if (typeof analysis.score !== 'number' || analysis.score <= 0) {
      try { 
        const parsedScore = parseInt(analysis.score) || 55;
        analysis.score = parsedScore > 0 ? parsedScore : 55; 
      } catch { 
        analysis.score = 55; // Default to reasonable score
      }
    }
    
    // Ensure score is never less than 30
    analysis.score = Math.max(30, analysis.score);
    
    if (!Array.isArray(analysis.missingKeywords)) analysis.missingKeywords = [];
    if (typeof analysis.sectionFeedback !== 'object' || analysis.sectionFeedback === null) analysis.sectionFeedback = {};
    if (!Array.isArray(analysis.weakBullets)) analysis.weakBullets = [];
    if (typeof analysis.toneSuggestions !== 'string') analysis.toneSuggestions = "No tone suggestions available";
    if (typeof analysis.wouldInterview !== 'string') analysis.wouldInterview = "No interview recommendation available";
    
    return analysis;
  } catch (error) {
    console.error("Error in parseAndValidateAnalysis:", error);
    // Return a default analysis object on error
    return {
      score: 55,
      missingKeywords: [],
      sectionFeedback: {},
      weakBullets: [],
      toneSuggestions: "Error occurred during analysis",
      wouldInterview: "Unable to provide recommendation due to error"
    };
  }
}
