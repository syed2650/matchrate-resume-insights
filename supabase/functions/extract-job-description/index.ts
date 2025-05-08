
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
    } else {
      // Generic extraction for other job sites
      description = extractGenericDescription(cleanHtml);
    }
    
    // If description is still empty or too short, try the generic approach as fallback
    if (!description || description.length < 100) {
      description = extractGenericDescription(cleanHtml);
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
    'What You'll Do', 'Responsibilities', 'About This Role'
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
         text.includes('what you will do') || text.includes('what you'll do') ||
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
