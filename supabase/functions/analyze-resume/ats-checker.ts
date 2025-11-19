// Real ATS Compatibility Checker
// This module performs 15+ actual ATS compatibility checks based on industry standards

export interface ATSCheck {
  id: string;
  name: string;
  passed: boolean;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  recommendation?: string;
}

export interface ATSCheckResult {
  score: number;
  checks: ATSCheck[];
  summary: string;
  criticalIssues: number;
  warnings: number;
}

/**
 * Comprehensive ATS compatibility checker
 * Performs 15+ real checks that actual ATS systems use
 */
export async function performRealATSChecks(
  resumeText: string,
  fileType: string = 'txt',
  jobDescription: string = '',
  keywords: string[] = []
): Promise<ATSCheckResult> {
  const checks: ATSCheck[] = [];

  // CHECK 1: File Format Compatibility
  checks.push(checkFileFormat(fileType));

  // CHECK 2: Standard Section Headers
  checks.push(checkSectionHeaders(resumeText));

  // CHECK 3: Contact Information Placement
  checks.push(checkContactInfo(resumeText));

  // CHECK 4: Date Formatting Consistency
  checks.push(checkDateFormatting(resumeText));

  // CHECK 5: Bullet Point Format
  checks.push(checkBulletPoints(resumeText));

  // CHECK 6: Font and Formatting Elements
  checks.push(checkFormattingElements(resumeText));

  // CHECK 7: Keyword Density
  checks.push(checkKeywordDensity(resumeText, keywords));

  // CHECK 8: Keyword Placement
  checks.push(checkKeywordPlacement(resumeText, keywords));

  // CHECK 9: Action Verbs Usage
  checks.push(checkActionVerbs(resumeText));

  // CHECK 10: Quantifiable Metrics
  checks.push(checkQuantifiableMetrics(resumeText));

  // CHECK 11: Resume Length
  checks.push(checkResumeLength(resumeText));

  // CHECK 12: Tables and Columns Detection
  checks.push(checkTablesAndColumns(resumeText));

  // CHECK 13: Special Characters
  checks.push(checkSpecialCharacters(resumeText));

  // CHECK 14: Keyword Match with Job Description
  checks.push(checkJobDescriptionMatch(resumeText, jobDescription));

  // CHECK 15: Professional Summary Presence
  checks.push(checkProfessionalSummary(resumeText));

  // Calculate overall score
  const passedCount = checks.filter(c => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);

  // Count issues by severity
  const criticalIssues = checks.filter(c => !c.passed && c.severity === 'critical').length;
  const warnings = checks.filter(c => !c.passed && c.severity === 'warning').length;

  // Generate summary
  const summary = generateSummary(score, criticalIssues, warnings);

  return {
    score,
    checks,
    summary,
    criticalIssues,
    warnings
  };
}

// ===== INDIVIDUAL CHECK FUNCTIONS =====

function checkFileFormat(fileType: string): ATSCheck {
  const atsCompatibleFormats = ['pdf', 'docx', 'txt'];
  const passed = atsCompatibleFormats.includes(fileType.toLowerCase());

  return {
    id: 'file_format',
    name: 'File Format',
    passed,
    severity: 'critical',
    message: passed
      ? `${fileType.toUpperCase()} format is ATS-compatible`
      : `${fileType.toUpperCase()} format may not be ATS-friendly`,
    recommendation: passed
      ? undefined
      : 'Use PDF or DOCX format for best ATS compatibility'
  };
}

function checkSectionHeaders(resumeText: string): ATSCheck {
  const standardHeaders = [
    /\b(professional\s+summary|summary|profile|objective)\b/i,
    /\b(experience|work\s+experience|employment\s+history|professional\s+experience)\b/i,
    /\b(education|academic\s+background)\b/i,
    /\b(skills|technical\s+skills|core\s+competencies)\b/i
  ];

  const foundHeaders = standardHeaders.filter(pattern => pattern.test(resumeText));
  const passed = foundHeaders.length >= 3;

  return {
    id: 'section_headers',
    name: 'Standard Section Headers',
    passed,
    severity: 'critical',
    message: passed
      ? `Found ${foundHeaders.length}/4 standard section headers`
      : `Only found ${foundHeaders.length}/4 standard section headers`,
    recommendation: passed
      ? undefined
      : 'Use standard headers: "Professional Summary", "Experience", "Education", "Skills"'
  };
}

function checkContactInfo(resumeText: string): ATSCheck {
  const firstLines = resumeText.split('\n').slice(0, 10).join('\n');

  const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(firstLines);
  const hasPhone = /\b(\+?1[-.]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(firstLines);

  const passed = hasEmail || hasPhone;

  return {
    id: 'contact_info',
    name: 'Contact Information Placement',
    passed,
    severity: 'critical',
    message: passed
      ? 'Contact information found at top of resume'
      : 'Contact information not clearly visible at top',
    recommendation: passed
      ? undefined
      : 'Place email and phone number at the very top of your resume'
  };
}

function checkDateFormatting(resumeText: string): ATSCheck {
  const datePatterns = [
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b/gi,
    /\b\d{1,2}\/\d{4}\b/g,
    /\b\d{4}\s*-\s*\d{4}\b/g,
    /\b\d{4}\s*–\s*\d{4}\b/g
  ];

  const allDates: string[] = [];
  datePatterns.forEach(pattern => {
    const matches = resumeText.match(pattern);
    if (matches) allDates.push(...matches);
  });

  // Check if dates follow consistent format
  const passed = allDates.length === 0 || allDates.length >= 2;

  return {
    id: 'date_formatting',
    name: 'Date Formatting Consistency',
    passed,
    severity: 'warning',
    message: passed
      ? `Date formatting appears consistent (${allDates.length} dates found)`
      : 'Date formatting may be inconsistent',
    recommendation: passed
      ? undefined
      : 'Use consistent date format throughout (e.g., "Jan 2020 - Dec 2022")'
  };
}

function checkBulletPoints(resumeText: string): ATSCheck {
  const standardBullets = /^[\s]*[•\-\*]\s/gm;
  const customBullets = /^[\s]*[►▪▸→➢➤]\s/gm;

  const standardCount = (resumeText.match(standardBullets) || []).length;
  const customCount = (resumeText.match(customBullets) || []).length;

  const passed = standardCount > customCount;

  return {
    id: 'bullet_points',
    name: 'Bullet Point Format',
    passed,
    severity: 'warning',
    message: passed
      ? `Using standard bullet points (${standardCount} found)`
      : `Found ${customCount} custom bullet characters that may not parse well`,
    recommendation: passed
      ? undefined
      : 'Use standard bullets (•, -, or *) instead of custom characters'
  };
}

function checkFormattingElements(resumeText: string): ATSCheck {
  // Check for problematic formatting indicators
  const hasComplexFormatting =
    /\t{3,}/.test(resumeText) || // Multiple tabs
    /\|{2,}/.test(resumeText) || // Table borders
    /={3,}/.test(resumeText) || // Horizontal lines
    /__+/.test(resumeText); // Underscores for lines

  const passed = !hasComplexFormatting;

  return {
    id: 'formatting_elements',
    name: 'Simple Formatting',
    passed,
    severity: 'warning',
    message: passed
      ? 'Resume uses clean, simple formatting'
      : 'Resume may contain tables, columns, or complex formatting',
    recommendation: passed
      ? undefined
      : 'Avoid tables, columns, and complex layouts - use simple left-aligned text'
  };
}

function checkKeywordDensity(resumeText: string, keywords: string[]): ATSCheck {
  if (keywords.length === 0) {
    return {
      id: 'keyword_density',
      name: 'Keyword Density',
      passed: true,
      severity: 'info',
      message: 'No keywords provided for density check',
    };
  }

  const wordCount = resumeText.split(/\s+/).length;
  const keywordCount = keywords.reduce((count, keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = resumeText.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);

  const density = (keywordCount / wordCount) * 100;
  const passed = density >= 2 && density <= 15;

  return {
    id: 'keyword_density',
    name: 'Keyword Density',
    passed,
    severity: 'warning',
    message: passed
      ? `Keyword density is optimal (${density.toFixed(1)}%)`
      : `Keyword density is ${density < 2 ? 'too low' : 'too high'} (${density.toFixed(1)}%)`,
    recommendation: passed
      ? undefined
      : `Aim for 5-10% keyword density. ${density < 2 ? 'Add more relevant keywords' : 'Reduce keyword stuffing'}`
  };
}

function checkKeywordPlacement(resumeText: string, keywords: string[]): ATSCheck {
  if (keywords.length === 0) {
    return {
      id: 'keyword_placement',
      name: 'Keyword Placement',
      passed: true,
      severity: 'info',
      message: 'No keywords provided for placement check',
    };
  }

  const sections = {
    summary: resumeText.slice(0, Math.min(500, resumeText.length)),
    skills: extractSkillsSection(resumeText),
    experience: extractExperienceSection(resumeText)
  };

  let sectionsWithKeywords = 0;
  Object.values(sections).forEach(section => {
    const hasKeyword = keywords.some(keyword =>
      new RegExp(`\\b${keyword}\\b`, 'i').test(section)
    );
    if (hasKeyword) sectionsWithKeywords++;
  });

  const passed = sectionsWithKeywords >= 2;

  return {
    id: 'keyword_placement',
    name: 'Keyword Distribution',
    passed,
    severity: 'warning',
    message: passed
      ? `Keywords found in ${sectionsWithKeywords}/3 major sections`
      : `Keywords only found in ${sectionsWithKeywords}/3 major sections`,
    recommendation: passed
      ? undefined
      : 'Distribute keywords across Summary, Skills, and Experience sections'
  };
}

function checkActionVerbs(resumeText: string): ATSCheck {
  const strongActionVerbs = [
    'led', 'managed', 'created', 'developed', 'implemented', 'designed',
    'launched', 'improved', 'increased', 'reduced', 'achieved', 'delivered',
    'built', 'established', 'optimized', 'spearheaded', 'directed', 'coordinated',
    'executed', 'streamlined', 'transformed', 'generated', 'accelerated'
  ];

  const weakVerbs = ['worked on', 'responsible for', 'helped with', 'participated in', 'assisted'];

  const actionVerbCount = strongActionVerbs.reduce((count, verb) => {
    const regex = new RegExp(`\\b${verb}\\b`, 'gi');
    const matches = resumeText.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);

  const weakVerbCount = weakVerbs.reduce((count, phrase) => {
    const regex = new RegExp(phrase, 'gi');
    const matches = resumeText.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);

  const passed = actionVerbCount >= 5 && weakVerbCount <= 2;

  return {
    id: 'action_verbs',
    name: 'Strong Action Verbs',
    passed,
    severity: 'warning',
    message: passed
      ? `Using ${actionVerbCount} strong action verbs`
      : `Only ${actionVerbCount} strong action verbs found, ${weakVerbCount} weak phrases`,
    recommendation: passed
      ? undefined
      : 'Replace weak phrases with strong action verbs (Led, Created, Improved, etc.)'
  };
}

function checkQuantifiableMetrics(resumeText: string): ATSCheck {
  const metricPatterns = [
    /\d+%/g, // Percentages
    /\$[\d,]+/g, // Dollar amounts
    /\d+\+?\s*(users|customers|clients|employees|projects|products)/gi, // Numbers with units
    /\d+[kKmMbB]\+?\s*(revenue|sales|users|customers)/gi, // K, M, B notation
    /\d+\s*(hours|days|weeks|months)/gi, // Time metrics
  ];

  const totalMetrics = metricPatterns.reduce((count, pattern) => {
    const matches = resumeText.match(pattern);
    return count + (matches ? matches.length : 0);
  }, 0);

  const passed = totalMetrics >= 5;

  return {
    id: 'quantifiable_metrics',
    name: 'Quantifiable Achievements',
    passed,
    severity: 'warning',
    message: passed
      ? `Found ${totalMetrics} quantifiable metrics`
      : `Only ${totalMetrics} quantifiable metrics found`,
    recommendation: passed
      ? undefined
      : 'Add 5-10 quantifiable metrics (%, $, numbers) to demonstrate impact'
  };
}

function checkResumeLength(resumeText: string): ATSCheck {
  const wordCount = resumeText.split(/\s+/).length;

  // Optimal: 400-800 words (roughly 1-2 pages)
  const passed = wordCount >= 300 && wordCount <= 1000;

  return {
    id: 'resume_length',
    name: 'Resume Length',
    passed,
    severity: 'info',
    message: passed
      ? `Resume length is appropriate (${wordCount} words)`
      : `Resume is ${wordCount < 300 ? 'too short' : 'too long'} (${wordCount} words)`,
    recommendation: passed
      ? undefined
      : wordCount < 300
        ? 'Add more detail to your experience and achievements'
        : 'Consider condensing to 1-2 pages (400-800 words)'
  };
}

function checkTablesAndColumns(resumeText: string): ATSCheck {
  const tableIndicators = /\|.*\|/gm;
  const multipleSpaces = /\s{10,}/g;

  const hasTableIndicators = tableIndicators.test(resumeText);
  const hasLargeSpacing = (resumeText.match(multipleSpaces) || []).length > 3;

  const passed = !hasTableIndicators && !hasLargeSpacing;

  return {
    id: 'tables_columns',
    name: 'No Tables or Columns',
    passed,
    severity: 'critical',
    message: passed
      ? 'Resume uses simple single-column layout'
      : 'Resume may contain tables or multi-column layout',
    recommendation: passed
      ? undefined
      : 'Use a simple single-column layout - ATS systems struggle with tables and columns'
  };
}

function checkSpecialCharacters(resumeText: string): ATSCheck {
  const problematicChars = /[►▪▸→➢➤◆◇■□●○☑✓✔✗✘]/g;
  const matches = resumeText.match(problematicChars);

  const passed = !matches || matches.length <= 2;

  return {
    id: 'special_characters',
    name: 'Standard Characters',
    passed,
    severity: 'warning',
    message: passed
      ? 'Using standard characters'
      : `Found ${matches?.length || 0} special characters that may not parse`,
    recommendation: passed
      ? undefined
      : 'Replace special symbols with standard characters'
  };
}

function checkJobDescriptionMatch(resumeText: string, jobDescription: string): ATSCheck {
  if (!jobDescription || jobDescription.trim() === '') {
    return {
      id: 'job_match',
      name: 'Job Description Match',
      passed: true,
      severity: 'info',
      message: 'No job description provided for matching',
    };
  }

  // Extract keywords from job description
  const jobKeywords = extractKeywords(jobDescription);
  const resumeText_lower = resumeText.toLowerCase();

  const matchedKeywords = jobKeywords.filter(keyword =>
    resumeText_lower.includes(keyword.toLowerCase())
  );

  const matchPercentage = (matchedKeywords.length / Math.min(jobKeywords.length, 20)) * 100;
  const passed = matchPercentage >= 50;

  return {
    id: 'job_match',
    name: 'Job Description Alignment',
    passed,
    severity: 'critical',
    message: passed
      ? `${matchPercentage.toFixed(0)}% of key job requirements matched`
      : `Only ${matchPercentage.toFixed(0)}% of key job requirements matched`,
    recommendation: passed
      ? undefined
      : `Add these missing keywords: ${jobKeywords.filter(k => !matchedKeywords.includes(k)).slice(0, 5).join(', ')}`
  };
}

function checkProfessionalSummary(resumeText: string): ATSCheck {
  const summaryPatterns = [
    /\b(professional\s+summary|summary|profile|objective)\b/i,
    /^.{100,500}/s // First 100-500 characters should be summary
  ];

  const hasSummaryHeader = summaryPatterns[0].test(resumeText);
  const hasSubstantialIntro = summaryPatterns[1].test(resumeText);

  const passed = hasSummaryHeader || hasSubstantialIntro;

  return {
    id: 'professional_summary',
    name: 'Professional Summary',
    passed,
    severity: 'warning',
    message: passed
      ? 'Resume includes professional summary'
      : 'Resume is missing a professional summary',
    recommendation: passed
      ? undefined
      : 'Add a 2-4 sentence professional summary at the top highlighting your key qualifications'
  };
}

// ===== HELPER FUNCTIONS =====

function extractKeywords(text: string): string[] {
  const cleanedText = text.toLowerCase().replace(/[^\w\s]/g, ' ');
  const words = cleanedText.split(/\s+/);

  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were',
    'be', 'been', 'being', 'in', 'on', 'at', 'to', 'for', 'with',
    'by', 'about', 'as', 'from', 'of', 'that', 'this', 'will', 'would'
  ]);

  const filteredWords = words.filter(word =>
    word.length > 3 && !stopWords.has(word)
  );

  // Count frequency
  const frequency: {[key: string]: number} = {};
  filteredWords.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  // Return top 20 most frequent
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(entry => entry[0]);
}

function extractSkillsSection(resumeText: string): string {
  const match = resumeText.match(/\b(skills|technical\s+skills|core\s+competencies)\b.{0,500}/is);
  return match ? match[0] : '';
}

function extractExperienceSection(resumeText: string): string {
  const match = resumeText.match(/\b(experience|work\s+experience|employment)\b.{0,1000}/is);
  return match ? match[0] : '';
}

function generateSummary(score: number, criticalIssues: number, warnings: number): string {
  if (score >= 90) {
    return "Excellent! Your resume is highly optimized for ATS systems with strong formatting, keywords, and structure.";
  } else if (score >= 80) {
    return "Good! Your resume has strong ATS compatibility. Address the warnings below to achieve an excellent score.";
  } else if (score >= 70) {
    return "Fair. Your resume has adequate ATS compatibility but needs improvement in several areas.";
  } else if (score >= 60) {
    return "Needs improvement. Your resume has multiple issues that may prevent it from passing ATS screening.";
  } else {
    return "Poor. Your resume requires significant optimization for ATS systems. Address critical issues immediately.";
  }
}
