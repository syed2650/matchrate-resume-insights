
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Extracts job description from a URL, with special handling for LinkedIn.
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
    
    // Handle LinkedIn job posts specifically
    if (url.includes('linkedin.com/jobs/') || url.includes('linkedin.com/job/')) {
      // Extract job title from LinkedIn
      const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].replace(/\s*[\|\-–]\s*.*$/, '').trim();
      }
      
      // Try various LinkedIn selectors for job description
      const descriptionSelectors = [
        /<div\s+class="[^"]*description__text[^"]*">([\s\S]*?)<\/div>/i,
        /<div\s+class="[^"]*jobs-description__content[^"]*">([\s\S]*?)<\/div>/i,
        /<div\s+class="[^"]*jobs-box__html-content[^"]*">([\s\S]*?)<\/div>/i,
        /<div\s+class="[^"]*jobs-description-content__text[^"]*">([\s\S]*?)<\/div>/i
      ];
      
      // Try each selector
      for (const selector of descriptionSelectors) {
        const match = cleanHtml.match(selector);
        if (match && match[1]) {
          let extractedText = match[1];
          
          // Clean up the extracted HTML
          description = extractedText
            .replace(/<[^>]*>/g, ' ') // Remove HTML tags
            .replace(/\s+/g, ' ')      // Normalize whitespace
            .replace(/See more/gi, '') // Remove "See more" buttons
            .replace(/Join now/gi, '') // Remove "Join now" text
            .trim();
          
          if (description.length > 100) {
            console.log(`Successfully extracted LinkedIn job description (${description.length} chars) using selector`);
            break;
          }
        }
      }
      
      // If description is still empty or too short, try a broader approach
      if (!description || description.length < 100) {
        // Look for content div with substantial text
        const contentDivs = cleanHtml.match(/<div[^>]*>([\s\S]*?)<\/div>/gi) || [];
        
        for (const div of contentDivs) {
          const text = div.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          if (text.length > 200 && text.length < 10000 && 
              (text.includes('responsibilities') || text.includes('requirements') || 
               text.includes('qualifications') || text.includes('about the job'))) {
            description = text;
            console.log(`Found job description in content div (${text.length} chars)`);
            break;
          }
        }
      }
    } else {
      // Generic extraction for non-LinkedIn URLs
      // Extract title
      const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].replace(/\s+/g, ' ').trim();
        title = title.replace(/\s*[\|\-–]\s*.*$/, ''); // Remove site name
      }
      
      // Look for job description in meta tags first
      const metaDescription = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
      if (metaDescription && metaDescription[1]) {
        description = metaDescription[1].trim();
      }
      
      // If meta description is not useful, look for common job posting patterns
      if (!description || description.length < 100) {
        // Common section identifiers for job postings
        const jobSectionIds = [
          'job-description', 'jobDescription', 'job_description',
          'description', 'job-details', 'jobDetails',
          'position-description', 'requirements'
        ];
        
        // Try to find sections by ID or class
        for (const sectionId of jobSectionIds) {
          const sectionRegex = new RegExp(`<(?:div|section)[^>]*(?:id|class)=["'](?:[^"']*\\s)?${sectionId}(?:\\s[^"']*)?["'][^>]*>([\\s\\S]*?)<\/(?:div|section)>`, 'i');
          const match = cleanHtml.match(sectionRegex);
          
          if (match && match[1]) {
            const sectionText = match[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
            if (sectionText.length > 100) {
              description = sectionText;
              console.log(`Found job description by section identifier: ${sectionId}`);
              break;
            }
          }
        }
      }
      
      // If still no good description, extract a reasonable chunk of main content
      if (!description || description.length < 100) {
        // Find the main content area (usually has the most text)
        let mainContent = '';
        const contentMatches = cleanHtml.match(/<(?:div|section|article|main)[^>]*>([\\s\\S]*?)<\/(?:div|section|article|main)>/gi) || [];
        
        for (const content of contentMatches) {
          const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          if (text.length > mainContent.length && text.length < 10000) {
            mainContent = text;
          }
        }
        
        description = mainContent;
      }
    }
    
    // If we still don't have a description, use generic text extraction
    if (!description || description.length < 100) {
      // Remove common irrelevant sections
      cleanHtml = cleanHtml
        .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
        .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
        .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '');
      
      // Convert remaining HTML to text
      const textContent = cleanHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      
      // Take a reasonable chunk from the middle (likely to be the main content)
      const middleStartPos = Math.floor(textContent.length / 3);
      description = textContent.substring(middleStartPos, middleStartPos + 3000);
    }
    
    // Limit description length to 3000 tokens (approximately 3000 words)
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
