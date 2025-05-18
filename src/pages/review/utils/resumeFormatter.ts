/**
 * Formats the resume content by removing markdown syntax and improving formatting
 */
export const formatResumeContent = (content: string): string => {
  if (!content) return "";
  try {
    return content
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^(#+\s*)(.*?)$/gm, (_, hash, title) => `${hash}${title.toUpperCase()}`)
      .replace(/^\s*-\s+/gm, '• ')
      .replace(/^---$/gm, '--------------------')
      .replace(/^Optimized Resume(\n|$)/g, '')
      .replace(/^This resume is optimized for(?: a)?:? (.*?)(\n|$)/g, '');
  } catch (error) {
    console.error("Error formatting resume content:", error);
    return content || "";
  }
};

/**
 * Extracts the role summary from the resume content
 */
export const extractRoleSummary = (resumeContent: string): string => {
  if (!resumeContent) return "";
  const match = resumeContent.match(/This resume is optimized for(?: a)?:? (.*?)(\n|$)/) ||
                resumeContent.match(/Optimized for(?: a)?:? (.*?)(\n|$)/);
  return match ? match[1].trim() : "";
};

// Add or modify this function to parse the roleSummary string into an object
export const parseRoleSummary = (roleSummary: string): any => {
  try {
    // Attempt to parse as JSON if it's in JSON format
    return JSON.parse(roleSummary);
  } catch (error) {
    // If not JSON, try to extract info from the text
    const summaryLines = roleSummary.split('\n').map(line => line.trim());
    let name = '';
    let email = '';
    let phone = '';
    let location = '';
    let summary = '';
    
    // Basic extraction logic - this can be enhanced based on your data format
    for (const line of summaryLines) {
      if (line.match(/^[A-Z][a-zA-Z\s-]+$/)) {
        // Likely a name
        name = line;
      } else if (line.includes('@')) {
        // Likely an email
        email = line;
      } else if (line.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/)) {
        // Likely a phone number
        phone = line;
      } else if (line.includes(',') && !line.includes('@')) {
        // Likely a location
        location = line;
      } else if (line.length > 30) {
        // Likely a summary paragraph
        summary = line;
      }
    }
    
    return { name, email, phone, location, summary };
  }
};
