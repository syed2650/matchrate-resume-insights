
/**
 * Format resume content for display
 * @param content Raw resume content
 * @returns Formatted resume content
 */
export const formatResumeContent = (content: string): string => {
  if (!content) return '';
  
  // Replace multiple consecutive newlines with two newlines
  let formatted = content.replace(/\n{3,}/g, '\n\n');
  
  // Ensure section headers stand out
  const sections = ['EXPERIENCE', 'EDUCATION', 'SKILLS', 'PROJECTS', 'CERTIFICATIONS', 'SUMMARY'];
  sections.forEach(section => {
    const regex = new RegExp(`^${section}`, 'gm');
    formatted = formatted.replace(regex, `\n${section}`);
  });
  
  return formatted.trim();
};

/**
 * Extract role summary from resume content
 * @param content Resume content
 * @returns Role summary string
 */
export const extractRoleSummary = (content: string): string => {
  if (!content) return '';
  
  // Try to extract a job title or role from the summary section
  const summaryMatch = content.match(/SUMMARY\s*\n([\s\S]*?)(?:\n\n|\n[A-Z]+|$)/i);
  if (summaryMatch && summaryMatch[1]) {
    const summaryText = summaryMatch[1].trim();
    
    // Look for common role patterns in the summary
    const rolePatterns = [
      /(?:experienced|senior|junior)\s+([A-Za-z\s]+(?:developer|engineer|designer|manager|analyst|specialist))/i,
      /([A-Za-z\s]+(?:developer|engineer|designer|manager|analyst|specialist))\s+with/i,
      /career\s+as\s+(?:an?|the)\s+([A-Za-z\s]+)/i,
    ];
    
    for (const pattern of rolePatterns) {
      const match = summaryText.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
  }
  
  // Fallback: try to find role in the first few lines
  const firstLines = content.split('\n').slice(0, 5).join(' ');
  const roleMatch = firstLines.match(/(?:experienced|senior|junior)\s+([A-Za-z\s]+(?:developer|engineer|designer|manager|analyst|specialist))/i);
  if (roleMatch && roleMatch[1]) {
    return roleMatch[1].trim();
  }
  
  // Second fallback: return a generic string
  return "Professional";
};
