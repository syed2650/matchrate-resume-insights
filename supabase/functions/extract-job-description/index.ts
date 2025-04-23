
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Extracts job description from a URL.
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
    
    // Simple text extraction from HTML
    let textContent = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
                          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
                          .replace(/<[^>]*>/g, ' ')
                          .replace(/\s+/g, ' ')
                          .trim();
    
    // Find potential job description
    let description = '';
    let title = '';
    
    // Look for likely job description sections
    const jobKeywords = ['job description', 'responsibilities', 'requirements', 'qualifications'];
    
    // Try to extract title
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].replace(/\s+/g, ' ').trim();
      // Remove common website name suffixes
      title = title.replace(/\s*[\|\-–]\s*.*$/, '');
    }
    
    // Extract a reasonable chunk of text that might contain the job description
    const contentStart = Math.max(0, textContent.toLowerCase().indexOf('job '));
    if (contentStart >= 0) {
      description = textContent.substring(contentStart, Math.min(contentStart + 4000, textContent.length));
    } else {
      // Fallback: take the first 4000 chars from the middle of the page
      const middle = Math.floor(textContent.length / 3);
      description = textContent.substring(middle, Math.min(middle + 4000, textContent.length));
    }
    
    console.log(`Successfully extracted job description (${description.length} chars)`);
    
    return { 
      description: description, 
      title: title 
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
