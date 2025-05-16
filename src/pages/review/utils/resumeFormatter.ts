export const formatResumeContent = (text: string) => {
  return text.replace(/\r\n|\r/g, "\n").trim();
};

export const extractRoleSummary = (text: string) => {
  const match = text.match(/PROFESSIONAL SUMMARY\n(.*?)(\n\n|$)/s);
  return match ? match[1].trim() : "";
};

export const extractExperienceBullets = (text: string) => {
  const workSectionMatch = text.match(/WORK EXPERIENCE\n([\s\S]*)/);
  if (!workSectionMatch) return [];
  const bullets = workSectionMatch[1]
    .split(/\n(?=\s*[\u2022*-])/)
    .map(b => b.replace(/^\s*[\u2022*-]\s*/, "").trim())
    .filter(Boolean);
  return bullets;
};
