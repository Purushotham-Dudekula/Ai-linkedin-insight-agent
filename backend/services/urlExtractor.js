import fetch from 'node-fetch';

/**
 * Check if a string is a URL
 */
export function isURL(str) {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Extract content from LinkedIn post URL
 * Note: This is a simplified version. LinkedIn requires authentication for API access.
 * For production, you'd need to use LinkedIn API or a scraping service.
 */
export async function extractLinkedInContent(url) {
  try {
    // Validate LinkedIn URL
    if (!url.includes('linkedin.com')) {
      throw new Error('URL must be a LinkedIn post URL');
    }

    // Fetch the page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const html = await response.text();
    
    // Try to extract post content from meta tags or structured data
    // This is a simplified extraction - LinkedIn's actual structure may vary
    const metaDescriptionMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);
    const metaTitleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
    
    let extractedText = '';
    
    if (metaDescriptionMatch) {
      extractedText = metaDescriptionMatch[1];
    } else if (metaTitleMatch) {
      extractedText = metaTitleMatch[1];
    } else {
      // Fallback: try to extract from article or main content
      const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
      if (articleMatch) {
        // Remove HTML tags
        extractedText = articleMatch[1].replace(/<[^>]+>/g, ' ').trim();
      }
    }

    if (!extractedText || extractedText.length < 10) {
      // If extraction fails, provide helpful error message
      throw new Error('Could not extract content from LinkedIn URL. LinkedIn requires authentication to access post content. Please paste the post text directly instead.');
    }

    return extractedText.trim();
  } catch (error) {
    console.error('Error extracting LinkedIn content:', error);
    throw new Error(`Failed to extract content from URL: ${error.message}`);
  }
}

