/**
 * Formats the resume content by removing markdown syntax and improving formatting
 */
export const formatResumeContent = (content: string): string => {
  if (!content) return "";
  try {
    return content
      // Remove markdown formatting but keep structure
      .replace(/\*\*(.*?)\*\*/g, '$1')  // Bold
      .replace(/\*(.*?)\*/g, '$1')      // Italic
      // Ensure proper bullet point formatting
      .replace(/^\s*-\s+/gm, '• ')      // Convert dashes to bullet points
      .replace(/^---$/gm, '--------------------')
      // Clean up job specific information 
      .replace(/^Optimized Resume(\n|$)/g, '')
      .replace(/^This resume is optimized for(?: a)?:? (.*?)(\n|$)/g, '')
      // Ensure all sections are properly capitalized
      .replace(/^(#+\s*)(.*?)$/gm, (_, hash, title) => `${hash}${title.toUpperCase()}`)
      // Clean up extra spacing
      .replace(/\n{3,}/g, '\n\n')       // Reduce multiple line breaks
      .trim();
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

/**
 * Makes sure bullet points are consistently formatted throughout the resume
 */
export const normalizeBulletPoints = (content: string): string => {
  if (!content) return "";
  return content
    .replace(/^\s*-\s+/gm, '• ')  // Convert dash bullets to dot bullets
    .replace(/^\s*\*\s+/gm, '• ') // Convert asterisk bullets to dot bullets
    .replace(/^\s*\d+\.\s+/gm, '• '); // Convert numbered lists to bullet points
};

/**
 * Improves overall section formatting
 */
export const improveSectionFormatting = (content: string): string => {
  if (!content) return "";
  
  const sectionHeaders = ['SUMMARY', 'EXPERIENCE', 'EDUCATION', 'SKILLS', 'PROJECTS', 'CERTIFICATIONS'];
  let formatted = content;
  
  // Make sure section headers are properly capitalized and formatted
  sectionHeaders.forEach(header => {
    const headerRegex = new RegExp(`^${header}$`, 'im');
    formatted = formatted.replace(headerRegex, header.toUpperCase());
  });
  
  return formatted;
};
