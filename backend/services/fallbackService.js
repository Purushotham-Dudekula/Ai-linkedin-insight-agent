/**
 * Fallback service that generates insights without API calls
 * Used when API credits are unavailable
 */

/**
 * Generate basic summary from post text
 */
export function generateBasicSummary(postText) {
  const sentences = postText.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const firstSentence = sentences[0]?.trim() || postText.substring(0, 150);
  const secondSentence = sentences[1]?.trim() || postText.substring(150, 300);
  
  return `${firstSentence}. ${secondSentence || 'This post discusses important professional topics.'}`;
}

/**
 * Extract main idea
 */
export function extractBasicMainIdea(postText) {
  // Look for key phrases
  const keywords = ['hiring', 'role', 'job', 'opportunity', 'project', 'build', 'develop', 'create'];
  const lowerText = postText.toLowerCase();
  
  for (const keyword of keywords) {
    if (lowerText.includes(keyword)) {
      const index = lowerText.indexOf(keyword);
      const start = Math.max(0, index - 50);
      const end = Math.min(postText.length, index + 150);
      return postText.substring(start, end).trim() + '.';
    }
  }
  
  // Fallback: first sentence
  const firstSentence = postText.split(/[.!?]+/)[0]?.trim();
  return firstSentence || 'Professional opportunity or discussion about industry topics.';
}

/**
 * Generate basic actionable steps
 */
export function generateBasicActionableSteps(postText) {
  const steps = [];
  const lowerText = postText.toLowerCase();
  
  if (lowerText.includes('reach out') || lowerText.includes('contact')) {
    steps.push('Reach out to the poster to express interest');
  }
  
  if (lowerText.includes('apply') || lowerText.includes('hiring')) {
    steps.push('Review the job requirements and prepare your application');
  }
  
  if (lowerText.includes('build') || lowerText.includes('develop') || lowerText.includes('create')) {
    steps.push('Consider how your skills align with the opportunity');
  }
  
  // Always add these generic steps
  if (steps.length === 0) {
    steps.push('Review the post content carefully');
    steps.push('Identify how this relates to your goals');
    steps.push('Take appropriate action based on the opportunity');
  } else {
    steps.push('Follow up and maintain professional communication');
  }
  
  return steps.slice(0, 3);
}

/**
 * Generate basic project ideas
 */
export function generateBasicProjectIdeas(postText) {
  const ideas = [];
  const lowerText = postText.toLowerCase();
  
  if (lowerText.includes('code agent') || lowerText.includes('agent')) {
    ideas.push('Build a code agent for a specific domain or use case');
    ideas.push('Create a demo showcasing agent capabilities');
  }
  
  if (lowerText.includes('build') || lowerText.includes('develop')) {
    ideas.push('Develop a related project to demonstrate skills');
  }
  
  if (ideas.length === 0) {
    ideas.push('Create a project related to the post topic');
    ideas.push('Build a portfolio piece demonstrating relevant skills');
  }
  
  return ideas.slice(0, 3);
}

/**
 * Analyze sentiment (basic)
 */
export function analyzeBasicSentiment(postText) {
  const lowerText = postText.toLowerCase();
  const positiveWords = ['interesting', 'exciting', 'great', 'amazing', 'wonderful', 'cool', 'excellent'];
  const negativeWords = ['difficult', 'challenging', 'problem', 'issue', 'concern'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeCount++;
  });
  
  let sentiment = 'neutral';
  if (positiveCount > negativeCount) sentiment = 'positive';
  else if (negativeCount > positiveCount) sentiment = 'negative';
  
  return {
    sentiment,
    confidence: 0.6,
    emotions: ['professional', 'engaging'],
    tone: 'professional'
  };
}

/**
 * Extract key topics
 */
export function extractBasicKeyTopics(postText) {
  const topics = [];
  const lowerText = postText.toLowerCase();
  
  // Common professional topics
  const topicKeywords = {
    'AI': ['ai', 'artificial intelligence', 'machine learning'],
    'Code Agents': ['code agent', 'agent', 'automation'],
    'Hiring': ['hiring', 'job', 'role', 'position', 'opportunity'],
    'Development': ['develop', 'build', 'create', 'project'],
    'Technology': ['tech', 'technology', 'software', 'coding']
  };
  
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      topics.push(topic);
    }
  }
  
  if (topics.length === 0) {
    topics.push('Professional', 'Career', 'Opportunity');
  }
  
  return topics.slice(0, 5);
}

/**
 * Identify target audience (basic)
 */
export function identifyBasicTargetAudience(postText) {
  const lowerText = postText.toLowerCase();
  
  if (lowerText.includes('hiring') || lowerText.includes('job')) {
    return 'Job seekers and professionals interested in new opportunities';
  }
  
  if (lowerText.includes('developer') || lowerText.includes('engineer')) {
    return 'Software developers and engineers';
  }
  
  if (lowerText.includes('student') || lowerText.includes('fresher')) {
    return 'Students and entry-level professionals';
  }
  
  return 'Professionals in the technology and software development industry';
}

/**
 * Analyze post quality (basic)
 */
export function analyzeBasicPostQuality(postText) {
  const length = postText.length;
  const hasQuestion = postText.includes('?');
  const hasCallToAction = /reach out|contact|apply|interested/i.test(postText);
  
  let score = 7;
  const strengths = [];
  const weaknesses = [];
  const suggestions = [];
  
  if (length > 100) strengths.push('Adequate length for engagement');
  else weaknesses.push('Could be more detailed');
  
  if (hasCallToAction) strengths.push('Clear call to action');
  else {
    weaknesses.push('Missing clear call to action');
    suggestions.push('Add a specific call to action');
  }
  
  if (hasQuestion) strengths.push('Engages audience with questions');
  
  if (length < 50) {
    score = 5;
    weaknesses.push('Post is too short');
    suggestions.push('Add more context and details');
  }
  
  if (suggestions.length === 0) {
    suggestions.push('Consider adding more specific examples');
  }
  
  return {
    score,
    suggestions: suggestions.slice(0, 3),
    strengths: strengths.length > 0 ? strengths : ['Clear message'],
    weaknesses: weaknesses.length > 0 ? weaknesses : []
  };
}

/**
 * Process LinkedIn post using fallback (no API needed)
 */
export function processLinkedInPostFallback(postText) {
  return {
    summary: generateBasicSummary(postText),
    mainIdea: extractBasicMainIdea(postText),
    actionableSteps: generateBasicActionableSteps(postText),
    projectIdeas: generateBasicProjectIdeas(postText),
    sentiment: analyzeBasicSentiment(postText),
    keyTopics: extractBasicKeyTopics(postText),
    targetAudience: identifyBasicTargetAudience(postText),
    qualityScore: analyzeBasicPostQuality(postText).score,
    qualitySuggestions: analyzeBasicPostQuality(postText).suggestions,
    qualityStrengths: analyzeBasicPostQuality(postText).strengths,
    qualityWeaknesses: analyzeBasicPostQuality(postText).weaknesses
  };
}

