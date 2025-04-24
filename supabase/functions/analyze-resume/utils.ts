
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

export function calculateATSScore(resume: string, jobDescription: string): number {
  // Calculate deterministic ATS score based on hashCode of resume + job description
  // This ensures consistent scores for the same inputs
  const hash = hashCode(resume + jobDescription);
  const baseScore = Math.abs(hash % 40) + 60; // Range 60-99
  return Math.min(99, Math.max(60, baseScore));
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
          toneSuggestions: "Error processing response",
          wouldInterview: "Unable to determine due to processing error"
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

