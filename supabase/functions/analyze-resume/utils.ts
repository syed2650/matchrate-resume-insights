
export function calculateATSScore(resumeText: string, jobDescriptionText: string): number {
  if (!resumeText || !jobDescriptionText) {
    return 0;
  }
  
  // Extract keywords from job description and resume
  const jobKeywords = extractKeywords(jobDescriptionText);
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

// Extract keywords from text
function extractKeywords(text: string): string[] {
  // Convert to lowercase and remove special characters
  const cleanedText = text.toLowerCase().replace(/[^\w\s]/g, ' ');
  
  // Split into words and remove common stop words
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

export function parseAndValidateAnalysis(response: any) {
  if (!response || !response.choices || !response.choices[0] || !response.choices[0].message) {
    console.error("Invalid response structure from OpenAI", response);
    throw new Error("Invalid response structure from OpenAI");
  }

  try {
    // Extract the raw content
    const content = response.choices[0].message.content;
    console.log("Received content from OpenAI:", content?.substring(0, 100) + "...");
    
    // Attempt to parse as JSON
    let parsedData;
    try {
      parsedData = JSON.parse(content);
    } catch (err) {
      console.error("Failed to parse OpenAI response as JSON", err);
      console.log("Raw content:", content);
      throw new Error("Failed to parse OpenAI response");
    }

    // Validate the required fields and provide defaults
    const analysis = {
      score: validateNumberField(parsedData.score, 0, 100),
      missingKeywords: Array.isArray(parsedData.missingKeywords) 
        ? parsedData.missingKeywords 
        : [],
      sectionFeedback: parsedData.sectionFeedback || {},
      weakBullets: Array.isArray(parsedData.weakBullets) 
        ? parsedData.weakBullets 
        : [],
      toneSuggestions: parsedData.toneSuggestions || "No tone suggestions available.",
      wouldInterview: parsedData.wouldInterview || "No interview recommendation available."
    };

    console.log("Validated analysis:", {
      score: analysis.score,
      missingKeywordsCount: analysis.missingKeywords.length,
      sectionFeedbackKeys: Object.keys(analysis.sectionFeedback).length,
      weakBulletsCount: analysis.weakBullets.length,
      hasToneSuggestions: !!analysis.toneSuggestions,
      hasWouldInterview: !!analysis.wouldInterview
    });

    return analysis;
  } catch (error) {
    console.error("Error parsing OpenAI analysis:", error);
    // Return default structure with error flag
    return {
      error: `Failed to parse analysis: ${error.message}`,
      score: 0,
      missingKeywords: [],
      sectionFeedback: {},
      weakBullets: [],
      toneSuggestions: "Error occurred during analysis",
      wouldInterview: "Unable to provide recommendation due to error"
    };
  }
}

// Helper function to validate numeric fields
function validateNumberField(value: any, min: number, max: number): number {
  // Check if the value is defined and is a number
  if (value === undefined || value === null) {
    console.warn(`Value is undefined or null, defaulting to ${min}`);
    return min;
  }
  
  // Convert to number if it's a string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if it's a valid number
  if (isNaN(numValue)) {
    console.warn(`Value "${value}" is not a valid number, defaulting to ${min}`);
    return min;
  }
  
  // Ensure it's within the specified range
  if (numValue < min) {
    console.warn(`Value ${numValue} is below minimum ${min}, clamping to ${min}`);
    return min;
  }
  
  if (numValue > max) {
    console.warn(`Value ${numValue} is above maximum ${max}, clamping to ${max}`);
    return max;
  }
  
  return numValue;
}
