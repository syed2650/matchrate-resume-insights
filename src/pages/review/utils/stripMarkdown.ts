/**
 * Utility to strip markdown syntax and return clean, HTML-ready text
 */

export const stripMarkdown = (text: string): string => {
  if (!text) return '';
  
  return text
    // Remove headers (# ## ### etc)
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold **text** or __text__
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    // Remove italic *text* or _text_
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove code blocks ```code```
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code `code`
    .replace(/`([^`]+)`/g, '$1')
    // Remove links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images ![alt](url)
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    // Remove horizontal rules --- or ***
    .replace(/^[-*]{3,}\s*$/gm, '')
    // Remove blockquotes >
    .replace(/^>\s+/gm, '')
    // Clean up extra whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

export const stripMarkdownLine = (line: string): string => {
  if (!line) return '';
  
  return line
    // Remove bold **text** or __text__
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    // Remove italic *text* or _text_
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove inline code `code`
    .replace(/`([^`]+)`/g, '$1')
    // Remove links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
};

export const parseCleanBullets = (text: string): string[] => {
  if (!text) return [];
  
  const lines = text.split('\n');
  const bullets: string[] = [];
  
  lines.forEach(line => {
    const trimmed = line.trim();
    // Match bullet points: -, *, •, or numbered 1. 2. etc
    if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
      const clean = stripMarkdownLine(trimmed.replace(/^[-*•]\s*/, ''));
      if (clean) bullets.push(clean);
    } else if (/^\d+\.\s/.test(trimmed)) {
      const clean = stripMarkdownLine(trimmed.replace(/^\d+\.\s*/, ''));
      if (clean) bullets.push(clean);
    }
  });
  
  return bullets;
};

export const parseSectionContent = (raw: string, sectionName: string): string | null => {
  const regex = new RegExp(`${sectionName}[:\\s]*([\\s\\S]*?)(?=###|$)`, 'i');
  const match = raw.match(regex);
  if (match && match[1]) {
    return stripMarkdown(match[1].trim());
  }
  return null;
};
