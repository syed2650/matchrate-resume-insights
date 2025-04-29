
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
