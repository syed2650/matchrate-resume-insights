
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Extract job title and company name from HTML
 */
function extractJobMetadata(html: string, url: string): { title?: string, company?: string } {
  const metadata: { title?: string, company?: string } = {};
  
  // Extract title based on common patterns
  const titleMatches = html.match(/<title>([^<]*)<\/title>/i);
  if (titleMatches && titleMatches[1]) {
    let title = titleMatches[1].replace(/\s+/g, ' ').trim();
    
    // Clean up title
    if (title.includes('|')) {
      // Format: "Job Title | Company"
      const parts = title.split('|');
      metadata.title = parts[0].trim();
      if (parts[1]) metadata.company = parts[1].trim();
    } else if (title.includes(' - ')) {
      // Format: "Job Title - Company" 
      const parts = title.split(' - ');
      metadata.title = parts[0].trim();
      if (parts[1]) metadata.company = parts[1].trim();
    } else if (title.includes(' at ')) {
      // Format: "Job Title at Company"
      const parts = title.split(' at ');
      metadata.title = parts[0].trim();
      if (parts[1]) metadata.company = parts[1].trim();
    } else {
      metadata.title = title;
    }
  }
  
  // LinkedIn-specific extractors
  if (url.includes('linkedin.com')) {
    const jobTitleMatch = html.match(/<h1[^>]*class="[^"]*job-title[^"]*"[^>]*>([^<]+)<\/h1>/i);
    if (jobTitleMatch && jobTitleMatch[1]) {
      metadata.title = jobTitleMatch[1].trim();
    }
    
    const companyMatch = html.match(/<span[^>]*class="[^"]*company-name[^"]*"[^>]*>([^<]+)<\/span>/i);
    if (companyMatch && companyMatch[1]) {
      metadata.company = companyMatch[1].trim();
    }
  }
  
  return metadata;
}

/**
 * Extract job description from HTML
 */
function extractJobDescription(html: string, url: string): string {
  // Common job description container patterns
  const patterns = [
    /<div[^>]*class="[^"]*job-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*id="job-description"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<section[^>]*class="[^"]*job-description[^"]*"[^>]*>([\s\S]*?)<\/section>/i,
  ];
  
  // Try each pattern
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return cleanHtml(match[1]);
    }
  }
  
  // LinkedIn specific patterns
  if (url.includes('linkedin.com')) {
    const liMatch = html.match(/<div[^>]*class="[^"]*description__text[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    if (liMatch && liMatch[1]) {
      return cleanHtml(liMatch[1]);
    }
  }
  
  // Indeed specific patterns
  if (url.includes('indeed.com')) {
    const indeedMatch = html.match(/<div[^>]*id="jobDescriptionText"[^>]*>([\s\S]*?)<\/div>/i);
    if (indeedMatch && indeedMatch[1]) {
      return cleanHtml(indeedMatch[1]);
    }
  }
  
  // If no specific pattern works, take a portion of the page content
  const cleanedHtml = cleanHtml(html);
  // Extract a reasonable portion in the middle where job descriptions often are
  const middleStart = Math.floor(cleanedHtml.length * 0.3);
  const extractLength = Math.floor(cleanedHtml.length * 0.4);
  return cleanedHtml.substr(middleStart, extractLength);
}

/**
 * Clean HTML content to plain text
 */
function cleanHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
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
      throw new Error('URL is required');
    }
    
    // Validate URL
    try {
      new URL(url);
    } catch (e) {
      throw new Error('Invalid URL format');
    }
    
    console.log(`Extracting job description from: ${url}`);
    
    // Fetch the job page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText} (${response.status})`);
    }
    
    const html = await response.text();
    
    // Extract job data
    const metadata = extractJobMetadata(html, url);
    const description = extractJobDescription(html, url);
    
    return new Response(JSON.stringify({
      title: metadata.title || '',
      company: metadata.company || '',
      description,
      url
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in extract-job-description function:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
