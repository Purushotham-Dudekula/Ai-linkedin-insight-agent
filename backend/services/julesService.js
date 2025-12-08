import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

// Auto-detect API provider based on key format and set appropriate endpoint
function getApiConfig() {
  const apiKey = process.env.JULES_API_KEY || process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    return { url: null, model: null, isOpenRouter: false };
  }

  // Check if explicitly set in env
  if (process.env.JULES_API_URL) {
    const isOpenRouter = process.env.JULES_API_URL.includes('openrouter');
    return {
      url: process.env.JULES_API_URL,
      model: isOpenRouter ? 'openai/gpt-3.5-turbo' : 'gpt-3.5-turbo',
      isOpenRouter: isOpenRouter
    };
  }

  if (process.env.OPENAI_API_URL) {
    return {
      url: process.env.OPENAI_API_URL,
      model: 'gpt-3.5-turbo',
      isOpenRouter: false
    };
  }

  // Auto-detect based on key format
  // OpenRouter keys start with "sk-or-v1" or "sk-or-"
  if (apiKey.startsWith('sk-or-v1') || apiKey.startsWith('sk-or-')) {
    return {
      url: 'https://openrouter.ai/api/v1/chat/completions',
      model: 'openai/gpt-3.5-turbo',
      isOpenRouter: true
    };
  }

  // OpenAI keys start with "sk-" (but not "sk-or-")
  if (apiKey.startsWith('sk-')) {
    return {
      url: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-3.5-turbo',
      isOpenRouter: false
    };
  }

  // Default to OpenAI
  return {
    url: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    isOpenRouter: false
  };
}

/**
 * Call Jules API with a prompt
 */
async function callJulesAPI(prompt, systemPrompt = null) {
  try {
    const messages = [];
    
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    }
    
    messages.push({
      role: 'user',
      content: prompt
    });

    // Get API configuration (recalculate to ensure latest env vars)
    const apiConfig = getApiConfig();
    const apiKey = process.env.JULES_API_KEY || process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      // No API key - use fallback mode
      console.log('⚠️  No API key found. Using fallback mode...');
      const { processLinkedInPostFallback } = await import('./fallbackService.js');
      throw new Error('FALLBACK_MODE'); // Special error to trigger fallback
    }

    if (!apiConfig.url) {
      throw new Error('API URL is not configured. Please set JULES_API_URL or OPENAI_API_URL in .env file');
    }

    console.log(`Calling API: ${apiConfig.url}`);
    console.log(`Using API key: ${apiKey.substring(0, 10)}...`);
    console.log(`Provider: ${apiConfig.isOpenRouter ? 'OpenRouter' : 'OpenAI'}`);
    console.log(`Model: ${apiConfig.model}`);
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
    
    // Add required headers for OpenRouter
    if (apiConfig.isOpenRouter) {
      headers['HTTP-Referer'] = 'http://localhost:3001';
      headers['X-Title'] = 'LinkedIn Insight Agent';
    }
    
    const response = await fetch(apiConfig.url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        model: apiConfig.model, // Auto-selected based on provider
        messages: messages,
        temperature: 0.7,
        max_tokens: 300 // Reduced tokens for cost efficiency
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Jules API error: ${response.status}`;
      
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error) {
          errorMessage = errorData.error.message || errorText;
          
          // Provide helpful messages for common errors
          if (response.status === 401 || errorMessage.includes('Incorrect API key') || errorMessage.includes('invalid_api_key') || errorMessage.includes('Unauthorized') || errorMessage.includes('User not found')) {
            // Invalid API key - trigger fallback mode
            throw new Error('INVALID_API_KEY');
          } else if (response.status === 402 || errorMessage.includes('credits')) {
            errorMessage = 'Insufficient API credits. Please add credits to your OpenRouter account at https://openrouter.ai/settings/credits or use a different API key with credits.';
          } else if (errorMessage.includes('User not found') || errorMessage.includes('user not found')) {
            errorMessage = 'API key is invalid or the account does not exist. Please verify your OpenRouter API key at https://openrouter.ai/keys.';
          }
        }
      } catch (e) {
        errorMessage = errorText || `HTTP ${response.status} error`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error calling Jules API:', error);
    throw error;
  }
}

/**
 * Generate summary of LinkedIn post
 */
export async function generateSummary(postText) {
  const prompt = `Please provide a concise summary (2-3 sentences) of the following LinkedIn post:\n\n${postText}`;
  const systemPrompt = 'You are a helpful assistant that summarizes LinkedIn posts clearly and concisely.';
  return await callJulesAPI(prompt, systemPrompt);
}

/**
 * Extract main idea from LinkedIn post
 */
export async function extractMainIdea(postText) {
  const prompt = `What is the main idea or key message of this LinkedIn post? Provide a single, clear sentence:\n\n${postText}`;
  const systemPrompt = 'You are an expert at identifying core messages and main ideas from social media posts.';
  return await callJulesAPI(prompt, systemPrompt);
}

/**
 * Generate actionable steps
 */
export async function generateActionableSteps(postText) {
  const prompt = `Based on this LinkedIn post, provide 3 prioritized actionable steps that someone could take. Format as a numbered list:\n\n${postText}`;
  const systemPrompt = 'You are a productivity expert that extracts actionable insights from content. Provide clear, specific, prioritized steps.';
  const response = await callJulesAPI(prompt, systemPrompt);
  
  // Parse the response into an array of steps
  const steps = response
    .split('\n')
    .filter(line => line.trim().match(/^\d+[\.\)]/))
    .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim())
    .filter(step => step.length > 0)
    .slice(0, 3);
  
  return steps.length > 0 ? steps : ['Review the post content', 'Identify key takeaways', 'Plan next steps'];
}

/**
 * Generate project ideas (optional)
 */
export async function generateProjectIdeas(postText) {
  const prompt = `Based on this LinkedIn post, suggest 2-3 project ideas that could be inspired by or related to this content. Be creative and practical:\n\n${postText}`;
  const systemPrompt = 'You are a creative project advisor that generates practical and inspiring project ideas.';
  const response = await callJulesAPI(prompt, systemPrompt);
  
  // Parse project ideas
  const ideas = response
    .split('\n')
    .filter(line => line.trim().match(/^[-*•]\s|\d+[\.\)]/))
    .map(line => line.replace(/^[-*•]\s*|\d+[\.\)]\s*/, '').trim())
    .filter(idea => idea.length > 0)
    .slice(0, 3);
  
  return ideas.length > 0 ? ideas : [];
}

/**
 * Analyze sentiment of the post
 */
export async function analyzeSentiment(postText) {
  const prompt = `Analyze the sentiment of this LinkedIn post. Respond with ONLY a JSON object in this exact format: {"sentiment": "positive/negative/neutral", "confidence": 0.0-1.0, "emotions": ["emotion1", "emotion2"], "tone": "professional/casual/inspirational/etc"}\n\n${postText}`;
  const systemPrompt = 'You are a sentiment analysis expert. Always respond with valid JSON only.';
  const response = await callJulesAPI(prompt, systemPrompt);
  
  try {
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Error parsing sentiment JSON:', e);
  }
  
  // Fallback
  return {
    sentiment: 'neutral',
    confidence: 0.5,
    emotions: ['professional'],
    tone: 'professional'
  };
}

/**
 * Extract key topics and tags
 */
export async function extractKeyTopics(postText) {
  const prompt = `Extract the main topics and keywords from this LinkedIn post. Provide 3-5 key topics as a comma-separated list:\n\n${postText}`;
  const systemPrompt = 'You are an expert at identifying key topics and themes in content. Provide concise, relevant topics.';
  const response = await callJulesAPI(prompt, systemPrompt);
  
  // Parse topics
  const topics = response
    .split(/[,;]/)
    .map(t => t.trim())
    .filter(t => t.length > 0)
    .slice(0, 5);
  
  return topics.length > 0 ? topics : ['General', 'Professional'];
}

/**
 * Identify target audience
 */
export async function identifyTargetAudience(postText) {
  const prompt = `Who is the target audience for this LinkedIn post? Describe the primary audience in 1-2 sentences:\n\n${postText}`;
  const systemPrompt = 'You are a marketing expert that identifies target audiences for content.';
  return await callJulesAPI(prompt, systemPrompt);
}

/**
 * Calculate post quality score and provide improvement suggestions
 */
export async function analyzePostQuality(postText) {
  const prompt = `Analyze this LinkedIn post and provide: 1) A quality score from 1-10, 2) 2-3 specific suggestions for improvement. Respond in JSON format: {"score": 8, "suggestions": ["suggestion1", "suggestion2"], "strengths": ["strength1"], "weaknesses": ["weakness1"]}\n\n${postText}`;
  const systemPrompt = 'You are a content quality expert. Always respond with valid JSON only.';
  const response = await callJulesAPI(prompt, systemPrompt);
  
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Error parsing quality JSON:', e);
  }
  
  // Fallback
  return {
    score: 7,
    suggestions: ['Add more specific examples', 'Include a clear call-to-action'],
    strengths: ['Clear message'],
    weaknesses: ['Could be more engaging']
  };
}

/**
 * Process LinkedIn post and generate all insights
 */
export async function processLinkedInPost(postText) {
  try {
    // Try to use API first, fallback to local processing if credits unavailable
    try {
      // Run core AI tasks first (most important) - these are essential
      const [summary, mainIdea, actionableSteps] = await Promise.all([
        generateSummary(postText),
        extractMainIdea(postText),
        generateActionableSteps(postText)
      ]);

      // Try to get additional insights, but use defaults if they fail (to save credits)
      let projectIdeas = [];
      let sentiment = { sentiment: 'neutral', confidence: 0.5, emotions: ['professional'], tone: 'professional' };
      let keyTopics = [];
      let targetAudience = 'General professional audience';
      let qualityAnalysis = { score: 7, suggestions: ['Add more specific examples'], strengths: ['Clear message'], weaknesses: ['Could be more engaging'] };

      try {
        // Run additional features - if they fail, we'll use defaults
        const additionalResults = await Promise.allSettled([
          generateProjectIdeas(postText),
          analyzeSentiment(postText),
          extractKeyTopics(postText),
          identifyTargetAudience(postText),
          analyzePostQuality(postText)
        ]);

        // Extract results, using defaults if any failed
        projectIdeas = additionalResults[0].status === 'fulfilled' ? additionalResults[0].value : [];
        sentiment = additionalResults[1].status === 'fulfilled' ? additionalResults[1].value : sentiment;
        keyTopics = additionalResults[2].status === 'fulfilled' ? additionalResults[2].value : [];
        targetAudience = additionalResults[3].status === 'fulfilled' ? additionalResults[3].value.trim() : targetAudience;
        qualityAnalysis = additionalResults[4].status === 'fulfilled' ? additionalResults[4].value : qualityAnalysis;
      } catch (additionalError) {
        console.warn('Some additional features failed, using defaults:', additionalError.message);
        // Continue with defaults - core features already succeeded
      }

      return {
        summary: summary.trim(),
        mainIdea: mainIdea.trim(),
        actionableSteps: actionableSteps,
        projectIdeas: projectIdeas,
        sentiment: sentiment,
        keyTopics: keyTopics,
        targetAudience: targetAudience,
        qualityScore: qualityAnalysis.score,
        qualitySuggestions: qualityAnalysis.suggestions || [],
        qualityStrengths: qualityAnalysis.strengths || [],
        qualityWeaknesses: qualityAnalysis.weaknesses || []
      };
    } catch (apiError) {
      // If API fails due to credits or invalid key, use fallback
      const errorMsg = apiError.message || '';
      if (errorMsg.includes('credits') || errorMsg.includes('402') || errorMsg.includes('Insufficient') || 
          errorMsg.includes('INVALID_API_KEY') || errorMsg.includes('FALLBACK_MODE') ||
          errorMsg.includes('Invalid API key') || errorMsg.includes('Unauthorized') ||
          errorMsg.includes('User not found') || errorMsg.includes('401')) {
        console.log('⚠️  API unavailable (invalid key or no credits), using fallback mode (no API calls needed)...');
        const { processLinkedInPostFallback } = await import('./fallbackService.js');
        return processLinkedInPostFallback(postText);
      } else {
        // Other errors, throw them
        console.error('Error processing LinkedIn post:', apiError);
        throw new Error(`Failed to process post: ${apiError.message}`);
      }
    }
  } catch (error) {
    console.error('Error processing LinkedIn post:', error);
    throw new Error(`Failed to process post: ${error.message}`);
  }
}

