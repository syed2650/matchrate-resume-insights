
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Extracts job description from a URL, with specialized handling for common job sites.
 */
async function fetchJobDescription(url: string): Promise<{ description: string; title?: string }> {
  console.log(`Attempting to fetch job description from URL: ${url}`);
  
  try {
    // Validate URL
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      throw new Error('Invalid URL format');
    }
    
    // Attempt to fetch content from the URL
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch job description: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Clean HTML (remove scripts, styles)
    let cleanHtml = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    
    let description = '';
    let title = '';
    
    // Extract title from meta tags first (more reliable)
    const metaTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
                      html.match(/<meta\s+name=["']title["']\s+content=["']([^"']+)["']/i);
    
    if (metaTitle && metaTitle[1]) {
      title = metaTitle[1].trim();
    } else {
      // Fallback to title tag
      const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].replace(/\s*[\|\-–]\s*.*$/, '').trim();
      }
    }
    
    // Site-specific handling
    if (url.includes('linkedin.com/jobs/') || url.includes('linkedin.com/job/')) {
      // Handle LinkedIn job posts
      description = extractLinkedInDescription(cleanHtml);
    } else if (url.includes('salesforce.com/')) {
      // Handle Salesforce job posts
      description = extractSalesforceDescription(cleanHtml);
    } else if (url.includes('indeed.com/')) {
      // Handle Indeed job posts
      description = extractIndeedDescription(cleanHtml);
    } else if (url.includes('glassdoor.com/')) {
      // Handle Glassdoor job posts
      description = extractGlassdoorDescription(cleanHtml);
    } else if (url.includes('totaljobs.com/')) {
      // Handle TotalJobs posts
      description = extractTotalJobsDescription(cleanHtml);
    } else if (url.includes('monster.com/')) {
      // Handle Monster job posts
      description = extractMonsterDescription(cleanHtml);
    } else if (url.includes('reed.co.uk/')) {
      // Handle Reed job posts
      description = extractReedDescription(cleanHtml);
    } else if (url.includes('workday.com/')) {
      // Handle Workday job posts
      description = extractWorkdayDescription(cleanHtml);
    } else if (url.includes('lever.co/')) {
      // Handle Lever job posts
      description = extractLeverDescription(cleanHtml);
    } else if (url.includes('greenhouse.io/')) {
      // Handle Greenhouse job posts
      description = extractGreenhouseDescription(cleanHtml);
    } else {
      // Generic extraction for other job sites
      description = extractGenericDescription(cleanHtml);
    }
    
    // If description is still empty or too short, try the generic approach as fallback
    if (!description || description.length < 100) {
      description = extractGenericDescription(cleanHtml);
      
      // If still no luck, try aggressive extraction
      if (!description || description.length < 100) {
        description = extractAggressiveDescription(cleanHtml);
      }
    }
    
    // Limit description length to 12000 chars
    if (description.length > 12000) {
      description = description.substring(0, 12000) + '...';
    }
    
    console.log(`Successfully extracted job description (${description.length} chars)`);
    
    return { 
      description: description || "Could not extract job description. Please paste it manually.", 
      title: title || "Job Position" 
    };
  } catch (error) {
    console.error(`Error fetching job description: ${error.message}`);
    throw new Error(`Failed to extract job description: ${error.message}`);
  }
}

function extractLinkedInDescription(html: string): string {
  // Try various LinkedIn selectors for job description
  const descriptionSelectors = [
    /<div\s+class="[^"]*description__text[^"]*">([\s\S]*?)<\/div>/i,
    /<div\s+class="[^"]*jobs-description__content[^"]*">([\s\S]*?)<\/div>/i,
    /<div\s+class="[^"]*jobs-box__html-content[^"]*">([\s\S]*?)<\/div>/i,
    /<div\s+class="[^"]*jobs-description-content__text[^"]*">([\s\S]*?)<\/div>/i
  ];
  
  // Try each selector
  for (const selector of descriptionSelectors) {
    const match = html.match(selector);
    if (match && match[1]) {
      let extractedText = match[1];
      
      // Clean up the extracted HTML
      return extractedText
        .replace(/<[^>]*>/g, ' ') // Remove HTML tags
        .replace(/\s+/g, ' ')      // Normalize whitespace
        .replace(/See more/gi, '') // Remove "See more" buttons
        .replace(/Join now/gi, '') // Remove "Join now" text
        .trim();
    }
  }
  
  // If selectors didn't work, look for content div with substantial text
  return extractDescriptionFromContentDivs(html);
}

function extractSalesforceDescription(html: string): string {
  // Salesforce-specific selectors
  const salesforceSelectors = [
    /<section\s+class="[^"]*job-description[^"]*">([\s\S]*?)<\/section>/i,
    /<div\s+class="[^"]*job-description[^"]*">([\s\S]*?)<\/div>/i,
    /<div\s+data-testid="job-description">([\s\S]*?)<\/div>/i,
    /<div\s+class="[^"]*description[^"]*">([\s\S]*?)<\/div>/i
  ];
  
  for (const selector of salesforceSelectors) {
    const match = html.match(selector);
    if (match && match[1]) {
      return cleanExtractedHtml(match[1]);
    }
  }
  
  // If we can't find a matching selector, try looking for the job responsibilities section
  const responsibilitiesSection = html.match(/<h\d[^>]*>(?:Responsibilities|What you'll do)[^<]*<\/h\d>[\s\S]*?(<ul>[\s\S]*?<\/ul>)/i);
  if (responsibilitiesSection && responsibilitiesSection[1]) {
    const requirementsSection = html.match(/<h\d[^>]*>(?:Requirements|What we need)[^<]*<\/h\d>[\s\S]*?(<ul>[\s\S]*?<\/ul>)/i);
    
    let fullDescription = cleanExtractedHtml(responsibilitiesSection[1]);
    if (requirementsSection && requirementsSection[1]) {
      fullDescription += "\n\n" + cleanExtractedHtml(requirementsSection[1]);
    }
    
    if (fullDescription.length > 200) {
      return fullDescription;
    }
  }
  
  return extractDescriptionFromContentDivs(html);
}

function extractIndeedDescription(html: string): string {
  // Indeed-specific selectors
  const indeedSelectors = [
    /<div\s+id="jobDescriptionText">([\s\S]*?)<\/div>/i,
    /<div\s+class="[^"]*jobsearch-JobComponent-description[^"]*">([\s\S]*?)<\/div>/i
  ];
  
  for (const selector of indeedSelectors) {
    const match = html.match(selector);
    if (match && match[1]) {
      return cleanExtractedHtml(match[1]);
    }
  }
  
  return extractDescriptionFromContentDivs(html);
}

function extractGlassdoorDescription(html: string): string {
  // Glassdoor-specific selectors
  const glassdoorSelectors = [
    /<div\s+class="[^"]*jobDescriptionContent[^"]*">([\s\S]*?)<\/div>/i,
    /<div\s+data-test="description">([\s\S]*?)<\/div>/i,
    /<div\s+class="[^"]*desc[^"]*">([\s\S]*?)<\/div>/i
  ];
  
  for (const selector of glassdoorSelectors) {
    const match = html.match(selector);
    if (match && match[1]) {
      return cleanExtractedHtml(match[1]);
    }
  }
  
  return extractDescriptionFromContentDivs(html);
}

function extractTotalJobsDescription(html: string): string {
  // TotalJobs-specific selectors
  const totalJobsSelectors = [
    /<div\s+class="job-description">([\s\S]*?)<\/div>/i,
    /<div\s+id="job-description">([\s\S]*?)<\/div>/i,
    /<div\s+class="[^"]*job-description[^"]*">([\s\S]*?)<\/div>/i,
    /<div\s+data-at="job-description">([\s\S]*?)<\/div>/i,
    /<article[^>]*>([\s\S]*?)<\/article>/i
  ];
  
  for (const selector of totalJobsSelectors) {
    const match = html.match(selector);
    if (match && match[1]) {
      return cleanExtractedHtml(match[1]);
    }
  }
  
  // Look for content with job-related keywords
  const contentDivs = html.match(/<div[^>]*>([\s\S]*?)<\/div>/gi) || [];
  for (const div of contentDivs) {
    if (div.includes('job description') || div.includes('role') || div.includes('responsibilities') || div.includes('requirements')) {
      const cleanText = cleanExtractedHtml(div);
      if (cleanText.length > 150) {
        return cleanText;
      }
    }
  }
  
  // If all else fails, try to find main content
  return extractDescriptionFromContentDivs(html);
}

function extractMonsterDescription(html: string): string {
  // Monster-specific selectors
  const monsterSelectors = [
    /<div\s+class="[^"]*job-description[^"]*">([\s\S]*?)<\/div>/i,
    /<section\s+class="[^"]*job-description[^"]*">([\s\S]*?)<\/section>/i,
    /<div\s+id="JobDescription">([\s\S]*?)<\/div>/i
  ];
  
  for (const selector of monsterSelectors) {
    const match = html.match(selector);
    if (match && match[1]) {
      return cleanExtractedHtml(match[1]);
    }
  }
  
  return extractDescriptionFromContentDivs(html);
}

function extractReedDescription(html: string): string {
  // Reed-specific selectors
  const reedSelectors = [
    /<div\s+class="[^"]*job-description[^"]*">([\s\S]*?)<\/div>/i,
    /<section\s+class="[^"]*description[^"]*">([\s\S]*?)<\/section>/i,
    /<div\s+data-qa="job-description">([\s\S]*?)<\/div>/i
  ];
  
  for (const selector of reedSelectors) {
    const match = html.match(selector);
    if (match && match[1]) {
      return cleanExtractedHtml(match[1]);
    }
  }
  
  return extractDescriptionFromContentDivs(html);
}

function extractWorkdayDescription(html: string): string {
  // Workday-specific selectors
  const workdaySelectors = [
    /<div\s+class="[^"]*job-description[^"]*">([\s\S]*?)<\/div>/i,
    /<div\s+id="job-description">([\s\S]*?)<\/div>/i,
    /<div\s+class="[^"]*WDDF">([\s\S]*?)<\/div>/i
  ];
  
  for (const selector of workdaySelectors) {
    const match = html.match(selector);
    if (match && match[1]) {
      return cleanExtractedHtml(match[1]);
    }
  }
  
  // Look for common Workday sections
  const jobRequisites = html.match(/<h3>Job Requisites<\/h3>([\s\S]*?)<\/div>/i);
  const jobDescription = html.match(/<h3>Description<\/h3>([\s\S]*?)<\/div>/i);
  
  let fullDescription = '';
  if (jobDescription && jobDescription[1]) {
    fullDescription += cleanExtractedHtml(jobDescription[1]) + "\n\n";
  }
  if (jobRequisites && jobRequisites[1]) {
    fullDescription += cleanExtractedHtml(jobRequisites[1]);
  }
  
  if (fullDescription.length > 150) {
    return fullDescription;
  }
  
  return extractDescriptionFromContentDivs(html);
}

function extractLeverDescription(html: string): string {
  // Lever-specific selectors
  const leverSelectors = [
    /<div\s+class="[^"]*posting-page[^"]*">([\s\S]*?)<\/div>/i,
    /<div\s+class="[^"]*posting-description[^"]*">([\s\S]*?)<\/div>/i,
    /<div\s+class="[^"]*job-description[^"]*">([\s\S]*?)<\/div>/i
  ];
  
  for (const selector of leverSelectors) {
    const match = html.match(selector);
    if (match && match[1]) {
      return cleanExtractedHtml(match[1]);
    }
  }
  
  return extractDescriptionFromContentDivs(html);
}

function extractGreenhouseDescription(html: string): string {
  // Greenhouse-specific selectors
  const greenhouseSelectors = [
    /<div\s+id="content">([\s\S]*?)<\/div>/i,
    /<div\s+class="[^"]*content[^"]*">([\s\S]*?)<\/div>/i,
    /<div\s+class="[^"]*job-description[^"]*">([\s\S]*?)<\/div>/i
  ];
  
  for (const selector of greenhouseSelectors) {
    const match = html.match(selector);
    if (match && match[1]) {
      return cleanExtractedHtml(match[1]);
    }
  }
  
  return extractDescriptionFromContentDivs(html);
}

function extractGenericDescription(html: string): string {
  // Look for job description in meta tags first
  const metaDescription = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  if (metaDescription && metaDescription[1] && metaDescription[1].length > 100) {
    return metaDescription[1].trim();
  }
  
  // Common section identifiers for job postings
  const jobSectionIds = [
    'job-description', 'jobDescription', 'job_description',
    'description', 'job-details', 'jobDetails',
    'position-description', 'requirements', 'job-responsibilities',
    'jobContent', 'vacancy-description', 'career-detail', 'job-detail-description'
  ];
  
  // Try to find sections by ID or class
  for (const sectionId of jobSectionIds) {
    const sectionRegex = new RegExp(`<(?:div|section)[^>]*(?:id|class)=["'](?:[^"']*\\s)?${sectionId}(?:\\s[^"']*)?["'][^>]*>([\\s\\S]*?)<\/(?:div|section)>`, 'i');
    const match = html.match(sectionRegex);
    
    if (match && match[1]) {
      const sectionText = cleanExtractedHtml(match[1]);
      if (sectionText.length > 100) {
        return sectionText;
      }
    }
  }
  
  // Look for specific headers that typically introduce job descriptions
  const headings = [
    'Job Description', 'About the Role', 'Position Summary',
    'The Role', 'About the Position', 'Job Summary',
    'What You\u2019ll Do', 'Responsibilities', 'About This Role'
  ];
  
  for (const heading of headings) {
    const headingRegex = new RegExp(`<h\\d[^>]*>\\s*${heading}\\s*<\/h\\d>\\s*(<[\\s\\S]*?(?:<\/div>|<\/section>))`, 'i');
    const match = html.match(headingRegex);
    
    if (match && match[1]) {
      const sectionText = cleanExtractedHtml(match[1]);
      if (sectionText.length > 100) {
        return sectionText;
      }
    }
  }
  
  return extractDescriptionFromContentDivs(html);
}

function extractAggressiveDescription(html: string): string {
  // More aggressive approach - look for any significant text blocks
  const paragraphs = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
  const lists = html.match(/<ul[^>]*>([\s\S]*?)<\/ul>/gi) || [];
  
  let combinedText = '';
  
  // Extract paragraphs that look job-related
  for (const p of paragraphs) {
    const text = cleanExtractedHtml(p);
    if (text.length > 50 && 
        (text.toLowerCase().includes('experience') || 
         text.toLowerCase().includes('skill') || 
         text.toLowerCase().includes('responsib') || 
         text.toLowerCase().includes('qualifi') || 
         text.toLowerCase().includes('about the') || 
         text.toLowerCase().includes('position'))) {
      combinedText += text + '\n\n';
    }
  }
  
  // Extract lists
  for (const list of lists) {
    const text = cleanExtractedHtml(list);
    if (text.length > 50) {
      combinedText += text + '\n\n';
    }
  }
  
  // If we found some relevant text
  if (combinedText.length > 200) {
    return combinedText.trim();
  }
  
  // Last resort: extract the longest text block from the page
  const allTextBlocks = html.match(/<(?:div|section|article)[^>]*>([\s\S]*?)<\/(?:div|section|article)>/gi) || [];
  let longestText = '';
  
  for (const block of allTextBlocks) {
    const text = cleanExtractedHtml(block);
    if (text.length > longestText.length && text.length < 20000) {
      longestText = text;
    }
  }
  
  return longestText;
}

function extractDescriptionFromContentDivs(html: string): string {
  // Look for content div with substantial text
  const contentDivs = html.match(/<(?:div|section)[^>]*>([\s\S]*?)(?:<\/div>|<\/section>)/gi) || [];
  
  let longestText = "";
  
  for (const div of contentDivs) {
    const text = cleanExtractedHtml(div);
    
    // Look for divs with substantial text that have job-related keywords
    if (text.length > 200 && text.length < 15000 && 
        (text.includes('responsibilities') || text.includes('requirements') || 
         text.includes('qualifications') || text.includes('about the job') ||
         text.includes('job summary') || text.includes('position') ||
         text.includes('what you will do') || text.includes('what you\u2019ll do') ||
         text.includes('experience') || text.includes('skills needed'))) {
      
      if (text.length > longestText.length) {
        longestText = text;
      }
    }
  }
  
  if (longestText.length > 200) {
    return longestText;
  }
  
  // If we still don't have good text, get the longest content div that's reasonably sized
  let bestText = "";
  for (const div of contentDivs) {
    const text = cleanExtractedHtml(div);
    if (text.length > 200 && text.length < 20000 && text.length > bestText.length) {
      bestText = text;
    }
  }
  
  return bestText;
}

function cleanExtractedHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')       // Remove HTML tags
    .replace(/\s+/g, ' ')           // Normalize whitespace
    .replace(/\s+([.,;:!?])/g, '$1') // Remove spaces before punctuation
    .trim();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { url } = await req.json();
    
    if (!url) {
      throw new Error('No URL provided');
    }
    
    console.log(`Received extraction request for URL: ${url}`);
    
    const { description, title } = await fetchJobDescription(url);
    
    if (!description) {
      return new Response(
        JSON.stringify({ error: 'Could not extract meaningful content from the URL' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    return new Response(
      JSON.stringify({ description, title }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in extract-job-description function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to extract job description' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
